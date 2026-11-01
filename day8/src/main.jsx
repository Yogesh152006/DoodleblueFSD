// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'


// import App from './App.jsx'

// import StudentManagementPage from './pages/StudentManagementPage.jsx'
// import SearchStudents from './pages/SearchStudents.jsx'
// import Form from './pages/Form.jsx'

// import StudentExplorer from './pages/Debounce.jsx'


// import StudentForm1 from './components/common/StudentForm1.jsx'

// createRoot(document.getElementById('root')).render(
//   <StrictMode>
//     <StudentForm1/>

//   </StrictMode>,
// )



import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import App from './App';

ReactDOM.createRoot(
  document.getElementById('root')
).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
