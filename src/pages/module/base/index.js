import React, {useState, useEffect, useRef} from 'react'
import {useSelector} from 'react-redux'
import {selectProjectId} from '@redux/systemconfig.js'
import Pagecount from '@com/pagecontent'
import CustContext from '@com/content.js'
import Set from './set'
export default function Index() {
 
  const projectId = useSelector(selectProjectId);

  return (
    <CustContext.Provider value={{}}>
    <Pagecount showserach={false} pd="0px">   
        
     <Set  projectId={projectId} />
      
    </Pagecount>
    </CustContext.Provider>
  )
}
