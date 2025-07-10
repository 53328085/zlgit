import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import Pagecount from '@com/pagecontent'
import { selectProjectId } from '@redux/systemconfig.js'
import CustContext from '@com/content.js'
import Electric from './electric'
import Water from './water'
import HotWater from './hotWater'
import Gas from './gas'
import style from './style.module.less'

export default function Index() {
  const [value, setvalue] = useState('electric')
  const projectId = useSelector(selectProjectId);
  const tabs = [
    { label: '电', key: 'electric' },
    { label: '冷水', key: 'water' },
    { label: '热水', key: 'hotWater' },
    { label: '燃气', key: 'gas' },
  ]
  const propsData = {
    tabs,
    value,
    setvalue
  }
  const ProjectCom = {
    electric: Electric,
    water: Water,
    hotWater: HotWater,
    gas: Gas,
  }
  const [tag, setTag] = useState('')
  const getFromChild = val => {
    setTag(val)
  }
  let Com = ProjectCom[value]
  return (
    <CustContext.Provider value={propsData}>
      <Pagecount showserach={false} pd="16px">
        {<Com projectId={projectId} getValues={getFromChild} />}
      </Pagecount>
    </CustContext.Provider>
  )
}
