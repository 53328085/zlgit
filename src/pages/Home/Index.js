import React, {useState, useMemo, useEffect, Suspense} from 'react'
import {useSelector} from 'react-redux'
import {DefaultLayout} from '../../components/layout'
import { ProjectLayout } from '../../components/layout'
import Header from './header'
import Sider from './sider'
import {Outlet, useLocation} from 'react-router-dom'
import {  mixtitle } from "@redux/systemconfig";
import Loading from '@pages/Loading';

export default function Index(props) {
  let location = useLocation()
  const enchtitle = useSelector(mixtitle)
  useEffect(() => {
    document.title = enchtitle+ ' ' + location.state?.title
    return () => document.title = enchtitle
  },[location])  
  const index = useMemo(() => location?.state?.index, [location.state]); 
  let Defaultlayout = (
    <DefaultLayout       
      custheader= {<Header istitle={true}/>}
    >
      <Suspense fallback={<Loading />}>
    <Outlet/>
    </Suspense>
   </DefaultLayout> 
  )
  let Projectlayout = (
    <ProjectLayout {...props} custheader= {<Header istitle={false}/>}  custsider={<Sider />}>
        <Suspense fallback={<Loading />}>
          <Outlet/>
        </Suspense>
    </ProjectLayout>
  )
  return  <>{index ? Defaultlayout : Projectlayout}</>
}
