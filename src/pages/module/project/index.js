import React, {useState, useEffect, useRef} from 'react'
import {useSelector} from 'react-redux'
import {selectProjectId, iszhCN,adaptation} from '@redux/systemconfig.js'

import Pagecount from '@com/pagecontent'
import {useTranslation} from "react-i18next"
import CustContext from '@com/content.js'
import styled from 'styled-components'
import Release from './release'
// import Set from './set'
import Region from './area'
import Datagroup from './dataGroup'
import CModal from '@com/useModal'
export default function Index() {
  const [value, setvalue] = useState('area');
  const {t} = useTranslation("common")
  const iszh = useSelector(iszhCN)
  const projectId = useSelector(selectProjectId);
  const {laptop} = useSelector(adaptation)
  const tabs = [
   /*  {label: '项目基础设置', key: 'set'}, */
    {label: t("RegionSettings"), key: 'area'},
    {label:  t("DataGroupManagement"), key: 'datagroup'},
    {label: t("ProjectRelease"), key: 'release'},
  ]
 const propsData ={
  tabs,
  value,
  setvalue,
  tabwidth: iszh ? null : "192px"
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
    <Pagecount showserach={false} pd={laptop ? "16px" : "32px"}>   
        
     { <Com CModal={CModal} projectId={projectId} />}
      
    </Pagecount>
    </CustContext.Provider>
  )
}
