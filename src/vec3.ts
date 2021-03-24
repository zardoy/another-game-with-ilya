import vec3, { Vec3 } from "vec3";

export default vec3 as unknown as (...args: ([x: number, y: number, z: number] | [Record<"x" | "y" | "z", number>])) => Vec3;