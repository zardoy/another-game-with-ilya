export const isMouseLocked = () => !!document.pointerLockElement;

export const debug = (str: string) => {
    debugElem.insertAdjacentText("beforeend", str + "\n");
};

// find better alternative
export const entries = <T extends object>(obj: T): [keyof T, T[keyof T]][] => {
    return Object.entries(obj) as any;
};

export const createProgram = (gl: WebGL2RenderingContext, vertexShader: string, fragmentShader: string) => {
    const createShader = (gl: WebGL2RenderingContext, type: number, source: string) => {
        const shader = gl.createShader(type);
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

    const program = gl.createProgram();
    // просто добавляем шейдеры они пока не знают друг о друга
    gl.attachShader(program, createShader(gl, gl.VERTEX_SHADER, vertexShader));
    gl.attachShader(program, createShader(gl, gl.FRAGMENT_SHADER, fragmentShader));
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
