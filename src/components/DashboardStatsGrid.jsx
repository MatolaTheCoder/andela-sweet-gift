import React from 'react'
import { HiOutlineShoppingCart } from 'react-icons/hi'

export default function DashboardStatsGrid() {
  return (
    <>
      <div className='flex gap-2'>
        <GridWrapper>
          <div className='bg-cyan-500 text-xl w-10 h-10 flex items-center justify-center rounded-full text-white m-2'>
            <HiOutlineShoppingCart/>
          </div>
          <div className='flex flex-col pl-3'>
            <p className='font-bold text-sm text-gray-500'>Numero de encomendas</p>
            <p className='font-bold text-xl text-gray-600'>20</p>            
          </div>
        </GridWrapper>
        <GridWrapper>123</GridWrapper>
        <GridWrapper>123</GridWrapper>
        <GridWrapper>123</GridWrapper>
      </div>
    </>
  )
}

function GridWrapper({children}){
  return <div className='bg-white p-4 flex-1 rounded shadow flex items-center'>{children}</div>
}