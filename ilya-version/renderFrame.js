import {Matrix4x4} from "../shared/structures.js";
import {mapVector} from "../shared/util.js";
import {camera, fNear, matProj, mesh, ry, rz} from "./canvasSetup.js";
const multipleMatrix = (vector, {matrix}) => {
  mapVector(vector, (value, i) => {
    return matrix[0][i] * value + matrix[1][i] * value + matrix[2][i] * value + matrix[3][i];
  });
  const w = matrix[0][3] * vector.x + matrix[1][3] * vector.y + matrix[2][3] * vector.z + matrix[3][3];
  if (w != 0) {
    mapVector(vector, (val) => val / w);
  }
};
const drawCrosshair = (gl) => {
  const vert = [
    -2e-3,
    -1e-3,
    2e-3
  ];
};
const drawTriangles = (gl, points, method = "fill") => {
  const triangles2dPoints = points.map(({x, y}) => [x, y]);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangles2dPoints.flat()), gl.STATIC_DRAW);
  gl.drawArrays(gl.TRIANGLES, 0, points.length);
};
const vecbymat1 = (vector, {matrix}) => {
  mapVector(vector, (_, i) => matrix[i][0] * vector.x + matrix[i][1] * vector.y + matrix[i][2] * vector.z);
};
export const renderFrame = (gl, shaderProgram, updateStat) => {
  let drawedTriangles = 0;
  const colorUniformLocation = gl.getUniformLocation(shaderProgram, "u_color");
  let RZ = new Matrix4x4(), RY = new Matrix4x4();
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
  gl.uniform4f(colorUniformLocation, 1, 0, 0, 1);
  for (const {triangles, color} of mesh) {
    gl.uniform4f(colorUniformLocation, ...color, 1);
    triangle:
      for (const triangle of triangles) {
        if (triangle.normal.x * (triangle.points[0].x - camera.x) + triangle.normal.y * (triangle.points[0].y - camera.y) + triangle.normal.z * (triangle.points[0].z - camera.z) >= 0)
          continue;
        let {points} = triangle;
        points = points.map((vec) => vec.clone());
        for (const i in points) {
          points[i].subtract(camera);
          points[i].z += fNear;
          vecbymat1(points[i], RZ);
          vecbymat1(points[i], RY);
          points[i].z -= fNear;
          if (points[i].z <= fNear)
            continue triangle;
          multipleMatrix(points[i], matProj);
        }
        drawedTriangles++;
        drawTriangles(gl, points);
      }
  }
  drawCrosshair(gl);
  updateStat("triangles", drawedTriangles);
};
