import React, { useEffect } from 'react';
import { Button, Modal, Input } from "antd";
import { useForm, Controller } from "react-hook-form";

import { changeUserFx } from "../../store/adminUsers";

import st from "./index.module.scss";

const LoginAsUserModal = ({
  loginAsUserIsOpen,
  setLoginAsUserIsOpen,
  selectedUser,
  notificationApi
}) => {
  const { control, handleSubmit, formState: { errors }, setError, reset } = useForm({
    defaultValues: {
      mail: ""
    }
  });

  // useEffect(() => {
  //   const data = {};
  //
  //   columns.forEach(({ name }) => data[name] = selectedUser[name])
  //   reset(data)
  // }, [selectedUser])

  const onSubmit = async (props) => {
    const { data } = await changeUserFx({ props, id: selectedUser.id });

    // if(data.error_msg){
    //   notificationApi.error({ message: data.error_message, duration: 5 });
    // }else{
    //   notificationApi.success({ message: 'Данные пользователя успешно обновлены', duration: 5 });
    // }
  }

  return (
    <Modal
      title="Войти как пользователь"
      open={loginAsUserIsOpen}
      onCancel={() => setLoginAsUserIsOpen(false)}
      footer={null}
    >
      <form
        className={st.modalForm}
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className={st.modalItem}>
          <div className={st.modalItem}>
            <div>Почтовый ящик работника</div>
            <div className={st.inputError}>{errors["mail"] && errors["mail"].message}</div>
            <Controller
              name={"mail"}
              control={control}
              rules={{ required: "Не введен почтовый ящик"}}
              render={({ field }) =>
                <Input status={errors["mail"] ? 'error' : ''} {...field} />
              }
            />
          </div>
        </div>
        <div className={st.modalFooter}>
          <Button
            onClick={() => setLoginAsUserIsOpen(false)}
          >
            Отменить
          </Button>
          <Button
            type="primary"
            htmlType="submit"
          >
            Переход
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default LoginAsUserModal;