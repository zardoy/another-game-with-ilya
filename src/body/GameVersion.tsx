import React, { Suspense } from "react";

import { css } from "@emotion/css";
import { Backdrop as MUIBackdrop, CircularProgress } from "@material-ui/core";
import zIndex from "@material-ui/core/styles/zIndex";

import Interface from "../shared/interface/Root";

const Backdrop: React.FC = () => <MUIBackdrop
    open={true}
    // sx={{ zIndex: theme => theme.zIndex.drawer + 1 }}
    className={css`
        z-index: ${zIndex.drawer + 1} !important;
    `}
>
    <CircularProgress color="inherit" />
</MUIBackdrop>;

let GameVersion: React.FC<{ unloadModule?: () => unknown; }> = ({ children, unloadModule = () => { } }) => {
    return <Suspense fallback={<Backdrop />}>
        {children}

        <Interface unloadModule={unloadModule} />
    </Suspense>;
};

export default GameVersion;
