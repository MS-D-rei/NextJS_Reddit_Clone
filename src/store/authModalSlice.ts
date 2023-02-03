import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type AuthModalViewType = 'login' | 'signup' | 'resetPassword';

export interface AuthModalState {
  isOpen: boolean;
  view: AuthModalViewType;
}

const initialState: AuthModalState = {
  isOpen: false,
  view: 'login',
};

export const authModalSlice = createSlice({
  name: 'authModal',
  initialState,
  reducers: {
    openModal: (state, actions: PayloadAction<AuthModalViewType>) => {
      state.isOpen = true;
      state.view = actions.payload;
    },
    closeModal: (state) => {
      state.isOpen = false;
    },
  },
});

// Action creators are generated for each case reducer function
export const { openModal, closeModal } = authModalSlice.actions;

export default authModalSlice.reducer;
