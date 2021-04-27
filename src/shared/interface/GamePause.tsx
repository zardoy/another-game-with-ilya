import React, { useEffect, useState } from "react";

import useTypedEventListener from "use-typed-event-listener";

import styled from "@emotion/styled";
import { CSSProperties } from "@material-ui/styles";

import { getRendererName, pointerlock } from "../util";

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

const RightCornerInfo: React.FC = () => {
    const [gpu] = useState(() => {
        try {
            return getRendererName();
        } catch (err) {
            console.warn("Unable to detect gpu", err);
            return "Unknown";
        }
    });

    return <div style={{
        position: "fixed",
        top: 0,
        right: 0,
        padding: 5
    }}>
        GPU: {gpu}
    </div>;
};

type ButtonAction = `open-ui-${"settings"}`;

interface ComponentProps {
    buttons: {
        label: string;
        click?: (event: React.MouseEvent<HTMLElement>) => unknown | ButtonAction;
    }[];
}

let GamePause: React.FC<ComponentProps> = ({ buttons }) => {
    const [show, setShow] = useState(false);

    useTypedEventListener(window, "keydown", e => {
        if (e.code !== "Escape") return;
        setShow(show => {
            const newState = !show;
            if (!newState) {
                // special handling for escape key
                // if we dont add timeout otherwise we would get instant exit from pointer lock
                // setTimeout(() => pointerlock.capture(), 100); // this workaround will work only in 50%
                // pointerlock.capture(); //TODO-HIGH enable when upstream bug with pointerlock-esc will be fixed
            }
            return newState;
        });
    });

    useEffect(() => {
        const onPointerlockExit = () => {
            // console.log("Showing pause menu because of pointer lock exit");
            setShow(true);
        };
        pointerlock.onRelease.push(onPointerlockExit);

        return () => {
            pointerlock.removeListener("onRelease", onPointerlockExit);
        };
    }, []);

    return !show ? null : <PauseRoot>
        <RightCornerInfo />
        {
            buttons.map(({ label, click = () => { } }, index) => {
                return <MenuPrimaryButton key={label} autoFocus={index === 0} onClick={click}>{label}</MenuPrimaryButton>;
            })
        }
        <MenuActionOWButton
            /* tabIndex={-1} */
            style={{ position: "absolute", bottom: 30, right: 35 }}
            data-button="esc"
            onClick={() => {
                pointerlock.capture();
                setShow(false);
            }}
        >BACK</MenuActionOWButton>
    </PauseRoot>;
};

export default GamePause;
