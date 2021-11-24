import React, { useMemo } from 'react'

import { createTheme, ThemeProvider, Theme, StyledEngineProvider, adaptV4Theme } from '@mui/material'

declare module '@mui/styles/defaultTheme' {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface DefaultTheme extends Theme {}
}

interface ComponentProps {}

let MyThemeProvider: React.FC<ComponentProps> = ({ children }) => {
    const muiTheme = useMemo(
        () =>
            createTheme({
                palette: {
                    mode: 'dark',
                },
            }),
        [],
    )

    return (
        <StyledEngineProvider injectFirst>
            <ThemeProvider theme={muiTheme}>{children}</ThemeProvider>
        </StyledEngineProvider>
    )
}

export default MyThemeProvider
