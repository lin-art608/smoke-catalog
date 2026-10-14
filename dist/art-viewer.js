/* Shared full-art viewer for the regional archive and original-art gallery. */
(() => {
  const viewer = document.createElement('dialog');
  viewer.className = 'art-viewer';
  viewer.setAttribute('aria-labelledby', 'artViewerTitle');
  viewer.innerHTML = '<header class="art-viewer-head"><h2 id="artViewerTitle">立绘细看</h2><button type="button" data-art-close aria-label="关闭立绘查看">×</button></header><div class="art-viewer-stage" tabindex="0" aria-label="立绘画布，放大后可滑动查看"><div class="art-viewer-canvas"><img alt=""></div></div><div class="art-viewer-tools"><button type="button" data-art-minus aria-label="缩小立绘">−</button><label>缩放 <input type="range" min="100" max="300" step="25" value="100" aria-label="立绘缩放比例"></label><output>100%</output><button type="button" data-art-plus aria-label="放大立绘">＋</button><button type="button" data-art-reset>适应屏幕</button><a target="_blank" rel="noopener noreferrer">查看原图 ↗</a></div><p class="art-viewer-hint">双击放大或还原 · 放大后滑动查看细节</p>';
  document.body.append(viewer);
  const image = viewer.querySelector('img'), range = viewer.querySelector('input'), stage = viewer.querySelector('.art-viewer-stage');
  const zoom = value => {
    range.value = Math.min(300, Math.max(100, Number(value)));
    viewer.style.setProperty('--art-zoom', Number(range.value) / 100);
    viewer.querySelector('output').textContent = range.value + '%';
    if (Number(range.value) === 100) { stage.scrollTop = 0; stage.scrollLeft = 0; }
  };
  document.addEventListener('click', event => {
    const trigger = event.target.closest('[data-view-art]');
    if (!trigger) return;
    image.src = trigger.dataset.viewArt;
    image.alt = (trigger.dataset.artTitle || '角色') + '原创立绘';
    viewer.querySelector('h2').textContent = trigger.dataset.artTitle || '立绘细看';
    viewer.querySelector('a').href = image.src;
    zoom(100);
    viewer.showModal();
    document.body.classList.add('dialog-open');
  });
  range.addEventListener('input', () => zoom(range.value));
  viewer.querySelector('[data-art-close]').onclick = () => viewer.close();
  viewer.querySelector('[data-art-plus]').onclick = () => zoom(Number(range.value) + 25);
  viewer.querySelector('[data-art-minus]').onclick = () => zoom(Number(range.value) - 25);
  viewer.querySelector('[data-art-reset]').onclick = () => zoom(100);
  stage.ondblclick = () => zoom(Number(range.value) === 100 ? 200 : 100);
  viewer.addEventListener('click', event => { if (event.target === viewer) viewer.close(); });
  viewer.addEventListener('close', () => {
    if (!document.querySelector('dialog[open]')) document.body.classList.remove('dialog-open');
    image.removeAttribute('src');
  });
})();
