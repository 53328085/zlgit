import React from 'react'
import CustContext from '@com/content.js'
import Pagecount from '@com/pagecontent'
 
import {useSelector} from 'react-redux'
import {selectProjectId} from '@redux/systemconfig.js'
import Report from './report'
 
export default function Index() {  
  const projectId = useSelector(selectProjectId)
 
  return (
    <CustContext.Provider value={{}}>
    <Pagecount   bgcolor="transparent" pd="0px">   
       <Report projectId={projectId}  />
    </Pagecount>
    </CustContext.Provider>
  )
}
