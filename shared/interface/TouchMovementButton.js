import React from "../../_snowpack/pkg/react.js";
import clsx from "../../_snowpack/pkg/clsx.js";
import {css} from "../../_snowpack/pkg/@emotion/css.js";
import {useFixedPointerEvents} from "../react-util.js";
import {touchControlsSize} from "./TouchControls.js";
const touchingButtonClass = css`
    background-color: rgba(255, 255, 255, 0.1);
`;
let TouchMovementButton = ({
  size = touchControlsSize,
  borderOnTouch,
  children,
  DivProps,
  ...restProps
}) => {
  const [pointerEvents, touching] = useFixedPointerEvents({...restProps});
  return /* @__PURE__ */ React.createElement("div", {
    ...DivProps,
    className: clsx("touch-movement-button", {[touchingButtonClass]: touching}, DivProps?.className),
    style: {
      width: size,
      height: size,
      ...DivProps?.style
    },
    ...pointerEvents
  }, "imageSrc" in restProps && /* @__PURE__ */ React.createElement("img", {
    ...restProps.ImgProps,
    src: restProps.imageSrc,
    className: clsx(css`
                        width: 100%;
                        height: 100%;
                        pointer-events: none;
                    `, restProps.ImgProps?.className)
  }), children);
};
export default TouchMovementButton;
