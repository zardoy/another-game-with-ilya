import _ from "../_snowpack/pkg/lodash.js";
import {activeControls} from "./movementControl.js";
import vec3 from "./vec3.js";
export const touchSupported = "ontouchstart" in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
export const mapVector = (vector, callback) => {
  const c = ["x", "y", "z"];
  const newArray = vector.toArray().map((value, index) => callback(value, index, c[index]));
  vector.update(vec3(...newArray));
};
export const pointerlock = {
  usingRawInput: null,
  get captured() {
    return !!document.pointerLockElement;
  },
  capture() {
    if (!document.documentElement.requestPointerLock)
      return;
    const usingRawInput = !!document.documentElement.requestPointerLock({
      unadjustedMovement: true
    });
    pointerlock.usingRawInput = usingRawInput;
    return usingRawInput;
  },
  onRelease: [],
  onCapture: [],
  stopFiring: false,
  removeListener: (type, listener) => {
    const indexToRemove = pointerlock[type].indexOf(listener);
    if (indexToRemove < 0)
      throw new TypeError(`Listener ${listener} on type ${type} doesn't exist`);
    pointerlock[type].splice(indexToRemove, 1);
  }
};
export const getRendererName = () => {
  const gl = document.createElement("canvas").getContext("webgl");
  if (!gl)
    throw new Error("Webgl is disabled or unsupported");
  const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
  if (!debugInfo)
    throw new Error("no WEBGL_debug_renderer_info");
  const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
  return renderer;
};
{
  document.addEventListener("pointerlockchange", (e) => {
    if (pointerlock.stopFiring)
      return;
    const {captured} = pointerlock;
    debug(`Lock ${captured ? "captured" : "released"}`);
    const eventsToFire = captured ? pointerlock.onCapture : pointerlock.onRelease;
    eventsToFire.forEach((callback) => callback(e));
  });
}
export const getActiveMovement = ({touchMovement}) => {
  const hardwareMovementRaw = activeControls.movement.query();
  const movement = {
    x: hardwareMovementRaw.x,
    y: activeControls.crouch.query() ? -1 : activeControls.jump.query() ? 1 : 0,
    z: hardwareMovementRaw.y
  };
  for (const [coord] of entries(movement)) {
    movement[coord] = _.clamp(touchMovement[coord] + movement[coord], -1, 1);
  }
  return movement;
};
export const debug = (str) => {
  console.log(str);
};
export const entries = (obj) => {
  return Object.entries(obj);
};
export const keys = (obj) => {
  return Object.keys(obj);
};
export const createProgram = (gl, vertexShader, fragmentShader) => {
  const createShader = (gl2, type, source) => {
    const shader = gl2.createShader(type);
    gl2.shaderSource(shader, source);
    gl2.compileShader(shader);
    const success = gl2.getShaderParameter(shader, gl2.COMPILE_STATUS);
    if (!success) {
      const info = gl2.getShaderInfoLog(shader);
      gl2.deleteShader(shader);
      throw new Error("Shader compile error: " + info);
    }
    return shader;
  };
  const program = gl.createProgram();
  gl.attachShader(program, createShader(gl, gl.VERTEX_SHADER, vertexShader));
  gl.attachShader(program, createShader(gl, gl.FRAGMENT_SHADER, fragmentShader));
  gl.linkProgram(program);
  const linkSuccess = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (!linkSuccess) {
    const info = gl.getProgramInfoLog(program);
    gl.deleteProgram(program);
    throw new Error("Program link error: " + info);
  }
  return program;
};
