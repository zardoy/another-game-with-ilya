import React, { useMemo } from "react";

import { css, Global } from "@emotion/react";
import { createMuiTheme, CssBaseline, ThemeProvider } from "@material-ui/core";

import GamePause from "./GamePause";
import MouseRawInputSnackbar from "./MouseRawInputSnackbar";

interface ComponentProps {
}

let App: React.FC<ComponentProps> = () => {
    const muiTheme = useMemo(() => createMuiTheme({
        palette: {
            type: "dark"
        }
    }), []);

    return <ThemeProvider theme={muiTheme}>
        <CssBaseline />

        <MouseRawInputSnackbar />

        <Global
            styles={css`
            body {
                background: url("https://games.mail.ru/hotbox/content_files/gallery/c3/ab/minecraft_wallpaper_1920x1080_47a2afe2.jpeg") no-repeat center/cover fixed;
            }
            `}
        />

        <GamePause buttons={[
            {
                label: "SOCIAL"
            },
            {
                label: "OPTIONS"
            },
            {
                label: "LEAVE GAME"
            },
        ]} />
    </ThemeProvider>;
};

export default App;
