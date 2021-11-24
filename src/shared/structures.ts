import { Vec3 } from 'vec3'

export type CoordinateComponent = 'x' | 'y' | 'z'
export const coordinateComponents: CoordinateComponent[] = ['x', 'y', 'z']

export type ArrayPoint = [number, number, number]
export type TrianglePoints = [Vec3, Vec3, Vec3]

export class Matrix4x4 {
    public matrix: number[][] = new Array(4).fill(undefined).map(() => {
        return new Array(4).fill(0)
    })
}
