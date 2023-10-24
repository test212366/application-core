import React, { useEffect } from 'react';
import { Button, Modal, Input } from "antd";
import { useForm, Controller } from "react-hook-form";

import { changeUserFx } from "../../store/adminUsers";

import st from "./index.module.scss";

const columns = [
  {
    title: 'Фамилия',
    name: 'surname',
    rules: { required: 'Не указана фамилия' }
  },
  {
    title: 'Имя',
    name: 'name',
    rules: { required: 'Не указано имя' }
  },
  {
    title: 'Отцество',
    name: 'patronymic',
    rules: { required: 'Не указано отцество' }
  },
  {
    title: 'Номер телефона',
    name: 'phone',
    rules: { required: 'Не указан номер телефона' }
  },
  {
    title: 'Почта',
    name: 'mail',
    rules: { required: 'Не указана почта' }
  },
];

const defaultValues = {}

columns.forEach(({ name }) => defaultValues[name] = "")

const NewUserModal = ({
  changeUserIsOpen,
  setChangeUserIsOpen,
  selectedUser,
  notificationApi
}) => {
  const { control, handleSubmit, formState: { errors }, setError, reset } = useForm({
    defaultValues
  });

  useEffect(() => {
    const data = {};

    columns.forEach(({ name }) => data[name] = selectedUser[name])
    reset(data)
  }, [selectedUser])

  const onSubmit = async (props) => {
    const { data } = await changeUserFx({ props, id: selectedUser.id });

    if(data.error_msg){
      notificationApi.error({ message: data.error_message, duration: 5 });
    }else{
      notificationApi.success({ message: 'Данные пользователя успешно обновлены', duration: 5 });
    }
  }

  return (
    <Modal
      title="Редактирование пользователя"
      open={changeUserIsOpen}
      onCancel={() => setChangeUserIsOpen(false)}
      footer={null}
    >
      <form
        className={st.modalForm}
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className={st.modalItem}>
          {columns.map(({ title, name, rules }) => (
            <div
              key={name}
              className={st.modalItem}
            >
              <div>{title}</div>
              <div className={st.inputError}>{errors[name] && errors[name].message}</div>
              <Controller
                name={name}
                control={control}
                rules={rules}
                render={({ field }) =>
                  <Input status={errors[name] ? 'error' : ''} {...field} />
                }
              />
            </div>
          ))}
        </div>
        <div className={st.modalFooter}>
          <Button
            onClick={() => setChangeUserIsOpen(false)}
          >
            Отменить
          </Button>
          <Button
            type="primary"
            htmlType="submit"
          >
            Сохранить данные
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default NewUserModal;