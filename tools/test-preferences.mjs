import fs from 'node:fs';
import assert from 'node:assert/strict';
import {preferences,dayKey} from '../workers/preferences.mjs';
import {localPreferences} from './local-preferences.mjs';
const db=localPreferences(),env={PREFERENCES:db},base='https://smoke.inneros.asia/api/preferences';
const get=(cookie,query='')=>preferences(new Request(base+query,{headers:cookie?{Cookie:cookie}:{}}),env);
const write=(cookie,id,method='PUT',origin='https://smoke.inneros.asia')=>preferences(new Request(base,{method,headers:{Cookie:cookie,Origin:origin,'Content-Type':'application/json'},...(method==='PUT'?{body:JSON.stringify({id})}:{})}),env);
try{
 assert.deepEqual(JSON.parse(fs.readFileSync('workers/exhibit-ids.json','utf8')),JSON.parse(fs.readFileSync('data/2.0/exhibits.json','utf8')).map(d=>d.id));
 assert.equal(dayKey(new Date('2026-10-17T15:59:59Z')),'2026-10-17');assert.equal(dayKey(new Date('2026-10-17T16:00:00Z')),'2026-10-18');
 let r=await get();assert.equal(r.status,200);const cookie=r.headers.get('Set-Cookie').split(';')[0];assert.ok(r.headers.get('Set-Cookie').includes('HttpOnly'));assert.equal((await r.json()).votes,0);
 assert.equal((await write(cookie,'unknown')).status,400);assert.equal((await write(cookie,'sku-yanpk-929','PUT','https://other.example')).status,403);
 assert.equal((await write(cookie,'sku-yanpk-929')).status,200);
 assert.equal((await (await write(cookie,'sku-yanpk-929')).json()).votes,1);
 let data=await (await write(cookie,'sku-yanpk-213')).json();assert.equal(data.votes,1);assert.equal(data.myVote,'sku-yanpk-213');assert.equal(data.entries[0].id,'sku-yanpk-213');
 const second=await get(),cookie2=second.headers.get('Set-Cookie').split(';')[0];data=await (await write(cookie2,'sku-yanpk-213')).json();assert.equal(data.votes,2);assert.equal(data.participants,2);assert.equal(data.entries[0].votes,2);
 data=await (await write(cookie,'','DELETE')).json();assert.equal(data.votes,1);assert.equal(data.myVote,null);
 for(const period of ['today','week','all']){data=await (await get(cookie2,'?period='+period)).json();assert.equal(data.period,period);assert.equal(data.votes,1);}
 db.exec("INSERT INTO preferences(visitor,day,exhibit_id) SELECT visitor,'2000-01-01',exhibit_id FROM preferences");
 data=await (await get(cookie2,'?period=all')).json();assert.equal(data.votes,2);assert.equal(data.participants,1);data=await (await get(cookie2,'?period=week')).json();assert.equal(data.votes,1);
 assert.equal((await preferences(new Request(base),{})).status,503);
 assert.equal((await preferences(new Request('https://smoke.inneros.asia/api/unknown'),env)).status,404);
 assert.equal((await preferences(new Request(base,{method:'POST'}),env)).status,405);
 console.log('Preferences: SQLite uniqueness, real aggregation, vote replacement/withdrawal, period filters, cookie and error boundaries PASS');
}finally{db.close();}
