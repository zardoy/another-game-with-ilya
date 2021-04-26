// todo:
// - ps4 color targeting players https://thebitlink.github.io/WebHID-DS4/
// check support for events
// right top corner - (battery) time
// mouse sliders for ipad
import { physicsUpdate, render } from "./loop.js";
import { createProgram, debug, isMouseLocked, mapVector } from "./util.js";
import prismarineDiamondSquare from "diamond-square";
import vec3 from "./vec3";
import "./integrations.js";
import prismarineWorld from "prismarine-world";
import { Vec3 } from "vec3";

// const World = prismarineWorld("1.12");

// const diamondSquare = prismarineDiamondSquare({ version: '1.12', seed: Math.floor(Math.random() * Math.pow(2, 31)) });

// const world = new World(diamondSquare);

// world.getBlock(new Vec3(3, 50, 3)).then(block => console.log(JSON.stringify(block, null, 2)));

const glsl = x => x;

const downgradeResolution = 1;

if (downgradeResolution > 1) {
    canvas.style.imageRendering = "pixelated";
}

const resize = () => {
    const dpr = window.devicePixelRatio || 1;

    if (downgradeResolution > 1) {
        canvas.width = window.innerWidth / downgradeResolution;
        canvas.height = window.innerHeight / downgradeResolution;
    } else {
        // calculating proper resolution
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    document.getElementById("resolution").innerText = `${canvas.width} X ${canvas.height}`;
};
resize();
window.addEventListener("resize", resize);

// document.addEventListener("mousedown", () => {
//     document.documentElement.requestPointerLock();
// });

// document.addEventListener("pointerlockerror")

const gl = canvas.getContext("webgl2");

if (!gl) {
    throw new Error("WebGL 2 isn't supported on your platform. Probably you can enable it manually");
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

let fps = 0;
setInterval(() => {
    const fpsElem: HTMLSpanElement = document.querySelector("#fps")!;
    fpsElem.innerText = fps + "";
    fps = 0;
    vec3(0, 0, 0);
}, 1000);

const renderLoop = () => {
    fps++;
    // const colorUniformLocation = gl.getUniformLocation(shaderProgram, "u_color");
    // gl.uniform4f(colorUniformLocation, 1, 0, 0, 1);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    render(gl, shaderProgram);
    requestAnimationFrame(renderLoop);
};
renderLoop();
