import React from 'react';
import { Controller, useForm } from "react-hook-form";
import { Button, Input } from "antd";
import { useNavigate } from "react-router-dom";
import queryString from 'query-string';

import { useStore } from "effector-react";
import { $userStore, sendActivation } from "../../../store/user";

import st from "./index.module.scss";

const Activation = () => {
  const $store = useStore($userStore);
  const query = queryString.parse(window.location.search);
  const navigate = useNavigate();

  const queryCode = query.code || "";
  const queryMail = query.mail ? query.mail : $store.mail;

  const { control, handleSubmit, formState: { errors }, setError } = useForm({
    defaultValues: {
      code: queryCode
    }
  });

  const onSubmit = async (props) => {
    const { code } = props;

    const { data } = await sendActivation({ mail: queryMail, code });

    if(data.error_message){
      setError('code', { type: "custom", message: data.error_message });
    }else{
      navigate('/login');
    }
  }

  return (
    <div className={st.content}>
      <form
        className={st.regButtons}
        onSubmit={handleSubmit(onSubmit)}
      >
        <Controller
          name="code"
          control={control}
          rules={{ required: "Не введен код активации" }}
          render={({ field }) =>
            <Input
              {...field}
              placeholder="Код активации"
              className={st.regInputMail}
            />
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
          Активировать аккаунт
        </Button>
      </form >
    </div>
  );
};

export default Activation;