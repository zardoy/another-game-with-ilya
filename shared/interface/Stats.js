import React, {useEffect, useRef} from "../../_snowpack/pkg/react.js";
import {css} from "../../_snowpack/pkg/@emotion/css.js";
import {entries} from "../util.js";
const statsDisplay = {
  fps: true,
  resolution: true,
  triangles: true
};
const updateStatNotReady = () => {
  throw new Error("Stats component isn't mounted anymore!");
};
let Stats = ({updateStatCallbackRef}) => {
  const divRef = useRef(null);
  useEffect(() => {
    let statElems = {};
    for (const [statName] of entries(statsDisplay)) {
      statElems[statName] = divRef.current.appendChild(document.createElement("span"));
      statElems[statName].dataset.display = statName;
    }
    updateStatCallbackRef.current = (stat, newValue) => statElems[stat].innerText = newValue.toString();
    return () => {
      updateStatCallbackRef.current = updateStatNotReady;
    };
  }, []);
  return /* @__PURE__ */ React.createElement("div", {
    className: css`
            position: fixed;
            top: 0;
            left: 0;
            border: 2px solid white;
            border-top: none;
            border-left: none;
            background: #26354d;
            color: white;
            font-family: 'Courier New', Courier, monospace;
            padding: 2px;
            z-index: 5;
            pointer-events: none;

            & > span::before {
                content: attr(data-display) ": ";
                text-transform: uppercase;
            }
            & > span {
                padding-right: 5px;
            }
        `,
    ref: divRef,
    id: "performance-stats"
  });
};
export default Stats;
