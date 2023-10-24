import React, { useEffect, useState } from 'react';
import { useStore } from "effector-react";
import {
  Menu,
  Layout,
  Input,
  Button,
  Divider,
  Modal,
  Table,
  Dropdown,
  notification
} from "antd";
import { IoEllipsisHorizontal } from 'react-icons/io5'

import { $userStore } from "../../store/user";

import st from './index.module.scss';

import {
  getUserListFx,
  sendForgotPasswordFx,
  $userList
} from "../../store/adminUsers";
import NewUserModal from './NewUserModal';
import ChangeUsersModal from "./ChangeUsersModal";
import LoginAsUserModal from "./LoginAsUserModal";

const User = () => {
  const [newUserIsOpen, setNewUserIsOpen] = useState(false);
  const [changeUserIsOpen, setChangeUserIsOpen] = useState(false);
  const [loginAsUserIsOpen, setLoginAsUserIsOpen] = useState(false);

  const [selectedUser, setSelectedUser] = useState(null)
  const [notificationApi, contextHolder] = notification.useNotification();

  const { user, authData, isFetchedOk } = useStore($userStore);
  const userList = useStore($userList);

  const findSelectedUser = (id) => {
    return userList.find(user => user.id == id)
  }

  const sendForgotPassword = async () => {
    const { data } = await sendForgotPasswordFx({ s: authData.id, mail: selectedUser.mail });

    if(data.error_msg){
      notificationApi.error({ message: data.error_message, duration: 5 });
    }else{
      notificationApi.success({ message: `Запрос на восстановление пароля ${selectedUser.mail} успешно отправлен`, duration: 5 });
    }
  }

  useEffect(() => {
    isFetchedOk && getUserListFx(authData.id)
  }, [isFetchedOk]);

  const dropdowItems = [
    {
      key: '1',
      label: (
        <div
          className={st.dropdownItem}
          onClick={() => {
            setChangeUserIsOpen(!changeUserIsOpen)
          }}
        >
          Редактировать страницу пользователя
        </div>
      ),
    },
    {
      key: '2',
      label: (
        <div
          className={st.dropdownItem}
          onClick={() => {
            setLoginAsUserIsOpen(!loginAsUserIsOpen)
          }}
        >
          Войти как пользователь
        </div>
      ),
    },
    {
      key: '3',
      label: (
        <div
          className={st.dropdownItem}
          onClick={sendForgotPassword}
        >
          Восстановить пароль пользователю
        </div>
      ),
    },
  ]

  const columns = [
    {
      title: 'Логин',
      dataIndex: 'login',
      key: 'login',
    },
    {
      title: 'Email',
      dataIndex: 'mail',
      key: 'mail',
    },
    {
      title: 'Создан',
      dataIndex: 'created',
      key: 'created',
    },
    {
      title: '',
      dataIndex: '',
      render: (row) => {
        return (
          <Dropdown
            menu={{ items: dropdowItems }}
            trigger="click"
            onOpenChange={() => {
              setSelectedUser(findSelectedUser(row.id))
            }}
          >
            <Button>
              <div className={st.profileAvatar}>
                <IoEllipsisHorizontal height={30} width={30} />
              </div>
            </Button>
          </Dropdown>
        )
      }
    }
  ]

  return (
    <div>
      <div className={st.header}>
        <div className={st.pageTitle}>
          Пользователи
        </div>
        <Button
          className={st.headerNewUser}
          onClick={() => setNewUserIsOpen(true)}
        >
          Зарегистрировать нового пользователя
        </Button>
      </div>
      <Divider />
      <Table
        dataSource={userList}
        columns={columns}
        pagination={{
          defaultPageSize: 20
        }}
        scroll={{ x: true }}
      />
      <NewUserModal
        newUserIsOpen={newUserIsOpen}
        setNewUserIsOpen={setNewUserIsOpen}
        notificationApi={notificationApi}
      />
      {selectedUser &&
        <ChangeUsersModal
          changeUserIsOpen={changeUserIsOpen}
          setChangeUserIsOpen={setChangeUserIsOpen}
          selectedUser={selectedUser}
          notificationApi={notificationApi}
        />
      }
      <LoginAsUserModal
        loginAsUserIsOpen={loginAsUserIsOpen}
        setLoginAsUserIsOpen={setLoginAsUserIsOpen}
      />
      {contextHolder}
    </div>
  );
};

export default User;