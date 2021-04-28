import { Vector3 } from "three";

import { makeVar } from "@apollo/client";

export const playerPositionVar = makeVar<Vector3 | null>(null);
// export const playerState = makeVar<>(null);
