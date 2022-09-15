// import { ModalStateI } from '../redux/features/modal/modalSlice';
// import { NewModal } from '../redux/features/modal/modalThunk';
// import store from '../redux/store';

// // export const dispatchModal = (payload?: ModalStateI) => {
//   store.dispatch(NewModal(payload) as any);
// };

export const getModalContent = (id: string) => {
  switch (id) {
    case 'genericModal':
      return {
        title: 'Titolo della modale',
        bodyText: 'Il testo del corpo della modale va qui.',
        buttonClose: 'Chiudi',
        buttonSave: 'Salva le modifiche',
      };
    default:
      return {
        title: 'Test modale',
        bodyText: 'Testo di prova della modale.',
      };
  }
};
