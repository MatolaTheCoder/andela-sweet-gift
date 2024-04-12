import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const Layout = ({ children }) => {
  return (
    <>
      <div className='flex flex-row bg-neutral-100 h-screen w-screen overflow-hidden'>
        <Sidebar/>
        <div className='p-4'>
          <div >
            <Header/>
          </div>
          <div><Outlet/></div>
          <div className='bg-gray-400'>
            Footer
          </div>
        </div>
      </div> 
    </>
    
  );
}

export default Layout;