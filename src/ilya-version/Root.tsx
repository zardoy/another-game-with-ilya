import React, { useEffect, useRef } from "react";

import { setupCanvas } from "./canvasSetup";

interface ComponentProps {
}

// Why don't we use IDs? https://stackoverflow.com/a/54127836/14982288
// everything should be unique in our app

let Root: React.FC<ComponentProps> = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null!);

    useEffect(() => {
        setupCanvas(canvasRef.current);
        return () => {
            console.log("Canvas unmounted!");
        };
    }, []);

    return <>
        <canvas ref={canvasRef} />
    </>;
};

export default Root;
