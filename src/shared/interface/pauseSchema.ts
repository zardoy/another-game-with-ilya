import { pointerlock } from "../util";
import { PauseSchema } from "./GamePause";

export const pauseSchema: PauseSchema = {
    buttons: [
        {
            label: "CONTINUE PLAYING",
            click: () => pointerlock.capture(),
            closePause: true
        },
        {
            label: "OPTIONS"
        },
        {
            label: "UNLOAD MODULE",
            // click: unloadModule
        },
    ]
};
