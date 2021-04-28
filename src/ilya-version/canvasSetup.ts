import type { Vector2 } from "contro/dist/utils/math";
// import prismarineDiamondSquare from "diamond-square";
import _ from "lodash";
import { Vec3 } from "vec3";

// import prismarineWorld from "prismarine-world";
import { initCameraControl } from "../shared/cameraControl";
import { UpdateStatCallback } from "../shared/interface/Stats";
import { ArrayPoint, Matrix4x4, TrianglePoints } from "../shared/structures";
import { createProgram, detectGpu, entries, getActiveMovement, mapVector } from "../shared/util";
import vec3 from "../shared/vec3";
import { renderFrame } from "./renderFrame";

const glsl = x => x;

export let rz = 0, ry = 0;
export const fNear = 0.1;
export const matProj = new Matrix4x4();

class Triangle {
    static getNormal(triangle: Triangle) {
        const line1 = vec3(
            triangle.points[1].x - triangle.points[0].x,
            triangle.points[1].y - triangle.points[0].y,
            triangle.points[1].z - triangle.points[0].z,
        ),
            line2 = vec3(
                triangle.points[2].x - triangle.points[0].x,
                triangle.points[2].y - triangle.points[0].y,
                triangle.points[2].z - triangle.points[0].z,
            ),
            normal = vec3(
                line1.y * line2.z - line1.z * line2.y,
                line1.z * line2.x - line1.x * line2.z,
                line1.x * line2.y - line1.y * line2.x,
            );

        // It's normally normal to normalise the normal
        normal.normalize();
        return normal;
    };

    public normal = Triangle.getNormal(this);
    constructor(
        public points: TrianglePoints,
    ) { }
}

type Color = [number, number, number];

export const mesh: Array<{
    triangles: [Triangle, Triangle],
    color: Color;
}> = [];

export const camera = vec3(0, 0, -5);

export const setupCanvas = (canvas: HTMLCanvasElement, updateStat: UpdateStatCallback) => {
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

        updateStat("resolution", `${canvas.width} X ${canvas.height}`);
    };
    resize();
    window.addEventListener("resize", resize);

    // document.addEventListener("mousedown", () => {
    //     document.documentElement.requestPointerLock();
    // });

    // document.addEventListener("pointerlockerror")

    const gl = canvas.getContext("webgl2", {
        // doesn't switch the gpu on Windows https://github.com/emscripten-core/emscripten/issues/10000#issuecomment-749167911
        powerPreference: "high-performance"
    });

    if (!gl) {
        throw new Error("WebGL 2 isn't supported on your platform. Probably you can enable it manually");
    }
    detectGpu(gl);
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

    let fps = 0;
    setInterval(() => {
        updateStat("fps", fps);

        fps = 0;
    }, 1000);

    const renderLoop = () => {
        fps++;
        // const colorUniformLocation = gl.getUniformLocation(shaderProgram, "u_color");
        // gl.uniform4f(colorUniformLocation, 1, 0, 0, 1);
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        renderFrame(gl, shaderProgram, updateStat);
        requestAnimationFrame(renderLoop);
    };
    renderLoop();

    const fFar = 1000.0;

    const fFov = 90.0;
    let fAspectRatio = 1;
    const fFovRad = 1.0 / Math.tan(fFov * 0.5 / 180.0 * 3.14159);

    const getBlockSideCoordinates = (x: number, y: number, z: number) => {
        return [
            0, 0, 0, 0
        ];
    };

    type BlockSide =
        "south"
        | "west" | "east"
        | "north"
        | "top" | "bottom";

    const blockSideToCoordinateMap: Record<BlockSide, ["x" | "y" | "z", 1 | -1]> = {
        west: ["x", 1],
        east: ["x", -1],
        south: ["z", 1],
        north: ["z", -1],
        top: ["y", 1],
        bottom: ["y", -1],
    };
    type SquareCoordinate = [Vec3, Vec3, Vec3, Vec3];

    const getTriangles = (blockPosition: Vec3): Record<BlockSide, [Triangle, Triangle]> => {
        type SquareCoordinateArr = [ArrayPoint, ArrayPoint, ArrayPoint, ArrayPoint];

        const blockSidesArr: Record<BlockSide, SquareCoordinateArr> = {
            top: [//red
                [0, 1, 1],
                [1, 1, 1],
                [1, 1, 0],
                [0, 1, 0]
            ],
            bottom: [//blue
                [0, 0, 0],
                [1, 0, 0],
                [1, 0, 1],
                [0, 0, 1],
            ],
            south: [//blue
                [1, 1, 1],
                [0, 1, 1],
                [0, 0, 1],
                [1, 0, 1],
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

                [1, 0, 0],
            ],
            east: [
                [0, 0, 0],
                [0, 0, 1],
                [0, 1, 1],
                [0, 1, 0],
            ],
        };
        const blockSidesTriangles = _.mapValues(blockSidesArr, (squareCoordinatesArr) => {
            const squareCoordinates = squareCoordinatesArr.map(coordinateArr => {
                const point = vec3(...coordinateArr);
                point.add(blockPosition);
                return point;
            }) as SquareCoordinate;
            const triangles = [
                squareCoordinates.slice(0, -1) as TrianglePoints,
                [
                    ...squareCoordinates.slice(2),
                    squareCoordinates[0]
                ] as TrianglePoints
            ].map(triangleCoordinates => new Triangle(triangleCoordinates)) as [Triangle, Triangle];
            return triangles;
        });

        return blockSidesTriangles;
    };

    class World {
        static HEIGHT = 256;
    }
    class Block {
        constructor(
            public position: Vec3
        ) { }
    }
    class Chunk {
        static SIZE = 16;

        constructor(
            blocks: Block[]
        ) { }
    }

    // const triangleToClip = (buf: Triangle) => {
    //     var count = 0;
    //     for (const i in buf) {
    //         if (buf[i][0] * buf[i][0] > 1 || buf[i][1] * buf[i][1] > 1)
    //             count++;
    //     }
    //     return count;
    // };

    // const checkTriangleClipping = (triangle: Triangle): boolean => {
    //     if (triangle.points[0] >= ) {
    //     }
    // };

    const doesBlockExist = (position: Vec3) => {
        for (const block of blocks) {
            if (block.position.equals(position)) return true;
        }
        return false;
    };

    const blocks = [
        new Block(vec3(0, 0, 1)),
    ];
    const recalculateMesh = () => {
        for (const block of blocks) {
            const sideTriangles = getTriangles(block.position);
            const blockColor: Color =
                (block.position.x + block.position.z % 2) % 2 === 0 ?
                    [1, 0, 0] :
                    [0, 1, 0];
            for (const [side, triangles] of entries(sideTriangles)) {
                const siblingBlockPos = block.position.clone();
                const [componentAdd, valueToAdd] = blockSideToCoordinateMap[side];
                mapVector(siblingBlockPos, (value, _index, component) => {
                    if (component !== componentAdd) return value;
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
    _.times(10, x => {
        _.times(10, z => {
            blocks.push(
                new Block(vec3(x, 0, z))
            );
        });
    });
    recalculateMesh();
    matProj.matrix[0][0] = fAspectRatio * fFovRad;
    matProj.matrix[1][1] = fFovRad;
    matProj.matrix[2][2] = fFar / (fFar - fNear);
    matProj.matrix[3][2] = (-fFar * fNear) / (fFar - fNear);
    matProj.matrix[2][3] = 1.0;
    matProj.matrix[3][3] = 0.0;

    document.addEventListener("resize", () => {
        const canvas = document.querySelector("canvas") as HTMLCanvasElement;
        fAspectRatio = canvas.width / canvas.height;
        matProj.matrix[0][0] = fAspectRatio * fFovRad;
    });

    const rotateCamera = (delta: Vector2) => {
        const { x, y } = delta;
        const delimeter = 500;
        rz -= x / delimeter;
        if (ry - y / delimeter > -1.54 && ry - y / delimeter < 1.54)
            ry -= y / delimeter;
    };

    const MOVEMENT_DIVIDER_MIN = 100;
    const moveCamera = (vecAdd: Vec3, subtract: boolean) => {
        let movementDivider = MOVEMENT_DIVIDER_MIN;
        // if (activeControls.slowDown.query()) movementDivider *= 2;
        mapVector(vecAdd,
            val => val / movementDivider);
        camera[subtract ? "subtract" : "add"](vecAdd);
    };

    const physicsUpdate = () => {
        // key engine from phaser
        const movement = getActiveMovement();

        if (movement.y) {
            moveCamera(
                vec3(0, movement.y, 0),
                false
            );
        }

        // change Z!

        // todo-high!
        if (movement.z) {
            moveCamera(
                vec3(-Math.sin(rz), 0, Math.cos(rz)),
                movement.z > 0
            );
        }
        if (movement.x) {
            moveCamera(
                vec3(-Math.cos(rz), 0, -Math.sin(rz)),
                movement.x > 0
            );
        }
    };

    setInterval(physicsUpdate, 10);
    initCameraControl(canvas, { rotateCamera });
};
