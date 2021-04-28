import { makeVar } from "@apollo/client";

export const deviceInfoVar = makeVar<{ gpu: string; } | null>(null);

// export const playerPositionVar = makeVar<Vector3 | null>(null);
// export const playerState = makeVar<{} | null>(null);
