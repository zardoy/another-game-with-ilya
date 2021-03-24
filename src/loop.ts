import _ from "lodash";
import { Vec3 } from "vec3";

import { ArrayPoint, Matrix4x4, TrianglePoints } from "./structures.js";
import { entries, mapVector } from "./util.js";
import vec3 from "./vec3.js";

const fNear = 0.1;
const fFar = 1000.0;

const fFov = 90.0;
let fAspectRatio = 1;
const fFovRad = 1.0 / Math.tan(fFov * 0.5 / 180.0 * 3.14159);

const camera = vec3(0, 0, 0);

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

class Triangle {
    static setNormal(triangle: Triangle) {
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
        triangle.normal = normal;
    };

    public normal: Vec3;
    constructor(
        public points: TrianglePoints,
    ) {
        Triangle.setNormal(this);
    }
}

const addTriangles = (blockPosition: Vec3) => {
    const blockSideToCoordinateMap: Record<BlockSide, ["x" | "y" | "z", 1 | -1]> = {
        east: ["x", 1],
        west: ["x", -1],
        south: ["z", 1],
        north: ["z", -1],
        top: ["y", 1],
        bottom: ["y", -1],
    };

    type SquareCoordinateArr = [ArrayPoint, ArrayPoint, ArrayPoint, ArrayPoint];
    type SquareCoordinate = [Vec3, Vec3, Vec3, Vec3];

    const blockSidesArr: Record<BlockSide, SquareCoordinateArr> = {
        top: [
            [0, 1, 0],
            [1, 1, 0],
            [1, 1, 1],
            [0, 1, 1]
        ],
        bottom: [
            [0, 0, 0],
            [1, 0, 0],
            [1, 0, 1],
            [0, 0, 1]
        ],
        south: [
            [0, 0, 0],
            [1, 0, 0],
            [1, 1, 0],
            [0, 1, 0]
        ],
        north: [
            [0, 0, 1],
            [1, 0, 1],
            [1, 1, 1],
            [0, 1, 1]
        ],
        east: [
            [1, 0, 0],
            [1, 0, 1],
            [1, 1, 1],
            [1, 1, 0],
        ],
        west: [
            [0, 0, 0],
            [0, 0, 1],
            [0, 1, 1],
            [0, 1, 0],
        ],
    };
    const blockSidesTriangles = _.mapValues(blockSidesArr, (squareCoordinatesArr) => {
        const squareCoordinate = squareCoordinatesArr.map(coordinateArr => {
            const point = vec3(...coordinateArr);
            point.add(blockPosition);
            return point;
        }) as SquareCoordinate;
        const triangles = [
            squareCoordinate.slice(0, -1) as TrianglePoints,
            [
                ...squareCoordinate.slice(2),
                squareCoordinate[0]
            ] as TrianglePoints
        ]
            .map(triangleCoordinates => new Triangle(triangleCoordinates)) as [Triangle, Triangle];
        return triangles;
    });

    return blockSidesTriangles;
};

class World {
    static HEIGHT = 256;
}
class Block {
    static TRIANGLES_COUNT = 12;

    sideTriangles: Record<BlockSide, [Triangle, Triangle]>;
    constructor(
        public position: Vec3
    ) {
        this.sideTriangles = addTriangles(position);
    }
}
class Chunk {
    static SIZE = 16;

    constructor(
        blocks: Block[]
    ) { }
}

const triangleToClip = (buf: Triangle) => {
    var count = 0;
    for (const i in buf) {
        if (buf[i][0] * buf[i][0] > 1 || buf[i][1] * buf[i][1] > 1)
            count++;
    }
    return count;
};

// class Mesh {
//     constructor(
//         public triangles: Triangle[]
//     ) { }
// }

const multipleMatrix = (vector: Vec3, { matrix }: Matrix4x4) => {
    mapVector(vector, (value, i) => {
        return matrix[0][i] * value
            + matrix[1][i] * value
            + matrix[2][i] * value
            + matrix[3][i];
    });
    const w = matrix[0][3] * vector.x + matrix[1][3] * vector.y + matrix[2][3] * vector.z + matrix[3][3];
    if (w != 0) {
        mapVector(vector, val => val / w);
    }
};

const vecbymat1 = (vector: Vec3, { matrix: matrix }: Matrix4x4) => {
    mapVector(vector, (_, i) =>
        matrix[i][0] * vector.x + matrix[i][1] * vector.y + matrix[i][2] * vector.z);
};

// const checkTriangleClipping = (triangle: Triangle): boolean => {
//     if (triangle.points[0] >= ) {
//     }
// };

const blocks = [
    new Block(
        vec3(0, 0, 1)
    )
];
// _.times(10, x => {
//     _.times(10, z => {
//         blocks.push(
//             new Block(
//                 createPoint(x, 0, z)
//             )
//         );
//     });
// });
const matProj = new Matrix4x4();
matProj.matrix[0][0] = fAspectRatio * fFovRad;
matProj.matrix[1][1] = fFovRad;
matProj.matrix[2][2] = fFar / (fFar - fNear);
matProj.matrix[3][2] = (-fFar * fNear) / (fFar - fNear);
matProj.matrix[2][3] = 1.0;
matProj.matrix[3][3] = 0.0;

document.addEventListener("resize", () => {
    // fAspectRatio = canvas.width / canvas.height;
    // matProj.m[0][0] = fAspectRatio * fFovRad;
});
let rz = 0, ry = 0;
document.addEventListener("mousemove", event => {
    if (!document.pointerLockElement) return;
    const { movementX: deltaX, movementY: deltaY } = event;
    const delimeter = 500;
    rz -= deltaX / delimeter;
    if (ry - deltaY / delimeter > -1.54 && ry - deltaY / delimeter < 1.54)
        ry -= deltaY / delimeter;
});

const movement = {
    ACCELERATION: 10,
    joystick: false,

    shifted: false,

    forward: 0,
    left: 0,
    up: 0
};

const keyPressToggle = (event: KeyboardEvent) => {
    if (movement.joystick) return;
    const newKeyPressed = event.type === "keydown";
    let { code } = event;
    if (code === "ShiftLeft") {
        movement.shifted = newKeyPressed;
    }
    if (newKeyPressed) {
        if (code === "KeyW" || code === "KeyS") {
            if (movement.forward) return;
            movement.forward = code === "KeyW" ? 1 : -1;
        } else if (code === "KeyA" || code === "KeyD") {
            if (movement.left) return;
            movement.left = code === "KeyA" ? 1 : -1;
        } else if (code === "KeyQ" || code === "Space") {
            if (movement.up) return;
            movement.up = code === "Space" ? 1 : -1;
        }
    } else {
        if (code === "KeyW" || code === "KeyS") {
            movement.forward = 0;
        } else if (code === "KeyA" || code === "KeyD") {
            movement.left = 0;
        } else if (code === "KeyQ" || code === "Space") {
            movement.up = 0;
        }
    }
};

document.addEventListener("keydown", keyPressToggle);
document.addEventListener("keyup", keyPressToggle);

const movementDivider = 100;
const moveCamera = (vecAdd: Vec3, subtract: boolean) => {
    mapVector(vecAdd,
        val => val / movementDivider
            * (movement.shifted ? movement.ACCELERATION : 1));
    camera[subtract ? "subtract" : "add"](vecAdd);
};

export const physicsUpdate = () => {
    // key engine from phaser
    if (movement.forward) {
        moveCamera(
            vec3(-Math.sin(rz), 0, Math.cos(rz)),
            movement.forward > 0
        );
    }
    if (movement.left) {
        moveCamera(
            vec3(-Math.cos(rz), 0, -Math.sin(rz)),
            movement.left > 0
        );
    }
    if (movement.up) {
        moveCamera(
            vec3(0, 1, 0),
            movement.up > 0
        );
    }
};
const drawTriangles = (gl: WebGL2RenderingContext, points: TrianglePoints, method: "fill" | "lines" = "fill") => {
    const triangles2dPoints = points.map(({ x, y }) => [x, y]);

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangles2dPoints.flat()), gl.STATIC_DRAW);
    gl.drawArrays(gl.TRIANGLES, 0, points.length);
};

export const render = (gl: WebGL2RenderingContext, shaderProgram: WebGLProgram) => {
    const colorUniformLocation = gl.getUniformLocation(shaderProgram, "u_color");
    let RZ = new Matrix4x4(),
        RY = new Matrix4x4();
    RZ.matrix[1][1] = 1;
    RZ.matrix[2][2] = Math.cos(rz);
    RZ.matrix[0][2] = Math.sin(rz);
    RZ.matrix[2][0] = -Math.sin(rz);
    RZ.matrix[0][0] = Math.cos(rz);

    RY.matrix[0][0] = 1;
    RY.matrix[1][1] = Math.cos(ry);
    RY.matrix[2][1] = Math.sin(ry);
    RY.matrix[1][2] = -Math.sin(ry);
    RY.matrix[2][2] = Math.cos(ry);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    for (const block of blocks) {
        if ((block.position.x + block.position.z % 2) % 2 === 0) {
            gl.uniform4f(colorUniformLocation, 1, 0, 0, 1);
        } else {
            gl.uniform4f(colorUniformLocation, 0, 1, 0, 1);
        }
        for (const [side, triangles] of entries(block.sideTriangles)) {
            triangle: for (const triangle of triangles) {
                if (
                    triangle.normal.x * (triangle.points[0].x - camera.x) +
                    triangle.normal.y * (triangle.points[0].y - camera.y) +
                    triangle.normal.z * (triangle.points[0].z - camera.z) >= 0
                ) continue;
                let { points } = triangle;
                points = points.map(vec => vec.clone()) as TrianglePoints;
                for (const i in points) {
                    points[i].subtract(camera);
                    points[i].z += fNear;
                    vecbymat1(points[i], RZ);
                    vecbymat1(points[i], RY);
                    points[i].z -= fNear;
                    if (points[i].z <= fNear) continue triangle;
                    multipleMatrix(points[i], matProj);
                    // if (triangleToClip(triangle) > 0) continue;
                }
                drawTriangles(gl, points);
            }
        }
    }
};