import React, {useState, useEffect, useRef} from 'react'
import {useSelector} from 'react-redux'
import {selectProjectId} from '@redux/systemconfig.js'

import Pagecount from '@com/pagecontent'

import CustContext from '@com/content.js'
import styled from 'styled-components'
import Release from './release'
// import Set from './set'
import Region from './area'
import Datagroup from './dataGroup'
import CModal from '@com/useModal'
export default function Index() {
  const [value, setvalue] = useState('area')
  const projectId = useSelector(selectProjectId);
  const tabs = [
   /*  {label: '项目基础设置', key: 'set'}, */
    {label: '区域设置', key: 'area'},
    {label: '数据组管理', key: 'datagroup'},
    {label: '项目发布', key: 'release'},
  ]
 const propsData ={
  tabs,
  value,
  setvalue
}
 const ProjectCom = {
  release: Release ,
  set: Set,
  area: Region,
  datagroup: Datagroup
 }
 let Com = ProjectCom[value]
  return (
    <CustContext.Provider value={propsData}>
    <Pagecount showserach={false} pd="32px">   
        
     { <Com CModal={CModal} projectId={projectId} />}
      
    </Pagecount>
    </CustContext.Provider>
  )
}
