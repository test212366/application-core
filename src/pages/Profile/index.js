import React, { useEffect } from 'react';
import { useForm, Controller } from "react-hook-form";
import { Button, Input, Divider, notification } from 'antd';
import { $userStore, changeUserFx } from "../../store/user";
import { useStore } from "effector-react";

import st from './index.module.scss';

const items = [
  {title: 'Имя', value: 'name', rules: { required: "Не введено имя" }},
  {title: 'Фамилия', value: 'surname', rules: { required: "Не введена фамилия" }},
  {title: 'Отчество', value: 'patronymic', rules: { required: "Не введено отчество" }},
  {title: 'Телефон', value: 'phone', rules: { required: "Не введен номер телефона" }},
]

const Profile = () => {
  const [api, contextHolder] = notification.useNotification();
  const { user } = useStore($userStore);
  const { control, handleSubmit, formState: { errors }, setError, reset } = useForm({
    defaultValues: {
      phone: user.phone,
      name: user.name,
      patronymic: user.patronymic,
      surname: user.surname
    }
  });

  useEffect(() => {
    const data = {};

    items.forEach(({ value }) => data[value] = user[value])
    reset(data)
  }, [user])

  const onSubmit = async (props) => {
    const { phone, name, patronymic, surname, mail } = props;

    const data = await changeUserFx(props);

    if(data.error_message){
      setError('mail', { type: "custom", message: data.error_message });
    }else{
      api.success({ message: 'Данные успешно обновлены', duration: 0 });
    }
  }

  return (
    <div>
      <div className={st.pageTitle}>Настройки профиля</div>
      <Divider />
      <form
        className={st.profile}
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className={st.left}></div>
        <div className={st.rigth}>
          <div>Контактная информация</div>
          <Divider />
          <div className={st.userItems}>
            {items.map(({ title, value, rules }) => (
              <div className={st.inputContainer} key={value}>
                <div className={st.userItemTitle}>{title}</div>
                <Controller
                  name={value}
                  control={control}
                  rules={rules}
                  render={({ field }) =>
                    <div>
                      <div className={st.inputError}>{errors[value] && errors[value].message}</div>
                      <Input
                        {...field}
                        placeholder={title}
                        className={st.regInputMail}
                        status={errors[value] ? 'error' : ''}
                      />
                    </div>
                  }
                />
              </div>
            ))}
          </div>
          <Divider />
          <Button
            type="primary"
            htmlType="submit"
            style={{ width: 100, marginLeft: 'auto' }}
          >
            Сохранить
          </Button>
        </div>
      </form>
      {contextHolder}
    </div>
  );
};

export default Profile;