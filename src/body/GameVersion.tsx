import React, { Suspense } from 'react'

import { css } from '@emotion/css'
import { Backdrop as MUIBackdrop, CircularProgress } from '@mui/material'
import { zIndex } from '@mui/material/styles'

const Backdrop: React.FC = () => (
    <MUIBackdrop
        open={true}
        // sx={{ zIndex: theme => theme.zIndex.drawer + 1 }}
        className={css`
            z-index: ${zIndex.drawer + 1} !important;
        `}
    >
        <CircularProgress color="inherit" />
    </MUIBackdrop>
)

let GameVersion: React.FC<{ unloadModule?: () => unknown }> = ({ children, unloadModule = () => {} }) => {
    return <Suspense fallback={<Backdrop />}>{children}</Suspense>
}

export default GameVersion
