import React, { useState, useEffect } from 'react';
import { Button, Input } from 'antd';
import { useStore } from "effector-react";
import { Link, useNavigate } from 'react-router-dom';
import { useForm, Controller } from "react-hook-form";

import {
  $userStore,
  login,
  setUserEmail,
  setSession,
  savingSession
} from "../../../store/user";

import st from './index.module.scss';

const Login = () => {
  const navigate = useNavigate();
  const { control, handleSubmit, formState: { errors }, setError } = useForm({
    defaultValues: {
      account: "",
      psw: "",
    }
  });

  const onSubmit = async (props) => {
    const { account, psw } = props;

    const { data } = await login({ account, psw });

    if(data.error_msg === "user_not_activated"){
      setUserEmail(account);
      navigate('/activation');
    }else if(data.error_message){
      setError('account', { type: "custom", message: data.error_message });
    }else{
      savingSession(data);
      setSession(data);
      navigate('/profile');
    }
  }

  return (
    <div className={st.content}>
      <form
        className={st.regButtons}
        onSubmit={handleSubmit(onSubmit)}
      >
        <Controller
          name="account"
          control={control}
          rules={{ required: "Не введена почта" }}
          render={({ field }) =>
            <Input {...field} placeholder="Почта" className={st.regInputMail} type="email" />
          }
        />
        <Controller
          className={st.regInput}
          name="psw"
          control={control}
          rules={{ required: "Не введен пароль" }}
          render={({ field }) =>
            <Input {...field} placeholder="Пароль" className={st.regInput} type="password" />
          }
        />
        {Object.keys(errors).length > 0 && Object.keys(errors).map(item => (
          <div className={st.regErrorMsg}>{errors[item].message}</div>
        ))}
        <Link
          className={st.smallRegButton}
          to="/forgot"
        >
          Забыли пароль?
        </Link>
        <Button
          type="primary"
          htmlType="submit"
          className={st.regButton}
        >
          Вход в аккаунт
        </Button>
      </form >
    </div>
  )
}

export default Login;