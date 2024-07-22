import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  user: { username: string } | null;
  token: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<{ username: string }>) => {
      state.user = action.payload;
      // console.log(state.user);
    },
    setToken: (state, action: PayloadAction<string>) => {
      // console.log("token" + action.payload);
      state.token = action.payload;
    },
    clearAuth: (state) => {
      state.user = null;
      state.token = null;
    },
  },
});

const { actions, reducer } = authSlice; 

export const { setUser, setToken, clearAuth } = actions;

export default reducer;
