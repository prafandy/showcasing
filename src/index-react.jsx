import React from 'react';
import ReactDOM from 'react-dom';
import { useLocation, useNavigate, useParams, BrowserRouter, Outlet, Routes, Route, Navigate } from 'react-router-dom';

import i18next from '@/utils/i18next';
import url from '@/utils/url';

import LayoutBlank from '@/layouts-react/LayoutBlank';
import LayoutDefault from '@/layouts-react/LayoutDefault';
import { AuthData, AuthProvider, AuthHandler } from '@/pages-react/auth/Auth';
import AuthLogin from '@/pages-react/auth/AuthLogin';
import AuthInfo from '@/pages-react/auth/AuthInfo';
import UserList from '@/pages-react/user/UserList';
import UserForm from '@/pages-react/user/UserForm';

import '@/app.scss';

const LangHandler = () => {
  let params = useParams();
  return i18next.options.supportedLngs.includes(params.lang) ?
    <Outlet /> : <Navigate to={`/${i18next.options.fallbackLng}`} replace />;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/:lang" element={<LangHandler />}>
            <Route index
              element={
                <LayoutDefault>
                  <AuthInfo />
                </LayoutDefault>
              } />

            <Route path="user"
                element={
                  <AuthHandler>
                    <LayoutDefault />
                  </AuthHandler>
                }>
              <Route index element={<UserList />} />
              <Route path="create" element={<UserForm />} />
              <Route path="update" element={<Navigate to={url('/user/create')} replace />} />
            </Route>

            <Route path="login"
              element={
                <LayoutBlank>
                  <AuthLogin />
                </LayoutBlank>
              } />
          </Route>

          <Route path="*" element={<Navigate to={`/${i18next.options.fallbackLng}`} replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

ReactDOM.render(<App />, document.getElementById('app'));
