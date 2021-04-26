import React, { useEffect, useState } from "react";

import { Button, Slide, Snackbar } from "@material-ui/core";
import { Alert } from "@material-ui/lab";

import { pointerlock } from "../util";

interface ComponentProps {
}

function TransitionDown(props: any) {
    return <Slide {...props} direction="down" />;
}

const howToEnableRawInputUrl = "https://gist.github.com/zardoy/8325b680c08a396d820986991c54a41e";

type SnackbarState = "notShowed" | boolean | "showed";

let MouseRawInputSnackbar: React.FC<ComponentProps> = () => {
    const [snackbarState, setSnackbarState] = useState<SnackbarState>("notShowed");

    useEffect(() => {
        if (snackbarState !== "notShowed") return;
        const listener = () => pointerlock.usingRawInput !== null && setSnackbarState(pointerlock.usingRawInput);
        pointerlock.onCapture.push(listener);
        return () => {
            pointerlock.removeListener("onCapture", listener);
        };
    }, [snackbarState]);

    return <Snackbar
        open={typeof snackbarState === "boolean"}
        onClose={() => setSnackbarState("showed")}
        anchorOrigin={{
            vertical: "top",
            horizontal: "right"
        }}
        TransitionComponent={TransitionDown}
        autoHideDuration={4000}
    >
        <Alert severity={snackbarState ? "success" : "warning"}>
            Mouse Raw Input {snackbarState ? "enabled" : "needs to be enabled!"}
            {!snackbarState && <Button color="primary" size="small" component="a" target="_blank" href={howToEnableRawInputUrl}>MORE INFO</Button>}
        </Alert>
    </Snackbar>;
};

export default MouseRawInputSnackbar;
