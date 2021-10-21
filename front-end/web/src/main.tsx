import React from 'react'
import ReactDOM from 'react-dom'
import { App } from './App'
import { AuthProvider } from './context/auth'

import './styles/global.css'

//AuthProvider: contexto contendo as informações de login de usuario
ReactDOM.render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>,
  document.getElementById('root')
)
