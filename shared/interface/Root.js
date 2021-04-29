import React from "../../_snowpack/pkg/react.js";
import GamePause from "./GamePause.js";
import MouseRawInputSnackbar from "./MouseRawInputSnackbar.js";
import TouchControls from "./TouchControls.js";
export const touchMovement = {x: 0, y: 0, z: 0};
let Root = ({unloadModule}) => {
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(MouseRawInputSnackbar, null), /* @__PURE__ */ React.createElement(TouchControls, {
    updateTouchMoving: ({x, y, z}) => {
      touchMovement.x = x;
      touchMovement.y = y;
      touchMovement.z = z;
    }
  }), /* @__PURE__ */ React.createElement(GamePause, {
    buttons: [
      {
        label: "SOCIAL"
      },
      {
        label: "OPTIONS"
      },
      {
        label: "UNLOAD MODULE"
      }
    ]
  }));
};
export default Root;
