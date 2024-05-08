// src/utils/redux/features/modal/modalSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ModalState {
  isOpen: boolean;
  modalType: string | null; // e.g. 'AddPlaylistModal', 'AddSongModal', etc.
}

const initialState: ModalState = {
  isOpen: false,
  modalType: null,
};

const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    openModal(state, action: PayloadAction<string>) {
      state.isOpen = true;
      state.modalType = action.payload;
    },
    closeModal(state) {
      state.isOpen = false;
      state.modalType = null;
    },
  },
});

export const { openModal, closeModal } = modalSlice.actions;
export default modalSlice.reducer;

