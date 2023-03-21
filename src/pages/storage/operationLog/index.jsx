import React, {useState} from 'react'
import CustContext from '@com/content.js'
import Pagecount from '@com/pagecontent'
import CModal from '@com/useModal'
import {useSelector} from 'react-redux'
import {selectProjectId} from '@redux/systemconfig.js'
import Report from './report'
import {Form} from 'antd'
export default function Index() {  
  const projectId = useSelector(selectProjectId)
  const {form} = Form.useForm
  return (
    <CustContext.Provider>
    <Pagecount showserach={true} value={{form}} bgcolor="transparent" pd="0px">   
       <Report projectId={projectId} CModal={CModal} />
    </Pagecount>
    </CustContext.Provider>
  )
}
