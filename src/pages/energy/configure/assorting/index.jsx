import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import Pagecount from '@com/pagecontent'
import { Editapi } from "@api/api.js"
import { selectProjectId } from '@redux/systemconfig.js'
import CustContext from '@com/content.js'
import Electric from './electric'
import Water from './water'
import HotWater from './hotWater'
import Gas from './gas'
import Steam from './steam'
import style from './style.module.less'

export default function Index() {
  const [value, setvalue] = useState(1)
  const projectId = useSelector(selectProjectId);
  const [tabs, setTabs] = useState([])

  const getTabs = async () => {
    try {
      if (!Number.isInteger(parseInt(projectId))) return
      let { success, data } = await Editapi.QueryEnergyType(projectId)
      if (success && Array.isArray(data) && data?.length) {
        let types = data.map((d, index) => ({ label: d.name, key: d.type }))
        setTabs(types)
      } else {
        setTabs([])
      }
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    getTabs()
  }, [projectId])
  // const tabs = [
  //   { label: '电', key: 'electric' },
  //   { label: '冷水', key: 'water' },
  //   { label: '热水', key: 'hotWater' },
  //   { label: '燃气', key: 'gas' },
  // ]
  const propsData = {
    tabs,
    value,
    setvalue
  }
  const ProjectCom = {
    1: Electric,
    2: Water,
    7: HotWater,
    3: Gas,
    18: Steam
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
