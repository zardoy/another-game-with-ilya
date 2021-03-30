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
