import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface GroupState {
  selectedGroupId: string | null;
}

const initialState: GroupState = {
  selectedGroupId: null,
};

const groupSlice = createSlice({
  name: "group",
  initialState,
  reducers: {
    setSelectedGroup: (state, action: PayloadAction<string | null>) => {
      state.selectedGroupId = action.payload;
    },
  },
});

export const { setSelectedGroup } = groupSlice.actions;
export default groupSlice.reducer;
