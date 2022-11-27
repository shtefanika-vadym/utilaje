import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'

import { App } from 'app'
import { store } from 'store/store'

import reportWebVitals from './reportWebVitals'

import 'styles/index.scss'
import 'styles/variables.css'
import 'styles/variables.css'
import 'antd/dist/antd.min.css'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
  <BrowserRouter>
    <Provider store={store}>
      <App />
    </Provider>
  </BrowserRouter>,
)

reportWebVitals()
