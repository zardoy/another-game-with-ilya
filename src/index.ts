const glsl = x => x;

const resize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
};
resize();
window.addEventListener("resize", resize);

const gl = canvas.getContext("webgl2");

if (!gl) {
    throw new Error("WebGL isn't supported on your platform");
}

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

const createProgram = (gl: WebGL2RenderingContext, vertexShader: WebGLShader, fragmentShader: WebGLShader) => {
    const program = gl.createProgram();
    // просто добавляем шейдеры они пока не знают друг о друга
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
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

const vertices = [
    -0.5,
    0.5,
    -0.5,
    -0.5,
    0.0,
    -0.5
];

const vertex_buffer = gl.createBuffer();

gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
gl.bindBuffer(gl.ARRAY_BUFFER, null);

// SHADERS

const vertexCode = glsl`#version 300 es

in vec4 a_position;

void main() {
    gl_Position = a_position;
}
`;
const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexCode);

const fragmentCode = glsl`#version 300 es
precision highp float;

out vec4 outColor;

void main() {

}
`;
const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentCode);

const shaderProgram = createProgram(gl, vertexShader, fragmentShader);

const positionAttributeLocation = gl.getAttribLocation(shaderProgram, "a_position");

const positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
const positions = [
    0, 0,
    0, 0.5,
    0.7, 0
];
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

const vao = gl.createVertexArray();

gl.bindVertexArray(vao);
gl.enableVertexAttribArray(positionAttributeLocation);


const size = 2;