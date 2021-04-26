// POINTER LOCK API WAS ALWAYS ACTUALLY ASYNC A LOT OF BUGS!! (and exitPointerLock as well)!!!
// IM NOT ABLE TO CHECK WHETHER RAW INPUT IS ENABLED ON PAGE LOAD BECAUSE OF BUGS

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
