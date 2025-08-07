import React, { useState, useEffect } from 'react'
import CustContext from '@com/content.js'
import Pagecount from '@com/pagecontent'
import Electric from './electric'
import Water from './water'
import HotWater from './hotWater'
import Steam from './steam'
import Fire from './fire'
import { useOutletContext } from 'react-router-dom'
import { Editapi } from '@api/api.js'
export default function Index() {
  let { projectId } = useOutletContext()
  console.log(projectId)
  const [value, setvalue] = useState(1)
  const [tabs, setTabs] = useState([
    // { key: '0', label: '电' },
    // { key: '1', label: '冷水' },
    // { key: '7', label: '热水' },
    // { key: '2', label: '燃气' }
  ])
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
  }, [])
  let dataProps = {
    value,
    setvalue,
    tabs
  }
  let Coms = [
    <></>,
    <Electric />,
    <Water />,
    <Fire />,
    <></>,
    <></>,
    <></>,
    <HotWater />,
    <></>,
    <></>,
    <></>,
    <></>,
    <></>,
    <></>,
    <></>,
    <></>,
    <></>,
    <></>,
    <Steam></Steam>
  ]
  return (
    <CustContext.Provider value={dataProps}>
      {/*   <div style={{ overflow: 'hidden' ,width:'100%',height:873 }}> */}
      <Pagecount>
        {Coms[Number(value)]}
      </Pagecount>
      {/*  </div>  */}
    </CustContext.Provider>
  )
}
