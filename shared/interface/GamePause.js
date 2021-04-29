import React, {useEffect, useState} from "../../_snowpack/pkg/react.js";
import useTypedEventListener from "../../_snowpack/pkg/use-typed-event-listener.js";
import styled from "../../_snowpack/pkg/@emotion/styled.js";
import {getRendererName, pointerlock} from "../util.js";
const fullScreenFixed = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
`;
const PauseRoot = styled.div`
    ${fullScreenFixed}
    background-color: rgba(0, 0, 0, 0.3);
    @supports ((-webkit-backdrop-filter: blur(2em)) or (backdrop-filter: blur(2em))) {
    backdrop-filter: blur(3px);
        background-color: transparent;
    }
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    z-index: 1250;
`;
const buttonStyles = `
    padding: 0;
    background: transparent;
    font-family: inherit;
    letter-spacing: 0.5px;
    border: none;
    color: white;
    text-transform: uppercase;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`;
const OverwatchButton = styled.button`
    
`;
const MenuPrimaryButton = styled.button`
    ${buttonStyles}
    width: 300px;
    padding: 4px;
    margin: 3px;
    font-size: 1.2rem;
    font-weight: 500;
    background: rgba(0, 0, 0, 0.6);

    &:hover {
        background: rgba(0, 0, 0, 0.7);
    }
`;
const MenuActionOWButton = ({style, onClick}) => {
  const KeyHint = styled.div`
        text-overflow: clip;
        padding: 10px;
        background: rgba(0, 0, 0, 0.5);
        font-size: 0.8em;
        text-transform: inherit;
    `;
  const ActionName = styled.div`
        padding: 0 10px;
        text-shadow: 0 0 5px black;
    `;
  const Button = styled.button`
        ${buttonStyles}
        letter-spacing: 1px;
        padding: 3px;
        display: flex;
        align-items: center;
        font-weight: 500;
        font-size: 1rem;
        outline: none;
        border-radius: 2px;
        border: 1px solid transparent;

        &:hover {
            border: 1px solid rgba(255, 255, 255, 0.4); 
        }
        &:active {
            transform: scale(0.9);
        }
    `;
  return /* @__PURE__ */ React.createElement(Button, {
    style,
    tabIndex: -1,
    onClick
  }, /* @__PURE__ */ React.createElement(KeyHint, null, "esc"), /* @__PURE__ */ React.createElement(ActionName, null, "BACK"));
};
const RightCornerInfo = () => {
  const [gpu] = useState(() => {
    try {
      return getRendererName();
    } catch (err) {
      console.warn("Unable to detect gpu", err);
      return "Unknown";
    }
  });
  return /* @__PURE__ */ React.createElement("div", {
    style: {
      position: "fixed",
      top: 0,
      right: 0,
      padding: 5
    }
  }, "GPU: ", gpu);
};
let GamePause = ({buttons}) => {
  const [show, setShow] = useState(false);
  useTypedEventListener(window, "keydown", (e) => {
    if (e.code !== "Escape")
      return;
    setShow((show2) => {
      const newState = !show2;
      if (!newState) {
      }
      return newState;
    });
  });
  useEffect(() => {
    const onPointerlockExit = () => {
      setShow(true);
    };
    pointerlock.onRelease.push(onPointerlockExit);
    return () => {
      pointerlock.removeListener("onRelease", onPointerlockExit);
    };
  }, []);
  return !show ? null : /* @__PURE__ */ React.createElement(PauseRoot, null, /* @__PURE__ */ React.createElement(RightCornerInfo, null), buttons.map(({label, click = () => {
  }}, index) => {
    return /* @__PURE__ */ React.createElement(MenuPrimaryButton, {
      key: label,
      autoFocus: index === 0,
      onClick: click
    }, label);
  }), /* @__PURE__ */ React.createElement(MenuActionOWButton, {
    style: {position: "absolute", bottom: 30, right: 35},
    "data-button": "esc",
    onClick: () => {
      pointerlock.capture();
      setShow(false);
    }
  }, "BACK"));
};
export default GamePause;
