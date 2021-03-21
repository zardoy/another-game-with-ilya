// check support for events
// right top corner - (battery) time
import { physicsUpdate, render } from "./loop.js";
import { createProgram, debug, isMouseLocked } from "./util.js";
import "./integrations.js";

const glsl = x => x;

const resize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
};
resize();
window.addEventListener("resize", resize);

// document.addEventListener("mousedown", () => {
//     document.documentElement.requestPointerLock();
// });

// document.addEventListener("pointerlockerror")

const gl = canvas.getContext("webgl2");

if (!gl) {
    throw new Error("WebGL 2 isn't supported on your platform. Probably you could enable it manually");
}

// SHADERS

const vertexCode = glsl`#version 300 es

in vec4 a_position;

// in vec2 a_position;

// uniform vec2 u_resolution;

void main() {
    // vec2 clip_space = a_position / u_resolution * 2 - 1.0;
    
    // gl_Position = vec4(clip_space);
    gl_Position = a_position;
}
`;
const fragmentCode = glsl`#version 300 es
precision highp float;

uniform vec4 u_color;

out vec4 outColor;

void main() {
    outColor = u_color;
}
`;
const shaderProgram = createProgram(gl, vertexCode, fragmentCode);

const positionAttributeLocation = gl.getAttribLocation(shaderProgram, "a_position");

const positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

const vao = gl.createVertexArray();

// now we're working with this vertex array
gl.bindVertexArray(vao);
// > 2
gl.enableVertexAttribArray(positionAttributeLocation);

gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

// chore: adjust viewport
gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

gl.useProgram(shaderProgram);

setInterval(physicsUpdate, 10);

const renderLoop = () => {
    render(gl, shaderProgram);
    requestAnimationFrame(renderLoop);
};
renderLoop();