import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDetectClickOutside } from 'react-detect-click-outside';
import { Button, Dropdown } from "antd";
import { CgProfile } from 'react-icons/cg';
import { GiHamburgerMenu } from 'react-icons/gi';
import { useStore } from "effector-react";

import { $userStore, clearUser } from "../../store/user";
import { $mobileMenu, showedMobuleMenu } from "../../store/ui";

import st from './index.module.scss';

const Header = () => {
  const { authData } = useStore($userStore);
  const mobileMenuState = useStore($mobileMenu);
  const navigate = useNavigate();

  const userLogout = () => {
    clearUser();
    localStorage.removeItem('user');
    navigate('/login');
  }

  const dropdowItems = [
    {
      key: '1',
      label: (
        <Link to="/profile">
          <div className={st.dropdownItem}>
            Профиль
          </div>
        </Link>
      ),
    },
    {
      key: '2',
      label: (
        <div
          onClick={userLogout}
          className={st.dropdownItem}
        >
          Выйти
        </div>
      ),
    },
  ]

  return (
    <div className={st.header}>
      <div
        className={st.headerBurger}
        onClick={() => showedMobuleMenu(!mobileMenuState)}
      >
        <GiHamburgerMenu />
      </div>
      <Link to="/" className={st.logo}>
        <div>Argo</div>
      </Link>
      <div className={st.headerRight}>
        {(authData && authData.id) ?
          <div className={st.profile}>
            <Dropdown
              menu={{ items: dropdowItems }}
            >
              <div className={st.profileAvatar}>
                <CgProfile height={30} width={30} />
              </div>
            </Dropdown>
          </div> :
          <>
            <Link to="/login">
              <Button className={st.login}>Вход</Button>
            </Link>
            <Link to="/registration">
              <Button type="primary">Регистрация</Button>
            </Link>
          </>
        }
      </div>
    </div>
  );
};

export default Header;