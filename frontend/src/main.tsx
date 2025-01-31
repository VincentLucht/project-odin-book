import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './tailwind.css';

import Login from '@/auth/Login/Login';
import SignUp from '@/auth/SignUp/SignUp';
import Layout from '@/Main/Layout/Layout';

import Main from '@/Main/Main';
import UserSettings from '@/Main/user/UserSettings/UserSettings';
import UserProfile from '@/Main/user/UserProfile/UserProfile';

import ScreenSizeProvider from '@/context/screen/ScreenSizeProvider';
import AuthProvider from '@/context/auth/AuthProvider';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ScreenSizeProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/sign-up" element={<SignUp />} />

            <Route path="/" element={<Layout />}>
              <Route index element={<Main />} />
              <Route path="user/settings" element={<UserSettings />} />
              <Route path="user/:username" element={<UserProfile />} />
            </Route>
          </Routes>

          <ToastContainer theme="dark" className="mt-12" />
        </ScreenSizeProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
