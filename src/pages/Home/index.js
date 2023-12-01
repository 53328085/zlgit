import React, {useState, useMemo, useEffect, Suspense} from 'react'
import {useSelector} from 'react-redux'
import {ErrorBoundary} from 'react-error-boundary'
import {DefaultLayout, ProjectLayout} from '@com/layout'
import {Fallack} from "@com/useError"
import Header from './header'
import Sider from './sider'
import {Outlet, useLocation} from 'react-router-dom'
import {  mixtitle,jump} from "@redux/systemconfig";
import Loading from '@pages/Loading';
export default function Index(props) {

 

  let location = useLocation()
  const enchtitle = useSelector(mixtitle)
  const desin = useSelector(jump)
  console.log(location)
  useEffect(() => {
    document.title = enchtitle+ ' ' + location.state?.title
    return () => document.title = enchtitle
  },[location])  
   
 
  let Defaultlayout = (
    <DefaultLayout       
      custheader= {<Header istitle={true}/>}
    >
      <Suspense fallback={<Loading />}>
      <ErrorBoundary FallbackComponent={Fallack}>
          <Outlet/>
      </ErrorBoundary>
    </Suspense>
   </DefaultLayout> 
  )
  let Projectlayout = (
    <ProjectLayout {...props} custheader= {<Header istitle={false}/>}  custsider={<Sider />}>
        <Suspense fallback={<Loading />}>
          <ErrorBoundary FallbackComponent={Fallack} >
            <Outlet/>
          </ErrorBoundary>
        </Suspense>
    </ProjectLayout>
  )
  return  <>{desin ? Defaultlayout : Projectlayout}</>
}
