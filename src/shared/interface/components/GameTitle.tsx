import React from "react";

import { css } from "@emotion/css";

interface ComponentProps {
}

let GameTitle: React.FC<ComponentProps> = ({ children }) => {
    return <h1
        className={css`
            color: white;
            font-family: Arial, Helvetica, sans-serif;
            font-weight: 900;
            font-size: 5em;
            text-shadow: 0 0 10px gray;
        `}
    >{children}</h1>;
};

export default GameTitle;
