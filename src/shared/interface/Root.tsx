import React from "react";

import GamePause from "./GamePause";
import MouseRawInputSnackbar from "./MouseRawInputSnackbar";
import { pauseSchema } from "./pauseSchema";
import TouchControls from "./TouchControls";

interface ComponentProps {
    unloadModule: () => unknown;
}

export const touchMovement = { x: 0, y: 0, z: 0 };

let Root: React.FC<ComponentProps> = ({ unloadModule }) => {
    return <>
        <MouseRawInputSnackbar />

        <TouchControls updateTouchMoving={({ x, y, z }) => {
            touchMovement.x = x;
            touchMovement.y = y;
            touchMovement.z = z;
        }} />

        <GamePause
            schema={pauseSchema}
        />
    </>;
};

export default Root;
