(() => {
 const items=window.v2Exhibits,params=new URLSearchParams(location.search),view=params.get('view')||'home';
 const current=items.find(d=>d.id===params.get('item'))||items[0];
 const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const asset=p=>p.startsWith('v2:')?p.slice(3):''+p;
 const heart='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z"/></svg>';
 function updateHeart(){document.querySelectorAll('[data-save]').forEach(b=>{b.innerHTML=heart+'<span>'+(b.getAttribute('aria-pressed')==='true'?'已收入收藏':'收入本地收藏')+'</span>';});}
 updateHeart();
 document.addEventListener('archive-save-change',updateHeart);
 if(view==='detail'){const stage=document.querySelector('.object-stage'),image=stage?.querySelector('img');if(image){const inspector=document.createElement('div');inspector.className='pack-inspector';image.before(inspector);inspector.append(image);}}
 let comparison;try{comparison=JSON.parse(sessionStorage.getItem('smoke-v2-compare')||'[]').filter(id=>items.some(d=>d.id===id)).slice(0,2);}catch{comparison=[];}
 const tray=document.createElement('aside');tray.className='compare-tray';tray.hidden=true;tray.setAttribute('aria-label','展品并置选择');document.body.append(tray);
 function compareButtons(){document.querySelectorAll('.label-card').forEach(card=>{if(card.querySelector('[data-compare]'))return;const a=card.querySelector('.label-image'),id=new URL(a.href).searchParams.get('item');if(!id)return;const b=document.createElement('button');b.className='compare-pick';b.dataset.compare=id;b.setAttribute('aria-label','并置比较'+items.find(d=>d.id===id).name);card.querySelector('.label-caption').append(b);});paintCompare();}
 function paintCompare(){document.querySelectorAll('[data-compare]').forEach(b=>{const active=comparison.includes(b.dataset.compare);b.setAttribute('aria-pressed',String(active));b.textContent=active?'已选入并置 −':'加入并置 ＋';});tray.hidden=view==='detail'||comparison.length===0;tray.innerHTML=`<span>并置 ${comparison.length}/2 <small>${comparison.map(id=>esc(items.find(d=>d.id===id).name)).join(' / ')}</small></span><button data-open-compare ${comparison.length!==2?'disabled':''}>查看并置 ↗</button><button data-clear-compare>清空</button><span class="compare-status" role="status"></span>`;try{sessionStorage.setItem('smoke-v2-compare',JSON.stringify(comparison));}catch{}}
 function comparePage(){document.querySelector('main').innerHTML=`<section class="page-heading"><p class="eyebrow">SIDE BY SIDE <span>比较视觉，不评价消费</span></p><h1>放在一起，<em>区别就出现了。</em></h1><p>并置观察配色、地域关联、图形结构与原创角色方向。两边顺序由选择决定，不是名次。</p></section>${comparison.length===2?`<div class="comparison-columns">${comparison.map(id=>{const d=items.find(d=>d.id===id);return `<article><p class="eyebrow">${esc(d.region)} / ${esc(d.theme)}</p><h2>${esc(d.name)}</h2><div class="compare-pack"><img src="${d.packFront}" alt="${esc(d.name)}包装参考图"></div><small>参考图 · 许可待确认</small><h3>看见的结构</h3><ul>${d.observations.map(o=>`<li>${esc(o)}</li>`).join('')}</ul><h3>原创方向</h3><p>${esc(d.type)} · ${esc(d.translations[0][1])}</p><img class="compare-silhouette silhouette" src="${asset(d.preview)}" alt="${esc(d.name)}角色轮廓"><a class="button" href="?view=detail&item=${id}">进入档案 ↗</a></article>`;}).join('')}</div>`:'<div class="empty"><p>先选择两件展品，就能并置观察。</p><a class="button" href="?view=labels">去烟标索引 ↗</a></div>'}`;}
 if(view==='compare')comparePage();else compareButtons();
 const dynamic=document.querySelector('#region-detail')||document.querySelector('#label-index');if(dynamic)new MutationObserver(compareButtons).observe(dynamic,{childList:true});
 document.addEventListener('click',e=>{const pick=e.target.closest('[data-compare]');if(pick){const id=pick.dataset.compare;if(comparison.includes(id))comparison=comparison.filter(x=>x!==id);else if(comparison.length<2)comparison.push(id);else{tray.querySelector('.compare-status').textContent='已选两件，请先移除一件。';return;}paintCompare();}
  if(e.target.closest('[data-open-compare]')&&comparison.length===2)location.href='?view=compare';
  if(e.target.closest('[data-clear-compare]')){comparison=[];paintCompare();if(view==='compare')comparePage();}
  const wander=e.target.closest('[data-wander]');if(wander){const pool=items.filter(d=>d.id!==current.id&&(view==='home'||d.themes.some(t=>current.themes.includes(t))));const selected=pool[Math.floor(Math.random()*pool.length)];if(selected)location.href='?view=detail&item='+selected.id;}
 });
 if(view==='home'&&document.querySelector('.hero-actions')){const b=document.createElement('button');b.className='button wander';b.dataset.wander='1';b.textContent='随机走进一件展品 ↗';document.querySelector('.hero-actions').append(b);}
 if(view==='themes'){
  const essays={'建筑的回声':'中华参考图的金色建筑横向展开，像把视线固定在纸面中部；黄鹤楼以层叠轮廓与蓝金分区形成另一种节奏；红塔山的红色竖线则把视线往上引。同样借用建筑式图形，三件作品并没有相同的方向感。并置它们时，可以先遮住名字，只比较重心如何移动，再看这些线条怎样进入肩线、翼羽和木尺。这里讨论的是照片里的构图，不由包装反推建筑的建造年代，也不认定其中所有图形都精确再现现实建筑。','印刷的秩序':'利群的宽横带、红方印的红色方框、云烟大重九的细边框，分别把视线停在不同位置。银蓝渐变的炫彩版又让边框与中间的弧线产生远近关系。看这组展品，不妨从最外缘开始，一步步走向图案中心：哪一条线挡住了视线，哪一处留白让文字呼吸？这些观看动作，也是四个原创角色的动作来源。展览不把画面效果直接等同于某一种印刷工艺；纸张、油墨与具体版次仍需要更清楚的实物资料。'};
  document.querySelectorAll('.selection-section').forEach(section=>{const title=section.querySelector('h2').textContent;if(!essays[title])return;const p=document.createElement('p');p.className='curatorial-essay';p.textContent=essays[title];section.querySelector('.label-grid').before(p);});
 }
})();
