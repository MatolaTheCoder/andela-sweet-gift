import React from 'react'
import { Link} from 'react-router-dom';

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
  },
  {
    id: '5',
    productId: 'PROD005',
    customerName: 'Charlie Davis',
    orderDate: '2024-04-18:18:20',
    orderTotal: '1750MZN',
    orderStatus: 'Cancelled',
    address: '1011 Pine Lane'
  },
  {
    id: '6',
    productId: 'PROD006',
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
      <div className="bg-white px-4 pt-4 w-[60.5rem] h-full flex flex-col flex-1 pb-4">
        <div className="font-md text-gray-600"><p>Recent Orders</p></div>
        <div className="mt-3">
          <table className=' w-full border text-gray-700'>
            <thead>
              <tr className='bg-gray-300 border'>
                <th className=''>Id</th>
                <th className=''>Cod Producto</th>
                <th className=''>Nome do cliente</th>
                <th className=''>Data de reserva</th>
                <th className=''>Preco</th>
                <th className=''>Endereco</th>
                <th className=''>Estado</th>
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
                <tr className='' key={order.id}>
                  <td className='pl-4 pr-4 border-r-2 border-gray-200'>{order.id}</td>
                  <td className='pl-5 pr-5 border-r-2 border-gray-200'>{order.productId}</td>
                  <td className='pl-10 pr-5 border-r-2 border-gray-200'> <Link to={`/cliente/:{order.id}`}></Link> {order.customerName}</td>
                  <td className='pl-7 pr-5 border-r-2 border-gray-200'>{order.orderDate}</td>
                  <td className='pl-7 pr-5 border-r-2 border-gray-200'>{order.orderTotal}</td>
                  <td className='pl-10 pr-7 border-r-2 border-gray-200'>{order.address}</td>
                  <td className='pl-5 pr-5 border-r-2 border-gray-200 ' >{order.orderStatus}</td>
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
