import fs from 'node:fs';import assert from 'node:assert/strict';import crypto from 'node:crypto';import {createRequire} from 'node:module';
const require=createRequire('C:/Users/HONOR/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/_entry.js'),{chromium}=require('playwright');
const stage=process.env.SMOKE_REVIEW_STAGE||'G3',folder='docs/2.0/screenshots';
const rows=JSON.parse(fs.readFileSync('data/2.0/exhibits.json')),baseline=JSON.parse(fs.readFileSync('data/2.0/baseline-manifest.json'));
for(const d of baseline.files)assert.equal(crypto.createHash('sha256').update(fs.readFileSync(d.path)).digest('hex'),d.sha256,'v1 changed '+d.path);
const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'}),context=await browser.newContext({viewport:{width:1440,height:1000},locale:'zh-CN',reducedMotion:'reduce'}),page=await context.newPage(),errors=[],failed=[],shots=[],checks=[];
page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)failed.push(r.url()+':'+r.status());});
const base='http://127.0.0.1:4180/site-v2/';
async function go(v){await page.goto(base+'?'+v,{waitUntil:'networkidle'});await page.evaluate(async()=>{await Promise.all([...document.images].filter(i=>i.getAttribute('src')).map(img=>{img.loading='eager';return img.complete?Promise.resolve():new Promise(r=>{img.onload=img.onerror=r})}));});}
async function shot(name,fullPage=false){const file=stage+'-'+name+'.png';await page.screenshot({path:folder+'/'+file,fullPage});shots.push(file);}
try{
for(const width of [390,768,1440]){
 await page.setViewportSize({width,height:width===390?844:1000});
 for(const view of ['home','regions','labels','characters','detail','themes','collection','votes']){await go('view='+view);const state=await page.evaluate(()=>({w:innerWidth,scroll:document.documentElement.scrollWidth,broken:[...document.images].filter(i=>i.getAttribute('src')&&(!i.complete||!i.naturalWidth)).length}));assert.ok(state.scroll<=state.w+1,view+' overflow '+width);assert.equal(state.broken,0,view+' broken images');if(width!==768&&['home','regions','labels','detail'].includes(view))await shot(view+'-'+width);}
 checks.push(width+'px: 8 views, no overflow or missing images');
}
await page.setViewportSize({width:390,height:844});
for(const d of rows){await go('view=detail&item='+d.id);assert.ok((await page.locator('#fiction').innerText()).includes(d.lore));assert.equal(await page.locator('[data-symbol]').count(),3);await page.locator('[data-symbol]').nth(0).click();assert.ok((await page.locator('#symbol-explanation').innerText()).includes('依据：'));assert.ok((await page.locator('#symbol-explanation').innerText()).includes('原创转译'));if(d===rows[0])await shot('symbol-explanation-390',true);}
checks.push(rows.length+' exhibits: three symbol markers, evidence, translation and fiction');
await page.locator('[data-object-mode="character"]').click();assert.equal(await page.locator('.symbol-overlay').isVisible(),false);await page.locator('[data-object-mode="pack"]').click();assert.equal(await page.locator('.symbol-overlay').isVisible(),true);
await page.locator('.object-stage [data-image]').click();assert.ok(await page.locator('#image-view').isVisible());await page.locator('#image-zoom').click();await page.keyboard.press('Escape');assert.equal(await page.locator('#image-view').isVisible(),false);
await go('view=labels');await page.locator('[data-compare]').nth(0).click();await page.locator('[data-compare]').nth(1).click();await page.locator('[data-open-compare]').click();assert.equal(await page.locator('.comparison-columns article').count(),2);assert.ok((await page.locator('main').innerText()).includes('不是名次'));await shot('comparison-390',true);
await page.setViewportSize({width:1440,height:1000});await shot('comparison-1440');
await go('view=labels');await page.locator('#exhibit-search').fill('不存在的作品');assert.equal(await page.locator('#label-index article:visible').count(),0);assert.ok(await page.locator('#filter-empty').isVisible());await page.locator('#exhibit-search').fill('');await page.locator('#exhibit-region').selectOption('上海');assert.ok(await page.locator('#label-index article:visible').count()>0);
await go('view=detail');const save=page.locator('[data-save]'),before=await save.getAttribute('aria-pressed');await save.click();assert.notEqual(await save.getAttribute('aria-pressed'),before);assert.equal(await save.locator('svg').count(),1);await page.reload();assert.notEqual(await page.locator('[data-save]').getAttribute('aria-pressed'),before);await page.locator('[data-save]').click();
await page.locator('[data-wander]').click();assert.notEqual(new URL(page.url()).searchParams.get('item'),rows[0].id);
checks.push('pack/character toggle, image zoom/Escape, two-item comparison, compound filters/empty state, SVG collection persistence, thematic wandering');
assert.deepEqual(errors,[]);assert.deepEqual(failed,[]);
fs.writeFileSync('docs/2.0/reviews/'+stage+'-automated.json',JSON.stringify({date:'2026-10-15',status:'pass',exhibits:rows.length,baselineFilesUnchanged:baseline.files.length,checks,shots,errors,failed,limitations:['本地Edge模拟尺寸；非实体手机','文化史料与图像授权不由交互测试证明']},null,2)+'\n');
console.log(JSON.stringify({stage,status:'pass',exhibits:rows.length,screenshots:shots.length}));
}finally{await browser.close();}
