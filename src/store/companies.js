import { createStore, createEvent, createEffect, combine } from "effector";
import api, { urls } from '../shared/api';
import { $userStore } from "./user";

export const $companiesStore = createStore({
  list: []
});

const changeCompanies = createEvent();
const editCompany = createEvent();
const addCompany = createEvent();

export const getCompanies = createEffect(async () => {
  const { authData } = $userStore.getState();
  const res = await api.get(`${urls.enterprisesList}&s=${authData.id}`);
  return res;
});

export const createOrEditCompany = createEffect(async (props) => {
  const { authData } = $userStore.getState();
  const { id } = props;

  const copyProps = JSON.parse(JSON.stringify(props));
  delete copyProps.id;

  const formData = new FormData();
  formData.append('module', 'company');
  formData.append('action', 'edit');
  formData.append('s', authData.id);
  formData.append('data', JSON.stringify(copyProps));
  id && formData.append('company_id', id);

  const res = await api.post('', formData);

  // company_id ? editCompany(props) : addCompany(props)

  return res;
})

getCompanies.done.watch(({ params, result }) => {
  changeCompanies(result.data.list)
});

createOrEditCompany.done.watch(({ params, result }) => {
  params.id ? editCompany(params) : addCompany(params)
})

$companiesStore.on(changeCompanies, (state, data) => {
  return {
    ...state,
    list: data
  }
})

$companiesStore.on(editCompany, (state, data) => {
  const newList = state.list.map((item) => {
    if(data.id == item.id){
      return { ...item, ...data };
    }
    return item
  })

  return {
    ...state,
    list: newList
  }
})

$companiesStore.on(addCompany, (state, data) => {
  const newList = state.list.concat(data);

  return {
    ...state,
    list: newList
  }
})