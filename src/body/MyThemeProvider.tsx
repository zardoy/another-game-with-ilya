import React, { useMemo } from "react";

import { createMuiTheme, ThemeProvider } from "@material-ui/core";

interface ComponentProps {
}

let MyThemeProvider: React.FC<ComponentProps> = ({ children }) => {
    const muiTheme = useMemo(() => createMuiTheme({
        palette: {
            type: "dark"
        }
    }), []);

    return <ThemeProvider theme={muiTheme}>{children}</ThemeProvider>;
};

export default MyThemeProvider;
