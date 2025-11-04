import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import { storage } from './utils/storage'

// Hacemos disponible "window.storage" para compatibilidad
;(window as any).storage = storage

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
