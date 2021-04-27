import React, { useState } from "react";

import clsx from "clsx";
import _ from "lodash";

import { css } from "@emotion/css";
import { makeStyles, Theme } from "@material-ui/core";

import TouchMovementButton from "../components/TouchMovementButton";
import { touchMovement } from "../loop";
import { releasePointerCapture, useFixedPointerEvents } from "../react-util";
import { touchSupported } from "../util";

import type { CoordinateComponent } from "../structures";
interface ComponentProps {
    // moveCallback() { }
}

const buttonImagesPath = {
    arrow: "./touch-movement-button.svg",
    circle: "./touch-circle.svg",
    pause: "./pause-button.svg"
};

export const touchControlsSize = 50;
const pauseButtonSize = 45;

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

// IOS safari bug: select element dev feature fires touch/pointer events and doesn't fire cancel/end event! So, it's posiible to accomplish the state where app thinks that user holds button but he's actually not!
// there is no workaround for this now.

let MobileControls: React.FC<ComponentProps> = () => {
    const classes = useStyles({ controlsSize: touchControlsSize });

    const [showYButtons, setShowYButtons] = useState(true);
    const [showForwardAuxButtons, setShowForwardAuxButtons] = useState(true);

    const startMoving = (buttonIndex: number) => {
        if (buttonIndex === 1) setShowForwardAuxButtons(true);
        // todo: use ??
        // @ts-ignore
        // const pressure = touch.force || touch.pressure || touch.webkitForce || 1;
        // if (interval) clearInterval(interval);
        // interval = setInterval(() => console.log(event.pressure), 500);
        let [, , movementActionRaw] = controlsConfig[buttonIndex];
        // todo fix ts: if (!Array.isArray(movementAction)) movementAction = [movementAction];
        // very unstable
        const movementActions: MovementAction[] = typeof movementActionRaw[0] === "string" ? [movementActionRaw as MovementAction] : movementActionRaw as MovementAction[];
        for (const action of movementActions) {
            const [coord, step] = action;
            touchMovement[coord] += step/* * pressure */;
        }
    };
    const stopMoving = (buttonIndex: number) => {
        let [, , movementActionRaw] = controlsConfig[buttonIndex];
        // todo: fix 45deg buttons multiple holding
        const movementActions: MovementAction[] = typeof movementActionRaw[0] === "string" ? [movementActionRaw as MovementAction] : movementActionRaw as MovementAction[];
        for (const action of movementActions) {
            const [coord, step] = action;
            touchMovement[coord] -= step;
        }
        // if (touchMovement.z !== -1) setShowForwardAuxButtons(false);
    };

    const [yControlsContainerEvents] = useFixedPointerEvents({ /* stateToggle: setShowYButtons */ });

    // improve react rendering performance
    // TODO-EXTREMELY-HIGH wrap into flex container!
    // watch for css selector!!!!!!!!
    return !touchSupported ? null : <div
        onPointerDown={releasePointerCapture}
    >
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

                        return (Math.abs(rotate) !== 45 || showForwardAuxButtons) && <TouchMovementButton
                            key={label}
                            startTouching={() => startMoving(index)}
                            stopTouching={() => stopMoving(index)}
                            DivProps={{
                                style: {
                                    border: Math.abs(rotate) !== 45 ? "1px solid rgba(255, 255, 255, 0.2)" : "",
                                    gridArea: label
                                }
                            }}
                            imageSrc={buttonImagesPath.arrow}
                            ImgProps={{
                                style: { transform: `rotate(${rotate}deg)` }
                            }}
                        />;
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
            src={buttonImagesPath.pause}
        />
        <div
            // expand with css
            className={css`
                position: fixed;
                right: ${touchControlsSize}px;
                bottom: ${touchControlsSize * (showYButtons ? 1 : 2) + 10}px;
                display: flex;
                flex-direction: column;
            `}
            {...yControlsContainerEvents}
        >
            {
                !showYButtons ? null : [1, -1].map((yStep, index) => {
                    return <TouchMovementButton
                        key={yStep}
                        DivProps={{
                            className: css`
                                transform: ${index === 1 ? "rotate(180deg)" : ""};
                                order: ${!index ? 0 : 2};
                            `,
                            title: yStep + ""
                        }}
                        imageSrc={buttonImagesPath.arrow}
                        startTouching={() => touchMovement.y += yStep}
                        stopTouching={() => touchMovement.y -= yStep}
                    />;
                })
            }
            <img
                src={buttonImagesPath.circle}
                draggable={false}
                style={{ width: touchControlsSize, height: touchControlsSize, order: 1 }}
            />
            <div
                className={css`
                    position: fixed;
                    left: 0;
                    bottom: 0;
                    width: 100%;
                    height: ${touchControlsSize / 1.5}px;
                    display: flex;
                    justify-content: center;
                `}
            >
                {
                    _.times(9, (index) => {
                        return <div
                            className={css`
                                width: ${touchControlsSize / 1.5}px;
                                height: 100%;
                                border: 3px solid rgba(128, 128, 128, 0.8);
                                background-color: rgba(0, 0, 0, 0.3);
                            `}
                        />;
                    })
                }
            </div>
        </div>
    </div>;
};

export default MobileControls;
