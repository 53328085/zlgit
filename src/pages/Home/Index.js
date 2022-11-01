import React, {useState, useMemo, useEffect} from 'react'

import {DefaultLayout} from '../../components/layout'
import { ProjectLayout } from '../../components/layout'
import Header from './header'
import Sider from './sider'
import {Outlet, useLocation} from 'react-router-dom'
export default function Index(props) {
  let location = useLocation()
  useEffect(() => {
    document.title = location.state?.title || 'NES600智慧能源服务平台' 
    return () => document.title= 'NES600智慧能源服务平台'
  },[location])  
  const index = useMemo(() => location?.state?.index, [location.state]);
  console.log(index)
  let Defaultlayout = (
    <DefaultLayout       
      custheader= {<Header istitle={true}/>}
    >
    <Outlet/>
   </DefaultLayout> 
  )
  let Projectlayout = (
    <ProjectLayout {...props} custheader= {<Header istitle={false}/>}  custsider={<Sider />}>
        <Outlet/>
    </ProjectLayout>
  )
  return  <>{index ? Defaultlayout : Projectlayout}</>
}
