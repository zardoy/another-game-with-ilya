import {pointerlock, touchSupported} from "./util.js";
export const initCameraControl = (container, {rotateCamera}) => {
  if (touchSupported) {
    let ongoingTouch = null;
    container.addEventListener("pointerdown", ({pointerId, clientX, clientY}) => {
      if (ongoingTouch)
        return;
      container.setPointerCapture(pointerId);
      ongoingTouch = {
        id: pointerId,
        last: {x: clientX, y: clientY}
      };
    });
    container.addEventListener("pointermove", ({pointerId, clientX, clientY}) => {
      if (!ongoingTouch || ongoingTouch.id !== pointerId)
        return;
      const {last} = ongoingTouch;
      const delta = {x: clientX - last.x, y: clientY - last.y};
      ongoingTouch.last = {
        x: clientX,
        y: clientY
      };
      rotateCamera(delta);
    });
    container.addEventListener("lostpointercapture", (e) => {
      if (ongoingTouch && ongoingTouch.id !== e.pointerId)
        return;
      ongoingTouch = null;
    });
  } else {
    document.addEventListener("mousemove", (event) => {
      if (!document.pointerLockElement)
        return;
      const {movementX: deltaX, movementY: deltaY} = event;
      rotateCamera({x: deltaX, y: deltaY});
    });
  }
  container.addEventListener("click", () => {
    pointerlock.capture();
  });
};
