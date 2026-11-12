import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import PortfolioPage from './Graphic_Design.jsx'

const basePath = import.meta.env.BASE_URL.replace(/\/$/, '')
const appPath = window.location.pathname.startsWith(basePath)
  ? window.location.pathname.slice(basePath.length)
  : window.location.pathname
const currentPath = appPath.replace(/\/+$/, '') || '/'
const Page = currentPath === '/portfolio' ? PortfolioPage : App

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Page />
  </StrictMode>,
)
