import React, {useEffect, useState} from "../../_snowpack/pkg/react.js";
import {Button, Slide, Snackbar} from "../../_snowpack/pkg/@material-ui/core.js";
import {Alert} from "../../_snowpack/pkg/@material-ui/lab.js";
import {pointerlock} from "../util.js";
function TransitionDown(props) {
  return /* @__PURE__ */ React.createElement(Slide, {
    ...props,
    direction: "down"
  });
}
const howToEnableRawInputUrl = "https://gist.github.com/zardoy/8325b680c08a396d820986991c54a41e";
let MouseRawInputSnackbar = () => {
  const [snackbarState, setSnackbarState] = useState("notShowed");
  useEffect(() => {
    if (snackbarState !== "notShowed")
      return;
    const listener = () => pointerlock.usingRawInput !== null && setSnackbarState(pointerlock.usingRawInput);
    pointerlock.onCapture.push(listener);
    return () => {
      pointerlock.removeListener("onCapture", listener);
    };
  }, [snackbarState]);
  return /* @__PURE__ */ React.createElement(Snackbar, {
    open: typeof snackbarState === "boolean",
    onClose: () => setSnackbarState("showed"),
    anchorOrigin: {
      vertical: "top",
      horizontal: "right"
    },
    TransitionComponent: TransitionDown,
    autoHideDuration: 4e3
  }, /* @__PURE__ */ React.createElement(Alert, {
    severity: snackbarState ? "success" : "warning"
  }, "Mouse Raw Input ", snackbarState ? "enabled" : "needs to be enabled!", !snackbarState && /* @__PURE__ */ React.createElement(Button, {
    color: "primary",
    size: "small",
    component: "a",
    target: "_blank",
    href: howToEnableRawInputUrl
  }, "MORE INFO")));
};
export default MouseRawInputSnackbar;
