import React from "react";

import clsx from "clsx";

import { makeStyles } from "@material-ui/core";

import { touchControlsSize } from "../interface/MobileControls";
import { useFixedPointerEvents } from "../react-util";

type ComponentProps = {
    size?: number;
    /** @default true */
    borderOnTouch?: boolean;
    DivProps?: React.ComponentProps<"div">;
}
    & Pick<Parameters<typeof useFixedPointerEvents>[0], "startTouching" | "stopTouching">
    & ({} | {
        imageSrc: string;
        ImgProps?: React.ComponentProps<"img">;
    });

const useStyles = makeStyles({
    button: {},
    touchingButton: {
        backgroundColor: "rgba(255, 255, 255, 0.1)"
    }
});

let TouchMovementButton: React.FC<ComponentProps> = ({
    size = touchControlsSize,
    borderOnTouch,
    children,
    DivProps,
    ...restProps
}) => {
    const classes = useStyles();
    const [pointerEvents, touching] = useFixedPointerEvents({ ...restProps, tag: DivProps?.title });

    return <div
        {...DivProps}
        className={clsx("touch-movement-button", DivProps?.className, { [classes.touchingButton]: touching })}
        style={{
            width: size, height: size, ...DivProps?.style
        }}
        {...pointerEvents}
    >
        {"imageSrc" in restProps &&
            <img
                {...restProps.ImgProps}
                src={restProps.imageSrc}
                style={{ pointerEvents: "none", width: "100%", height: "100%", ...restProps.ImgProps?.style }}
            />}
        {children}
    </div>;
};

export default TouchMovementButton;