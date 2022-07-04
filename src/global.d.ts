// todo:
// - ps4 color targeting players https://thebitlink.github.io/WebHID-DS4/
// check support for events
// right top corner - (battery) time
// mouse sliders for ipad

// GLOBAL CANVAS, PLEASE!

// got really tired of disconnecting chrome dev tools

declare module 'lodash' {
    export const chunk: <T extends any[]>(arr: T, chunkSize: number) => T
    export const times: <T>(count: number, callback: (index: number) => T) => T[]
    export const mapValues: <T extends object, K extends (value: T[keyof T]) => any>(obj: T, mapFn: K) => Record<keyof T, ReturnType<K>>
    export const without: <T extends any[]>(arr: T, value: T[number]) => T
    export const clamp: (number: number, lower: number, upper?: number) => number
}

// fix for chromium browsers
interface Gamepad {
    vibrationActuator: {
        type: 'dual-rumble'
        reset(): Promise<void>
        playEffect(
            type: Gamepad['vibrationActuator']['type'],
            options: {
                startDelay: number
                duration: number
                // intensity (0-1) of the small / bigger ERM
                weakMagnitude: number
                strongMagnitude: number
            },
        ): Promise<void>
    }
}

declare module '*.svg' {
    const src: string
    export default src
}

interface ImportMeta {
    env: {
        NODE_ENV: 'development' | 'production'
        VITE_SCRIPT: string
        VITE_NAME: string
        VITE_BUILD_DATE: string
    }
}

interface Navigator {
    standalone: boolean
}
