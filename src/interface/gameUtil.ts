export const init = (): void => {
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
};

/** Actually sync method. Should be executed only on page load */
export const isRawInputSupported = async (): Promise<boolean> => {
    document.addEventListener("pointerlockchange", e => {
        e.stopImmediatePropagation();
        e.stopPropagation();
    }, { capture: true, once: true });
    let pointerLockResult: undefined | Promise<void>;
    try {
        //@ts-ignore
        await (pointerLockResult = document.body.requestPointerLock({
            unadjustedMovement: true
        }));
    } catch (err) { }
    document.exitPointerLock();
    return pointerLockResult !== undefined;
};

// https://browserleaks.com/webgl
// implementation from https://bit.ly/3s1Rz8z
// todo handle errors
export const getRendererName = () => {
    const gl = document.createElement("canvas").getContext("webgl");
    if (!gl) throw new Error("Webgl is disabled or unsupported");
    const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
    if (!debugInfo) throw new Error("no WEBGL_debug_renderer_info");
    const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
    return renderer;
};
