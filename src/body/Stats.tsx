import React, { useEffect, useRef } from "react";

import { css } from "@emotion/css";

import { entries } from "../shared/util";

interface ComponentProps {
}

const statsDisplay = {
    fps: true,
    resolution: true,
    triangles: true
};

const updateStatNotReady = () => { throw new Error("Stats display not ready yet!"); };
export let updateStat: (stat: keyof typeof statsDisplay, newValue: string | number) => unknown = updateStatNotReady;

let Stats: React.FC<ComponentProps> = () => {
    const divRef = useRef<HTMLDivElement>(null!);

    useEffect(() => {
        let statElems: { [stat: string]: HTMLSpanElement; } = {};
        for (const [statName] of entries(statsDisplay)) {
            statElems[statName] = divRef.current.appendChild(document.createElement("span"));
            statElems[statName].dataset.display = statName;
        }
        updateStat = ((stat, newValue) => statElems[stat].innerText = newValue.toString());
        return () => {
            updateStat = updateStatNotReady;
        };
    }, []);

    return <div
        className={css`
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
                padding-right: 3px;
            }
        `}
        ref={divRef}
        id="performance-stats"
    />;
};

export default Stats;
