(() => {
 const id=new URLSearchParams(location.search).get('item'),stage=document.querySelector('.pack-inspector');if(!stage)return;
 const row=window.v2Exhibits.find(d=>d.id===id);if(!row)return;
 const photos={'sku-yanpk-929':'assets/packs/front-photos/sku-yanpk-929-photo.jpg'};
 const button=document.createElement('button');button.className='pack-image-open';button.dataset.image=photos[id]||row.packFront;button.dataset.title=row.name;button.setAttribute('aria-label','查看'+row.name+'包装图片');
 const image=stage.querySelector('img');image.before(button);button.append(image);if(photos[id]){const source=document.createElement('a');source.href='https://m.yanpk.com/item-mobile-do-pictures-albumid-739.html';source.textContent='中华软实拍来源 · 黑色眼睛 / 九联汇相册';source.target='_blank';source.rel='noopener noreferrer';document.querySelector('.narrative details')?.append(source);}
})();
