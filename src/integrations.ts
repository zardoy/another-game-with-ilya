// INTEGRATIONS WITH USER INPUT (KEYBOARD MOUSE ETC)

import { rotateCamera } from "./loop.js";
import { pointerlock, touchSupported } from "./util.js";

if (touchSupported) {
    // CAMERA ROTATION
    let ongoingTouch: {
        id: number,
        last: Record<"x" | "y", number>,
    } | null = null;
    canvas.addEventListener("pointerdown", ({ pointerId, clientX, clientY }) => {
        // TODO: NOT ALWAYS CAPTURING WITH MOVEMENT!
        if (ongoingTouch) return;
        // ensure that pointer is captured
        canvas.setPointerCapture(pointerId);
        ongoingTouch = {
            id: pointerId,
            last: { x: clientX, y: clientY }
        };
    });
    canvas.addEventListener("pointermove", ({ pointerId, clientX, clientY }) => {
        if (!ongoingTouch || ongoingTouch.id !== pointerId) return; // should throw err?
        const { last } = ongoingTouch;
        const deltaX = clientX - last.x;
        const deltaY = clientY - last.y;
        ongoingTouch.last = {
            x: clientX, y: clientY
        };
        rotateCamera(deltaX * 3, deltaY * 3);
    });
    canvas.addEventListener("lostpointercapture", e => {
        if (ongoingTouch && ongoingTouch.id !== e.pointerId) return;
        ongoingTouch = null;
    });
}

window.addEventListener("keydown", e => {
    if (
        (e.code === "KeyS" && e.ctrlKey) ||
        // prevent scrolling the page
        e.code === "Space" ||
        e.code.startsWith("Arrow")
    ) {
        e.preventDefault();
    }
});

canvas.addEventListener("click", () => {
    pointerlock.capture();
});
