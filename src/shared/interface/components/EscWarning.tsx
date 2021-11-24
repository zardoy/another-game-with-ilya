import React from 'react'

import { Slide, Snackbar } from '@mui/material'
import { Alert } from '@mui/material'

type ComponentProps = Pick<React.ComponentProps<typeof Snackbar>, 'onClose' | 'open'>

function TransitionDown(props: any) {
    return <Slide {...props} direction="down" />
}

// WRAPPER AROUND SNACKBAR!!! WITH!!!!!

let EscWarning: React.FC<ComponentProps> = ({ ...snackbarProps }) => {
    return (
        <Snackbar
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'center',
            }}
            TransitionComponent={TransitionDown}
            autoHideDuration={3000}
            {...snackbarProps}
        >
            <Alert severity="warning">Don't use ESC Key here. It doesn't work properly due browsers internal bug.</Alert>
        </Snackbar>
    )
}

export default EscWarning
