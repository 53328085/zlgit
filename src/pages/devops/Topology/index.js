import React, {useState} from 'react'
import CustContext from '@com/content.js'
import Pagecount from '@com/pagecontent'
 
import {useSelector} from 'react-redux'
import {selectProjectId, selectOneLevelDefaultId} from '@redux/systemconfig.js'
import Topology from './Topology'
 
export default function Index() {  
  const projectId = useSelector(selectProjectId)
  const areaId = useSelector(selectOneLevelDefaultId)
  let [AreaID, setAreaid] = useState(areaId)
 
  return (
    <CustContext.Provider value={{handler: setAreaid}}>
    <Pagecount showserach={true} pd="0px" bgcolor="transparent">   
      <Topology projectId={projectId}  areaId={AreaID}  /> 
    </Pagecount>
    </CustContext.Provider>
  )
}
