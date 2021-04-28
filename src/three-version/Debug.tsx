import React from "react";

import { css } from "@emotion/css";
import { Stats } from "@react-three/drei";

interface ComponentProps {
}

let Debug: React.FC<ComponentProps> = () => {
    return <>
        <Stats showPanel={0} />
        <Stats showPanel={2} className={css`
            & > canvas {
                left: 80px !important;
            }
        `} />
    </>;
};

export default Debug;
