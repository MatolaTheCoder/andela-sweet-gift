import React from 'react'
import { FcBarChart } from "react-icons/fc";
import { DASHBOARD_SIDEBAR_LINKS } from '../../lib/constants';
import { Link, useLocation } from 'react-router-dom';

export default function Sidebar() {
  return (
    <div>
      <div className='bg-purple-900 w-[190px] p-4 h-screen flex flex-col'>
            <div className='flex  items-center gap-2 py-3 border-b-2 border-gray-500'><FcBarChart fontSize={24}/>
                <span className='text-gray-400 text-lg font-bold'>Andela</span>
            </div>
            <div className='flex-1 py-8 flex flex-col gap-0.5'>{DASHBOARD_SIDEBAR_LINKS.map((item) => (
                <SideBarLinks key={item.key} item={item}/>
                ))}
            </div>
            <div>Sidebar bottom</div>
        </div>
    </div>
  )
}

function SideBarLinks({ item }) {
    const { pathname } = useLocation(); // Added parentheses to useLocation

    const isActive = pathname === item.path;

    return (
        <Link to={item.path}>
            <div className={`flex text-slate-100 items-center gap-2 py-2 px-3 font-light ${isActive ? 'bg-purple-800' : ''} hover:bg-purple-800 active:text-purple-500 active:bg-purple-800 text-base rounded-lg`}>
                <span className='text-xl'>{item.icon}</span>
                {item.label}
            </div>
        </Link>
    );
}

