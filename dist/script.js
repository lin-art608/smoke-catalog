const featuredProvinces = window.archiveCatalog.regions.filter(p => p.items.length);

const provinces=window.archiveCatalog.regions.map(region=>({...region,place:region.place||'地域档案',lead:region.lead||(region.items.length?'浏览本省份的包装样本与原创角色。':'该地区的品牌、包装与角色资料正在核对，后续收录。'),motif:region.motif||'待编目'}));
const allItems=provinces.flatMap(p=>p.items.map(item=>({...item,province:p.name,provinceId:p.id,accent:p.color,dark:p.dark})));
const byId=Object.fromEntries(allItems.map(item=>[item.id,item]));
let activeProvince=null;
let saved;
try { saved=new Set(JSON.parse(localStorage.getItem('smoke-archive-saved')||'[]').filter(id=>byId[id])); } catch { saved=new Set(); }

function packUrl(item){return item.packs[0]?.imagePath||''}
function escapeHtml(value){return String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));}
function packPhoto(item,detail=false){
  const pack=item.packs[0];
  if(!pack?.imagePath)return '<div class="pack-unavailable">正面照片待补充</div>';
  const crop=pack.crop;
  const outerClass=(detail?'detail-pack-photo':'pack-image')+(pack.imageFit==='original'?' pack-original':'');
  const imageStyle=crop?`--photo-width:${100/crop.width}%;--photo-height:${100/crop.height}%;width:${100/crop.width}%;height:${100/crop.height}%;left:${-100*crop.left/crop.width}%;top:${-100*crop.top/crop.height}%;`:'';
  const ratio=crop?`aspect-ratio:${pack.width*crop.width}/${pack.height*crop.height};`:'';
  return `<div class="${outerClass}${crop?' photo-cropped':''}" style="${ratio}"><img src="${escapeHtml(pack.imagePath)}" alt="${escapeHtml(item.brand)}包装${crop?'正面':'实物'}照片" style="${imageStyle}" ${detail?'':'loading="lazy"'}></div>`;
}
function character(item,silhouette=false){
  const asset=item.character?.image;
  if(!asset)return '<div class="character-pending"><span>独立人物待绘</span><small>一规格 · 一角色</small></div>';
  if(asset.type==='portrait')return `<img class="character-portrait ${asset.fullBody?'character-fullbody':''} ${silhouette?'is-silhouette':''}" src="${escapeHtml(asset.path)}" alt="${escapeHtml(item.role)}的${silhouette?'角色剪影':'二次元角色概念立绘'}" loading="lazy">`;
  return `<div class="character-image ${silhouette?'is-silhouette':''}" style="--sheet:url('${asset.path}');--sprite-x:${asset.x}%;--sprite-y:${asset.y}%" role="img" aria-label="${escapeHtml(item.role)}的原创二次元角色概念图"></div>`;
}
function renderProvinces(){
  document.getElementById('provinceList').innerHTML=provinces.map(p=>`<button type="button" class="province-button ${p.id===activeProvince?'active':''}" style="--active-color:${p.color}" data-province="${p.id}" aria-pressed="${p.id===activeProvince}"><span class="province-no">${p.index}</span><span class="province-name">${p.name}<small>${p.en}</small></span><span class="province-arrow">↗</span></button>`).join('');
  document.querySelectorAll('.map-shape.selectable,.map-pin').forEach(el=>{
    const active=el.dataset.province===activeProvince;
    el.classList.toggle('active',active);
    el.setAttribute('aria-pressed',String(active));
  });
  const p=provinces.find(entry=>entry.id===activeProvince);
  document.getElementById('mapSelection').textContent=p?`${p.index} ${p.name} · ${p.place}`:'选择一个省份，探索烟标与角色';
  document.querySelector('.map-stage').style.setProperty('--active-color',p?.color||'#c8ad81');
}
function variantsFor(item){return [item];}
function card(item){
  const n=String(allItems.findIndex(entry=>entry.id===item.id)+1).padStart(2,'0');
  return `<article class="archive-card ${item.character?.image?.fullBody?'route-card':!item.character?'pending-card':''}" style="--card-accent:${item.accent};--card-dark:${item.dark}"><button type="button" class="card-main" data-open="${item.id}" data-variant="${item.variantId||''}" aria-label="揭示${item.brand}${item.variantId?' · '+item.title:''}角色与烟盒档案"><div class="card-art"><span class="card-orbit"></span>${character(item,item.character?.designSystem==='2.0')}${packPhoto(item)}<span class="card-number">CHARACTER / ${n}${item.variantId?' · '+item.character.route:''}</span></div><div class="card-copy"><div class="card-kicker">${item.province} · ${item.en}</div><h4>${item.brand}<small>${item.en}</small></h4><p>${item.character?'角色「'+escapeHtml(item.role)+'」 · '+escapeHtml(item.title):'包装已收录 · 独立人物待绘'}</p><span class="card-cta">${item.character?'点击剪影 · 揭示角色':'查看包装与来源'} <span aria-hidden="true">↗</span></span></div></button><button type="button" class="save-button ${saved.has(item.id)?'is-saved':''}" data-save="${item.id}" aria-label="${saved.has(item.id)?'取消收藏':'收藏'}${item.brand}" aria-pressed="${saved.has(item.id)}">${saved.has(item.id)?'♥':'♡'}</button></article>`;
}
function renderProvince(){
  const p=provinces.find(entry=>entry.id===activeProvince);
  if(!p){document.getElementById('provinceContent').innerHTML='<div class="region-pending"><span>从地图开始探索</span><p>选择一个省份，浏览烟盒与角色；点击剪影揭示人物。</p></div>';return;}
  const contents=p.items.length?`<div class="cards-heading"><span>包装档案 <b>${p.items.length.toString().padStart(2,'0')}</b></span><span>已绘角色点击剪影揭示 · 待绘规格先展示包装</span></div><div class="card-grid">${p.items.flatMap(i=>variantsFor({...i,province:p.name,provinceId:p.id,accent:p.color,dark:p.dark})).map(card).join('')}</div>`:`<div class="region-pending"><span>资料待核对</span><p>${escapeHtml(p.lead)}</p></div>`;
  document.getElementById('provinceContent').innerHTML=`<div class="province-cover" style="--cover-accent:${p.color};--cover-dark:${p.dark}"><div><span class="cover-label">REGION FILE / ${p.index}</span><h3>${p.name}<small>${p.en}</small></h3><p>${p.lead}</p>${p.items.length?`<span class="cover-motif">纹样线索 · ${p.motif}</span>`:''}</div><div class="cover-glyph" aria-hidden="true">${p.abbr}</div></div>${contents}`;
}
function renderSaved(){
  document.getElementById('navCount').textContent=saved.size;
  document.getElementById('savedCount').textContent=saved.size;
  document.getElementById('savedList').innerHTML=saved.size?allItems.filter(i=>saved.has(i.id)).map(i=>`<button type="button" class="saved-chip" data-open="${i.id}"><span>${i.mark}</span><b>${i.brand}</b><small>${i.province} · ${i.role}</small><i aria-hidden="true">↗</i></button>`).join(''):`<div class="empty-state"><span>◇</span><p>图鉴尚未收入条目。<br>点击卡片上的心形，将角色保存在这里。</p></div>`;
}
function toggleSave(id){
  saved.has(id)?saved.delete(id):saved.add(id);
  try{localStorage.setItem('smoke-archive-saved',JSON.stringify([...saved]))}catch{}
  renderProvince();renderSaved();
  const dialogSave=document.querySelector('#detailDialog [data-save]');
  if(dialogSave&&dialogSave.dataset.save===id){dialogSave.textContent=saved.has(id)?'♥ 已收藏':'♡ 加入收藏';dialogSave.setAttribute('aria-pressed',saved.has(id))}
}
const dialog=document.getElementById('detailDialog');
function openDetail(id,variantId){
  const base=byId[id];if(!base)return;
  const options=variantsFor(base);
  const item=options.find(i=>i.variantId===variantId)||options.find(i=>i.character?.route===base.character?.designCard?.route)||options[0];
  const variantTabs=options.length>1?`<div class="variant-tabs" aria-label="角色形象">${options.map(i=>`<button type="button" data-open="${id}" data-variant="${i.variantId}" aria-pressed="${i.variantId===item.variantId}">${escapeHtml(i.title)}</button>`).join('')}</div>`:'';
  const pack=item.packs[0];
  const design=item.character?.designCard;
  const designElements=design?`<section class="design-elements"><h3>从烟标到人物</h3><ol>${design.translations.map(t=>`<li><strong>${escapeHtml(t.package_element)}</strong><span>${escapeHtml(t.character_element)}</span></li>`).join('')}</ol><p class="design-observation">${escapeHtml(design.packaging.material_uncertainty)}</p></section>`:'';
  const sources=item.sources.length?`<h3>资料来源</h3><ul class="source-links">${item.sources.map(source=>`<li><a href="${escapeHtml(source.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(source.title)} ↗</a></li>`).join('')}</ul>`:'';
  document.getElementById('dialogBody').innerHTML=`
    <div class="detail-layout" style="--card-accent:${item.accent};--card-dark:${item.dark}">
      <div class="detail-art ${item.character?.image?.fullBody?'fullbody-art':''}">${item.character?character(item):packPhoto(item,true)}<span class="detail-art-caption">${item.character?'CONCEPT CHARACTER':'PACKAGE REFERENCE'} / ${item.province}</span></div>
      <div class="detail-copy">
        <div class="eyebrow">ARCHIVE FILE · ${String(allItems.indexOf(item)+1).padStart(2,'0')}</div>
        <div class="detail-brand">${item.province} / ${item.brand}</div>
        ${variantTabs}<h2 id="dialogTitle">${item.role}</h2><p class="detail-subtitle">${item.title}</p><div class="detail-rule"></div>
        <dl><div><dt>视觉色谱</dt><dd>${item.palette}</dd></div><div><dt>${design?'包装线索':'概念纹样'}</dt><dd>${escapeHtml(design?design.packaging.observed_elements.join(' · '):item.character?provinces.find(p=>p.id===item.provinceId).motif:'待逐项解析原包装')}</dd></div></dl>
        <h3>角色手记</h3><p>${item.design}</p>
        ${designElements}<h3>品牌与包装档案</h3><p>${item.archive}</p>${/待.*核对/.test(item.verification||'')?`<p class="archive-verification">${escapeHtml(item.verification)}</p>`:''}
        ${item.producer?`<p class="archive-producer">文献所述企业：${escapeHtml(item.producer)}</p>`:''}
        ${sources}
        ${pack?`<div class="detail-pack">${packPhoto(item,true)}<div><span>包装实物参考</span><p>${escapeHtml(pack.label)}</p>${pack.collectionDate?`<p>馆藏采集：${escapeHtml(pack.collectionDate)}${pack.collectionCity?' · '+escapeHtml(pack.collectionCity):''}<br>采集地不等于生产地。</p>`:''}<a href="${escapeHtml(pack.sourceUrl)}" target="_blank" rel="noopener noreferrer">查看烟盒图片来源 ↗</a><br><a href="${escapeHtml(pack.imagePath)}" target="_blank" rel="noopener noreferrer">查看完整原始照片 ↗</a></div></div>`:''}
        <button type="button" class="detail-save" data-save="${item.id}" aria-pressed="${saved.has(item.id)}">${saved.has(item.id)?'♥ 已收藏':'♡ 加入收藏'}</button>
        <p class="detail-disclaimer">角色为非官方原创概念。烟盒仅为一个包装样本，不代表品牌全部产品。</p>
      </div>
    </div>`;
  if(!dialog.open)dialog.showModal();document.body.classList.add('dialog-open');
}
function selectProvince(id){if(!provinces.some(p=>p.id===id))return;activeProvince=id;renderProvinces();renderProvince();}
document.addEventListener('click',event=>{
  const province=event.target.closest('[data-province]');if(province){selectProvince(province.dataset.province);return}
  const save=event.target.closest('[data-save]');if(save){toggleSave(save.dataset.save);return}
  const open=event.target.closest('[data-open]');if(open)openDetail(open.dataset.open,open.dataset.variant);
});
document.addEventListener('keydown',event=>{
  if((event.key==='Enter'||event.key===' ')&&event.target.matches('.map-shape.selectable,.map-pin')){event.preventDefault();selectProvince(event.target.dataset.province)}
});
document.getElementById('dialogClose').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',event=>{if(event.target===dialog)dialog.close()});
dialog.addEventListener('close',()=>document.body.classList.remove('dialog-open'));
document.getElementById('chinaMap').innerHTML=chinaMapSvg;
document.getElementById('archiveCount').textContent=allItems.length;
document.getElementById('collectionCapacity').textContent=allItems.length;
document.getElementById('archiveProgress').textContent=`34 个省级地区均可选择，已收录 ${featuredProvinces.length} 地，含 ${window.archiveCatalog.skuCount} 款规格，已完成 ${window.archiveCatalog.characterCount} 张立绘；点击剪影揭示角色。`;

renderProvinces();renderProvince();renderSaved();selectProvince("shanghai");

