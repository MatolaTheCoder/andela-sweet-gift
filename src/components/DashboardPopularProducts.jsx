import React from 'react'
import { data_popular_product } from '../lib/data'

function PopularProducts() {
  return (
    <>
      <div className="bg-white p-4 w-[20rem] h-full flex flex-col">
        <div className="font-md text-gray-600"><p>Popular Products</p></div>
        <div className="mt-3">
          {data_popular_product.map((order)=>(
            <div key={order.id}>
              
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export default PopularProducts
