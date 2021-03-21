export type Coordinate = Record<"x" | "y" | "z", number>;

export type ArrayCoordinate = [number, number, number];

export type TriangleCoordinates = [Coordinate, Coordinate, Coordinate];

export const createCoordinate = (x: number, y: number, z: number): Coordinate => ({ x, y, z });