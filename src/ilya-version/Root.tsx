import React, { useEffect, useRef } from 'react'

import Stats, { UpdateStatCallback } from '../shared/interface/Stats'
import { setupCanvas } from './canvasSetup'

interface ComponentProps {}

// Why don't we use IDs? https://stackoverflow.com/a/54127836/14982288
// everything should be unique in our app

let Root: React.FC<ComponentProps> = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null!)
    const updateStatCallbackRef = useRef<UpdateStatCallback>(null!)

    useEffect(() => {
        setupCanvas(canvasRef.current, updateStatCallbackRef.current)
        return () => {
            console.log('Canvas unmounted!')
        }
    }, [])

    return (
        <>
            <Stats updateStatCallbackRef={updateStatCallbackRef} />
            <canvas ref={canvasRef} />
        </>
    )
}

export default Root
