import React from 'react';
import { Outlet } from 'react-router-dom';


export default function LayoutBlank({ children }) {
  return children ? children : <Outlet />;
}
