 
import React from 'react'
import {Link, useLocation, NavLink} from 'react-router-dom'
export default function Index() {
  const state = useLocation()
  console.log(state)
  return (
    <div>Router</div>
    
  )
}
