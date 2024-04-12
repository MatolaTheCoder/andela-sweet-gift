import React from 'react'
import { FcBarChart } from "react-icons/fc";
import { DASHBOARD_SIDEBAR_LINKS } from '../../lib/constants';
import { Link } from 'react-router-dom';

export default function Sidebar() {
  return (
    <div>
      <div className='bg-purple-900 w-[190px] p-4 h-screen flex flex-col'>
            <div className='flex  items-center gap-2 py-3 border-b-2 border-gray-500'><FcBarChart fontSize={24}/><span className='text-gray-700 text-lg'>Andela</span></div>
            <div className='flex-1'>{DASHBOARD_SIDEBAR_LINKS.map((item) => (
                <SideBarLinks key={item.key} item={item}/>
                ))}
            </div>
            <div>Sidebar bottom</div>
        </div>
    </div>
  )
}

function SideBarLinks({item}){
    return(
        <Link to={item.path}>
            <div className='flex items-center gap-2 py-2 px-3 font-light hover:text-purple-500 active:text-purple-400 text-base'>
                <span className='text-xl '>{item.icon}</span>
                {item.label}
            </div>
        </Link>
    )
}
