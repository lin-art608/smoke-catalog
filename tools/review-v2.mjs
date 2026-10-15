import fs from 'node:fs';import assert from 'node:assert/strict';import crypto from 'node:crypto';import {createRequire} from 'node:module';
const require=createRequire('C:/Users/HONOR/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/_entry.js');
const {chromium}=require('playwright');
const folder='docs/2.0/screenshots';fs.mkdirSync(folder,{recursive:true});
fs.writeFileSync('docs/2.0/reviews/automated-results.json',JSON.stringify({status:'running',date:'2026-10-15'}));
process.on('uncaughtException',error=>{fs.writeFileSync('docs/2.0/reviews/automated-results.json',JSON.stringify({status:'fail',date:'2026-10-15',error:error.message},null,2)+'\n');console.error(error);process.exit(1);});
const seeds=JSON.parse(fs.readFileSync('data/2.0/seeds.json'));
const manifest=JSON.parse(fs.readFileSync('data/2.0/baseline-manifest.json'));
for(const file of manifest.files)assert.equal(crypto.createHash('sha256').update(fs.readFileSync(file.path)).digest('hex'),file.sha256,'V1 changed: '+file.path);
assert.equal(seeds.length,6);
for(const d of seeds){assert.equal(d.observations.length,3);assert.equal(d.translations.length,3);assert.ok(d.lore.length>=120&&d.lore.length<=250,d.name+' story length '+d.lore.length);assert.equal(d.loreKind,'original-fiction');assert.equal(d.imageRights.publicReplacementAllowed,false);assert.equal(d.imageResolution.hdVerified,false);assert.ok(fs.existsSync('dist/'+d.packFront));assert.ok(fs.existsSync('dist/'+d.portrait));assert.ok(d.sourceReferences.length);}
const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'});
const context=await browser.newContext({viewport:{width:1440,height:1000},locale:'zh-CN',reducedMotion:'reduce'});
const page=await context.newPage();const errors=[],broken=[],checks=[],screenshots=[];
page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)broken.push(r.url()+': '+r.status());});
const root='http://127.0.0.1:4180';
async function navigate(url){await page.goto(root+url,{waitUntil:'networkidle'});await page.evaluate(async()=>{await Promise.all([...document.images].map(img=>{img.loading='eager';return img.complete?Promise.resolve():new Promise(resolve=>{img.onload=img.onerror=resolve});}));});}
async function shot(name,fullPage=false){await page.screenshot({path:folder+'/'+name+'.png',fullPage});screenshots.push(name+'.png');}
await navigate('/dist/index.html');await shot('G0-v1-desktop');await page.setViewportSize({width:390,height:844});await shot('G0-v1-mobile');
for(const dir of ['a','b']){
 const prefix='/prototypes/2.0/prototype-'+dir+'/';
 for(const width of [390,768,1440]){
  await page.setViewportSize({width,height:width===390?844:1000});
  for(const view of ['home','regions','labels','characters','detail','themes','collection','votes']){
   await navigate(prefix+'?view='+view);
   const layout=await page.evaluate(()=>({scroll:document.documentElement.scrollWidth,width:innerWidth,images:[...document.images].filter(i=>i.getAttribute('src')&&(!i.complete||i.naturalWidth===0)).map(i=>i.src),title:document.querySelector('h1')?.textContent}));
   assert.ok(layout.scroll<=layout.width+1,`${dir}/${view}/${width}: horizontal overflow ${layout.scroll}`);
   assert.equal(layout.images.length,0,JSON.stringify(layout.images));assert.ok(layout.title);
   if(width===1440&&['home','regions','labels','characters','detail'].includes(view))await shot(`G2-${dir}-${view}-desktop`);
   if(width===1440&&view==='regions'){const name=`G2-${dir}-region-cards-desktop.png`;await page.locator('.all-regions').screenshot({path:folder+'/'+name});screenshots.push(name);}
   if(width===390&&view==='home')await shot(`G2-${dir}-home-mobile`);
   if(width===390&&view==='detail'){await shot(`G2-${dir}-detail-mobile`);await shot(`G2-${dir}-detail-mobile-full`,true);}
  }
  checks.push(`${dir}: ${width}px / 8 views / no overflow or broken images`);
 }
 await page.setViewportSize({width:390,height:844});
 await navigate(prefix+'?view=regions');
 await page.getByRole('button',{name:'湖北',exact:true}).click();
 await page.locator('#region-detail .label-image').click();
 await page.getByRole('button',{name:'查看包装正面 ＋',exact:true}).click();
 assert.ok(await page.locator('#image-view').isVisible());
 await page.getByRole('button',{name:'放大 2×',exact:true}).click();assert.equal(await page.locator('#image-zoom').getAttribute('aria-pressed'),'true');
 await shot(`G2-${dir}-pack-zoom-mobile`);
 await page.keyboard.press('Escape');assert.equal(await page.locator('#image-view').isVisible(),false);
 checks.push(`${dir}: map region → exhibit → pack view = 3 clicks; zoom + Escape`);
 const save=page.locator('[data-save]');await save.click();assert.equal(await save.getAttribute('aria-pressed'),'true');await page.reload();assert.equal(await page.locator('[data-save]').getAttribute('aria-pressed'),'true');await page.locator('[data-save]').click();
 await page.getByText('关于图像、角色与资料的声明',{exact:true}).click();assert.equal(await page.locator('details').getAttribute('open'),'');
 await navigate(prefix+'?view=characters');await page.locator('[data-reveal]').first().click();assert.equal(await page.locator('[data-reveal]').first().getAttribute('aria-pressed'),'true');await page.locator('[data-reveal]').first().click();assert.ok(page.url().includes('view=detail'));
 await navigate(prefix+'?view=labels');await page.locator('#theme-filter').selectOption('建筑的回声');assert.equal(await page.locator('#label-index article').count(),2);await page.locator('#density').click();assert.equal(await page.locator('#density').getAttribute('aria-pressed'),'true');
 await navigate(prefix+'?view=regions');await page.locator('#region-map .map-shape[data-province="zhejiang"]').focus();await page.keyboard.press('Enter');assert.ok((await page.locator('#region-detail').innerText()).includes('浙江'));
 await navigate(prefix+'?view=characters');assert.equal(await page.locator('.reveal img').first().evaluate(el=>getComputedStyle(el).transitionDuration),'0s');await page.emulateMedia({reducedMotion:'no-preference'});assert.notEqual(await page.locator('.reveal img').first().evaluate(el=>getComputedStyle(el).transitionDuration),'0s');await page.emulateMedia({reducedMotion:'reduce'});
 checks.push(`${dir}: persistent save/unsave, expandable notice, reveal/second click, theme filter, density toggle, keyboard map, reduced motion`);
 for(const item of seeds){await navigate(prefix+'?view=detail&item='+item.id);assert.ok((await page.locator('#observations').innerText()).includes(item.observations[0]));assert.ok((await page.locator('#fiction').innerText()).includes(item.lore));}
 checks.push(`${dir}: all six narratives and reference assets render`);
}
assert.deepEqual(errors,[]);assert.deepEqual(broken,[]);
await browser.close();
fs.writeFileSync('docs/2.0/reviews/automated-results.json',JSON.stringify({date:'2026-10-15',status:'pass',baseline:manifest.base,v1HashChecks:manifest.files.length,seedCount:seeds.length,checks,screenshots,errors,broken,limitations:['截图是本地Edge无头浏览器，非实体手机','不证明历史事实、图片授权或主观审美已通过','G2必须由产品负责人选择方向；G3以后尚未实施']},null,2)+'\n');
console.log(JSON.stringify({status:'pass',checks:checks.length,screenshots:screenshots.length,v1HashChecks:manifest.files.length}));
