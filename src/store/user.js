import {
  createStore,
  createEvent,
  createEffect,
  forward
} from "effector";
import api, { urls } from '../shared/api';
import axios from 'axios';

export const $userStore = createStore({
  mail: null,
  authData: {
    uid: null,
    expires: null,
    status: null,
    id: null
  },
  user: {
    patronymic: null,
    deleted: null,
    image: null,
    blocked: null,
    id: null,
    title: null,
    login: null,
    name: null,
    theme: null,
    surname: null,
    hello_page: null
  },
  isFetchedOk: false
});

export const setSession = createEvent();
export const savingSession = createEvent();
export const setUserEmail = createEvent();
export const regLogout = createEvent();
export const setUser = createEvent();
export const clearUser = createEvent();
const changeUser = createEvent();

export const login = createEffect(async (params) => {
  const { account, psw } = params;

  const res = await api.get(`${urls.login}&account=${account}&psw=${psw}`);
  return res;
});

export const sendRegistration = createEffect(async (params) => {
  const { mail, pass, repeatPass } = params;

  const res = await api.get(`${urls.registration}&mail=${mail}&psw=${pass}&psw1=${repeatPass}`);
  return res;
})

export const sendRestorePass = createEffect(async (params) => {
  const { mail } = params;

  const res = await api.get(`${urls.sendRestoreRequest}&mail=${mail}`);
  return res;
})

export const sendActivation = createEffect(async (params) => {
  const { mail, code } = params;

  const res = await api.get(`${urls.activation}&mail=${mail}&code=${code}`);
  return res;
})

export const getUser = createEffect(async (params) => {
  let res = {};
  try{
    const { id, uid } = JSON.parse(localStorage.getItem('user'));
    res = await api.get(`${urls.userData}&s=${id}&uid=${uid}`);
  }catch (e){
    console.log(e)
  }
  return res;
})

export const changeUserFx = createEffect(async (props) => {
  const sessionId = $userStore.getState().authData.id;
  const formData = new FormData();
  formData.append('module', 'user');
  formData.append('action', 'edit');
  formData.append('s', sessionId);
  formData.append('data', JSON.stringify(props));

  const res = await api.post('', formData)
  return res;
})

getUser.done.watch(({ params, result }) => {
  const { data } = result;
  if(data.error_msg == "required_auth"){
    clearUser();
    localStorage.removeItem('user');
    window.history.forward('/login');
    // regLogout();
  }else{
    setUser(data);
  }
});

changeUserFx.done.watch(({ params, result }) => {
  changeUser(params);
})

savingSession.watch((authData) => {
  localStorage.setItem('user', JSON.stringify(authData));
})


$userStore.on(setSession, (state, authData) => ({
  ...state,
  authData
}))

$userStore.on(setUserEmail, (state, mail) => ({
  ...state,
  mail,
}))

$userStore.on(changeUser, (state, props) => {
  return {
    ...state,
    user: {
      ...state.user,
      ...props
    }
  }

})

$userStore.on(setUser, (state, data) => ({
  ...state,
  user: data.user,
  isFetchedOk: true
}));

$userStore.on(regLogout, (state, data) => ({
  ...state,
  isFetchedOk: false
}));

$userStore.reset(clearUser);