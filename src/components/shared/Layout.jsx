// Layout.js
import React from 'react';
import { Outlet } from 'react-router-dom';

const Layout = ({ children }) => {
  return (
    <>
      <header>
        <h1>Header</h1>
      </header>
      <main>{children}</main>
      <footer>
        <p>Footer</p>
      </footer>
      <div><Outlet/></div>
    </>
  );
}

export default Layout;
