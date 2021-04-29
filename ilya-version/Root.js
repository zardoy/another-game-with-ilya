import React, {useEffect, useRef} from "../_snowpack/pkg/react.js";
import Stats from "../shared/interface/Stats.js";
import {setupCanvas} from "./canvasSetup.js";
let Root = () => {
  const canvasRef = useRef(null);
  const updateStatCallbackRef = useRef(null);
  useEffect(() => {
    setupCanvas(canvasRef.current, updateStatCallbackRef.current);
    return () => {
      console.log("Canvas unmounted!");
    };
  }, []);
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Stats, {
    updateStatCallbackRef
  }), /* @__PURE__ */ React.createElement("canvas", {
    ref: canvasRef
  }));
};
export default Root;
