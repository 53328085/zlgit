import React ,{useCallback, useEffect, useState,useRef}from 'react'
import { useSelector } from 'react-redux'
import CustContext from '@com/content.js'
import Pagecount from '@com/pagecontent'
import ParkStreet from './parkstreet'
import PublicLight from './publiclight'
import {Monitoring} from "@api/api"
import {selectOneLevel} from '@redux/systemconfig'
const { PubliclightManager:{AeraQueryAll},DeviceManager:{OneLevel}}=Monitoring
export default function Index() {
  const [value, setvalue] = useState('0')
  const projectId = useSelector(state => state.system.menus.projectId)
  const [tabs,setTabs] =useState([
    {key: '0',label: '园区路灯'},
    {key: '1',label: '公共照明'},
  ])


  const areaList = useSelector(selectOneLevel)
  const levelname = areaList?.length > 0 ? areaList[0].levelName : ''

  let dataProps={
    value,
    setvalue,
    tabs,
  }

  let Coms = [
    <ParkStreet areaList={areaList} levelname={levelname}/>,
    <PublicLight areaList={areaList} levelname={levelname}/>,
  ]


  return (
    <CustContext.Provider value={dataProps}>
      <Pagecount>
       { Coms[Number(value)] }
      </Pagecount>
    </CustContext.Provider>
  )
}
