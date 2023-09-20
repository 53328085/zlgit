import React, { useState, useEffect } from 'react'
import UseHeader from '@com/useHeader'
import Pagecount from '@com/pagecontent'
import { useSelector } from 'react-redux'
import { selectProjectId } from '@redux/systemconfig.js'
import CustContext from '@com/content.js'
import TopologyTree from './topologyTree'
import DirectionPage from './direction';
import style from './style.module.less';

export default function Index() {
  const [value, setvalue] = useState('directions')
  const tabs = [
    { label: '能源流向', key: 'directions' },
    { label: '能源拓扑图', key: 'topology' },
  ]

  const propsData = {
    tabs,
    value,
    setvalue
  }
  const ProjectCom = {
    directions: DirectionPage,
    topology: TopologyTree,
  }

  const projectId = useSelector(selectProjectId);

  const headerProps = {
    isEnergy: false,//能耗类型
    comprehensive: true, //包含综合能耗类型
    isDate: true,//日期 
  }
  const [headerData, setHeaderData] = useState({})
  const getFromChild = data => {
    if (!data.areaId || data.areaId == 0) return;
    setHeaderData(data)
  }
  let Com = ProjectCom[value]

  return (
    <div className={style.directionContent}>
      <UseHeader {...headerProps} getValues={getFromChild}></UseHeader>
      <CustContext.Provider value={propsData}>
        <Pagecount showserach={false} pd="32px">
          {<Com projectId={projectId} headerData={headerData} />}
        </Pagecount>
      </CustContext.Provider>
    </div>
  )
}
