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

import Post from '@/Main/Post/Post';

import Create from '@/Main/Create/Create';

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

              {/* USER */}
              <Route path="user/settings" element={<UserSettings />} />
              <Route path="user/:username" element={<UserProfile />} />

              {/* POST */}
              <Route path="r/:communityName/:postId/:postName?" element={<Post />} />
              <Route
                path="r/:communityName/:postId/:postName?/:parentCommentId"
                element={<Post />}
              />

              {/* CREATION */}
              <Route path="/create" element={<Create />} />
            </Route>
          </Routes>

          <ToastContainer theme="dark" position="bottom-right" />
        </ScreenSizeProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
