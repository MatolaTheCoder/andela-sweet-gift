import React from 'react'
import { HiOutlineSearch } from 'react-icons/hi'

export default function Header() {
  return (
    <div className='bg-white h-16 px-4 py-1 flex justify-between items-center '>
        <div className='relative'>
            <HiOutlineSearch className='text-gray-500 absolute top-1/2 -translate-y-1/2 left-2'/>
            <input type="text" placeholder='Pesquise...' className='border border-gray-300 rounded-md h-8 w-[24rem] px-8 focus:outline-none text-sm'/>
        </div>
        <div >But</div>
    </div>
  )
}
