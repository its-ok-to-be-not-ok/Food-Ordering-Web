import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "@/types/user";


interface AuthState {
  user: User | null;
  access: string | null;
  refresh: string | null;
  permissions: string | null; 
}

const initialState: AuthState = {
  user: null,
  access: null,
  refresh: null,
  permissions: null, 
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(state, action: PayloadAction<{ user: User; access: string; refresh: string; permissions?: string }>) {
      state.user = action.payload.user;
      state.access = action.payload.access;
      state.refresh = action.payload.refresh;
      state.permissions = action.payload.permissions ?? null; 
    },
    setUser(state, action: PayloadAction<User | null>) {
      state.user = action.payload;
    },
    logout(state) {
      state.user = null;
      state.access = null;
      state.refresh = null;
      state.permissions = null; 
    },
  },
});

export const { setUser, logout, login } = authSlice.actions;

export default authSlice.reducer;
