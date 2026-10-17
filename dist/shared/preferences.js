(() => {
 const items=window.v2Exhibits,params=new URLSearchParams(location.search),ranking=params.get('view')==='ranking';
 const current=items.find(d=>d.id===params.get('item')),asset=p=>p.startsWith('v2:')?p.slice(3):p;
 const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const thumb='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 10v11H3V10h4Zm0 0 5-8c2 0 3 2 2 5l-1 3h6a2 2 0 0 1 2 2l-2 7a3 3 0 0 1-3 2H7"/></svg>';
 let state=null,busy=false,error='';
 const host=ranking?document.querySelector('#preference-ranking'):null;
 if(current&&params.get('view')==='detail'){
  const button=document.createElement('button');button.className='portrait-like';button.dataset.preference=current.id;button.setAttribute('aria-label','点赞');button.setAttribute('aria-pressed','false');button.disabled=true;button.innerHTML=thumb;
  const frame=document.createElement('div');frame.className='portrait-frame';const portrait=document.querySelector('.hero-portrait');portrait.before(frame);frame.append(portrait,button);
  const status=document.createElement('p');status.className='preference-status';status.setAttribute('role','status');status.hidden=true;frame.after(status);
 }
 if(!host&&!document.querySelector('[data-preference]'))return;
 function paint(){
  document.querySelectorAll('[data-preference]').forEach(b=>{const picked=state?.myLikes?.includes(b.dataset.preference);b.setAttribute('aria-pressed',String(picked));b.disabled=busy||!state;b.innerHTML=thumb;b.setAttribute('aria-label',picked?'取消点赞':'点赞');});
  const status=document.querySelector('.preference-status');if(status){status.hidden=!error;status.textContent=error;}
  if(!host)return;
  const voted=(state?.entries||[]).filter(r=>r.votes>0&&items.some(d=>d.id===r.id)).sort((a,b)=>b.votes-a.votes||a.id.localeCompare(b.id));let rank=0,lastCount=-1;
  host.innerHTML=`${error||!state?`<p class="ranking-status" role="status">${esc(error||'正在读取…')}</p>`:''}${state&&!voted.length?'<p class="ranking-empty">暂无点赞</p>':''}<ol class="ranking-list">${voted.map((r,i)=>{const d=items.find(d=>d.id===r.id);if(r.votes!==lastCount){rank=i+1;lastCount=r.votes;}return `<li><span class="rank-number">${String(rank).padStart(2,'0')}</span><a class="rank-art" href="?view=detail&item=${d.id}"><img src="${asset(d.preview)}" alt="${esc(d.name)}角色" loading="lazy"></a><div><h2><a href="?view=detail&item=${d.id}">${esc(d.name)}</a></h2><span class="rank-count">${r.votes} 人气</span><button class="rank-like" aria-label="${state.myLikes.includes(d.id)?'取消点赞':'点赞'}" data-preference="${d.id}" aria-pressed="${state.myLikes.includes(d.id)}" ${busy?'disabled':''}>${thumb}</button></div></li>`;}).join('')}</ol>`;
 }
 async function request(method='GET',id){busy=true;error='';paint();try{const response=await fetch('/api/preferences?period=all',{method,credentials:'same-origin',signal:AbortSignal.timeout(10000),headers:method!=='GET'?{'Content-Type':'application/json'}:{},...(method!=='GET'?{body:JSON.stringify({id})}:{})});const data=await response.json();if(!response.ok)throw new Error(data.error||'排行暂时无法读取');state=data;}catch(e){if(method==='GET')state=null;error=e instanceof SyntaxError?'排行榜正在接通，请稍后再试。':e instanceof TypeError?'网络暂时不可用，请稍后重试。':e.name==='TimeoutError'?'读取超时，请稍后重试。':e.message;}finally{busy=false;paint();}}
 document.addEventListener('click',e=>{const vote=e.target.closest('[data-preference]');if(vote&&!busy&&state)request(state.myLikes.includes(vote.dataset.preference)?'DELETE':'PUT',vote.dataset.preference);});
 request();
})();
