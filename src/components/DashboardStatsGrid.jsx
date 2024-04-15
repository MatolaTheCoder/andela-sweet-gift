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
            <p className='font-light text-sm text-gray-500'>Numero de encomendas</p>
            <p className='font-medium text-xl text-gray-700 '><strong>20</strong></p>            
          </div>
        </GridWrapper>
        <GridWrapper>
        <div className='bg-red-500 text-xl w-10 h-10 flex items-center justify-center rounded-full text-white m-2'>
            <HiOutlineShoppingCart/>
          </div>
          <div className='flex flex-col pl-3'>
            <p className='font-light text-sm text-gray-500'>Numero de encomendas</p>
            <p className='font-medium text-xl text-gray-700 '><strong>20</strong></p>            
          </div>
        </GridWrapper>
        <GridWrapper>
          <div className='bg-yellow-500 text-xl w-10 h-10 flex items-center justify-center rounded-full text-white m-2'>
            <HiOutlineShoppingCart/>
          </div>
          <div className='flex flex-col pl-3'>
            <p className='font-light text-sm text-gray-500'>Numero de encomendas</p>
            <p className='font-medium text-xl text-gray-700 '><strong>20</strong></p>            
          </div>
        </GridWrapper>
        <GridWrapper>
        <div className='bg-green-500 text-xl w-10 h-10 flex items-center justify-center rounded-full text-white m-2'>
            <HiOutlineShoppingCart/>
          </div>
          <div className='flex flex-col pl-3'>
            <p className='font-light text-sm text-gray-500'>Numero de encomendas</p>
            <p className='font-medium text-xl text-gray-700 '><strong>20</strong></p>            
          </div>
        </GridWrapper>
      </div>
    </>
  )
}

function GridWrapper({children}){
  return <div className='bg-white p-4 flex-1 rounded shadow flex items-center'>{children}</div>
}