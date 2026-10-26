import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

import App from './App.jsx'

import StudentManagementPage from './pages/StudentManagementPage.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <StudentManagementPage/>

  </StrictMode>,
)
