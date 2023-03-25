import React, {useState, useEffect, useRef} from 'react'
import {useSelector} from 'react-redux'
import {selectProjectId} from '@redux/systemconfig.js'
import Pagecount from '@com/pagecontent'
import CustContext from '@com/content.js'
import Set from './set'
export default function Index() {
  const [value, setvalue] = useState('set')
  const projectId = useSelector(selectProjectId);
  const tabs = [
    {label: '基础设置', key: 'set'},
  
  ]
 const propsData ={
  tabs,
}
  return (
    <CustContext.Provider value={propsData}>
    <Pagecount showserach={false} pd="32px">   
        
     <Set  projectId={projectId} />
      
    </Pagecount>
    </CustContext.Provider>
  )
}
