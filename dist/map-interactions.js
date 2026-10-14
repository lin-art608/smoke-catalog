// A single hover/focus label keeps the small provinces readable.
const mapRoot = document.getElementById('chinaMap');
mapRoot.querySelector('.china-svg').setAttribute('role', 'group');
mapRoot.querySelector('.map-points')?.remove();
mapRoot.querySelectorAll('title').forEach(title => title.remove());
const mapTooltip = document.createElement('div');
mapTooltip.id = 'mapTooltip';
mapTooltip.className = 'map-tooltip';
mapTooltip.setAttribute('role', 'tooltip');
mapTooltip.hidden = true;
document.body.append(mapTooltip);
function positionMapTooltip(x, y) {
  const box = mapTooltip.getBoundingClientRect();
  mapTooltip.style.left = `${Math.max(8, Math.min(x + 14, window.innerWidth - box.width - 8))}px`;
  mapTooltip.style.top = `${Math.max(8, Math.min(y + 16, window.innerHeight - box.height - 8))}px`;
}
function showMapTooltip(target, x, y) {
  const region = provinces.find(p => p.id === target.dataset.province);
  if (!region) return;
  mapTooltip.textContent = region.name;
  mapTooltip.hidden = false;
  positionMapTooltip(x, y);
}
mapRoot.addEventListener('pointermove', event => {
  if (event.pointerType === 'touch') return;
  const target = event.target.closest('.map-shape[data-province]');
  if (target) showMapTooltip(target, event.clientX, event.clientY);
  else mapTooltip.hidden = true;
});
mapRoot.addEventListener('pointerleave', () => { mapTooltip.hidden = true; });
mapRoot.addEventListener('focusin', event => {
  const target = event.target.closest('.map-shape[data-province]');
  if (!target) return;
  const box = target.getBoundingClientRect();
  showMapTooltip(target, box.left + box.width / 2, box.top + box.height / 2);
});
mapRoot.addEventListener('focusout', () => { mapTooltip.hidden = true; });
window.addEventListener('scroll', () => { mapTooltip.hidden = true; }, {passive:true});
window.addEventListener('resize', () => { mapTooltip.hidden = true; });
document.addEventListener('keydown', event => { if(event.key === 'Escape') mapTooltip.hidden = true; });
