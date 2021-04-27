import React, { useCallback, useEffect, useState } from "react";

export const releasePointerCapture = (e: React.PointerEvent) => {
    e.preventDefault();
    const target = e.target as HTMLElement;
    if (!target.releasePointerCapture) return;
    target.releasePointerCapture(e.pointerId);
};

type HookParams = {
    startTouching?: (e: React.PointerEvent<HTMLElement>) => unknown;
    stopTouching?: (e?: React.PointerEvent<HTMLElement>) => unknown;
    stateToggle?: (newState: boolean) => unknown;
    tag?: string;
};

type Event = React.PointerEvent<HTMLElement>;
type ToggleIsTouching = (...args: [true, Event] | [false, Event?]) => void;

// TODO: refactoring required!

// TODO: only works with one level depth
export const useFixedPointerEvents = (props: HookParams):
    [React.ComponentProps<"div">, boolean] => {
    const [touching, setTouching] = useState(false);

    const toggleIsTouching = useCallback(((newState, event) => {
        console.log(event?.type, event?.target);
        if (touching === newState) return;
        const relatedTarget = event?.relatedTarget as HTMLElement;
        if (event && event.type === "pointerout" && relatedTarget?.parentElement === event.currentTarget) return;
        const { stateToggle, startTouching, stopTouching } = props;
        setTouching(newState);
        stateToggle?.(newState);
        (newState ? startTouching : stopTouching)?.(event!);
    }) as ToggleIsTouching, [touching, props]);

    useEffect(() => {
        if (!touching) return;
        // still could be buggy
        const removeTouchIfHidden = () => document.visibilityState === "hidden" && toggleIsTouching(false);
        const onTouchEnd = (e: TouchEvent) => e.touches.length === 0 && toggleIsTouching(false);
        document.addEventListener("visibilitychange", removeTouchIfHidden);
        // in case of other Safari bugs
        document.documentElement.addEventListener("touchend", onTouchEnd);
        return () => {
            document.removeEventListener("visibilitychange", removeTouchIfHidden);
            document.documentElement.removeEventListener("touchend", onTouchEnd);
        };
    }, [touching, toggleIsTouching]);

    // TODO-HIGH TS: access global variables only via window. & show conflicts!

    return [
        {
            onPointerDown: releasePointerCapture,
            onPointerOver: toggleIsTouching.bind(null, true),
            onPointerOut: toggleIsTouching.bind(null, false),
            // report 20+ bugs where this event isn't firing for some reason
            onPointerCancel: toggleIsTouching.bind(null, false),
            // for tablets on windows
            onContextMenu: e => e.preventDefault()
        },
        touching
    ];
};
