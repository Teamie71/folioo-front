/** 맵 블록의 실제 모습을 복제하고 누른 지점을 커서에 맞춰 이동한다. */
export function createMapDragGhost(source: HTMLElement, x: number, y: number) {
  const rect = source.getBoundingClientRect();
  const scale = source.offsetWidth ? rect.width / source.offsetWidth : 1;
  const pointerOffsetX = x - rect.left;
  const pointerOffsetY = y - rect.top;
  const wrapper = document.createElement('div');
  const clone = source.cloneNode(true) as HTMLElement;

  clone.removeAttribute('id');
  clone
    .querySelectorAll('[id]')
    .forEach((element) => element.removeAttribute('id'));
  clone.style.width = `${source.offsetWidth}px`;
  clone.style.transform = `scale(${scale})`;
  clone.style.transformOrigin = 'top left';

  wrapper.setAttribute('aria-hidden', 'true');
  wrapper.style.cssText = [
    'position:fixed',
    'z-index:300',
    'pointer-events:none',
    'opacity:0.92',
    `width:${rect.width}px`,
    `height:${rect.height}px`,
    'filter:drop-shadow(0 4px 12px #00000026)',
  ].join(';');
  wrapper.appendChild(clone);
  document.body.appendChild(wrapper);

  const move = (clientX: number, clientY: number) => {
    wrapper.style.transform = `translate3d(${clientX - pointerOffsetX}px, ${clientY - pointerOffsetY}px, 0)`;
  };
  move(x, y);

  return { move, remove: () => wrapper.remove() };
}
