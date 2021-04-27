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
