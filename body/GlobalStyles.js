import React from "../_snowpack/pkg/react.js";
import {Global} from "../_snowpack/pkg/@emotion/react.js";
import {CssBaseline} from "../_snowpack/pkg/@material-ui/core.js";
let GlobalStyles = () => {
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(CssBaseline, null), /* @__PURE__ */ React.createElement(Global, {
    styles: {
      "html, #root": {
        height: "100vh"
      },
      html: {
        overflow: "hidden",
        userSelect: "none",
        WebkitTouchCallout: "none",
        touchAction: "none"
      },
      body: {
        overflow: "hidden"
      },
      canvas: {
        position: "fixed",
        left: 0,
        top: 0,
        overflow: "hidden",
        width: "100%",
        height: "100vh"
      }
    }
  }));
};
export default GlobalStyles;
