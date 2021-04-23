import { rotateCamera, touchMovement } from "./loop.js";
import { CoordinateComponent } from "./structures.js";
import { debug, entries, isMouseLocked, touchSupported } from "./util.js";

document.addEventListener("pointerlockchange", () => {
    if (isMouseLocked()) {
        debug("Lock captured");
    } else {
        debug("Lock released");
    }
});

if (touchSupported) {
    const html = document.documentElement;
    const activeTouches = {
        rotation: {
            id: null as number | null,
            last: {
                x: 0,
                y: 0
            },
        },
        movement: {
            id: null as number | null,
            lastMoveButton: null as HTMLElement | null
        }
    };
    const resetLastMovementButton = () => {
        const { lastMoveButton } = activeTouches.movement;
        if (lastMoveButton) {
            lastMoveButton.style.backgroundColor = "";
        }
        touchMovement.x = 0;
        touchMovement.y = 0;
        touchMovement.z = 0;
        activeTouches.movement.lastMoveButton = null;
    };
    const updateTouch = (key: keyof typeof activeTouches, touch: Touch) => {
        const { clientX, clientY } = touch;
        if (key === "rotation") {
            const { last } = activeTouches.rotation;
            const deltaX = clientX - last.x;
            const deltaY = clientY - last.y;
            activeTouches.rotation.last = {
                x: clientX,
                y: clientY
            };
            rotateCamera(deltaX * 3, deltaY * 3);
        } else if (key === "movement") {
            // todo: use ??
            // @ts-ignore
            const pressure = touch.force || touch.pressure || touch.webkitForce || 1;
            const newButton = document.elementFromPoint(clientX, clientY) as HTMLElement;
            const { lastMoveButton } = activeTouches.movement;
            if (newButton === lastMoveButton) return;
            resetLastMovementButton();
            if (!newButton || !newButton.matches(".touch-movement-button")) return;
            const buttonIndex = +newButton.dataset.index;
            if (!isFinite(buttonIndex)) return;

            activeTouches.movement.lastMoveButton = newButton;
            newButton.style.backgroundColor = "red";
            const movementButtons: Array<[CoordinateComponent, number]> = [
                ["z", -1],
                ["x", 1],
                ["z", 1],
                ["x", -1]
            ];
            const movementAction = movementButtons[buttonIndex];
            touchMovement[movementAction[0]] = movementAction[1] * pressure;
        }
    };
    const resetTouch = (key: keyof typeof activeTouches) => {
        if (key === "rotation") {
            activeTouches.rotation = {
                id: null,
                last: { x: 0, y: 0 }
            };
        } else if (key === "movement") {
            resetLastMovementButton();
            (document.querySelector(".touch-movement-area") as HTMLElement).style.border = "";
            activeTouches.movement = {
                id: null,
                lastMoveButton: null
            };
        }
    };
    canvas.addEventListener("touchstart", e => e.preventDefault());
    html.addEventListener("touchstart", e => {
        const target = e.target as HTMLElement;
        const newTouch = e.changedTouches[0];
        if (target.matches("canvas") && activeTouches.rotation.id === null) {
            const { identifier: id, clientX: x, clientY: y } = newTouch;
            activeTouches.rotation = {
                id,
                last: {
                    x,
                    y
                }
            };
        }
        if (target.matches(".touch-movement-button, .touch-movement-area") && activeTouches.movement.id === null) {
            (document.querySelector(".touch-movement-area") as HTMLElement).style.border = "1px solid rgba(255, 255, 255, 0.2)";
            activeTouches.movement.id = newTouch.identifier;
            updateTouch("movement", newTouch);
        }
        console.log("New touch. Touching", target, "Touch id", e.changedTouches[0].identifier, "Final state", activeTouches);
    });
    html.addEventListener("touchmove", e => {
        for (const [key, { id }] of entries(activeTouches)) {
            const foundTouch = [].find.call(e.touches, ({ identifier }: Touch) => identifier === id);
            if (!foundTouch) continue;
            updateTouch(key, foundTouch);
        }
    });
    html.addEventListener("touchend", e => {
        console.log(e.type, e.changedTouches[0].identifier);
        const removedTouch = e.changedTouches[0];
        for (const [key, { id }] of entries(activeTouches)) {
            if (id !== removedTouch.identifier) continue;
            resetTouch(key);
        }
    });
}

export const requestPointerLock = () => {
    if (!document.documentElement.requestPointerLock) return;
    //@ts-ignore;
    const usingRawInput = !!document.documentElement.requestPointerLock({
        unadjustedMovement: true
    });
};

canvas.addEventListener("click", () => {
    requestPointerLock();
});
