import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../store';

export interface ModalPayloadI {
  description?: string;
  title?: string | undefined;
  [key: string]: any;
}

export interface ModalStateI {
  id: string | undefined;
  open?: boolean | undefined;
  payload?: ModalPayloadI | undefined;
  expandModal?: boolean | undefined;
}

const initialState: ModalStateI = {
  id: '',
  open: false,
  payload: {},
  expandModal: false,
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
    expandModal: (state, action: PayloadAction<any>) => {
      state.expandModal = action.payload.expandModal;
    },
  },
});

export const { resetModalState, openModal, closeModal, expandModal } =
  modalSlice.actions;

export const selectModalId = (state: RootState) => state.modal.id;
export const selectModalState = (state: RootState) => state.modal.open;
export const selectModalPayload = (state: RootState) => state.modal.payload;
export const selectExpandModal = (state: RootState) => state.modal.expandModal;

export default modalSlice.reducer;
