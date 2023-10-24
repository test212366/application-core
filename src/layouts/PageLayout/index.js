import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Menu, Layout } from "antd";
import cx from 'classnames';
import { useStore } from "effector-react";

import { getUser, $userStore } from "../../store/user";
import { $mobileMenu, showedMobuleMenu } from "../../store/ui";

import st from './index.module.scss';

const menuItems = [
  { label: "Предприятия", key: '/companies' },
  { label: "Пользователи", key: '/users' },
]

const User = () => {
  const mobileMenuState = useStore($mobileMenu);
  const { isFetchedOk } = useStore($userStore);
  const navigate = useNavigate();
  const { matches } = window.matchMedia('(max-width: 768px)');

  React.useEffect(() => {
    getUser();
  }, []);

  if(!isFetchedOk){
    return null;
  }

  return (
    <div className={st.layout}>
      <div
        className={cx(st.sider, mobileMenuState && st.siderOpen)}
        theme="light"
        width={256}
      >
        <Menu
          onClick={() => {
            matches && showedMobuleMenu(!mobileMenuState)
          }}
          onSelect={({ key }) => {
            navigate(key)
          }}
          style={{ width: 256, borderRadius: 8 }}
          defaultSelectedKeys={[window.location.pathname]}
          mode="vertical"
          items={menuItems}
        />
      </div>
      <div className={st.content}>
        <Outlet />
      </div>
      {matches &&
        <div
          className={cx(st.backdrop, mobileMenuState && st.backdropOpen)}
          onClick={() => showedMobuleMenu(!mobileMenuState)}
        />
      }
    </div>
  );
};

export default User;