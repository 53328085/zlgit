import React, {useState, useEffect, useRef} from 'react'
import CustContext from '@com/content.js'
import Pagecount from '@com/pagecontent'
import {Form, Select, Space, Divider} from 'antd' 
import {useSelector} from 'react-redux'
import {SiteManagerDesigner} from '@api/api'
import {selectProjectId, selectOneLevelDefaultId} from '@redux/systemconfig.js'
import Report from './report'

export default function Index() {  
  const projectId = useSelector(selectProjectId)
  const [initname, setInitname] = useState('')
  return (
    <CustContext.Provider value={{sitehandler: setInitname,  isSite: true }}>
    <Pagecount showserach={true} bgcolor="transparent" pd="0px">   
        <Report projectId={projectId}  stationName={initname?.name}/>
    </Pagecount>
    </CustContext.Provider>
  )
}
