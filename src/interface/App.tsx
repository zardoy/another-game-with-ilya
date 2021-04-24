import React, { useMemo, useState } from "react";

import { Global } from "@emotion/react";
import { createMuiTheme, CssBaseline, ThemeProvider } from "@material-ui/core";

import { touchSupported } from "../util";
import GamePause from "./GamePause";
import MobileControls from "./MobileControls";
import MouseRawInputSnackbar from "./MouseRawInputSnackbar";

interface ComponentProps {
}

let App: React.FC<ComponentProps> = () => {
    const [showPauseMenu, setShowPauseMenu] = useState(true);

    const muiTheme = useMemo(() => createMuiTheme({
        palette: {
            type: "dark"
        }
    }), []);

    return <ThemeProvider theme={muiTheme}>
        <CssBaseline />

        {touchSupported && <MobileControls />}

        <Global
            styles={{
                html: {
                    userSelect: "none",
                    WebkitTouchCallout: "none"
                }
            }}
        />

        <MouseRawInputSnackbar />

        {
            showPauseMenu &&
            <GamePause
                buttons={[
                    {
                        label: "SOCIAL"
                    },
                    {
                        label: "OPTIONS"
                    },
                    {
                        label: "LEAVE GAME"
                    },
                ]}
            />
        }
    </ThemeProvider>;
};

export default App;
