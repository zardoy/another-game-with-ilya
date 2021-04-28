import React, { CSSProperties } from "react";

import styled from "@emotion/styled";

import { buttonStyles } from "./styles";

const MenuActionOWButton: React.FC<{ keyboardKey?: string; style?: CSSProperties; onClick?: any; }> = ({ style, onClick }) => {
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
    return <Button style={style} tabIndex={-1} onClick={onClick}>
        <KeyHint>esc</KeyHint>
        <ActionName>BACK</ActionName>
    </Button>;
};

export default MenuActionOWButton;
