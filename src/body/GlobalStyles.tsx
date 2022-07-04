import React from 'react'

import { Global } from '@emotion/react'

interface ComponentProps {}

let GlobalStyles: React.FC<ComponentProps> = () => {
    return (
        <>
            <Global
                styles={{
                    'html, #root': {
                        height: '100vh',
                    },
                    html: {
                        overflow: 'hidden',
                        userSelect: 'none',
                        // TODO: restore where necessary
                        WebkitTouchCallout: 'none',
                        touchAction: 'none',
                    },
                    body: {
                        overflow: 'hidden',
                        margin: 0,
                    },
                    canvas: {
                        position: 'fixed',
                        left: 0,
                        top: 0,
                        overflow: 'hidden',
                        width: '100%',
                        height: '100vh',
                    },
                }}
            />
        </>
    )
}

export default GlobalStyles
