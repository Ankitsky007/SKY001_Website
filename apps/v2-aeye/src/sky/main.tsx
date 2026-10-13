import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../index.css'
import './sky.css'
import SkyApp from './SkyApp.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SkyApp />
  </StrictMode>,
)
