import React from 'react'
import { data_popular_product } from '../lib/data'

function PopularProducts() {
  return (
    <>
      <div className="bg-white p-4 w-[20rem] h-full flex flex-col">
        <div className="font-md text-gray-600"><p>Popular Products</p></div>
        <div className="mt-3 flex flex-col gap-3">
          {data_popular_product.map((order)=>(
            <div className='flex ml-4' key={order.id}>
              <div className="w-10 h-10 rounded-sm bg-gray-200">
                <img className='w-full h-full ' src="" alt='' />
              </div>
              <div className='ml-4 flex-1'>
                <div className="text-gray-500 text-sm">
                  <p>{order.prod_name}</p>
                  <span className='text-xs font-light text-red-400'>{order.prod_price}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export default PopularProducts
