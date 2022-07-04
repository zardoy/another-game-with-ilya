import React, { Suspense } from 'react'

// const Backdrop: React.FC = () => <MUIBackdrop
//     open={true}
//     // sx={{ zIndex: theme => theme.zIndex.drawer + 1 }}
//     className={css`
//         z-index: ${zIndex.drawer + 1} !important;
//     `}
// >
//     <CircularProgress color="inherit" />
// </MUIBackdrop>;

let GameVersion: React.FC<{ unloadModule?: () => unknown }> = ({ children, unloadModule = () => {} }) => {
    return <Suspense fallback={null}>{children}</Suspense>
}

export default GameVersion
