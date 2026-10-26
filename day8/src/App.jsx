import { useState } from 'react'


import "./App.css";

function App() {
  const students = [
    {
      id: 1,
      name: "Arun Kumar",
      course: "B.Tech",
      department: "Computer Science",
      address: "Chennai, Tamil Nadu",
    },
    {
      id: 2,
      name: "Priya Sharma",
      course: "B.Sc",
      department: "Information Technology",
      address: "Coimbatore, Tamil Nadu",
    },
    {
      id: 3,
      name: "Rahul Raj",
      course: "BCA",
      department: "Computer Applications",
      address: "Bengaluru, Karnataka",
    },
    {
      id: 4,
      name: "Sneha Devi",
      course: "B.Com",
      department: "Commerce",
      address: "Madurai, Tamil Nadu",
    },
    {
      id: 5,
      name: "Vijay Kumar",
      course: "B.E.",
      department: "Electronics",
      address: "Salem, Tamil Nadu",
    },
  ];

  return (
    <div className="app">
      <h1>Student Details</h1>

      <div className="student-grid">
        {students.map((student) => (
          <div className="student-card" key={student.id}>
            <h2>{student.name}</h2>

            <p>
              <strong>Course:</strong> {student.course}
            </p>

            <p>
              <strong>Department:</strong> {student.department}
            </p>

            <p>
              <strong>Address:</strong> {student.address}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
