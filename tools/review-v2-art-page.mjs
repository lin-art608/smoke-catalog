import fs from 'node:fs';import assert from 'node:assert/strict';import {createRequire} from 'node:module';
const require=createRequire('C:/Users/HONOR/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/_entry.js'),{chromium}=require('playwright');
const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'}),page=await browser.newPage(),errors=[],failed=[];
page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)failed.push(r.url());});
const base='http://127.0.0.1:4180/site-v2/';
try{
 for(const width of [390,768,1440]){
  await page.setViewportSize({width,height:900});await page.goto(base+'art-review.html',{waitUntil:'networkidle'});
  await page.evaluate(async()=>{await Promise.all([...document.images].filter(i=>i.getAttribute('src')).map(i=>{i.loading='eager';return i.complete?Promise.resolve():new Promise(r=>i.onload=i.onerror=r);}));});
  assert.equal(await page.locator('.sample').count(),20);assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));assert.equal(await page.evaluate(()=>[...document.images].filter(i=>i.getAttribute('src')&&!i.naturalWidth).length),0);
  await page.screenshot({path:'docs/2.0/screenshots/G5-art-review-'+width+'.png'});
  await page.locator('#blind').click();assert.equal(await page.locator('.metadata:visible').count(),0);assert.equal(await page.locator('.evidence:visible').count(),0);assert.equal(await page.locator('[data-open]:disabled').count(),20);assert.equal(await page.locator('.old-figure:visible').count(),0);
  if(width===1440)await page.screenshot({path:'docs/2.0/screenshots/G5-art-blind-1440.png'});
  await page.locator('#reveal').click();assert.equal(await page.locator('.metadata:visible').count(),20);await page.locator('[data-open]').first().click();assert.ok(await page.locator('#viewer').isVisible());assert.ok((await page.locator('#native').getAttribute('href')).endsWith('-v2.png'));await page.keyboard.press('Escape');assert.equal(await page.locator('#viewer').isVisible(),false);
 }
 await page.setViewportSize({width:390,height:844});await page.goto(base+'?view=detail',{waitUntil:'networkidle'});await page.locator('summary').click();assert.ok(await page.locator('details').getAttribute('open')!==null);await page.locator('summary').scrollIntoViewIfNeeded();await page.screenshot({path:'docs/2.0/screenshots/G5-declaration-390.png'});
 await page.locator('[data-object-mode="character"]').click();await page.locator('.object-stage img').evaluate(async i=>{if(!i.complete)await new Promise(r=>i.onload=r);});assert.equal(await page.locator('#symbol-explanation').isVisible(),false);assert.ok((await page.locator('.object-stage img').getAttribute('src')).startsWith('assets/characters/v2/'));await page.locator('.object-stage').scrollIntoViewIfNeeded();await page.screenshot({path:'docs/2.0/screenshots/G5-character-detail-390.png'});
 assert.deepEqual(errors,[]);assert.deepEqual(failed,[]);
 fs.writeFileSync('docs/2.0/reviews/G5-art-page-automated.json',JSON.stringify({status:'pass',samples:20,widths:[390,768,1440],checks:['no overflow/missing images','v1/v2 comparison','blind mode hides names, evidence and old images','reveal and detail modal/Escape','native PNG link','detail declaration opened','v2 character toggle'],errors,failed,limitations:['自动检查不能代替负责人美术批准或观众盲测']},null,2)+'\n');console.log('G5 art page: pass');
}finally{await browser.close();}
