import { debug, isMouseLocked } from "./util.js";

document.addEventListener("pointerlockchange", () => {
    if (isMouseLocked()) {
        debug("Lock captured");
    } else {
        debug("Lock released");
    }
});

document.addEventListener("click", () => {
    //@ts-ignore
    const usingRawInput = !!document.documentElement.requestPointerLock({
        unadjustedMovement: true
    });
    console.log(usingRawInput ? "Using raw input" : "Not using raw input");
});