import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type AuthModalViewType = 'login' | 'signup' | 'resetPassword'

export interface AuthModalState {
  isOpen: boolean;
  view?: AuthModalViewType;
}

const initialState: AuthModalState = {
  isOpen: false,
};

export const authModalSlice = createSlice({
  name: 'authModal',
  initialState,
  reducers: {
    open: (state, actions: PayloadAction<AuthModalViewType>) => {
      state.isOpen = true
      state.view = actions.payload
    },
  },
});

// Action creators are generated for each case reducer function
export const { open } = authModalSlice.actions;

export default authModalSlice.reducer;
