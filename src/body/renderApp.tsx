// MAIN ENTRYPOINT

import './pageInit'

import React from 'react'

import ReactDOM from 'react-dom'

import Interface from '../shared/interface/Root'
import GlobalStyles from './GlobalStyles'

// WORKAROUND
// try to not import theme to avoid overhead

export const renderApp = (ChildrenComponent: React.FC) => {
    ReactDOM.render(
        <>
            <Interface unloadModule={() => {}} />

            <GlobalStyles />
            <ChildrenComponent />
        </>,
        document.getElementById('root'),
    )
}
