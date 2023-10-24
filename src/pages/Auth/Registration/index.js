import React, { useState, useEffect } from 'react';
import { Button, Input, Modal } from 'antd';
import { useStore, useEvent } from "effector-react";
import { useForm, Controller } from "react-hook-form";

import { $userStore, sendRegistration, setUserEmail } from "../../../store/user";
import { useNavigate } from 'react-router-dom';
import { routes } from "../../../routes";

import st from './index.module.scss';

const Registration = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const $store = useStore($userStore);
  const navigate = useNavigate();
  const { control, handleSubmit, formState: { errors }, setError } = useForm({
    defaultValues: {
      mail: "",
      pass: "",
      repeatPass: ""
    }
  });

  const closeModal = () => {
    setIsModalOpen(false);
    navigate('/' + routes.activation);
  }

  const onSubmit = async (props) => {
    const { mail, pass, repeatPass } = props;

    if(pass !== repeatPass){
      setError('mail', { type: "custom", message: "Пароли не совпадают" });
      return;
    }

    const { data } = await sendRegistration({ mail, pass, repeatPass });

    if(data.error_message){
      setError('mail', { type: "custom", message: data.error_message });
    }else{
      setUserEmail(mail);
      setIsModalOpen(true);
    }
  }

  return (
    <div className={st.content}>
      <form
        className={st.regButtons}
        onSubmit={handleSubmit(onSubmit)}
      >
        <div>{$store.authId}</div>
        <Controller
          name="mail"
          control={control}
          rules={{ required: "Не введена почта" }}
          render={({ field }) =>
            <Input {...field} placeholder="Почта" className={st.regInputMail} type="email" />
          }
        />
        <Controller
          className={st.regInput}
          name="pass"
          control={control}
          rules={{ required: "Не введен пароль" }}
          render={({ field }) =>
            <Input {...field} placeholder="Пароль" className={st.regInput} type="password" />
          }
        />
        <Controller
          className={st.regInput}
          name="repeatPass"
          control={control}
          rules={{ required: "Не введено подтверждение пароля" }}
          render={({ field }) =>
            <Input {...field} placeholder="Повторить пароль" className={st.regInput} type="password" />
          }
        />
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {Object.keys(errors).length > 0 && Object.keys(errors).map(item => (
            <div className={st.regErrorMsg}>{errors[item].message}</div>
          ))}
        </div>
        <Button
          type="primary"
          htmlType="submit"
          className={st.regButton}
        >
          Регистрация
        </Button>
      </form >
      <Modal
        open={isModalOpen}
        onOk={closeModal}
        onCancel={closeModal}
        closable={false}
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
          Вам на почту было отправлено письмо с кодом для активации.
        </div>
      </Modal>
    </div>
  )
}

export default Registration;