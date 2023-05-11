import React, {useState, useMemo, useEffect, Suspense} from 'react'
import {useSelector} from 'react-redux'
import {DefaultLayout} from '@com/layout'
import { ProjectLayout } from '@com/layout'
import Header from './header'
import Sider from './sider'
import {Outlet, useLocation} from 'react-router-dom'
import {  mixtitle,jump } from "@redux/systemconfig";
import Loading from '@pages/Loading';

export default function Index(props) {
  let location = useLocation()
  const enchtitle = useSelector(mixtitle)
  const desin = useSelector(jump)
  console.log('desin', desin)
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
  return  <>{desin ? Defaultlayout : Projectlayout}</>
}
