import React, { useState, useEffect } from 'react';
import { Button, Input, Modal } from 'antd';
import { useStore } from "effector-react";
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from "react-hook-form";

import { $userStore, sendRestorePass } from "../../../store/user";

import st from './index.module.scss';

const Forgot = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const closeModal = () => {
    setIsModalOpen(false);
    navigate('/login');
  }

  const { control, handleSubmit, formState: { errors }, setError } = useForm({
    defaultValues: {
      mail: "",
    }
  });

  const onSubmit = async (props) => {
    const { mail } = props;

    const { data } = await sendRestorePass({ mail });

    if(data.error_message){
      setError('mail', { type: "custom", message: data.error_message });
    }else{
      setIsModalOpen(true);
    }
  }

  return (
    <div className={st.content}>
      <form
        className={st.regButtons}
        onSubmit={handleSubmit(onSubmit)}
      >
        <Controller
          name="mail"
          control={control}
          rules={{ required: "Не введена почта" }}
          render={({ field }) =>
            <Input {...field} placeholder={'Почта'} className={st.regInputMail} type="email" />
          }
        />
        {Object.keys(errors).length > 0 && Object.keys(errors).map(item => (
          <div className={st.regErrorMsg}>{errors[item].message}</div>
        ))}
        <Button
          type="primary"
          htmlType="submit"
          className={st.regButton}
        >
          Восстановить пароль
        </Button>
      </form >
      <Modal
        open={isModalOpen}
        onOk={closeModal}
        onCancel={closeModal}
        footer={[
          <Button
            onClick={closeModal}
            type="primary"
          >
            Ok
          </Button>
        ]}
      >
        <div className={st.modal}>
          На вашу почту отправлен новый пароль, авторизуйтесь с ним
        </div>
      </Modal>
    </div>
  )
}

export default Forgot;