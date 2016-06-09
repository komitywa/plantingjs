export const MOVE_END = 'moveend';
const PREVENT_SELECT_CLASS = 'noselect';

export function moveableComponent({ view }) {
  const offset = {};
  const position = {};

  function onMouseMove({ clientX, clientY }) {
    position.x = clientX - offset.x;
    position.y = clientY - offset.y;
    view.el.style.transform =
      `translate3d(${position.x}px, ${position.y}px, 0)`;
  }

  function onMouseUp() {
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp, false);
    view.trigger(MOVE_END, position);
  }

  function onMouseDown({ clientX, clientY }) {
    const { left, top } = view.el.getBoundingClientRect();
    offset.x = clientX - left;
    offset.y = clientY - top;
    document.addEventListener('mousemove', onMouseMove, false);
    document.addEventListener('mouseup', onMouseUp, false);
  }

  view.delegate('mousedown', null, onMouseDown);
  view.el.classList.add(PREVENT_SELECT_CLASS);
}
