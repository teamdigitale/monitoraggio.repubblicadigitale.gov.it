// import { Dispatch } from '@reduxjs/toolkit';
// import { closeModal, ModalStateI, openModal } from './modalSlice';

// const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

// export const NewModal = (payload?: ModalStateI) => async (dispatch: Dispatch) => {
//     const modal = payload;

//     if (modal?.open) {
//       dispatch(openModal(modal));
//       if (!modal?.open) {
//         await delay(3000);
//         dispatch(closeModal());
//       }
//     }
//   };
