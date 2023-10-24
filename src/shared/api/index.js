import axios from 'axios';
import { $userStore, setSession } from "../../store/user";

const baseURL = 'http://api.xn----7sbegmlg5bets.xn--p1ai/api/';

const instance = axios.create({
  baseURL,
});

const defaultUrls = {
  registration: 'module=auth&action=user_add',
  login: 'module=auth&action=login',
  sendRestoreRequest: 'module=auth&action=send_psw_to_mail',
  setNewPassword: 'module=auth&action=set_new_password',
  activation: 'module=auth&action=activate_user',

  userData: 'module=auth&action=user_info',

  enterprisesList: 'module=company&action=list',
  enterprisesCreateOrEdit: 'module=company&action=edit',

  adminUsersList: 'module=user&action=list',
  adminForgotPassword: 'module=admin&action=send_psw_to_mail',
  newAdminUser: 'module=admin&action=user_add&group=5',
  changeAdminUser: 'module=admin&action=user_edit'
}

const urls = {};

const setUrls = () => {
  Object.keys(defaultUrls).forEach(item => {
    let newStr = baseURL + '?' + defaultUrls[item];

    urls[item] = newStr;
  });
}

setUrls();

export { urls };

export default instance;