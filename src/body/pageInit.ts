if (import.meta.env.NODE_ENV === "development") document.title = "(dev) " + document.title;

const launchedVersion = import.meta.env.SNOWPACK_PUBLIC_SCRIPT.match(/\/([^\.]+)\.js/)![1];

document.title = `${document.title} - ${launchedVersion}`;

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
