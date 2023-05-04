import React, {useState} from 'react'
import CustContext from '@com/content.js'
import Pagecount from '@com/pagecontent'
import CModal from '@com/useModal'

import {useSelector} from 'react-redux'

import {selectProjectId, selectOneLevelDefaultId} from '@redux/systemconfig.js'

import Main from './main'
 
 
 
export default function Index() {
  const projectId = useSelector(selectProjectId)
  const areaId = useSelector(selectOneLevelDefaultId)
  let [AreaID, setAreaid] = useState(areaId)
  
  
  
  return (
    <CustContext.Provider  value={{handler: setAreaid}} >      
    <Pagecount showserach={false} pd="0px" bgcolor="transparent">   
        <Main projectId={projectId}   CModal={CModal}    areaId={AreaID}    />   
    </Pagecount>
    </CustContext.Provider>
  )
}
