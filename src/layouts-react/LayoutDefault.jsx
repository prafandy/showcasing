import React from 'react';
import { Outlet, Link } from 'react-router-dom';

import i18next from '@/utils/i18next';
import url from '@/utils/url';

export default function LayoutDefault({ children }) {
  return (
    <div className="flex flex-column height-100">
      <div className="flex">
        <div className="padding-y-12 border-bottom border-primary border-width-2" style={{ width: '238px' }}>
          <a href={url("/")} className="a a-nocolor flex flex-items-center flex-justify-center">
            <img alt="Technoart logo" src={ require('@/assets/logo.png') } className="width-28px" />
            <span className="margin-left-8 text-primary">Technoart</span>
          </a>
        </div>
        <div className="padding-y-12 padding-x-28 bg-primary text-white grow-1 flex flex-items-center">
          <div className="fw-700 margin-right-auto">Homepage</div>
          <Link className="a a-nocolor margin-left-16" to={url("/")}>Home</Link>
          <Link className="a a-nocolor margin-left-16" to={url("/user")}>User list</Link>
          <Link className="a a-nocolor margin-left-16" to={url("/user/create")}>User form</Link>
          <Link className="a a-nocolor margin-left-16" to={url("/login")}>Login</Link>
        </div>
      </div>

      <div className="hidden flex padding-y-15 padding-x-20 bg-primary">
        <a className="text-lightest margin-right-4">☰</a>
        <span>
          Technoart Homepage
        </span>
        <a className="a-nocolor" href="/">
          <img alt="Technoart logo" src={ require('@/assets/logo.png') } className="width-32px margin-top-4" />
        </a>
      </div>

      <div className="grow-1 flex bg-lightest">
        <div className="border-right border-light border-width-2" style={{ width: '240px' }} />
        <div className="grow-1 padding-24">
          {children ? children : <Outlet />}
        </div>
      </div>
    </div>
  );
}
