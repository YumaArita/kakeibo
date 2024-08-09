import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface GroupState {
  selectedGroupId: string | null;
  selectedDate: string;
}

const initialState: GroupState = {
  selectedGroupId: null,
  selectedDate: new Date().toISOString(),
};

const groupSlice = createSlice({
  name: "group",
  initialState,
  reducers: {
    setSelectedGroup(state, action: PayloadAction<string | null>) {
      state.selectedGroupId = action.payload;
    },
    setSelectedDate(state, action: PayloadAction<string>) {
      state.selectedDate = action.payload;
    },
  },
});

export const { setSelectedGroup, setSelectedDate } = groupSlice.actions;

export default groupSlice.reducer;
