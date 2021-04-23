import React from "react";

import clsx from "clsx";
import _ from "lodash";

import { makeStyles } from "@material-ui/core";

interface ComponentProps {
}

const controlsSize = 50,
    smallButtonSize = navigator.standalone ? 20 : 50;

const useStyles = makeStyles({
    touchMovementArea: {
        position: "fixed",
        left: 0,
        bottom: 0,
        width: controlsSize * 3,
        height: controlsSize * 3
    }
});

let MobileControls: React.FC<ComponentProps> = () => {
    const classes = useStyles();

    return <>
        <div
            className={clsx(classes.touchMovementArea, "touch-movement-area")}
            onTouchStart={e => e.preventDefault()}
        />
        <div style={{
            position: "fixed",
            bottom: 0,
            left: 0,
            paddingLeft: controlsSize,
            marginBottom: controlsSize * 2,
        }}
            onTouchStart={e => e.preventDefault()}
        >
            {
                _.times(4, (index) => {
                    return <img
                        key={index}
                        data-index={index}
                        src="./touch-movement-button.svg"
                        style={{
                            width: controlsSize, height: controlsSize,
                            position: "absolute",
                            transform: `rotate(${index * 90}deg) translateY(-100%)`,
                            WebkitTouchCallout: "none"
                        }}
                        className="touch-movement-button"
                    />;
                })
            }
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
                width: smallButtonSize,
                height: smallButtonSize,
                padding: 5,
                backgroundColor: "rgba(255, 255, 255, 0.3)"
            }}
            src="./pause.svg"
        />
    </>;
};

export default MobileControls;
