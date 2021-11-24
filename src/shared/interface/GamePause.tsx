import React, { useEffect, useState } from 'react'

import useTypedEventListener from 'use-typed-event-listener'

import { useReactiveVar } from '@apollo/client'
import { css } from '@emotion/css'
import styled from '@emotion/styled'

import { deviceInfoVar, userLocationVar } from '../globalState'
import { entries, pointerlock } from '../util'
import EscWarning from './components/EscWarning'
import { buttonStyles, fullScreenFixedStyles } from './components/styles'

type ButtonAction = `open-ui-${'settings'}`

export type PauseSchema = {
    buttons: {
        label: string
        click?: (event: React.MouseEvent<HTMLElement>) => unknown | ButtonAction
        closePause?: boolean
    }[]
}

interface ComponentProps {
    schema: PauseSchema
}

const MenuPrimaryButton = styled.button`
    ${buttonStyles}
    width: 300px;
    padding: 8px;
    margin: 3px;
    font-size: 1.2rem;
    font-weight: 500;
    background: rgba(0, 0, 0, 0.6);

    &:hover {
        background: rgba(0, 0, 0, 0.7);
    }
`

const RightCornerInfo: React.FC = () => {
    const deviceInfo = useReactiveVar(deviceInfoVar)

    return (
        <div
            style={{
                position: 'fixed',
                top: 0,
                right: 0,
                padding: 5,
            }}
        >
            {!deviceInfo
                ? 'Loading device info'
                : entries(deviceInfo).map(([property, value]) => (
                      <span key={property}>
                          {property.toUpperCase()}: {value}
                      </span>
                  ))}
        </div>
    )
}

let GamePause: React.FC<ComponentProps> = ({ schema }) => {
    const userLocation = useReactiveVar(userLocationVar)

    // use reducer
    const [show, setShow] = useState(false)
    const [showEscWarning, setShowEscWarning] = useState(false)

    useEffect(() => {
        userLocationVar(show ? 'pauseRoot' : 'playing')
        if (!show) setShowEscWarning(false)
    }, [show])

    useTypedEventListener(window, 'keydown', e => {
        if (e.code !== 'Escape') return
        if (show) setShowEscWarning(true)
        if (!show && userLocation === 'playing') setShow(true)
    })

    useEffect(() => {
        const onPointerlockExit = () => setShow(true)
        pointerlock.onRelease.push(onPointerlockExit)

        return () => {
            pointerlock.removeListener('onRelease', onPointerlockExit)
        }
    }, [])

    return (
        <>
            <EscWarning open={showEscWarning} onClose={() => setShowEscWarning(false)} />

            {!show ? null : (
                <div
                    className={css`
                        ${fullScreenFixedStyles}
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
                    `}
                >
                    <RightCornerInfo />
                    {/* <GameTitle>{import.meta.env.SNOWPACK_PUBLIC_NAME}</GameTitle> */}
                    {schema.buttons.map(({ label, click = () => {}, closePause = false }, index) => {
                        return (
                            <MenuPrimaryButton key={label} autoFocus={index === 0} onClick={e => (click(e), closePause && setShow(false))}>
                                {label}
                            </MenuPrimaryButton>
                        )
                    })}
                    {/* <MenuActionOWButton
            style={{ position: "absolute", bottom: 30, right: 35 }}
            data-button="esc"
            onClick={() => {
                pointerlock.capture();
                setShow(false);
            }}
        >BACK</MenuActionOWButton> */}
                </div>
            )}
        </>
    )
}

export default GamePause
