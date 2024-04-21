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
        <div className="pt-2">
          <table className='border p-2'>
            <thead>
              <tr className='bg-gray-300 border'>
                <th className='pl-4'>Id</th>
                <th className='pl-4'>Product Id</th>
                <th className='pl-4'>Customer Name</th>
                <th className='pl-4'>Order Date</th>
                <th className='pl-4'>Price</th>
                <th className='pl-4'>Status</th>
                <th className='pl-4'>Address</th>
              </tr>
            </thead>
            <tbody>
              {/* <tr className=''>
                <td>{recentData.map((props)=>(<div className='pl-4'>{props.id}</div>))}</td>
                <td>{recentData.map((props)=>(<div className='pl-4'>{props.productId}</div>))}</td>
                <td>{recentData.map((props)=>(<div className='pl-4'>{props.customerName}</div>))}</td>
                <td>{recentData.map((props)=>(<div className='pl-4'>{props.orderDate}</div>))}</td>
                <td>{recentData.map((props)=>(<div className='pl-4'>{props.orderTotal}</div>))}</td>
                <td>{recentData.map((props)=>(<div className='pl-4'>{props.orderStatus}</div>))}</td>
                <td>{recentData.map((props)=>(<div className='pl-4'>{props.address}</div>))}</td>
              </tr> */}
              {recentData.map((order) => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{order.productId}</td>
                  <td>{order.customerName}</td>
                  <td>{order.orderDate}</td>
                  <td>{order.orderTotal}</td>
                  <td>{order.orderStatus}</td>
                  <td>{order.address}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}

export default RecentOrders
