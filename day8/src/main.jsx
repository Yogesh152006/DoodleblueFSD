import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'


import App from './App.jsx'

import StudentManagementPage from './pages/StudentManagementPage.jsx'
import SearchStudents from './pages/SearchStudents.jsx'
import Form from './pages/Form.jsx'

import StudentExplorer from './pages/Debounce.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <StudentExplorer/>

  </StrictMode>,
)
