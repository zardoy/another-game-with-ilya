declare const canvas: HTMLCanvasElement;
declare const debugElem: HTMLDivElement;
declare const mousePos: HTMLDivElement;
declare const _: {
    chunk: any;
};

// fix for chromium browsers
interface Gamepad {
    vibrationActuator: {
        type: "dual-rumble";
        reset(): Promise<void>;
        playEffect(
            type: Gamepad["vibrationActuator"]["type"],
            options: {
                startDelay: number;
                duration: number;
                // intensity (0-1) of the small / bigger ERM
                weakMagnitude: number;
                strongMagnitude: number;
            }
        ): Promise<void>;
    };
}