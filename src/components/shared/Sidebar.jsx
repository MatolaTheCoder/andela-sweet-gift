import React from 'react'
import { FcBarChart} from "react-icons/fc";
import { HiOutlineLogout } from 'react-icons/hi';
import { DASHBOARD_SIDEBAR_BOTTOM_LINKS, DASHBOARD_SIDEBAR_LINKS } from '../../lib/constants';
import { Link, useLocation } from 'react-router-dom';

export default function Sidebar() {
  return (
    <div>
      <div className='bg-purple-900 w-[190px] p-4 h-screen flex flex-col'>
            <div className='flex  items-center gap-2 py-3'><FcBarChart fontSize={24}/>
                <span className='text-gray-400 text-lg font-bold'>Andela</span>
            </div>
            <div className='flex-1 py-8 flex flex-col gap-0.5'>
                {DASHBOARD_SIDEBAR_LINKS.map((item) => (<SideBarLinks key={item.key} item={item}/>))}
            </div>
            <div className='border-gray-500 border-t-2'>
                {DASHBOARD_SIDEBAR_BOTTOM_LINKS.map((item)=>(<SideBarLinks key={item.key} item={item}/>))}
                <div className='flex text-red-600 items-center gap-2 py-2 px-3 font-light'>
                    <span className='text-xl'><HiOutlineLogout/></span>
                    <p>Logout</p>
                </div>
            </div>
        </div>
    </div>
  )
}

function SideBarLinks({ item }) {
    const { pathname } = useLocation(); 
    const isActive = pathname === item.path;
    const logout = pathname!=='/logout'
    return (
        <Link to={item.path}>
            <div className={`flex text-slate-100 items-center gap-2 py-2 px-3 font-light ${isActive ? 'bg-purple-800 text-purple-500' : ''} hover:bg-purple-800  active:bg-purple-800 text-base rounded-lg`}>
                <span className={'text-xl'}>{item.icon}</span>
                {item.label}
            </div>
        </Link>
    );
}

