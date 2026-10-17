import exhibitIds from './exhibit-ids.json' with {type:'json'};

const validIds=new Set(exhibitIds);
export const dayKey=(now=new Date())=>new Date(now.getTime()+8*3600000).toISOString().slice(0,10);
const reply=(data,status=200,headers={})=>Response.json(data,{status,headers:{'Cache-Control':'no-store','X-Content-Type-Options':'nosniff',...headers}});
export async function preferences(request,env){
 const url=new URL(request.url);
 if(url.pathname!=='/api/preferences')return reply({error:'未找到接口'},404);
 if(!['GET','PUT','DELETE'].includes(request.method))return reply({error:'不支持此操作'},405,{'Allow':'GET, PUT, DELETE'});
 if(!env.PREFERENCES)return reply({error:'喜好排行正在接通，请稍后再试'},503);
 if(request.method!=='GET'){
  if(request.headers.get('Origin')!==url.origin||request.headers.get('Sec-Fetch-Site')==='cross-site')return reply({error:'请从本站提交喜好'},403);
  if(Number(request.headers.get('Content-Length')||0)>1024)return reply({error:'请求过大'},413);
 }
 const raw=request.headers.get('Cookie')?.match(/(?:^|;\s*)sa-visitor=([0-9a-f-]{36})(?:;|$)/)?.[1];
 const identity=raw||crypto.randomUUID();
 const digest=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(identity));
 const visitor=Array.from(new Uint8Array(digest),b=>b.toString(16).padStart(2,'0')).join('');
 const headers={};if(!raw)headers['Set-Cookie']=`sa-visitor=${identity}; Path=/; HttpOnly; SameSite=Strict; Max-Age=31536000${url.protocol==='https:'?'; Secure':''}`;
 const today=dayKey();
 try{
  if(request.method==='PUT'||request.method==='DELETE'){
   if(!request.headers.get('Content-Type')?.startsWith('application/json'))return reply({error:'请提交 JSON'},415);
   const text=await request.text();if(text.length>1024)return reply({error:'请求过大'},413);
   let body;try{body=JSON.parse(text);}catch{return reply({error:'请求格式有误'},400);}
   if(!validIds.has(body.id))return reply({error:'未知档案'},400);
   if(request.method==='PUT')await env.PREFERENCES.prepare('INSERT INTO exhibit_likes(visitor, day, exhibit_id) VALUES(?, ?, ?) ON CONFLICT(visitor, exhibit_id) DO NOTHING').bind(visitor,today,body.id).run();
   else await env.PREFERENCES.prepare('DELETE FROM exhibit_likes WHERE visitor=? AND exhibit_id=?').bind(visitor,body.id).run();
  }
  const period=['today','week','all'].includes(url.searchParams.get('period'))?url.searchParams.get('period'):'all';
  const start=period==='today'?today:period==='week'?dayKey(new Date(Date.now()-6*86400000)):'0000-00-00';
  const [counts,total,mine]=await env.PREFERENCES.batch([
   env.PREFERENCES.prepare('SELECT exhibit_id AS id, COUNT(*) AS votes FROM exhibit_likes WHERE day>=? GROUP BY exhibit_id ORDER BY votes DESC, exhibit_id ASC').bind(start),
   env.PREFERENCES.prepare('SELECT COUNT(*) AS votes, COUNT(DISTINCT visitor) AS participants FROM exhibit_likes WHERE day>=?').bind(start),
   env.PREFERENCES.prepare('SELECT exhibit_id AS id FROM exhibit_likes WHERE visitor=?').bind(visitor)
  ]);
  return reply({period,day:today,updatedAt:new Date().toISOString(),entries:counts.results,myLikes:mine.results.map(row=>row.id),...total.results[0],development:env.DEVELOPMENT===true},200,headers);
 }catch{return reply({error:'排行暂时无法读取，请稍后重试'},503,headers);}
}
export default {async fetch(request,env){return new URL(request.url).pathname.startsWith('/api/')?preferences(request,env):env.ASSETS.fetch(request);}};
