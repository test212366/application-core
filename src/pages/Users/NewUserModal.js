import React from 'react';
import { Button, Modal, Input } from "antd";
import { useForm, Controller } from "react-hook-form";

import st from "./index.module.scss";
import { createNewUserFx } from "../../store/adminUsers";

const items = [
  {
    label: 'Почта',
    name: 'mail',
    type: 'email',
    rules: { required: 'Не указана почта' }
  },
  {
    label: 'Пароль',
    name: 'psw',
    type: 'password',
    rules: { required: 'Не указан пароль' }
  },
  {
    label: 'Повторить пароль',
    name: 'psw1',
    type: 'password',
    rules: { required: 'Не указан повторный пароль' }
  }
]

const NewUserModal = ({
  newUserIsOpen,
  setNewUserIsOpen,
  notificationApi
}) => {
  const { control, handleSubmit, formState: { errors }, setError } = useForm({
    defaultValues: {
      mail: "",
      psw: "",
      psw1: ""
    }
  });

  const onSubmit = async (props) => {
    const { mail, psw, psw1 } = props;

    if(psw !== psw1){
      setError('psw', { type: "custom", message: "Пароли не совпадают" });
      setError('psw1', { type: "custom", message: "Пароли не совпадают" });
      return;
    }

    const { data } = await createNewUserFx({ mail, psw, psw1 });

    if(data.error_msg){
      notificationApi.error({ message: data.error_message, duration: 5 });
    }else{
      notificationApi.success({ message: 'Пользователь успешно создан', duration: 5 });
    }
  }

  return (
    <Modal
      title="Регистрация нового пользователя"
      open={newUserIsOpen}
      onCancel={() => setNewUserIsOpen(false)}
      footer={null}
    >
      <form
        className={st.modalForm}
        onSubmit={handleSubmit(onSubmit)}
      >
        {items.map(({ name, label, type, rules }) => (
          <div
            className={st.modalItem}
            key={name}
          >
            <div>{ label }</div>
            <div className={st.inputError}>{errors[name] && errors[name].message}</div>
            <Controller
              name={name}
              control={control}
              rules={rules}
              render={({ field }) =>
                <Input
                  status={errors[name] ? 'error' : ''}
                  type={type}
                  {...field}
                />
              }
            />
          </div>
        ))}
        <div className={st.modalFooter}>
          <Button
            onClick={() => setNewUserIsOpen(false)}
          >
            Отменить
          </Button>
          <Button
            type="primary"
            htmlType="submit"
          >
            Сохранить
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default NewUserModal;