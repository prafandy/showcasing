import React from 'react';
import { useNavigate } from 'react-router-dom';

import i18next from '@/utils/i18next';
import url from '@/utils/url';

import { AuthData, AuthProvider, AuthChecker } from '@/pages-react/auth/Auth';

export default function AuthInfo() {
  let auth = React.useContext(AuthData);
  let navigate = useNavigate();

  return auth.user ?
    (
      <div>
        <div>Welcome {auth.user}!</div>
        <button onClick={() => {
              auth.signout(() => navigate("/"));
            }}>
          Sign out
        </button>
      </div>
    ) :
    <div>You are not logged in.</div>;
}