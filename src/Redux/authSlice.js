import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { API } from "../Services/Api";

// ================= LOGIN =================
export const loginUser = createAsyncThunk(
  "auth/login",
  async (data, { rejectWithValue }) => {
    try {
      const res = await API.post("/api/auth/signin", data);

      return res?.data?.data?.user || null; 
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Login failed");
    }
  },
);

// ================= REGISTER =================
export const registerUser = createAsyncThunk(
  "auth/register",
  async (data, { rejectWithValue }) => {
    try {
      const res = await API.post("/api/auth/signup", data);

      return res?.data?.data?.user || null;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Register failed");
    }
  },
);

// ================= FORGOT PASSWORD =================
export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async (email, { rejectWithValue }) => {
    try {
      const res = await API.post("/api/auth/forgot-password", { email });
      return res.data.message;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to send reset link",
      );
    }
  },
);

// ================= VERIFY RESET TOKEN =================
export const verifyResetToken = createAsyncThunk(
  "auth/verifyResetToken",
  async ({ id, token }, { rejectWithValue }) => {
    try {
      const res = await API.get(`/api/auth/verify-reset-token/${id}/${token}`);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Invalid or expired link",
      );
    }
  },
);

// ================= RESET PASSWORD =================
export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async ({ id, token, password }, { rejectWithValue }) => {
    try {
      const res = await API.post(`/api/auth/reset-password/${id}/${token}`, {
        password,
      });
      return res.data.message;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Reset failed");
    }
  },
);

// ================= GET ME =================
export const getMe = createAsyncThunk(
  "auth/getMe",
  async (_, { rejectWithValue }) => {
    try {
      const res = await API.get("/api/auth/me");

      return res?.data?.data || null;
    } catch (err) {
      
      if (err.response?.status === 401) return null;

      return rejectWithValue("Failed to fetch user");
    }
  },
);

// ================= SLICE =================

const userFromStorage = localStorage.getItem("user")
  ? JSON.parse(localStorage.getItem("user"))
  : null;

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: userFromStorage,
    loading: true, 
    error: null,
    tokenData: null,
  },

  reducers: {
    logout: (state) => {
      state.user = null;
      state.error = null;
      state.loading = false;
      localStorage.removeItem("user");
    },

    clearError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // ================= LOGIN =================
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;

        if (!action.payload) {
          state.user = null;
          return;
        }

        state.user = {
          ...action.payload,
          _id: action.payload.id,
        };

        localStorage.setItem("user", JSON.stringify(state.user));
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.error = action.payload;
      })

      // ================= REGISTER =================
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload; 
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ================= FORGOT PASSWORD =================
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ================= VERIFY TOKEN =================
      .addCase(verifyResetToken.pending, (state) => {
        state.loading = true;
      })
      .addCase(verifyResetToken.fulfilled, (state, action) => {
        state.loading = false;
        state.tokenData = action.payload; 
      })
      .addCase(verifyResetToken.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ================= RESET PASSWORD =================
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ================= GET ME =================
      .addCase(getMe.pending, (state) => {
        state.loading = true;
      })
      .addCase(getMe.fulfilled, (state, action) => {
        state.loading = false;

        if (!action.payload) {
          state.user = null;
          localStorage.removeItem("user");
          return;
        }

        state.user = {
          ...action.payload,
          _id: action.payload.id,
        };

        localStorage.setItem("user", JSON.stringify(state.user));
      })
      .addCase(getMe.rejected, (state) => {
        state.loading = false;
        state.user = null;
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;



