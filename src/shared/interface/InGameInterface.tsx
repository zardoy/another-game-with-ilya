import React from 'react'

import { useReactiveVar } from '@apollo/client'

import { userLocationVar } from '../globalState'
import GamePause from './GamePause'
import { pauseSchema } from './pauseSchema'
import { touchMovement } from './Root'
import TouchControls from './TouchControls'

interface ComponentProps {}

let InGameInterface: React.FC<ComponentProps> = () => {
    const userLocation = useReactiveVar(userLocationVar)

    return userLocation === 'mainMenu' ? null : (
        <>
            <TouchControls
                updateTouchMoving={({ x, y, z }) => {
                    touchMovement.x = x
                    touchMovement.y = y
                    touchMovement.z = z
                }}
            />

            <GamePause schema={pauseSchema} />
        </>
    )
}

export default InGameInterface
