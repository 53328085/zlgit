import React from 'react'
import {Layout} from 'antd'
import Menus from './Sider'
import {Outlet} from 'react-router-dom'
export default function index() {
 const { Header, Footer, Sider, Content } = Layout;   
  return (
     <Layout>
         <Sider><Menus></Menus></Sider>
         <Content className='page--main'><Outlet/></Content>
     </Layout>
  )
}
