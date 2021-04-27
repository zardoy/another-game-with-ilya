import React, { Suspense, useEffect, useState } from "react";

import useTypedEventListener from "use-typed-event-listener";

import { css } from "@emotion/css";
import { Backdrop as MUIBackdrop, Button, CircularProgress, Grid, Typography } from "@material-ui/core";
import zIndex from "@material-ui/core/styles/zIndex";

import Interface from "../shared/interface/Root";
import { entries } from "../shared/util";
import GlobalStyles from "./GlobalStyles";
import MyThemeProvider from "./MyThemeProvider";
import Stats from "./Stats";

interface ComponentProps {
}

const Backdrop: React.FC = () => <MUIBackdrop
    open={true}
    className={css`
        z-index: ${zIndex.drawer + 1} !important;
    `}
>
    <CircularProgress color="inherit" />
</MUIBackdrop>;

interface LoadModuleProps {
    modulePath: string;
    onModuleLoad?: () => unknown;
    unloadModule?: () => unknown;
}

const ExternalModule: React.FC<LoadModuleProps> = ({ modulePath, onModuleLoad, unloadModule = () => { } }) => {
    const ModuleToLoad = React.lazy(async () => {
        const module = await import(modulePath);
        onModuleLoad?.();
        return module;
    });

    return <Suspense fallback={<Backdrop />}>
        <ModuleToLoad />

        <Interface unloadModule={unloadModule} />
        <Stats />
    </Suspense>;
};

const versions: {
    [label: string]: {
        title: string;
        module: string;
    };
} = {
    ilya: {
        title: "Ilya IMPLEMENTATION",
        module: "../ilya-version/index.js"
    },
    three: {
        title: "Three.js IMPLEMENTATION",
        module: "../three-version/index.js"
    }
};

let Root: React.FC<ComponentProps> = () => {
    const [modulePath, setModulePath] = useState(null as string | null);
    const [moduleLoaded, setModuleLoaded] = useState(false);

    useTypedEventListener(window, "hashchange", () => {
        const selectedVersion = window.location.hash.slice(1);
        if (selectedVersion in versions) {
            setModulePath(versions[selectedVersion].module);
        } else {
            setModulePath(null);
        }
    });

    useEffect(() => {
        window.dispatchEvent(new HashChangeEvent("hashchange"));
    }, []);

    return <MyThemeProvider>
        <GlobalStyles />
        {
            !moduleLoaded &&
            <Grid
                container
                justify="center"
                alignItems="center"
                direction="column"
                spacing={3}
                style={{ height: "100vh" }}
            >
                <Typography variant="h1" align="center">DIMAKA</Typography>
                {entries(versions).map(([label, { title, module }]) => {
                    return <Grid item key={label}>
                        <Button
                            variant="contained"
                            size="large"
                            color="primary"
                            onClick={() => window.location.hash = label.toString()}
                        >{title}</Button>
                    </Grid>;
                })}
            </Grid>
        }

        {modulePath &&
            <ExternalModule
                modulePath={modulePath}
                onModuleLoad={() => setModuleLoaded(true)}
                unloadModule={() => (setModuleLoaded(false), window.location.hash = "")}
            />}
    </MyThemeProvider>;
};

export default Root;
