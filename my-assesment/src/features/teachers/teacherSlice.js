import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../../api";
import { normalizeTeacher, unwrapList } from "../../utils/normalize";

export const fetchTeachers = createAsyncThunk(
  "teachers/fetch",
  async (_, thunkAPI) => {
    try {
      const { data } = await api.get("/teachers");
      return unwrapList(data, "teachers").map(normalizeTeacher);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const addTeacher = createAsyncThunk(
  "teachers/add",
  async (payload, thunkAPI) => {
    try {
      const { data } = await api.post("/teachers", payload);
      return normalizeTeacher(data?.teacher ?? data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const updateTeacher = createAsyncThunk(
  "teachers/update",
  async ({ id, ...payload }, thunkAPI) => {
    try {
      const { data } = await api.put(`/teachers/${id}`, payload);
      return normalizeTeacher(data?.teacher ?? data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const deleteTeacher = createAsyncThunk(
  "teachers/delete",
  async (id, thunkAPI) => {
    try {
      await api.delete(`/teachers/${id}`);
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const slice = createSlice({
  name: "teachers",

  initialState: {
    items: [],
    status: "idle",
    error: null,
  },

  reducers: {
    clearTeacherError: (s) => {
      s.error = null;
    },
  },

  extraReducers: (b) => {
    b.addCase(fetchTeachers.pending, (s) => {
      s.status = "loading";
      s.error = null;
    })

      .addCase(fetchTeachers.fulfilled, (s, a) => {
        s.status = "succeeded";
        s.items = a.payload;
      })

      .addCase(fetchTeachers.rejected, (s, a) => {
        s.status = "failed";
        s.error = a.payload || "Could not load teachers.";
      })

      .addCase(addTeacher.fulfilled, (s, a) => {
        s.items.unshift(a.payload);
        s.error = null;
      })

      .addCase(updateTeacher.fulfilled, (s, a) => {
        const i = s.items.findIndex((x) => x.id === a.payload.id);
        if (i >= 0) s.items[i] = a.payload;
      })

      .addCase(deleteTeacher.fulfilled, (s, a) => {
        s.items = s.items.filter(
          (x) => String(x.id) !== String(a.payload)
        );
      })

      .addMatcher(
        (a) =>
          a.type.startsWith("teachers/") &&
          a.type.endsWith("/rejected"),
        (s, a) => {
          s.error =
            typeof a.payload === "string"
              ? a.payload
              : a.payload?.message || "Teacher operation failed.";
        }
      );
  },
});

export const { clearTeacherError } = slice.actions;

export default slice.reducer;