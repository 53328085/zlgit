import React from 'react'
import CustContext from '@com/content.js'
import Pagecount from '@com/pagecontent'
import {useSelector} from 'react-redux'
import {selectProjectId} from '@redux/systemconfig.js'
import Main from './main'
 
 
 
export default function Index() {
  const projectId = useSelector(selectProjectId)
  return (
    <CustContext.Provider value={{}} >      
    <Pagecount showserach={false} pd="0px" bgcolor="transparent">   
        <Main projectId={projectId}   />   
    </Pagecount>
    </CustContext.Provider>
  )
}
