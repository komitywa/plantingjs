const required = param => {
  throw new Error(`Parametr ${param} is required`);
};

export function createMouseEvent({
  type = required('type'),
  canBubble = false,
  cancelable = true,
  view = global.window,
  detail = 0,
  screenX = 0,
  screenY = 0,
  clientX = 0,
  clientY = 0,
  ctrlKey = false,
  altKey = false,
  shiftKey = false,
  metaKey = false,
  button = false,
  relatedTarget = null,
}) {
  const event = document.createEvent('MouseEvent');

  event.initMouseEvent(
      type, canBubble, cancelable, view, detail,
      screenX, screenY, clientX, clientY, ctrlKey,
      altKey, shiftKey, metaKey, button, relatedTarget);

  return event;
}
