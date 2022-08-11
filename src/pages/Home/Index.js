import React from 'react'

import PageLayout from '../../components/layout/PageLayout'
import Header from './header'
import {Outlet} from 'react-router-dom'
export default function Index() {
 
  return (
     <PageLayout 
      custheader= {<Header/>}
     >
      
      <Outlet/>
     </PageLayout>
  )
}
