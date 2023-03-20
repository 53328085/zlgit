import React, {useState} from 'react'
import CustContext from '@com/content.js'
import Pagecount from '@com/pagecontent'
import CModal from '@com/useModal'
import {useSelector} from 'react-redux'
import {selectProjectId} from '@redux/systemconfig.js'
import Report from './report'
import {From} from 'antd'
export default function Index() {  
  const projectId = useSelector(selectProjectId)
   
  return (
    <CustContext.Provider>
    <Pagecount showserach={true}>   
        <Report projectId={projectId} CModal={CModal} />
    </Pagecount>
    </CustContext.Provider>
  )
}
