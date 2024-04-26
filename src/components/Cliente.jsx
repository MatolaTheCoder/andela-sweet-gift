import React from 'react'
import { useParams } from 'react-router-dom'

function Cliente() {
  const id = useParams()
    return (
    <div>
      <p>Cliente {id}</p>
    </div>
  )
}

export default Cliente
