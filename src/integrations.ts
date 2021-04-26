import { rotateCamera } from "./loop.js";
import { debug, isMouseLocked, touchSupported } from "./util.js";

document.addEventListener("pointerlockchange", () => {
    if (isMouseLocked()) {
        debug("Lock captured");
    } else {
        debug("Lock released");
    }
});

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

export const requestPointerLock = () => {
    if (!document.documentElement.requestPointerLock) return;
    //@ts-ignore;
    const usingRawInput = !!document.documentElement.requestPointerLock({
        unadjustedMovement: true
    });
};

canvas.addEventListener("click", () => {
    requestPointerLock();
});
