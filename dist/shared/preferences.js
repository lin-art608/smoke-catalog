(() => {
 const items=window.v2Exhibits,params=new URLSearchParams(location.search),ranking=params.get('view')==='ranking';
 const current=items.find(d=>d.id===params.get('item')),asset=p=>p.startsWith('v2:')?p.slice(3):p;
 const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 let state=null,period='all',busy=false,error='';
 const host=ranking?document.querySelector('#preference-ranking'):null;
 if(current&&params.get('view')==='detail'){
  const box=document.createElement('div');box.className='preference-action';box.innerHTML='<button class="button" data-preference="'+current.id+'" aria-pressed="false" disabled>喜欢这个设计 ♡</button><a href="?view=ranking">看看喜好排行 ↗</a><p class="preference-status" role="status"></p>';document.querySelector('.character-hero').append(box);
 }
 if(!host&&!document.querySelector('[data-preference]'))return;
 function paint(){
  document.querySelectorAll('[data-preference]').forEach(b=>{const picked=state?.myVote===b.dataset.preference;b.setAttribute('aria-pressed',String(picked));b.disabled=busy||!state;b.textContent=picked?'今日已喜欢 ♥':'喜欢这个设计 ♡';});
  const status=document.querySelector('.preference-status');if(status)status.textContent=error||(state?.development?'本地预览数据 · ':state?'':'正在读取…')+(state?'每日一票，可改选或取消。':'');
  if(!host)return;
  const voted=(state?.entries||[]).filter(r=>r.votes>0&&items.some(d=>d.id===r.id));let rank=0,lastCount=-1;
  host.innerHTML=`<div class="ranking-filters" aria-label="排行时间范围">${[['today','今日'],['week','近七日'],['all','累计']].map(([key,text])=>`<button data-period="${key}" aria-pressed="${key===period}" ${busy?'disabled':''}>${text}</button>`).join('')}</div><p class="ranking-status" role="status">${esc(error||(!state?'正在读取喜好排行…':(state.development?'本地预览 · ':'')+state.participants+' 位参与者 · '+state.votes+' 票'))}</p>${state&&!voted.length?'<div class="ranking-empty"><h2>第一份喜欢，还没有到来。</h2><p>打开一件档案，给喜欢的设计投一票。</p><a class="button" href="?view=labels">去看烟标 ↗</a></div>':''}<ol class="ranking-list">${voted.map((r,i)=>{const d=items.find(d=>d.id===r.id);if(r.votes!==lastCount){rank=i+1;lastCount=r.votes;}return `<li><span class="rank-number">${String(rank).padStart(2,'0')}</span><a class="rank-art" href="?view=detail&item=${d.id}"><img src="${asset(d.preview)}" alt="${esc(d.name)}角色" loading="lazy"></a><div><p>${esc(d.region)}</p><h2><a href="?view=detail&item=${d.id}">${esc(d.name)}</a></h2><span>${r.votes} 票</span><button data-preference="${d.id}" aria-pressed="${state.myVote===d.id}" ${busy?'disabled':''}>${state.myVote===d.id?'今日已喜欢 ♥':'喜欢这个设计 ♡'}</button></div></li>`;}).join('')}</ol><details class="ranking-rules"><summary>排行如何计算</summary><p>按烟标与角色整体设计的真实匿名投票数排列。北京时间每日一票，可以改选或取消当天的一票；同票并列，尚无票的档案不编造名次。收藏爱心与公众投票分别保存。</p><p>今日为北京时间当天；近七日含今天。匿名凭证保存在本浏览器的本站 Cookie 中，未登录，不做跨设备身份核验，清除 Cookie 会失去原凭证；本榜不能当作严格去重的公众调查。</p><p>${state?'更新于 '+new Date(state.updatedAt).toLocaleString('zh-CN',{timeZone:'Asia/Shanghai'}):'数据暂不可用时不会显示虚构票数。'}</p></details>`;
 }
 async function request(method='GET',id){busy=true;error='';paint();try{const response=await fetch('/api/preferences?period='+period,{method,credentials:'same-origin',signal:AbortSignal.timeout(10000),headers:method==='PUT'?{'Content-Type':'application/json'}:{},...(method==='PUT'?{body:JSON.stringify({id})}:{})});const data=await response.json();if(!response.ok)throw new Error(data.error||'排行暂时无法读取');state=data;}catch(e){if(method==='GET')state=null;error=e instanceof SyntaxError?'喜好排行正在接通，请稍后再试。':e instanceof TypeError?'网络暂时不可用，请稍后重试。':e.name==='TimeoutError'?'读取超时，请稍后重试。':e.message;}finally{busy=false;paint();}}
 document.addEventListener('click',e=>{const filter=e.target.closest('[data-period]');if(filter&&!busy){period=filter.dataset.period;request();}const vote=e.target.closest('[data-preference]');if(vote&&!busy&&state)request(state.myVote===vote.dataset.preference?'DELETE':'PUT',vote.dataset.preference);});
 request();
})();
