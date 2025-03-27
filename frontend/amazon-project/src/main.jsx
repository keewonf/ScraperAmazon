import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css';
import SearchPage from './App'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SearchPage />
  </StrictMode>,
)
