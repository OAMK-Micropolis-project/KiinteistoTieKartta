import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { KiinteistoProvider } from './context/KiinteistoProvider.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <KiinteistoProvider>
      <App />
    </KiinteistoProvider>
  </StrictMode>,
)
