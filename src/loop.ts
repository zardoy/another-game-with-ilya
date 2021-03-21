import { Coordinate, createCoordinate } from "./structures.js";
import { entries } from "./util.js";

const fNear = 0.1;
const fFar = 1000.0;

const fFov = 90.0;
let fAspectRatio = 1;
const fFovRad = 1.0 / Math.tan(fFov * 0.5 / 180.0 * 3.14159);

const camera = createCoordinate(0, 0, 0);

class Mat4x4 {
    public m: number[][] = new Array(4).fill(undefined).map(() => {
        return new Array(4).fill(0);
    });
}

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


const addTriangles = (x: number, y: number, z: number) => {
    const blockSideToCoordinateMap: Record<BlockSide, ["x" | "y" | "z", 1 | -1]> = {
        east: ["x", 1],
        west: ["x", -1],
        south: ["z", 1],
        north: ["z", -1],
        top: ["y", 1],
        bottom: ["y", -1],
    };

    const blockSides = entries(blockSideToCoordinateMap).map(([side, config]) => {
        return [
            side,
            [

            ]
        ];
    });

    const blockSides: Record<BlockSide, SquareArrayCoordinates> = {
        top: [
            [0,]
            [
            { x: 0, y: 1, z: 0 },
            { x: 0, y: 1, z: 1 },
            { x: 1, y: 1, z: 1 },
            ],
            [
                { x: 0, y: 1, z: 0 },
                { x: 0, y: 1, z: 1 },
                { x: 1, y: 1, z: 1 },
            ]
        ],
        bottom: [
            [
                { x: 1, y: 0, z: 1 },
                { x: 0, y: 0, z: 1 },
                { x: 0, y: 0, z: 0 },
            ],
            [
                { x: 1, y: 0, z: 1 },
                { x: 0, y: 0, z: 1 },
                { x: 1, y: 0, z: 0 },
            ]
        ],
        south: [
            [
                { x: 0, y: 0, z: 0 },
                { x: 0, y: 1, z: 0 },
                { x: 1, y: 1, z: 0 },
            ],
            [
                { x: 0, y: 0, z: 0 },
                { x: 1, y: 1, z: 0 },
                { x: 1, y: 0, z: 0 },
            ]
        ],
        north: [
            [
                { x: 0, y: 1, z: 0 },
                { x: 0, y: 1, z: 1 },
                { x: 1, y: 1, z: 1 },
            ],
            [
                { x: 0, y: 1, z: 0 },
                { x: 0, y: 1, z: 1 },
                { x: 1, y: 1, z: 1 },
            ]
        ]
    };

    const sides = [
        // SOUTH
        [0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0],
        [0.0, 0.0, 0.0, 1.0, 1.0, 0.0, 1.0, 0.0, 0.0],

        // EAST                                                      
        [1.0, 0.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0, 1.0],
        [1.0, 0.0, 0.0, 1.0, 1.0, 1.0, 1.0, 0.0, 1.0],

        // NORTH                                                     
        [1.0, 0.0, 1.0, 1.0, 1.0, 1.0, 0.0, 1.0, 1.0],
        [1.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 0.0, 1.0],

        // WEST                                                      
        [0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 0.0],
        [0.0, 0.0, 1.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0],

        // TOP                                                       
        [0.0, 1.0, 0.0, 0.0, 1.0, 1.0, 1.0, 1.0, 1.0],
        [0.0, 1.0, 0.0, 1.0, 1.0, 1.0, 1.0, 1.0, 0.0],
    ];
    let points: Point3[] = sides.map(allPoints =>
        _.chunk(allPoints, 3).map(
            (points: Point3Coordinates) => new Point3(...points)
        )
    );
    points = points.map(point => {
        point.x + x;
        point.y + y;
        point.z + z;
        return point;
    });
    const triagnles = sides.map(allPoints =>
        new Triangle(
            _.chunk(allPoints, 3).map(
                (points: Point3Coordinates) => new Point3(...points)
            ),
        )
    );
    triagnles.forEach(triangle => {
        triangle.points.forEach(point => {
            point.x += x;
            point.y += y;
            point.z += z;
        });
    });
    return triagnles;
};

class Triangle {
    visible = true;
    public normal: Point3;
    constructor(
        public points: [Point3, Point3, Point3],
    ) {
        setNormal(this);
    }
}

{
    class Block {
        static TRIANGLES_COUNT = 12;

        triangles: Record<BlockSide, [Triangle, Triangle]>;
        constructor(pos: Coordinate) { }
    }
}

const triangletoclip = (buf: Triangle) => {
    var count = 0;
    for (const i in buf) {
        if (buf[i][0] * buf[i][0] > 1 || buf[i][1] * buf[i][1] > 1)
            count++;
    }
    return count;
};

class Mesh {
    constructor(
        public triangles: Triangle[]
    ) { }
}

class Block {
    triangles: Triangle[];
    constructor(
        public x: number,
        public y: number,
        public z: number
    ) {
        this.triangles = Triangle.addTriangles(x, y, z);
    }
}

const vecbymat = (dot3: Point3Coordinates, { m: matrix }: Mat4x4) => {
    for (const [i, coordinate] of Object.entries(dot3)) {
        dot3[i] = matrix[0][i] * coordinate
            + matrix[1][i] * coordinate
            + matrix[2][i] * coordinate
            + matrix[3][i];
    }
    const w: number = matrix[0][3] * dot3[0] + matrix[1][3] * dot3[1] + matrix[2][3] * dot3[2] + matrix[3][3];
    if (w != 0) {
        dot3[0] /= w;
        dot3[1] /= w;
        dot3[2] /= w;
    }
};

const vecbymat1 = (dot3: Point3Coordinates, { m: matrix }: Mat4x4) => {
    const newDot3 = [...dot3];
    for (const i in dot3) {
        dot3[i] = matrix[i][0] * newDot3[0] + matrix[i][1] * newDot3[1] + matrix[i][2] * newDot3[2];
    }
};

const vecadd = (target: Point3, source: Point3Coordinates) => {
    for (const [index, component] of Object.entries(["x", "y", "z"])) {
        target[component] += source[index];
    }
};
const vecsub = (target: Point3, source: Point3Coordinates) => {
    for (const [index, component] of Object.entries(["x", "y", "z"])) {
        target[component] -= source[index];
    }
};
const setNormal = (triangle: Triangle) => {
    const line1 = new Point3(
        triangle.points[1].x - triangle.points[0].x,
        triangle.points[1].y - triangle.points[0].y,
        triangle.points[1].z - triangle.points[0].z,
    ),
        line2 = new Point3(
            triangle.points[2].x - triangle.points[0].x,
            triangle.points[2].y - triangle.points[0].y,
            triangle.points[2].z - triangle.points[0].z,
        ),
        normal = new Point3(
            line1.y * line2.z - line1.z * line2.y,
            line1.z * line2.x - line1.x * line2.z,
            line1.x * line2.y - line1.y * line2.x,
        );

    // It's normally normal to normalise the normal
    const length = Math.sqrt(normal.x * normal.x + normal.y * normal.y + normal.z * normal.z);
    normal.x /= length; normal.y /= length; normal.z /= length;
    triangle.normal = normal;
};


// const checkTriangleClipping = (triangle: Triangle): boolean => {
//     if (triangle.points[0] >= ) {
//     }
// };

const blocks = [
    new Block(0, 5, 0)
];
_.times(10, x => {
    _.times(10, z => {
        blocks.push(
            new Block(x, 0, z)
        );
    });
});
for (const block of blocks) {
    block.x.toExponential();
}
const matProj = new Mat4x4();
matProj.m[0][0] = fAspectRatio * fFovRad;
matProj.m[1][1] = fFovRad;
matProj.m[2][2] = fFar / (fFar - fNear);
matProj.m[3][2] = (-fFar * fNear) / (fFar - fNear);
matProj.m[2][3] = 1.0;
matProj.m[3][3] = 0.0;

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

const toggleMovementAcceleration = (newState: boolean) => {
    for (const key of ["forward", "left", "up"]) {
        if (newState) {
            movement[key] *= movement.ACCELERATION;
        } else {
            movement[key] /= movement.ACCELERATION;
        }
    }
};

const keyPressToggle = (event: KeyboardEvent) => {
    if (movement.joystick) return;
    const newKeyPressed = event.type === "keydown";
    let { code } = event;
    if (code === "ShiftLeft") {
        toggleMovementAcceleration(newKeyPressed);
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

export const physicsUpdate = () => {
    // key engine from phaser
    if (movement.forward) {
        const point: Point3Coordinates = [-Math.sin(rz) / 100, 0, Math.cos(rz) / 100];
        movement.forward > 0 ? vecadd(camera, point) : vecsub(camera, point);
    }
    if (movement.left) {
        const point: Point3Coordinates = [-Math.cos(rz) / 100, 0, -Math.sin(rz) / 100];
        movement.left > 0 ? vecadd(camera, point) : vecsub(camera, point);
    }
    if (movement.up) {
        camera.y += 0.01 * (movement.up > 0 ? 1 : -1);
    }
};

let fps = 0;

setInterval(() => {
    debugElem.innerText = fps + "";
    fps = 0;
}, 1000);

export const render = (gl: WebGL2RenderingContext, shaderProgram: WebGLProgram) => {
    fps++;

    const colorUniformLocation = gl.getUniformLocation(shaderProgram, "u_color");
    let RZ = new Mat4x4(),
        RY = new Mat4x4();
    RZ.m[1][1] = 1;
    RZ.m[2][2] = Math.cos(rz);
    RZ.m[0][2] = Math.sin(rz);
    RZ.m[2][0] = -Math.sin(rz);
    RZ.m[0][0] = Math.cos(rz);

    RY.m[0][0] = 1;
    RY.m[1][1] = Math.cos(ry);
    RY.m[2][1] = Math.sin(ry);
    RY.m[1][2] = -Math.sin(ry);
    RY.m[2][2] = Math.cos(ry);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    const multiplier = 0.07;

    for (const block of blocks) {
        if ((block.x + block.z % 2) % 2 === 0) {
            gl.uniform4f(colorUniformLocation, 1, 0, 0, 1);
        } else {
            gl.uniform4f(colorUniformLocation, 0, 1, 0, 1);
        }
        for (const [i, triangle] of Object.entries(block.triangles)) {
            if (triangle.normal.x * (triangle.points[0].x - camera.x) +
                triangle.normal.y * (triangle.points[0].y - camera.y) +
                triangle.normal.z * (triangle.points[0].z - camera.z) < 0.0) {

                let points = triangle.points
                    .map(({ x, y, z }) => [x, y, z]);
                triangle.visible = true;
                for (const i in points) {
                    const cameraCoordinates = getPointCoordinate(camera);
                    for (const k in points[i]) {
                        points[i][k] -= cameraCoordinates[k];
                    }
                    points[i][2] += fNear;
                    vecbymat1(points[i] as any, RZ);
                    vecbymat1(points[i] as any, RY);
                    points[i][2] -= fNear;
                    if (triangle.visible)
                        triangle.visible = points[i][2] > fNear;
                    vecbymat(points[i] as any, matProj);
                    /*                     if (triangletoclip(triangle) > 0)
                                            triangle.visible = false; */
                    points[i][2] = undefined;
                }
                if (!triangle.visible) continue;
                const positions = points
                    .flat()
                    .filter(val => val !== undefined);
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
                gl.drawArrays(gl.TRIANGLES, 0, 3);
            }
        }
    }
};