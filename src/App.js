import React, { useEffect } from 'react';
import { useStoreMap } from "effector-react";

import { Helmet } from 'react-helmet';
import { Route, Routes, Navigate } from 'react-router-dom';
import { setSession, $userStore, getUser } from "./store/user";

import PageLayout from './layouts/PageLayout';
import AuthLayout from "./layouts/AuthLayout";
import Header from './layouts/Header';

import Login from './pages/Auth/Login';
import Forgot from './pages/Auth/Forgot';
import Activation from './pages/Auth/Activation'
import Registration from './pages/Auth/Registration';
import Profile from './pages/Profile';
import Companies from './pages/Companies';
import Users from './pages/Users';

import './shared/styles/App.scss';

export const routes = {
  registration: 'registration',
  login: 'login',
  forgot: 'forgot',
  activation: 'activation',

  profile: 'profile',
  companies: 'companies',
  users: 'users'
}

function App() {
  const user = localStorage.getItem('user') && setSession(JSON.parse(localStorage.getItem('user')));
  const userId = useStoreMap($userStore, (store) => store.authData.id);

  return (
    <>
      <Helmet titleTemplate="Agro" defaultTitle="Agro">
        <meta name="description" content="Agro" />
      </Helmet>
      <div className="page">
        <Header />
        <Routes>
          {userId ?
            <Route path="/" element={<PageLayout />}>
              <Route path="/companies" element={<Companies />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/users" element={<Users />} />
              {['/', '*'].map(path => <Route path={path} key={path} element={<Navigate to='/companies' />} />)}
            </Route> :
            <Route path="/" element={<AuthLayout />}>
              <Route path="/login" element={<Login />} />
              <Route path="/registration" element={<Registration />} />
              <Route path="/forgot" element={<Forgot />} />
              <Route path="/activation" element={<Activation />} />
              {['/', '*'].map(path => <Route path={path} key={path} element={<Navigate to='/login' />} />)}
            </Route>
          }
        </Routes>
      </div>
    </>
  );
}

export default App;
