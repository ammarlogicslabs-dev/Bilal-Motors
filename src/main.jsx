import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { DataStoreProvider } from './context/DataStore'
import '@fontsource/lato/300.css' // Light
import '@fontsource/lato/400.css' // Regular (Default)
import '@fontsource/lato/700.css' // Bold
import '@fontsource/lato/900.css' // Black

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <DataStoreProvider>
        <App />
      </DataStoreProvider>
    </BrowserRouter>
  </StrictMode>,
)
