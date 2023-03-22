import React, {useState} from 'react'
import CustContext from '@com/content.js'
import Pagecount from '@com/pagecontent'
import CModal from '@com/useModal'
import {useSelector} from 'react-redux'
import {selectProjectId, selectOneLevelDefaultId} from '@redux/systemconfig.js'
import Report from './report'
import {From} from 'antd'
export default function Index() {  
  const projectId = useSelector(selectProjectId)
  const areaId = useSelector(selectOneLevelDefaultId)
  let [AreaID, setAreaid] = useState(areaId)
  
  return (
    <CustContext.Provider value={{}}>
    <Pagecount showserach={true} bgcolor="transparent" pd="0px">   
        <Report projectId={projectId} areaId={AreaID.area}/>
    </Pagecount>
    </CustContext.Provider>
  )
}
