import React from 'react'
import { useLocation } from 'react-router-dom'
export default function Devicedetail() {
  const aa =  useLocation()
  console.log(aa)
  return (
    <div>
      Devicedetail
    </div>
  )
}
