import React, { useRef, useState } from "react";

import _ from "lodash";

import { css } from "@emotion/css";

import pauseButtonSrc from "../../assets/pause-button.svg";
import circleButtonSrc from "../../assets/touch-circle.svg";
import arrowButtonSrc from "../../assets/touch-movement-button.svg";
import { releasePointerCapture, useFixedPointerEvents } from "../react-util";
import { touchSupported } from "../util";
import TouchMovementButton from "./TouchMovementButton";

import type { CoordinateComponent } from "../structures";

export type Vec3Temp = Record<CoordinateComponent, number>;

interface ComponentProps {
    updateTouchMoving?: (vec: Vec3Temp) => unknown;
}

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

// REFACTOR WITH PRESSURE MAP

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

// IOS safari bug: select element dev feature fires touch/pointer events and doesn't fire cancel/end event! So, it's posiible to accomplish the state where app thinks that user holds button but he's actually not!
// there is no workaround for this now.

let TouchControls: React.FC<ComponentProps> = ({ updateTouchMoving }) => {
    const movementRef = useRef<Vec3Temp>({ x: 0, y: 0, z: 0 });

    const [showYButtons, setShowYButtons] = useState(true);
    const [showForwardAuxButtons, setShowForwardAuxButtons] = useState(true);

    const updateMoving = (newState: boolean, buttonIndexOrActions: number | MovementAction[]) => {
        let movementActions: MovementAction[];
        if (typeof buttonIndexOrActions === "number") {
            let [, , movementActionRaw] = controlsConfig[buttonIndexOrActions];
            // unstable
            movementActions = typeof movementActionRaw[0] === "string" ? [movementActionRaw as MovementAction] : movementActionRaw as MovementAction[];
        } else {
            movementActions = buttonIndexOrActions;
        }

        for (const action of movementActions) {
            const [coord, step] = action;
            movementRef.current[coord] += step * (newState ? 1 : -1);
        }

        updateTouchMoving?.({ ...movementRef.current });
    };

    // todo fix ts: if (!Array.isArray(movementAction)) movementAction = [movementAction];

    const [yControlsContainerEvents] = useFixedPointerEvents({ /* stateToggle: setShowYButtons */ });

    // improve react rendering performance
    // TODO-EXTREMELY-HIGH wrap into flex container!
    // watch for css selector!!!!!!!!
    return !touchSupported ? null : <div
        onPointerDown={releasePointerCapture}
        className={css`
            z-index: 5;
            & > * {
                z-index: 5;
            }
        `}
    >
        <div
            className={css`
                position: fixed;
                left: 0;
                bottom: 0;
                width: ${touchControlsSize * 3}px;
                height: ${touchControlsSize * 3}px;
                border: 1px solid transparent;
                touch-action: none;
            `}
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
                            updateTouching={moving => updateMoving(moving, index)}
                            DivProps={{
                                style: {
                                    border: Math.abs(rotate) !== 45 ? "1px solid rgba(255, 255, 255, 0.2)" : "",
                                    gridArea: label
                                }
                            }}
                            imageSrc={arrowButtonSrc}
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
            src={pauseButtonSrc}
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
                            `
                        }}
                        imageSrc={arrowButtonSrc}
                        updateTouching={moving => updateMoving(moving, [["y", yStep]])}
                    />;
                })
            }
            <img
                src={circleButtonSrc}
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
                    /* TODO!!! */
                    pointer-events: none;
                    justify-content: center;
                `}
            >
                {
                    _.times(9, (index) => {
                        return <div
                            key={index}
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

export default TouchControls;
