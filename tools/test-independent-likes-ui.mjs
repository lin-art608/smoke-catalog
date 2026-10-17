import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
const require=createRequire('C:/Users/HONOR/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/_entry.js'),{chromium}=require('playwright');
const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'});
const page=await browser.newPage(),base='http://127.0.0.1:4186/',errors=[];
page.on('pageerror',e=>errors.push(e.message));
async function ready(){await page.waitForFunction(()=>{const b=document.querySelector('.portrait-like');return b&&!b.disabled;});}
try{
 for(const width of [390,1440]){
  await page.setViewportSize({width,height:900});
  await page.goto(base+'?view=regions&region=shanghai');
  assert.equal(await page.locator('.duet-view').count(),0);
  const saved=page.locator('.card-save').first();await saved.click();
  assert.equal(await saved.getAttribute('aria-pressed'),'true');
  await page.locator('.duet-pack').first().click();await ready();
  const detailUrl=page.url();assert.equal(await page.locator('.portrait-like svg').count(),1);
  assert.equal(await page.locator('.portrait-like').getAttribute('aria-label'),'点赞');
  await page.locator('.hero-portrait').click();assert.equal(await page.locator('#image-view').evaluate(e=>e.open),true);
  await page.goBack();assert.equal(page.url(),detailUrl);assert.equal(await page.locator('#image-view').evaluate(e=>e.open),false);
  await page.locator('.hero-portrait').click();await page.locator('#image-close').click();await page.waitForFunction(()=>!history.state?.archiveImage);
  assert.equal(page.url(),detailUrl);await page.goBack();assert.ok(page.url().includes('view=regions&region=shanghai'));
  // Restore collection to empty for next viewport.
  await page.locator('.card-save').first().click();
 }
 for(const id of ['sku-yanpk-929','sku-yanpk-213']){
  await page.goto(base+'?view=detail&item='+id);await ready();await page.locator('.portrait-like').click();await page.waitForFunction(()=>document.querySelector('.portrait-like').getAttribute('aria-pressed')==='true'&&!document.querySelector('.portrait-like').disabled);
 }
 await page.goto(base+'?view=ranking');await page.locator('.ranking-list li').nth(1).waitFor();assert.equal(await page.locator('.ranking-list li').count(),2);
 assert.deepEqual(await page.locator('.rank-number').allTextContents(),['01','01']);
 assert.equal(await page.evaluate(()=>localStorage.getItem('smoke-v2-saved')),'[]');
 await page.locator('[data-preference="sku-yanpk-213"]').click();await page.waitForFunction(()=>document.querySelectorAll('.ranking-list li').length===1);
 await page.goto(base+'?view=detail&item=sku-yanpk-929');await ready();assert.equal(await page.locator('.portrait-like').getAttribute('aria-pressed'),'true');
 await page.locator('.portrait-like').click();await page.waitForFunction(()=>document.querySelector('.portrait-like').getAttribute('aria-pressed')==='false'&&!document.querySelector('.portrait-like').disabled);
 assert.deepEqual(errors,[]);console.log('PASS: 390/1440px province, independent collection/likes, full tied ranking, targeted unlike, image Back/close then detail Back to province.');
}finally{await browser.close();}
