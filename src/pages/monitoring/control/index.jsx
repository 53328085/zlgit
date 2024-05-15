import React from 'react'

import Pagecount from '@com/pagecontent'

import {useSelector} from 'react-redux'
import {selectProjectId, selectOneLevelDefaultId} from '@redux/systemconfig.js'
import Report from './report'

export default function Index() {  
  const projectId = useSelector(selectProjectId)
  const areaId = useSelector(selectOneLevelDefaultId)
 

  return (
    <Pagecount  pd="0px" bgcolor="transparent">   
      <Report projectId={projectId}  areaId={areaId} /> 
    </Pagecount>
  )
}
