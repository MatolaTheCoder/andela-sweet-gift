import React from 'react'

const recentData = [
  {
    id: '1',
    productId: 'PROD001',
    customerName: 'Alice Smith',
    orderDate: '2024-04-21:09:30',
    orderTotal: '850MZN',
    orderStatus: 'Pending',
    address: '123 Main Street'
  },
  {
    id: '2',
    productId: 'PROD002',
    customerName: 'Bob Johnson',
    orderDate: '2024-04-20:15:45',
    orderTotal: '1200MZN',
    orderStatus: 'Shipped',
    address: '456 Elm Avenue'
  },
  {
    id: '3',
    productId: 'PROD003',
    customerName: 'Eve Brown',
    orderDate: '2024-04-19:12:00',
    orderTotal: '2100MZN',
    orderStatus: 'Delivered',
    address: '789 Oak Road'
  },
  {
    id: '4',
    productId: 'PROD004',
    customerName: 'Charlie Davis',
    orderDate: '2024-04-18:18:20',
    orderTotal: '1750MZN',
    orderStatus: 'Cancelled',
    address: '1011 Pine Lane'
  }
];


function RecentOrders() {
  return (
    <>
      <div className="bg-white p-4 w-[60.5rem] h-full flex flex-col flex-1">
        <div className="font-md text-gray-600"><p>Recent Orders</p></div>
        
      </div>
    </>
  )
}

export default RecentOrders
