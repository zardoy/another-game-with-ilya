import React, {useEffect, useRef, useState} from "../_snowpack/pkg/react.js";
import {Vector3} from "../_snowpack/pkg/three.js";
import {Sky} from "../_snowpack/pkg/@react-three/drei.js";
import {Canvas as ThreeFiberCanvas, useThree} from "../_snowpack/pkg/@react-three/fiber.js";
import {initCameraControl} from "../shared/cameraControl.js";
import {touchMovement} from "../shared/interface/Root.js";
import {useInterval} from "../shared/react-util.js";
import {getActiveMovement} from "../shared/util.js";
const Box = (props) => {
  const mesh = useRef(null);
  const [hovered, setHovered] = useState(false);
  const [active, setActive] = useState(false);
  return /* @__PURE__ */ React.createElement("mesh", {
    ref: mesh,
    scale: active ? 1.5 : 1,
    onClick: () => setActive(!hovered),
    ...props
  }, /* @__PURE__ */ React.createElement("boxGeometry", {
    args: [2, 2, 2]
  }), /* @__PURE__ */ React.createElement("meshStandardMaterial", {
    color: hovered ? "hotpink" : "orange"
  }));
};
const CanvasControl = () => {
  const {camera} = useThree();
  useInterval(() => {
    const movement = getActiveMovement({touchMovement});
    const movementVector = new Vector3(movement.x, movement.y, movement.z);
    movementVector.divideScalar(10);
    camera.position.add(movementVector);
  }, 15);
  useEffect(() => {
    initCameraControl(document.getElementById("canvas"), {
      rotateCamera({x, y}) {
        camera.rotation.y -= x * 2e-3;
        camera.rotation.x -= y * 2e-3;
      }
    });
    return () => {
      console.log("Canvas unmounted!");
    };
  }, []);
  return null;
};
let Canvas = () => {
  return /* @__PURE__ */ React.createElement(ThreeFiberCanvas, {
    id: "canvas"
  }, /* @__PURE__ */ React.createElement(CanvasControl, null), /* @__PURE__ */ React.createElement(Sky, {
    sunPosition: [100, 20, 100]
  }), /* @__PURE__ */ React.createElement("ambientLight", null), /* @__PURE__ */ React.createElement("pointLight", {
    position: [10, 10, 10]
  }), /* @__PURE__ */ React.createElement(Box, {
    position: [-1.2, 0, 0]
  }), /* @__PURE__ */ React.createElement(Box, {
    position: [1.2, 0, 0]
  }));
};
export default Canvas;
