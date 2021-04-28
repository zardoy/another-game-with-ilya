import { makeVar } from "@apollo/client";

export const userLocationVar = makeVar<"mainMenu" | "playing" | "pauseRoot" | "other">("mainMenu");

export const deviceInfoVar = makeVar<{ gpu: string; } | null>(null);

// export const playerPositionVar = makeVar<Vector3 | null>(null);
// export const playerState = makeVar<{} | null>(null);
