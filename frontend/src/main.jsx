import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

// Force redeploy after Vercel infrastructure issues - Dec 17 2024 - Search icon and Profile fixes
// Version: 1.0.2 - Auth improvements and SearchSeccion icon integration
