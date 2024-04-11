import React from 'react';
import { Outlet } from 'react-router-dom';

const Layout = ({ children }) => {
  return (
    <>
      <div className='flex flex-row bg-neutral-100 h-screen w-screen overflow-hidden'>
        <div className='bg-purple-200 w-[190px]'>
          <h1>Sidebar</h1>
        </div>
        <div className='p-4'>
          <div className='bg-violet-400'>
            <p>Header</p>
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