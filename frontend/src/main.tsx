import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './tailwind.css';

import Login from '@/auth/Login/Login';
import SignUp from '@/auth/SignUp/SignUp';
import Layout from '@/Main/Layout/Layout';

import Homepage from '@/Main/Pages/Homepage/Homepage';

import SearchResults from '@/Main/SearchResults/SearchResults';

import UserSettings from '@/Main/user/UserSettings/UserSettings';
import UserProfile from '@/Main/user/UserProfile/UserProfile';

import Community from '@/Main/Community/Community';
import CreateCommunity from '@/Main/Community/components/CreateCommunity/CreateCommunity';

import ModTools from '@/Main/Community/components/ModTools/ModTools';
import ModMail from '@/Main/Community/components/ModTools/components/ModMail/ModMail';
import CommunitySettings from '@/Main/Community/components/ModTools/components/CommunitySettings/CommunitySettings';
import CommunityFlairSettings from '@/Main/Community/components/ModTools/components/CommunitySettings/components/CommunityFlairSettings';

import Post from '@/Main/Post/Post';
import CreatePost from '@/Main/CreatePost/CreatePost';

import ScreenSizeProvider from '@/context/screen/ScreenSizeProvider';
import AuthProvider from '@/context/auth/AuthProvider';
import RecentCommunitiesProvider from '@/Sidebar/components/RecentCommunities/context/RecentCommunitiesProvider';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ScreenSizeProvider>
          <RecentCommunitiesProvider>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/sign-up" element={<SignUp />} />

              {/* MOD */}
              <Route path="r/:communityName/mod/" element={<ModTools />}>
                <Route path="modmail" element={<ModMail />} />

                <Route path="settings" element={<CommunitySettings />} />

                <Route
                  path="settings/post-flair"
                  element={<CommunityFlairSettings flairType="post" />}
                />

                <Route
                  path="settings/user-flair"
                  element={<CommunityFlairSettings flairType="user" />}
                />
              </Route>

              <Route path="/" element={<Layout />}>
                <Route index element={<Homepage />} />

                {/* SEARCHING */}
                <Route path="/search/*" element={<SearchResults />} />

                {/* USER */}
                <Route path="user/settings" element={<UserSettings />} />
                <Route path="user/:username" element={<UserProfile />} />

                {/* COMMUNITY */}
                <Route path="r/:communityName" element={<Community />} />

                {/* POST */}
                <Route path="r/:communityName/:postId" element={<Post />} />
                <Route path="r/:communityName/:postId/:postName?" element={<Post />} />
                <Route
                  path="r/:communityName/:postId/:postName?/:parentCommentId"
                  element={<Post />}
                />
                <Route
                  path="r/:communityName/:postId/:postName?/:editCommentId"
                  element={<Post />}
                />

                {/* CREATION */}
                <Route path="/create-community" element={<CreateCommunity />} />

                <Route path="/create" element={<CreatePost />} />
                <Route path="/create/r/:communityName" element={<CreatePost />} />
              </Route>
            </Routes>
          </RecentCommunitiesProvider>

          <ToastContainer theme="dark" position="bottom-right" />
        </ScreenSizeProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
