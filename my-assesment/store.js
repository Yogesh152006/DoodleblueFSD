import { configureStore } from "@reduxjs/toolkit";
import studentsReducer from "./src/features/students/studentSlice";
import teachersReducer from "./src/features/teachers/teacherSlice";

export const store = configureStore({
  reducer: { students: studentsReducer, teachers: teachersReducer }
});
