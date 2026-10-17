(() => {
 const id=new URLSearchParams(location.search).get('item');
 const references={'sku-yanpk-929':{image:'assets/packs/front-photos/sku-yanpk-929-photo.jpg',title:'中华(软) · 正面实拍 · 800 × 1000',source:'https://m.yanpk.com/item-mobile-do-pictures-albumid-739.html',credit:'黑色眼睛 · 九联汇相册，2026-10-13'}};
 const photo=references[id],stage=document.querySelector('.object-stage');if(!photo||!stage)return;
 const ref=document.createElement('div');ref.className='pack-photo-reference';
 ref.innerHTML=`<button class="text-button" data-image="${photo.image}" data-title="${photo.title}">查看正面实拍 ↗</button><a href="${photo.source}" target="_blank" rel="noopener noreferrer">实拍来源 · ${photo.credit}</a>`;stage.append(ref);
})();
