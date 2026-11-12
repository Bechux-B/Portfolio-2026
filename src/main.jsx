import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import PortfolioPage from './Graphic_Design.jsx'

const currentPath = window.location.pathname.replace(/\/+$/, '') || '/'
const Page = currentPath === '/portfolio' ? PortfolioPage : App

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Page />
  </StrictMode>,
)
