import React from 'react'
import { FcBarChart } from "react-icons/fc";

function Sidebar() {
  return (
    <div>
      <div className='bg-purple-200 w-[190px] p-4 h-screen flex flex-col'>
            <div className='flex  items-center gap-2 py-3'><FcBarChart fontSize={24}/><span className='text-gray-700 text-lg'>Andela</span></div>
            <div className='flex-1'>Sidebar top</div>
            <div>Sidebar bottom</div>
        </div>
    </div>
  )
}

export default Sidebar
