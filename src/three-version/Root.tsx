import React, { Suspense } from 'react'

import Canvas from './Canvas'

interface ComponentProps {}

let Root: React.FC<ComponentProps> = () => {
    return (
        <Suspense fallback={null}>
            <Canvas />
        </Suspense>
    )
}

export default Root
