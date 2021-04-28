import React from "react";

import clsx from "clsx";

import { css } from "@emotion/css";

import { useFixedPointerEvents } from "../react-util";
import { touchControlsSize } from "./TouchControls";

type ComponentProps = {
    size?: number;
    /** @default true */
    borderOnTouch?: boolean;
    DivProps?: React.ComponentProps<"div">;
}
    & Parameters<typeof useFixedPointerEvents>[0]
    & ({} | {
        imageSrc: string;
        ImgProps?: React.ComponentProps<"img">;
    });

const touchingButtonClass = css`
    background-color: rgba(255, 255, 255, 0.1);
`;

let TouchMovementButton: React.FC<ComponentProps> = ({
    size = touchControlsSize,
    borderOnTouch,
    children,
    DivProps,
    ...restProps
}) => {
    const [pointerEvents, touching] = useFixedPointerEvents({ ...restProps });

    return <div
        {...DivProps}
        className={clsx("touch-movement-button", { [touchingButtonClass]: touching }, DivProps?.className)}
        style={{
            width: size, height: size, ...DivProps?.style
        }}
        {...pointerEvents}
    >
        {"imageSrc" in restProps &&
            <img
                {...restProps.ImgProps}
                src={restProps.imageSrc}
                className={clsx(css`
                        width: 100%;
                        height: 100%;
                        pointer-events: none;
                    `,
                    restProps.ImgProps?.className
                )}
            />}
        {children}
    </div>;
};

export default TouchMovementButton;
