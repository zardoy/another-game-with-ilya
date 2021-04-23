import React, { useEffect, useState } from "react";

import { Button, Slide, Snackbar } from "@material-ui/core";
import { Alert } from "@material-ui/lab";

import { isRawInputSupported } from "./gameUtil";

interface ComponentProps {
}

function TransitionDown(props: any) {
    return <Slide {...props} direction="down" />;
}

const howToEnableRawInputUrl = "https://gist.github.com/zardoy/8325b680c08a396d820986991c54a41e";

let MouseRawInputSnackbar: React.FC<ComponentProps> = () => {
    const [open, setOpen] = useState(false);
    const [rawInput, setRawInput] = useState(false);

    useEffect(() => {
        (async () => {
            setRawInput(
                await isRawInputSupported()
            );
            setOpen(true);
        })();
    }, []);

    return <Snackbar
        open={open}
        onClose={() => setOpen(false)}
        anchorOrigin={{
            vertical: "top",
            horizontal: "right"
        }}
        TransitionComponent={TransitionDown}
        autoHideDuration={4000}
    >
        <Alert severity={rawInput ? "success" : "warning"}>
            Mouse Raw Input {rawInput ? "enabled" : "needs to be enabled!"}
            {!rawInput && <Button color="primary" size="small" component="a" target="_blank" href={howToEnableRawInputUrl}>MORE INFO</Button>}
        </Alert>
    </Snackbar>;
};

export default MouseRawInputSnackbar;
