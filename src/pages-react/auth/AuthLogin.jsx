import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import i18next from '@/utils/i18next';
import url from '@/utils/url';

import { AuthData, AuthProvider, AuthChecker } from '@/pages-react/auth/Auth';

export default function AuthLogin() {
  let navigate = useNavigate();
  let location = useLocation();
  let auth = React.useContext(AuthData);

  let from = location.state && location.state.from && location.state.from.pathname || "/";

  function handleSubmit(event) {
    event.preventDefault();

    let formData = new FormData(event.currentTarget);
    let username = formData.get("username");

    auth.signin(username, () => {
      navigate(from, { replace: true });
    });
  }

  return (
    <div className="height-100 flex flex-items-center flex-justify-center bg-lighter">
      <div className="padding-24 rounded border shadow bg-white" style={{ width: '400px' }}>
        <form onSubmit={handleSubmit}>
          <div className={`margin-bottom-24
                ${false && Object.values(data.validationStates.email).includes(false) ? 'has-error' : ''}
              `}>
            <label className="form-label">Username</label>
            <input name="username" type="text"
              className="form-text" onBlur={e => null}
              onChange={e => {
                return;
                const newValue = e.target.value;
                setData((prevData) => (prevData.user.email = newValue, { ...prevData }))
              }}
            />
          </div>
          <div className="margin-bottom-24">
            <button className="button button-primary"
                type="submit"
                disabled={false && !canSubmit()}
                onClick={null && submit}>
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}