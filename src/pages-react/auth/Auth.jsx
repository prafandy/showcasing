import React from 'react';
import ReactDOM from 'react-dom';
import { useLocation, useNavigate, BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import i18next from '@/utils/i18next';
import url from '@/utils/url';

let AuthData = React.createContext(null);

function AuthProvider({ children }) {
  const fakeAuthProvider = {
    isAuthenticated: false,
    signin(callback) {
      fakeAuthProvider.isAuthenticated = true;
      setTimeout(callback, 100); // fake async
    },
    signout(callback) {
      fakeAuthProvider.isAuthenticated = false;
      setTimeout(callback, 100);
    },
  };

  let [user, setUser] = React.useState(null);

  let signin = (newUser, callback) => {
    return fakeAuthProvider.signin(() => {
      setUser(newUser);
      callback();
    });
  };

  let signout = (callback) => {
    return fakeAuthProvider.signout(() => {
      setUser(null);
      callback();
    });
  };

  return <AuthData.Provider value={{ user, signin, signout }}>
      {children}
    </AuthData.Provider>;
}

function AuthHandler({ children }) {
  let auth = React.useContext(AuthData);
  let location = useLocation();

  return auth.user ? children : <Navigate to={url("/login")} state={{ from: location }} replace />;
}

export {AuthData, AuthProvider, AuthHandler}
