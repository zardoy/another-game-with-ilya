import "./pageInit.js";
import React from "../_snowpack/pkg/react.js";
import ReactDOM from "../_snowpack/pkg/react-dom.js";
import GameVersion from "./GameVersion.js";
import GlobalStyles from "./GlobalStyles.js";
export const renderOnlyWorld = (EngineRootComponent) => {
  ReactDOM.render(/* @__PURE__ */ React.createElement(GameVersion, null, /* @__PURE__ */ React.createElement(GlobalStyles, null), /* @__PURE__ */ React.createElement(EngineRootComponent, null)), document.getElementById("root"));
};
