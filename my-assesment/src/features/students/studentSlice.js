import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../../api";
import { normalizeStudent, unwrapList } from "../../utils/normalize";

export const fetchStudents = createAsyncThunk(
  "students/fetch",
  async (_, thunkAPI) => {
    try {
      const { data } = await api.get("/students");
      return unwrapList(data, "students").map(normalizeStudent);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const addStudent = createAsyncThunk(
  "students/add",
  async (payload, thunkAPI) => {
    try {
      const { data } = await api.post("/students", payload);
      return normalizeStudent(data?.student ?? data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const slice = createSlice({
  name: "students",

  initialState: {
    items: [],
    status: "idle",
    error: null,
  },

  reducers: {
    clearStudentError: (s) => {
      s.error = null;
    },
  },

  extraReducers: (b) => {
    b.addCase(fetchStudents.pending, (s) => {
      s.status = "loading";
      s.error = null;
    })

      .addCase(fetchStudents.fulfilled, (s, a) => {
        s.status = "succeeded";
        s.items = a.payload;
      })

      .addCase(fetchStudents.rejected, (s, a) => {
        s.status = "failed";
        s.error = a.payload || "Could not load students.";
      })

      .addCase(addStudent.fulfilled, (s, a) => {
        s.items.unshift(a.payload);
        s.error = null;
      })

      .addCase(addStudent.rejected, (s, a) => {
        s.error = a.payload || "Could not add student.";
      });
  },
});

export const { clearStudentError } = slice.actions;

export default slice.reducer;