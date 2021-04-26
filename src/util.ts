import { Vec3 } from "vec3";

import { ArrayPoint, CoordinateComponent } from "./structures.js";
import vec3 from "./vec3.js";

export const touchSupported = ('ontouchstart' in window) ||
    (navigator.maxTouchPoints > 0) ||
    (navigator.msMaxTouchPoints > 0);

export const mapVector = (vector: Vec3, callback: (value: number, index: 0 | 1 | 2, component: CoordinateComponent) => number) => {
    const c: CoordinateComponent[] = ["x", "y", "z"];
    const newArray = vector.toArray().map((value, index) =>
        callback(value, index as any, c[index])
    ) as ArrayPoint;
    vector.update(
        vec3(...newArray)
    );
};

type PointerLockListener = (e: Event) => unknown;
// use alternative to Node.js event class
export const pointerlock = {
    usingRawInput: null as boolean | null,
    get captured(): boolean {
        return !!document.pointerLockElement;
    },
    capture() {
        if (!document.documentElement.requestPointerLock) return;
        //@ts-ignore
        const usingRawInput = !!document.documentElement.requestPointerLock({
            unadjustedMovement: true
        });
        pointerlock.usingRawInput = usingRawInput;
        return usingRawInput;
    },
    onRelease: [] as PointerLockListener[],
    onCapture: [] as PointerLockListener[],
    stopFiring: false,
    removeListener: (type: "onRelease" | "onCapture", listener: PointerLockListener) => {
        const indexToRemove = pointerlock[type].indexOf(listener);
        if (indexToRemove < 0) throw new TypeError(`Listener ${listener} on type ${type} doesn't exist`);
        pointerlock[type].splice(indexToRemove, 1);
    }
};
{
    document.addEventListener("pointerlockchange", e => {
        if (pointerlock.stopFiring) return;
        const { captured } = pointerlock;
        debug(`Lock ${captured ? "captured" : "released"}`);
        const eventsToFire = captured ? pointerlock.onCapture : pointerlock.onRelease;
        eventsToFire.forEach(callback => callback(e));
    });
}

export const debug = (str: string) => {
    console.log(str);
};

// find better alternative
export const entries = <T extends object>(obj: T): [keyof T, T[keyof T]][] => {
    return Object.entries(obj) as any;
};
export const keys = <T extends object>(obj: T): (keyof T)[] => {
    return Object.keys(obj) as any;
};

export const createProgram = (gl: WebGL2RenderingContext, vertexShader: string, fragmentShader: string) => {
    const createShader = (gl: WebGL2RenderingContext, type: number, source: string) => {
        const shader = gl.createShader(type)!;
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
        if (!success) {
            const info = gl.getShaderInfoLog(shader);
            gl.deleteShader(shader);
            throw new Error("Shader compile error: " + info);
        }
        return shader;
    };

    const program = gl.createProgram()!;
    // просто добавляем шейдеры они пока не знают друг о друга
    gl.attachShader(program, createShader(gl, gl.VERTEX_SHADER, vertexShader)!);
    gl.attachShader(program, createShader(gl, gl.FRAGMENT_SHADER, fragmentShader)!);
    // сопрягаем уже
    gl.linkProgram(program);
    const linkSuccess = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (!linkSuccess) {
        const info = gl.getProgramInfoLog(program);
        gl.deleteProgram(program);
        throw new Error("Program link error: " + info);
    }
    return program;
};

// function createProgram(
//     gl, shaders, opt_attribs, opt_locations, opt_errorCallback) {
//     const errFn = opt_errorCallback || error;
//     const program = gl.createProgram();
//     shaders.forEach(function (shader) {
//         gl.attachShader(program, shader);
//     });
//     if (opt_attribs) {
//         opt_attribs.forEach(function (attrib, ndx) {
//             gl.bindAttribLocation(
//                 program,
//                 opt_locations ? opt_locations[ndx] : ndx,
//                 attrib);
//         });
//     }
//     gl.linkProgram(program);

//     // Check the link status
//     const linked = gl.getProgramParameter(program, gl.LINK_STATUS);
//     if (!linked) {
//         // something went wrong with the link
//         const lastError = gl.getProgramInfoLog(program);
//         errFn(`Error in program linking: ${lastError}\n${shaders.map(shader => {
//             const src = addLineNumbersWithError(gl.getShaderSource(shader));
//             const type = gl.getShaderParameter(shader, gl.SHADER_TYPE);
//             return `${glEnumToString(gl, type)}:\n${src}`;
//         }).join('\n')
//             }`);

//         gl.deleteProgram(program);
//         return null;
//     }
//     return program;
// }
