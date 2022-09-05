import React, {useState, useMemo, useEffect} from 'react'

import {DefaultLayout} from '../../components/layout'
import { ProjectLayout } from '../../components/layout'
import Header from './header'
import Sider from './sider'
import {Outlet, useLocation} from 'react-router-dom'
export default function Index(props) {
  let location = useLocation()
  useEffect(() => {
    document.title = location.state?.title   
    return () => document.title= 'NES600智慧能源服务平台'
  },[location])
  console.log(location)
  const index = useMemo(() => location?.state?.index, [location]);
  let Defaultlayout = (
    <DefaultLayout       
      custheader= {<Header/>}
    >
    <Outlet/>
   </DefaultLayout>
  )
  let Projectlayout = (
    <ProjectLayout {...props} custheader= {<Header/>}  custsider={<Sider />}>
        <Outlet/>
    </ProjectLayout>
  )
  return  <>{index ? Defaultlayout : Projectlayout}</>
}
