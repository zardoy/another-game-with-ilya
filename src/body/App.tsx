// THE ACTUAL ENTRYPOINT COMPONENT FOR THE WHOLE APP

import React, { useState } from "react";

import { Button, Grid, Typography } from "@material-ui/core";

import { entries } from "../shared/util";
import GameVersion from "./GameVersion";
import GlobalStyles from "./GlobalStyles";
import MyThemeProvider from "./MyThemeProvider";

interface ComponentProps {
}

interface LoadModuleProps {
    rootComponentPath: string;
    onLoad?: () => unknown;
    unloadModule?: () => unknown;
}

const GameVersionLazy: React.FC<LoadModuleProps> = ({ rootComponentPath, onLoad, unloadModule }) => {
    const LazyModule = React.lazy(async () => {
        const module = await import(rootComponentPath);
        onLoad?.();
        return module;
    });

    return <GameVersion {...{ unloadModule }}><LazyModule /></GameVersion>;
};

const gameVersions: {
    [label: string]: {
        module: string;
    };
} = {
    ilya: {
        module: "../ilya-version/index.js"
    },
    three: {
        module: "../three-version/index.js"
    }
};

let Root: React.FC<ComponentProps> = () => {
    const [enginePath, setEnginePath] = useState(null as string | null);
    const [moduleLoaded, setModuleLoaded] = useState(false);

    // useTypedEventListener(window, "hashchange", () => {
    //     const selectedVersion = window.location.hash.slice(1);
    //     if (selectedVersion in gameVersions) {
    //         setVersionPath(gameVersions[selectedVersion].module);
    //     } else {
    //         setVersionPath(null);
    //     }
    // });

    // useEffect(() => {
    //     window.dispatchEvent(new HashChangeEvent("hashchange"));
    // }, []);

    return <MyThemeProvider>
        <GlobalStyles />
        {
            !moduleLoaded &&
            <Grid
                container
                justify="space-between"
                direction="column"
                alignContent="center"
                style={{ height: "100vh" }}
            >
                <Typography variant="h1" align="center">DIMAKA</Typography>
                <Grid
                    item
                    container
                    justify="center"
                    alignItems="center"
                    direction="column"
                    spacing={3}
                >
                    {entries(gameVersions).map(([label, { module }]) => {
                        return <Grid item key={label}>
                            <Button
                                variant="contained"
                                color="primary"
                                size="large"
                                // onClick={() => window.location.hash = label.toString()}
                                onClick={() => setEnginePath(module)}
                            >{label} GAME ENGINE</Button>
                        </Grid>;
                    })}
                    <Button
                        variant="contained"
                        color="secondary"
                        disabled
                    >GAME SETTINGS</Button>
                </Grid>
                <Typography variant="body2" align="right" color="textSecondary">BUILT {import.meta.env.SNOWPACK_PUBLIC_BUILD_DATE}</Typography>
            </Grid>
        }

        {enginePath &&
            <GameVersionLazy
                rootComponentPath={enginePath}
                onLoad={() => setModuleLoaded(true)}
            // unloadModule={() => (setModuleLoaded(false), window.location.hash = "")}
            />}
    </MyThemeProvider>;
};

export default Root;
