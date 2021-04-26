import React from "react";

import clsx from "clsx";
import _ from "lodash";

import styled from "@emotion/styled";
import { makeStyles, Theme } from "@material-ui/core";

import { touchMovement } from "../loop";

import type { CoordinateComponent } from "../structures";
interface ComponentProps {
}

const buttonImagesPath = {
    arrow: "./touch-movement-button.svg",
    circle: "./touch-circle.svg",
    pause: "./pause-button.svg"
};

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

const _TouchMovementButtonStyled = styled.div``;

type TouchMovementButtonProps = {
    size: number;
    imageSrc?: string;
} & Record<"startMoving" | "stopMoving", (event: React.PointerEvent<HTMLDivElement>) => unknown>;

const TouchMovementButton: React.FC<TouchMovementButtonProps & React.ComponentProps<"div">> = ({ children, size, className = "", style = {}, imageSrc, startMoving, stopMoving, ...divProps }) => {

    return <_TouchMovementButtonStyled
        className={clsx("touch-movement-button", className)}
        onPointerDown={e => {
            e.currentTarget.releasePointerCapture(e.pointerId);
        }}
        onPointerOver={e => {
            e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.1)";
            startMoving(e);
        }}
        onPointerOut={e => {
            e.currentTarget.style.backgroundColor = "";
            stopMoving(e);
        }}
        onPointerCancel={e => {
            e.currentTarget.style.backgroundColor = "";
            stopMoving(e);
        }}
        style={{
            width: size, height: size, ...style
        }}
        {...divProps}
    >{imageSrc && <img src={imageSrc} style={{ pointerEvents: "none", width: "100%", height: "100%" }} />}{children}</_TouchMovementButtonStyled>;
};

// IOS safari bug: select element dev feature fires touch/pointer events and doesn't fire cancel/end event! So, it's posiible to accomplish the state where app thinks that user holds button but he's actually not!
// there is no workaround for this now.

let MobileControls: React.FC<ComponentProps> = () => {
    const classes = useStyles({ controlsSize });

    const startMoving = (buttonIndex: number) => {
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
        console.log("Stop!");

        let [, , movementActionRaw] = controlsConfig[buttonIndex];
        // todo: fix 45deg buttons multiple holding
        const movementActions: MovementAction[] = typeof movementActionRaw[0] === "string" ? [movementActionRaw as MovementAction] : movementActionRaw as MovementAction[];
        for (const action of movementActions) {
            const [coord, step] = action;
            touchMovement[coord] -= step;
        }
    };

    return <div
    // todo doesn't work
    // onPointerOver={e => {
    //     (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    // }}
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

                        return <TouchMovementButton
                            key={label}
                            startMoving={e => startMoving(index)}
                            stopMoving={e => stopMoving(index)}
                            size={controlsSize}
                            style={{
                                gridArea: label
                            }}
                        >
                            <img
                                src={buttonImagesPath.arrow}
                                style={{
                                    transform: `rotate(${rotate}deg)`,
                                    pointerEvents: "none"
                                }}
                            />
                        </TouchMovementButton>;
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
            style={{
                position: "fixed",
                bottom: controlsSize + 20,
                right: 50,
                display: "flex",
                flexDirection: "column"
            }}
        >
            <TouchMovementButton
                imageSrc={buttonImagesPath.arrow}
                size={controlsSize}
                startMoving={() => {
                    touchMovement.y += 1;
                }}
                stopMoving={() => {
                    touchMovement.y -= 1;
                }}
            />
            <img
                src={buttonImagesPath.circle}
                onPointerOver={e => e.currentTarget.releasePointerCapture(e.pointerId)}
                style={{ width: controlsSize, height: controlsSize }}
            />
            <TouchMovementButton
                imageSrc={buttonImagesPath.arrow}
                size={controlsSize}
                style={{ transform: "rotate(180deg)" }}
                startMoving={() => {
                    touchMovement.y -= 1;
                }}
                stopMoving={() => {
                    touchMovement.y += 1;
                }}
            />
        </div>
    </div>;
};

export default MobileControls;
