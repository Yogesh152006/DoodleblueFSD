
import * as yup from "yup";

export const studentSchema = yup.object({
  fullName: yup
    .string()
    .trim()
    .min(3, "Enter at least 3 characters")
    .required("Full name is required"),

  email: yup
    .string()
    .trim()
    .email("Enter a valid email address")
    .required("Email is required"),

  department: yup
    .string()
    .required("Select a department"),

  year: yup
    .string()
    .required("Select a year of study"),

  cgpa: yup
    .number()
    .typeError("CGPA must be a number")
    .min(0, "Minimum CGPA is 0")
    .max(10, "Maximum CGPA is 10")
    .required("CGPA is required"),
});

export const teacherSchema = yup.object({
  name: yup
    .string()
    .trim()
    .min(3, "Enter at least 3 characters")
    .required("Teacher name is required"),

  email: yup
    .string()
    .trim()
    .email("Enter a valid email address")
    .required("Email is required"),

  department: yup
    .string()
    .required("Select a department"),

  subject: yup
    .string()
    .trim()
    .min(2, "Enter a subject")
    .required("Subject is required"),
});
