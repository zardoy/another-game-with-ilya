import React, {useRef, useState} from "../../_snowpack/pkg/react.js";
import _ from "../../_snowpack/pkg/lodash.js";
import {css} from "../../_snowpack/pkg/@emotion/css.js";
import {releasePointerCapture, useFixedPointerEvents} from "../react-util.js";
import {touchSupported} from "../util.js";
import TouchMovementButton from "./TouchMovementButton.js";
const buttonImagesPath = {
  arrow: "../assets/touch-movement-button.svg",
  circle: "../assets/touch-circle.svg",
  pause: "../assets/pause-button.svg"
};
export const touchControlsSize = 50;
const pauseButtonSize = 45;
export const controlsConfig = [
  ["wa", -45, [["x", -1], ["z", -1]]],
  ["w", 0, ["z", -1]],
  ["wd", 45, [["x", 1], ["z", -1]]],
  ["d", 90, ["x", 1]],
  ["s", 180, ["z", 1]],
  ["a", 270, ["x", -1]]
];
let TouchControls = ({updateTouchMoving}) => {
  const movementRef = useRef({x: 0, y: 0, z: 0});
  const [showYButtons, setShowYButtons] = useState(true);
  const [showForwardAuxButtons, setShowForwardAuxButtons] = useState(true);
  const updateMoving = (newState, buttonIndexOrActions) => {
    let movementActions;
    if (typeof buttonIndexOrActions === "number") {
      let [, , movementActionRaw] = controlsConfig[buttonIndexOrActions];
      movementActions = typeof movementActionRaw[0] === "string" ? [movementActionRaw] : movementActionRaw;
    } else {
      movementActions = buttonIndexOrActions;
    }
    for (const action of movementActions) {
      const [coord, step] = action;
      movementRef.current[coord] += step * (newState ? 1 : -1);
    }
    updateTouchMoving?.({...movementRef.current});
  };
  const [yControlsContainerEvents] = useFixedPointerEvents({});
  return !touchSupported ? null : /* @__PURE__ */ React.createElement("div", {
    onPointerDown: releasePointerCapture,
    className: css`
            z-index: 5;
            & > * {
                z-index: 5;
            }
        `
  }, /* @__PURE__ */ React.createElement("div", {
    className: css`
                position: fixed;
                left: 0;
                bottom: 0;
                width: ${touchControlsSize * 3}px;
                height: ${touchControlsSize * 3}px;
                border: 1px solid transparent;
                touch-action: none;
            `
  }, /* @__PURE__ */ React.createElement("div", {
    style: {
      display: "grid",
      grid: "repeat(1fr, 3) / repeat(1fr, 3)",
      gridTemplateAreas: `
                    "wa w wd"
                    "a . d"
                    ". s ."`,
      width: "100%",
      height: "100%"
    }
  }, _.times(controlsConfig.length, (index) => {
    const [label, rotate] = controlsConfig[index];
    return (Math.abs(rotate) !== 45 || showForwardAuxButtons) && /* @__PURE__ */ React.createElement(TouchMovementButton, {
      key: label,
      updateTouching: (moving) => updateMoving(moving, index),
      DivProps: {
        style: {
          border: Math.abs(rotate) !== 45 ? "1px solid rgba(255, 255, 255, 0.2)" : "",
          gridArea: label
        }
      },
      imageSrc: buttonImagesPath.arrow,
      ImgProps: {
        style: {transform: `rotate(${rotate}deg)`}
      }
    });
  }))), /* @__PURE__ */ React.createElement("img", {
    onTouchStart: () => {
      window.dispatchEvent(new KeyboardEvent("keydown", {
        code: "Escape"
      }));
    },
    style: {
      position: "fixed",
      top: 0,
      right: 0,
      width: pauseButtonSize,
      height: pauseButtonSize,
      padding: 5,
      backgroundColor: "rgba(255, 255, 255, 0.1)"
    },
    src: buttonImagesPath.pause
  }), /* @__PURE__ */ React.createElement("div", {
    className: css`
                position: fixed;
                right: ${touchControlsSize}px;
                bottom: ${touchControlsSize * (showYButtons ? 1 : 2) + 10}px;
                display: flex;
                flex-direction: column;
            `,
    ...yControlsContainerEvents
  }, !showYButtons ? null : [1, -1].map((yStep, index) => {
    return /* @__PURE__ */ React.createElement(TouchMovementButton, {
      key: yStep,
      DivProps: {
        className: css`
                                transform: ${index === 1 ? "rotate(180deg)" : ""};
                                order: ${!index ? 0 : 2};
                            `
      },
      imageSrc: buttonImagesPath.arrow,
      updateTouching: (moving) => updateMoving(moving, [["y", yStep]])
    });
  }), /* @__PURE__ */ React.createElement("img", {
    src: buttonImagesPath.circle,
    draggable: false,
    style: {width: touchControlsSize, height: touchControlsSize, order: 1}
  }), /* @__PURE__ */ React.createElement("div", {
    className: css`
                    position: fixed;
                    left: 0;
                    bottom: 0;
                    width: 100%;
                    height: ${touchControlsSize / 1.5}px;
                    display: flex;
                    /* TODO!!! */
                    pointer-events: none;
                    justify-content: center;
                `
  }, _.times(9, (index) => {
    return /* @__PURE__ */ React.createElement("div", {
      key: index,
      className: css`
                                width: ${touchControlsSize / 1.5}px;
                                height: 100%;
                                border: 3px solid rgba(128, 128, 128, 0.8);
                                background-color: rgba(0, 0, 0, 0.3);
                            `
    });
  }))));
};
export default TouchControls;
