import _ from "../_snowpack/pkg/lodash.js";
import {initCameraControl} from "../shared/cameraControl.js";
import {touchMovement} from "../shared/interface/Root.js";
import {Matrix4x4} from "../shared/structures.js";
import {createProgram, entries, getActiveMovement, mapVector} from "../shared/util.js";
import vec3 from "../shared/vec3.js";
import {renderFrame} from "./renderFrame.js";
export let rz = 0, ry = 0;
export const fNear = 0.1;
export const matProj = new Matrix4x4();
class Triangle {
  constructor(points) {
    this.points = points;
    this.normal = Triangle.getNormal(this);
  }
  static getNormal(triangle) {
    const line1 = vec3(triangle.points[1].x - triangle.points[0].x, triangle.points[1].y - triangle.points[0].y, triangle.points[1].z - triangle.points[0].z), line2 = vec3(triangle.points[2].x - triangle.points[0].x, triangle.points[2].y - triangle.points[0].y, triangle.points[2].z - triangle.points[0].z), normal = vec3(line1.y * line2.z - line1.z * line2.y, line1.z * line2.x - line1.x * line2.z, line1.x * line2.y - line1.y * line2.x);
    normal.normalize();
    return normal;
  }
}
export const mesh = [];
export const camera = vec3(0, 0, -5);
export const setupCanvas = (canvas, updateStat) => {
  const glsl = (x) => x;
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
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    updateStat("resolution", `${canvas.width} X ${canvas.height}`);
  };
  resize();
  window.addEventListener("resize", resize);
  const gl = canvas.getContext("webgl2", {
    powerPreference: "high-performance"
  });
  if (!gl) {
    throw new Error("WebGL 2 isn't supported on your platform. Probably you can enable it manually");
  }
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
  gl.bindVertexArray(vao);
  gl.enableVertexAttribArray(positionAttributeLocation);
  gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  gl.useProgram(shaderProgram);
  let fps = 0;
  setInterval(() => {
    updateStat("fps", fps);
    fps = 0;
  }, 1e3);
  const renderLoop = () => {
    fps++;
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    renderFrame(gl, shaderProgram, updateStat);
    requestAnimationFrame(renderLoop);
  };
  renderLoop();
  const fFar = 1e3;
  const fFov = 90;
  let fAspectRatio = 1;
  const fFovRad = 1 / Math.tan(fFov * 0.5 / 180 * 3.14159);
  const getBlockSideCoordinates = (x, y, z) => {
    return [
      0,
      0,
      0,
      0
    ];
  };
  const blockSideToCoordinateMap = {
    west: ["x", 1],
    east: ["x", -1],
    south: ["z", 1],
    north: ["z", -1],
    top: ["y", 1],
    bottom: ["y", -1]
  };
  const getTriangles = (blockPosition) => {
    const blockSidesArr = {
      top: [
        [0, 1, 1],
        [1, 1, 1],
        [1, 1, 0],
        [0, 1, 0]
      ],
      bottom: [
        [0, 0, 0],
        [1, 0, 0],
        [1, 0, 1],
        [0, 0, 1]
      ],
      south: [
        [1, 1, 1],
        [0, 1, 1],
        [0, 0, 1],
        [1, 0, 1]
      ],
      north: [
        [0, 1, 0],
        [1, 1, 0],
        [1, 0, 0],
        [0, 0, 0]
      ],
      west: [
        [1, 1, 0],
        [1, 1, 1],
        [1, 0, 1],
        [1, 0, 0]
      ],
      east: [
        [0, 0, 0],
        [0, 0, 1],
        [0, 1, 1],
        [0, 1, 0]
      ]
    };
    const blockSidesTriangles = _.mapValues(blockSidesArr, (squareCoordinatesArr) => {
      const squareCoordinates = squareCoordinatesArr.map((coordinateArr) => {
        const point = vec3(...coordinateArr);
        point.add(blockPosition);
        return point;
      });
      const triangles = [
        squareCoordinates.slice(0, -1),
        [
          ...squareCoordinates.slice(2),
          squareCoordinates[0]
        ]
      ].map((triangleCoordinates) => new Triangle(triangleCoordinates));
      return triangles;
    });
    return blockSidesTriangles;
  };
  class World {
  }
  World.HEIGHT = 256;
  class Block {
    constructor(position) {
      this.position = position;
    }
  }
  class Chunk {
    constructor(blocks2) {
    }
  }
  Chunk.SIZE = 16;
  const doesBlockExist = (position) => {
    for (const block of blocks) {
      if (block.position.equals(position))
        return true;
    }
    return false;
  };
  const blocks = [
    new Block(vec3(0, 0, 1))
  ];
  const recalculateMesh = () => {
    for (const block of blocks) {
      const sideTriangles = getTriangles(block.position);
      const blockColor = (block.position.x + block.position.z % 2) % 2 === 0 ? [1, 0, 0] : [0, 1, 0];
      for (const [side, triangles] of entries(sideTriangles)) {
        const siblingBlockPos = block.position.clone();
        const [componentAdd, valueToAdd] = blockSideToCoordinateMap[side];
        mapVector(siblingBlockPos, (value, _index, component) => {
          if (component !== componentAdd)
            return value;
          return value + valueToAdd;
        });
        const siblingBlockExists = doesBlockExist(siblingBlockPos);
        if (!siblingBlockExists)
          mesh.push({
            triangles,
            color: blockColor
          });
      }
    }
  };
  _.times(10, (x) => {
    _.times(10, (z) => {
      blocks.push(new Block(vec3(x, 0, z)));
    });
  });
  recalculateMesh();
  matProj.matrix[0][0] = fAspectRatio * fFovRad;
  matProj.matrix[1][1] = fFovRad;
  matProj.matrix[2][2] = fFar / (fFar - fNear);
  matProj.matrix[3][2] = -fFar * fNear / (fFar - fNear);
  matProj.matrix[2][3] = 1;
  matProj.matrix[3][3] = 0;
  document.addEventListener("resize", () => {
    const canvas2 = document.querySelector("canvas");
    fAspectRatio = canvas2.width / canvas2.height;
    matProj.matrix[0][0] = fAspectRatio * fFovRad;
  });
  const rotateCamera = (delta) => {
    const {x, y} = delta;
    const delimeter = 500;
    rz -= x / delimeter;
    if (ry - y / delimeter > -1.54 && ry - y / delimeter < 1.54)
      ry -= y / delimeter;
  };
  const MOVEMENT_DIVIDER_MIN = 100;
  const moveCamera = (vecAdd, subtract) => {
    let movementDivider = MOVEMENT_DIVIDER_MIN;
    mapVector(vecAdd, (val) => val / movementDivider);
    camera[subtract ? "subtract" : "add"](vecAdd);
  };
  const physicsUpdate = () => {
    const movement = getActiveMovement({touchMovement});
    if (movement.y) {
      moveCamera(vec3(0, movement.y, 0), false);
    }
    if (movement.z) {
      moveCamera(vec3(-Math.sin(rz), 0, Math.cos(rz)), movement.z > 0);
    }
    if (movement.x) {
      moveCamera(vec3(-Math.cos(rz), 0, -Math.sin(rz)), movement.x > 0);
    }
  };
  setInterval(physicsUpdate, 10);
  initCameraControl(canvas, {rotateCamera});
};
