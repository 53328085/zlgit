import React, {useState } from 'react'
import CustContext from '@com/content.js'
import Pagecount from '@com/pagecontent' 
import {useSelector} from 'react-redux'
import {selectProjectId, selectOneLevelDefaultId} from '@redux/systemconfig.js'
import Report from './report' 
export default function Index() {  
  const projectId = useSelector(selectProjectId)
  const areaId = useSelector(selectOneLevelDefaultId)
 
  let [AreaID, setAreaid] = useState(areaId)
 
  const [site, setInitname] = useState({})


  return (
    <CustContext.Provider value={{handler: setAreaid, sitehandler: setInitname,  isSite: true}}>
    <Pagecount showserach={true} >   
      <Report projectId={projectId}  areaId={AreaID} stationName={site.name} /> 
    </Pagecount>
    </CustContext.Provider>
  )
}
