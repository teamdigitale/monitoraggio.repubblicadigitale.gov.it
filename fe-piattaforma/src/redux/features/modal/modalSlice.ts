import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../store';

export interface ModalPayloadI {
  description?: string;
  title?: string;
  [key: string]: any;
}

export interface ModalStateI {
  id: string;
  open?: boolean | undefined;
  payload?: ModalPayloadI;
}

const initialState: ModalStateI = {
  id: '',
  open: false,
  payload: {},
};

export const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    resetModalState: () => initialState,
    openModal: (state, action: PayloadAction<ModalStateI>) => {
      if (action.payload.id) {
        state.id = action.payload.id;
        state.open = true;
        state.payload = action.payload.payload || {};
      }
    },
    closeModal: () => initialState,
  },
});

export const { resetModalState, openModal, closeModal } = modalSlice.actions;

export const selectModalId = (state: RootState) => state.modal.id;
export const selectModalPayload = (state: RootState) => state.modal.payload;

export default modalSlice.reducer;
