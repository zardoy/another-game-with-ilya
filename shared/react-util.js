import {useCallback, useEffect, useRef, useState} from "../_snowpack/pkg/react.js";
export const releasePointerCapture = (e) => {
  e.preventDefault();
  const target = e.target;
  if (!target.releasePointerCapture)
    return;
  target.releasePointerCapture(e.pointerId);
};
export const useFixedPointerEvents = (props) => {
  const [touching, setTouching] = useState(false);
  const toggleIsTouching = useCallback((newState, event) => {
    if (touching === newState)
      return;
    const relatedTarget = event?.relatedTarget;
    if (event && event.type === "pointerout" && relatedTarget?.parentElement === event.currentTarget)
      return;
    const {updateTouching, startTouching, stopTouching} = props;
    setTouching(newState);
    updateTouching?.(newState);
    (newState ? startTouching : stopTouching)?.(event);
  }, [touching, props]);
  useEffect(() => {
    if (!touching)
      return;
    const removeTouchIfHidden = () => document.visibilityState === "hidden" && toggleIsTouching(false);
    const onTouchEnd = (e) => e.touches.length === 0 && toggleIsTouching(false);
    document.addEventListener("visibilitychange", removeTouchIfHidden);
    document.documentElement.addEventListener("touchend", onTouchEnd);
    return () => {
      document.removeEventListener("visibilitychange", removeTouchIfHidden);
      document.documentElement.removeEventListener("touchend", onTouchEnd);
    };
  }, [touching, toggleIsTouching]);
  return [
    {
      onPointerDown: releasePointerCapture,
      onPointerOver: (e) => toggleIsTouching(true, e),
      onPointerOut: (e) => toggleIsTouching(false, e),
      onPointerCancel: (e) => toggleIsTouching(false, e),
      onContextMenu: (e) => e.preventDefault()
    },
    touching
  ];
};
export const useInterval = (callback, delay) => {
  const savedCallback = useRef(callback);
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);
  useEffect(() => {
    if (delay === null)
      return;
    const id = setInterval(() => savedCallback.current(), delay);
    return () => clearInterval(id);
  }, [delay]);
};
