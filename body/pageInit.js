import * as __SNOWPACK_ENV__ from '../_snowpack/env.js';

if (__SNOWPACK_ENV__.NODE_ENV === "development")
  document.title = "(dev) " + document.title;
const launchedVersion = __SNOWPACK_ENV__.SNOWPACK_PUBLIC_SCRIPT.match(/\/([^\.]+)\.js/)[1];
document.title = `${document.title} - ${launchedVersion}`;
window.addEventListener("keydown", (e) => {
  if (e.code === "KeyS" && e.ctrlKey || e.code === "Space" || e.code.startsWith("Arrow")) {
    e.preventDefault();
  }
});
