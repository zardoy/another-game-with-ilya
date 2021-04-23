declare const canvas: HTMLCanvasElement;
declare module "lodash" {
    export const chunk: <T extends any[]>(arr: T, chunkSize: number) => T;
    export const times: <T>(count: number, callback: (index: number) => T) => T[];
    export const mapValues: <T extends object, K extends (value: T[keyof T]) => any>(obj: T, mapFn: K) =>
        Record<keyof T, ReturnType<K>>;
    export const without: <T extends any[]>(arr: T, value: T[number]) => T;
}

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

// todo: fix snowpack
interface ImportMeta {
    hot: any;
    env: {
        NODE_ENV: "development" | "production";
    };
}
