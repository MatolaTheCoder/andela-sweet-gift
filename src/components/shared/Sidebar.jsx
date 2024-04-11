import React from 'react'
import { FcBarChart } from "react-icons/fc";

function Sidebar() {
  return (
    <div>
      <div className='bg-purple-200 w-[190px] p-3.5 h-screen flex flex-col'>
            <div><FcBarChart />Andela</div>
            <div className='flex-1'>Sidebar top</div>
            <div>Sidebar bottom</div>
        </div>
    </div>
  )
}

export default Sidebar
