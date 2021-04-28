import React from "react";



import InGameInterface from "./InGameInterface";
import MouseRawInputSnackbar from "./MouseRawInputSnackbar";

interface ComponentProps {
    unloadModule: () => unknown;
}

export const touchMovement = { x: 0, y: 0, z: 0 };

let Root: React.FC<ComponentProps> = ({ unloadModule }) => {
    return <>
        <MouseRawInputSnackbar />

        <InGameInterface />
    </>;
};

export default Root;
