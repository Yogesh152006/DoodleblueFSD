# Campus Directory Management System

A modern, high-performance **Campus Directory Management System** built with **React.js**, **Vite**, **React Router DOM**, **Native Fetch API**, and **JSON Server**.

This system manages student enrollments, faculty profiles, department metrics, and course allocations with real-time dynamic statistics and full CRUD (Create, Read, Update, Delete) capabilities.

---

## Architecture

```
React Components (Pages & Modals)
       │
       ▼
React Hooks (useState, useEffect, useMemo, useNavigate, useLocation)
       │
       ▼
API Service Layer (api.js)
       │
       ▼
Native JavaScript Fetch API (async / await / try / catch / finally)
       │
       ▼
JSON Server REST Endpoints (http://localhost:3000)
       │
       ▼
Persistent Storage (db.json)
```

---

## Technology Stack

### Frontend
- **React.js (v18.3.1)**: Component-driven architecture using functional components and hooks.
- **Vite (v5.4.11)**: Ultra-fast module bundling and local dev server.
- **React Router DOM (v6.28.0)**: Client-side routing with automatic redirect fallback.
- **Vanilla CSS3**: Modern variables, responsive Flexbox/Grid layouts, clean animations.
- **Native JavaScript Fetch API**: Pure HTTP communication with custom error wrapping.

### Backend
- **JSON Server (v0.17.4)**: Full RESTful backend server running on port `3000`.
- **db.json**: Single source of truth for persistent student and teacher records.

### Strict Compliance
- **NO Axios**: Pure Native `fetch()` used exclusively.
- **NO localStorage / sessionStorage**: JSON Server is the sole persistence store.
- **NO External Database / Flask / MySQL / MongoDB**: 100% JSON Server REST API.
- **NO Redux / Redux Toolkit**: Pure React State Hooks (`useState`, `useEffect`).

---

## Directory Structure

```
campus-directory/
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx         # App header with branding & server status
│   │   │   ├── Sidebar.jsx        # Navigation sidebar with active highlighting
│   │   │   ├── Footer.jsx         # Application footer
│   │   │   ├── StatCard.jsx       # Reusable analytics summary card
│   │   │   ├── StudentForm.jsx    # Modal form for Student Create & Edit with validation
│   │   │   ├── TeacherForm.jsx    # Modal form for Teacher Create & Edit with validation
│   │   │   ├── ConfirmDialog.jsx  # Reusable deletion confirmation dialog
│   │   │   ├── Loading.jsx        # Accessible loading spinner & indicators
│   │   │   └── Icons.jsx          # SVG icon library
│   │   │
│   │   ├── pages/
│   │   │   ├── HomePage.jsx       # Dashboard with 4 StatCards, distribution & recents
│   │   │   ├── StudentsPage.jsx   # Student table, search, filters, full CRUD, view profile
│   │   │   └── TeachersPage.jsx   # Faculty table, search, filters, full CRUD, view profile
│   │   │
│   │   ├── services/
│   │   │   └── api.js             # Centralized Fetch API client for students & teachers
│   │   │
│   │   ├── styles/
│   │   │   ├── global.css         # Theme variables, base reset & utility classes
│   │   │   ├── App.css            # Layout container, breadcrumbs & notifications
│   │   │   ├── Header.css         # Top navbar styling
│   │   │   ├── Sidebar.css        # Sidebar menu & responsive drawer
│   │   │   ├── Dashboard.css      # Analytics grid, progress distribution & recents
│   │   │   ├── Students.css       # Tables, badges, search bar, profile viewer
│   │   │   ├── Teachers.css       # Teacher-specific tags, experience badges
│   │   │   └── Components.css     # Modals, inputs, form errors, loading spinners
│   │   │
│   │   ├── App.jsx                # Application shell with React Router setup
│   │   ├── main.jsx               # React entry point
│   │   ├── index.html             # Vite root HTML template
│   │   └── vite.config.js         # Vite configuration
│   │
│   └── package.json               # Frontend dependencies & scripts
│
├── backend/
│   ├── db.json                    # Persistent JSON database (students & teachers)
│   └── package.json               # Backend dependencies & server script
│
└── README.md                      # Complete system documentation
```

---

## REST Endpoints

JSON Server hosts endpoints on `http://localhost:3000`:

| Resource | HTTP Method | Endpoint | Description |
|---|---|---|---|
| **Students** | `GET` | `/students` | Retrieve all student records |
| | `GET` | `/students/:id` | Retrieve student by ID |
| | `POST` | `/students` | Create a new student |
| | `PUT` | `/students/:id` | Update an existing student |
| | `DELETE` | `/students/:id` | Remove a student record |
| **Teachers** | `GET` | `/teachers` | Retrieve all teacher records |
| | `GET` | `/teachers/:id` | Retrieve teacher by ID |
| | `POST` | `/teachers` | Create a new teacher |
| | `PUT` | `/teachers/:id` | Update an existing teacher |
| | `DELETE` | `/teachers/:id` | Remove a teacher record |

---

## Form Fields & Validation

### Student Fields
- **Student ID**: Automatically generated unique format (`STU-XXXX`).
- **Full Name**: Required (minimum 2 characters, trimmed).
- **Email**: Required (standard RFC email format validation).
- **Phone Number**: Required (7–15 digits format).
- **Gender**: Required (`Male`, `Female`, `Other`).
- **Date of Birth**: Required (valid date picker).
- **Department**: Required (select from academic departments).
- **Course**: Required (e.g. `B.Tech Computer Science`, `MBA`).
- **Year of Study**: Required (`1st Year`, `2nd Year`, `3rd Year`, `4th Year`).
- **Address**: Required (trimmed address).

### Teacher Fields
- **Teacher ID**: Automatically generated unique format (`TCH-XXXX`).
- **Full Name**: Required (minimum 2 characters, trimmed).
- **Email**: Required (standard email format validation).
- **Phone Number**: Required (7–15 digits format).
- **Gender**: Required (`Male`, `Female`, `Other`).
- **Department**: Required.
- **Subject**: Required (specialization / subject).
- **Qualification**: Required (e.g. `M.Tech, Ph.D.`).
- **Experience**: Required (non-negative numeric integer in years).
- **Address**: Required.

---

## Getting Started

### 1. Start the Backend (Terminal 1)

```bash
cd campus-directory/backend
npm install
npm run server
```

The backend API will run at **`http://localhost:3000`**.

### 2. Start the Frontend (Terminal 2)

```bash
cd campus-directory/frontend
npm install
npm run dev
```

The frontend application will run at **`http://localhost:5173`**.

---

## Verification & Features

1. **Dashboard (`/`)**:
   - Dynamic real-time calculation of Total Students, Total Teachers, Total Departments, and Total Courses.
   - Student department distribution with dynamic percentage bars.
   - Recently added students & teachers with direct navigation.
   - Quick action buttons to launch Add Student and Add Teacher modals directly.
   - Server health status indicator.

2. **Students Management (`/students`)**:
   - Table view with avatars, badges, and full contact details.
   - Search by name, ID, email, or course.
   - Filter by department and year of study.
   - Full student profile detail modal with all 10 fields.
   - Add new student with validation and unique ID generation.
   - Edit existing student with pre-filled form and `PUT` request.
   - Delete student with confirmation dialog and `DELETE` request.

3. **Teachers Management (`/teachers`)**:
   - Faculty table with department, qualification, subject, and experience tags.
   - Search and filter by department.
   - Full faculty profile modal.
   - Add faculty member with experience validation.
   - Edit faculty record.
   - Delete faculty record with confirmation dialog.

4. **Persistence & Refresh**:
   - Data persists across browser refreshes because JSON Server writes changes immediately into `db.json`.

