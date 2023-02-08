import React from 'react'
import {Layout} from 'antd'
import {Outlet} from 'react-router-dom'
export default function Index() {
 const {  Content } = Layout;   
  return (  
     <Content className='page--main'><Outlet/></Content>
  )
}
