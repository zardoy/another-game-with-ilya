import React from "react";

import { Global } from "@emotion/react";
import { CssBaseline } from "@material-ui/core";

interface ComponentProps {
}

let GlobalStyles: React.FC<ComponentProps> = () => {
    return <>
        <CssBaseline />
        <Global
            styles={{
                html: {
                    overflow: "hidden",
                    userSelect: "none",
                    WebkitTouchCallout: "none",
                    touchAction: "none"
                },
                body: {
                    overflow: "none",
                },
                canvas: {
                    overflow: "none",
                    height: "100vh"
                }
            }}
        />
    </>;
};

export default GlobalStyles;
