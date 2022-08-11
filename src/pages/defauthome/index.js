import React from 'react'
import {Layout} from 'antd'
import {Outlet} from 'react-router-dom'
const { Content } = Layout;
export default function DefaultHome(){
  return (
    <Content><div><h1>DefaultHome</h1></div><div><Outlet></Outlet></div></Content> 
  )
}
