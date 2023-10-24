import { createStore, createEvent, createEffect, forward } from "effector";
import api, { urls } from '../shared/api';
import { $userStore } from "./user";

export const $userList = createStore([]);

export const setUserList = createEvent();
export const addToUserList = createEvent();
export const sendForgotPassword = createEvent();
export const changeUser = createEvent();

export const getUserListFx = createEffect(async (session) => {
  const res = await api.get(`${urls.adminUsersList}&s=${session}`);
  return res;
});

export const createNewUserFx = createEffect(async (props) => {
  const s = $userStore.getState().authData.id
  const { mail, psw, psw1 } = props;

  const res = await api.get(`${urls.newAdminUser}&s=${s}&mail=${mail}&psw=${psw}&psw1=${psw1}`);
  return res;
})

export const sendForgotPasswordFx = createEffect(async ({ s, mail }) => {
  const res = await api.get(`${urls.adminForgotPassword}&s=${s}&mail=${mail}`);
  return res;
});

export const changeUserFx = createEffect(async ({ props, id }) => {
  const s = $userStore.getState().authData.id

  const formData = new FormData();
  formData.append('module', 'admin');
  formData.append('action', 'user_edit');
  formData.append('s', s);
  formData.append('uid', id);
  formData.append('data ', JSON.stringify(props));

  const res = await api.post("", formData);
  return res;
})


$userList.on(setUserList, (store, { result }) => {
  return result.data.list;
})

$userList.on(addToUserList, (store, { params, result }) => {
  const { data } = result;
  if(!data.error_msg){
    return [...store, ...data];
  }
})

$userList.on(changeUser, (store, { params, result }) => {
  const { id, props } = params;

  return store.map(item => item.id === id ? {...item, ...props} : item)
})


forward({
  from: getUserListFx.done,
  to: setUserList
})

forward({
  from: createNewUserFx.done,
  to: addToUserList
})

forward({
  from: changeUserFx.done,
  to: changeUser
})