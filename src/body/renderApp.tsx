// MAIN ENTRYPOINT

import './pageInit'

import React from 'react'

import ReactDOM from 'react-dom'

import GlobalStyles from './GlobalStyles'

// WORKAROUND
// try to not import theme to avoid overhead

export const renderApp = (ChildrenComponent: React.FC) => {
    ReactDOM.render(
        <>
            <GlobalStyles />
            <ChildrenComponent />
        </>,
        document.getElementById('root'),
    )
}
