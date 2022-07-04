// INTEGRATIONS WITH USER INPUT (KEYBOARD MOUSE ETC)

import { pointerlock, touchSupported } from './util'

import type { Vector2 } from 'contro/dist/utils/math'

interface Config {
    rotateCamera: (delta: Vector2) => unknown
}

export const initCameraControl = (container: HTMLElement, { rotateCamera }: Config) => {
    if (touchSupported) {
        // CAMERA ROTATION
        let ongoingTouch: {
            id: number
            last: Record<'x' | 'y', number>
        } | null = null
        container.addEventListener('pointerdown', ({ pointerId, clientX, clientY }) => {
            // TODO: NOT ALWAYS CAPTURING WITH MOVEMENT!
            if (ongoingTouch) return
            // ensure that pointer is captured
            container.setPointerCapture(pointerId)
            ongoingTouch = {
                id: pointerId,
                last: { x: clientX, y: clientY },
            }
        })
        container.addEventListener('pointermove', ({ pointerId, clientX, clientY }) => {
            if (!ongoingTouch || ongoingTouch.id !== pointerId) return // should throw err?
            const { last } = ongoingTouch
            const delta = { x: clientX - last.x, y: clientY - last.y }
            ongoingTouch.last = {
                x: clientX,
                y: clientY,
            }
            rotateCamera(delta)
        })
        container.addEventListener('lostpointercapture', e => {
            if (ongoingTouch && ongoingTouch.id !== e.pointerId) return
            ongoingTouch = null
        })
    } else {
        // merge with pointer lock?
        document.addEventListener('mousemove', event => {
            if (!document.pointerLockElement) return
            const { movementX: deltaX, movementY: deltaY } = event
            rotateCamera({ x: deltaX, y: deltaY })
        })
    }

    container.addEventListener('click', () => {
        pointerlock.capture()
    })
}
