import { createEvent, createStore } from "effector";

export const $mobileMenu = createStore(null);
export const showedMobuleMenu = createEvent();

$mobileMenu.on(showedMobuleMenu, (state, data) => data)

export const $changeUserModal = createStore(null);
export const showedChangeUserModal = createEvent();

$changeUserModal.on(showedChangeUserModal, (state, data) => data)