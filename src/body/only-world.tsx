import "./pageInit";

import React from "react";

import ReactDOM from "react-dom";

import GameVersion from "./GameVersion";
import GlobalStyles from "./GlobalStyles";

// WORKAROUND
// try to not import theme to avoid overhead

export const renderOnlyWorld = (EngineRootComponent: React.FC) => {
    ReactDOM.render(
        <GameVersion>
            <GlobalStyles />
            <EngineRootComponent />
        </GameVersion>,
        document.getElementById("root"));
};

