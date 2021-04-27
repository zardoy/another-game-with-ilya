import React from "react";

import GamePause from "./GamePause";
import MouseRawInputSnackbar from "./MouseRawInputSnackbar";
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
            buttons={[
                {
                    label: "SOCIAL"
                },
                {
                    label: "OPTIONS"
                },
                {
                    label: "UNLOAD MODULE",
                    // click: unloadModule
                },
            ]}
        />
    </>;
};

export default Root;
