import { Vector2 } from "contro/dist/utils/math";
import _ from "lodash";
import { Vec3 } from "vec3";

import { activeControls } from "./controls.js";
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

const blockSideToCoordinateMap: Record<BlockSide, ["x" | "y" | "z", 1 | -1]> = {
    west: ["x", 1],
    east: ["x", -1],
    south: ["z", 1],
    north: ["z", -1],
    top: ["y", 1],
    bottom: ["y", -1],
};
const getTriangles = (blockPosition: Vec3): Record<BlockSide, [Triangle, Triangle]> => {
    type SquareCoordinateArr = [ArrayPoint, ArrayPoint, ArrayPoint, ArrayPoint];
    type SquareCoordinate = [Vec3, Vec3, Vec3, Vec3];

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

const triangleToClip = (buf: Triangle) => {
    var count = 0;
    for (const i in buf) {
        if (buf[i][0] * buf[i][0] > 1 || buf[i][1] * buf[i][1] > 1)
            count++;
    }
    return count;
};

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

const doesBlockExist = (position: Vec3) => {
    for (const block of blocks) {
        if (block.position.equals(position)) return true;
    }
    return false;
};

const blocks = [
    new Block(vec3(0, 0, 1)),
];
const mesh: Array<[Triangle, Triangle]> = [];
const recalculateMesh = () => {
    for (const block of blocks) {
        const sideTriangles = getTriangles(block.position);
        let sideExists = {};
        for (const [side, triangles] of entries(sideTriangles)) {
            const siblingBlockPos = block.position.clone();
            const [componentAdd, valueToAdd] = blockSideToCoordinateMap[side];
            mapVector(siblingBlockPos, (value, _index, component) => {
                if (component !== componentAdd) return value;
                return value + valueToAdd;
            });
            const siblingBlockExists = doesBlockExist(siblingBlockPos);

            if (!siblingBlockExists)
                mesh.push(triangles);
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
const matProj = new Matrix4x4();
matProj.matrix[0][0] = fAspectRatio * fFovRad;
matProj.matrix[1][1] = fFovRad;
matProj.matrix[2][2] = fFar / (fFar - fNear);
matProj.matrix[3][2] = (-fFar * fNear) / (fFar - fNear);
matProj.matrix[2][3] = 1.0;
matProj.matrix[3][3] = 0.0;

document.addEventListener("resize", () => {
    fAspectRatio = canvas.width / canvas.height;
    matProj.matrix[0][0] = fAspectRatio * fFovRad;
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

const MOVEMENT_DIVIDER_MIN = 100;
const moveCamera = (vecAdd: Vec3, subtract: boolean) => {
    let movementDivider = MOVEMENT_DIVIDER_MIN;
    if (activeControls.slowDown.query()) movementDivider *= 2;
    mapVector(vecAdd,
        val => val / movementDivider);
    camera[subtract ? "subtract" : "add"](vecAdd);
};

export const physicsUpdate = () => {
    // key engine from phaser
    if (activeControls.jump.query()) {
        moveCamera(
            vec3(0, 1, 0),
            false
        );
    }
    if (activeControls.crouch.query()) {
        moveCamera(
            vec3(0, -1, 0),
            false
        );
    }

    // todo-high!
    const movement: Vector2 = activeControls.movement.query();
    if (movement.y) {
        moveCamera(
            vec3(-Math.sin(rz), 0, Math.cos(rz)),
            movement.y > 0
        );
    }
    if (movement.x) {
        moveCamera(
            vec3(-Math.cos(rz), 0, -Math.sin(rz)),
            movement.x > 0
        );
    }
};
const drawTriangles = (gl: WebGL2RenderingContext, points: TrianglePoints, method: "fill" | "lines" = "fill") => {
    const triangles2dPoints = points.map(({ x, y }) => [x, y]);

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangles2dPoints.flat()), gl.STATIC_DRAW);
    gl.drawArrays(gl.TRIANGLES, 0, points.length);
};

let skippedCount = 0;

export const render = (gl: WebGL2RenderingContext, shaderProgram: WebGLProgram) => {
    skippedCount = 0;
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
        for (const triangles of mesh) {
            // if (side === "top") {
            //     gl.uniform4f(colorUniformLocation, 1, 0, 0, 1);
            // } else if (side === "south") {
            //     gl.uniform4f(colorUniformLocation, 0, 0, 1, 1);
            // } else if (side === "west") {
            //     gl.uniform4f(colorUniformLocation, 0, 0.5, 0.5, 1);
            // } else if (side === "bottom") {
            //     gl.uniform4f(colorUniformLocation, 0.5, 0.5, 0, 1);
            // } else if (side === "east") {
            //     gl.uniform4f(colorUniformLocation, 0.5, 0, 0, 1);
            // } else {
            //     gl.uniform4f(colorUniformLocation, 0, 1, 0, 1);
            // }
            triangle: for (const triangle of triangles) {
                if (
                    triangle.normal.x * (triangle.points[0].x - camera.x) +
                    triangle.normal.y * (triangle.points[0].y - camera.y) +
                    triangle.normal.z * (triangle.points[0].z - camera.z) >= 0
                ) {
                    skippedCount++;
                    continue;
                };
                let { points } = triangle;
                points = points.map(vec => vec.clone()) as TrianglePoints;
                for (const i in points) {
                    points[i].subtract(camera);
                    points[i].z += fNear;
                    vecbymat1(points[i], RZ);
                    vecbymat1(points[i], RY);
                    points[i].z -= fNear;
                    if (points[i].z <= fNear) {
                        skippedCount++;
                        continue triangle;
                    }
                    multipleMatrix(points[i], matProj);
                    // if (triangleToClip(triangle) > 0) continue;
                }
                drawTriangles(gl, points);
            }
        }
    }
    //@ts-ignore
    skipped.innerText = skippedCount;
};