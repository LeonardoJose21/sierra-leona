import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Analytics } from "@vercel/analytics/react";
import Clarity from '@microsoft/clarity';
import './index.css'
import App from './App.jsx'


Clarity.init('yr649kg1mm');

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    <Analytics />
  </StrictMode>,
)
