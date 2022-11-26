import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

import { App } from 'app'

import reportWebVitals from './reportWebVitals'

import 'styles/index.scss'
import 'styles/variables.css'
import 'styles/variables.css'
import 'antd/dist/antd.min.css'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
)

reportWebVitals()
