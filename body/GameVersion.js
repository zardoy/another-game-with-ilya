import React, {Suspense} from "../_snowpack/pkg/react.js";
import {css} from "../_snowpack/pkg/@emotion/css.js";
import {Backdrop as MUIBackdrop, CircularProgress} from "../_snowpack/pkg/@material-ui/core.js";
import zIndex from "../_snowpack/pkg/@material-ui/core/styles/zIndex.js";
import Interface from "../shared/interface/Root.js";
const Backdrop = () => /* @__PURE__ */ React.createElement(MUIBackdrop, {
  open: true,
  className: css`
        z-index: ${zIndex.drawer + 1} !important;
    `
}, /* @__PURE__ */ React.createElement(CircularProgress, {
  color: "inherit"
}));
let GameVersion = ({children, unloadModule = () => {
}}) => {
  return /* @__PURE__ */ React.createElement(Suspense, {
    fallback: /* @__PURE__ */ React.createElement(Backdrop, null)
  }, children, /* @__PURE__ */ React.createElement(Interface, {
    unloadModule
  }));
};
export default GameVersion;
