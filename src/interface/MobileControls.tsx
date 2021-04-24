import React from "react";

import clsx from "clsx";
import _ from "lodash";

import { makeStyles, Theme } from "@material-ui/core";

import { CoordinateComponent } from "../structures";

interface ComponentProps {
}

const controlsSize = 50,
    pauseButtonSize = 45;

export type MovementAction = [
    coordinate: CoordinateComponent,
    step: number
];

type ControlsConfig = Array<[
    label: string,
    rotate: number,
    movementAction: MovementAction | MovementAction[]
]>;

// VSCODE!!! SHOW ARRAY ITEM LABEL ON HOVER!!!!!!!!!!
export const controlsConfig: ControlsConfig = [
    ["wa", -45, [["x", -1], ["z", -1]]],
    ["w", 0, ["z", -1]],
    ["wd", 45, [["x", 1], ["z", -1]]],
    ["d", 90, ["x", 1]],
    ["s", 180, ["z", 1]],
    ["a", 270, ["x", -1]],
];

interface StyleProps {
    controlsSize: number;
}

const useStyles = makeStyles<Theme, StyleProps>({
    touchMovementArea: ({ controlsSize }) => ({
        position: "fixed",
        left: 0,
        bottom: 0,
        width: controlsSize * 3,
        height: controlsSize * 3,
        border: "1px solid transparent",
        touchAction: "none"
    }),
});

let MobileControls: React.FC<ComponentProps> = () => {
    const classes = useStyles({ controlsSize });

    return <>
        <div
            className={clsx(classes.touchMovementArea, "touch-movement-area")}
        >
            <div
                style={{
                    display: "grid",
                    grid: "repeat(1fr, 3) / repeat(1fr, 3)",
                    gridTemplateAreas: `
                    "wa w wd"
                    "a . d"
                    ". s ."`,
                    width: "100%",
                    height: "100%"
                }}
            >
                {
                    _.times(controlsConfig.length, (index) => {
                        //VSCODE!!! AUTOCOMPLETION FOR ARRAY ITEM LABELS!
                        const [label, rotate] = controlsConfig[index];

                        return <div
                            key={label}
                            data-index={index}
                            style={{
                                gridArea: label,
                                transform: `rotate(${rotate}deg)`,
                                width: controlsSize,
                                height: controlsSize
                                // border: "1px solid rgba(255, 255, 255, 0.3)"
                            }}
                            className="touch-movement-button"
                        >
                            <img src="./touch-movement-button.svg" style={{ pointerEvents: "none" }} />
                        </div>;
                    })
                }
            </div>
        </div>
        <img
            onTouchStart={() => {
                window.dispatchEvent(new KeyboardEvent("keydown", {
                    code: "Escape"
                }));
            }}
            style={{
                position: "fixed",
                top: 0,
                right: 0,
                width: pauseButtonSize,
                height: pauseButtonSize,
                padding: 5,
                backgroundColor: "rgba(255, 255, 255, 0.1)",
            }}
            src="./pause-button.svg"
        />
    </>;
};

export default MobileControls;
