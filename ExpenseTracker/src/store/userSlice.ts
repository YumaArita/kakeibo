import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";

interface UserState {
  isLoggedIn: boolean;
  userData: any;
}

const initialState: UserState = {
  isLoggedIn: false,
  userData: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setLogin: (state, action: PayloadAction<any>) => {
      state.isLoggedIn = true;
      state.userData = action.payload;
    },
    setLogout: (state) => {
      state.isLoggedIn = false;
      state.userData = null;
    },
  },
});

export const { setLogin, setLogout } = userSlice.actions;

export const selectUser = (state: RootState) => state.user;

export default userSlice.reducer;
