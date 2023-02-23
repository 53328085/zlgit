import React, {useState} from 'react'
import style from './style.module.less'
import Region from './regionManage'
import Building from './buildingManage'
import Room from './roomManage'
import CModal from '@com/useModal'
import CustContext from '@com/content.js'
import Pagecount from '@com/pagecontent'
import {useSelector} from 'react-redux'
import {selectProjectId} from '@redux/systemconfig.js'
export default function Index() {
  const projectId = useSelector(selectProjectId);
  const [value, setvalue] = useState('region')
  
  const tabs = [
    { label: '园区', key: 'region' },
    { label: '建筑', key: 'building'},
    { label: '房间', key: 'room' },
  ]
  const propsData ={
    tabs,
    value,
    setvalue
  }
  const  RegionCom = {
    region: Region,
    building: Building,
    room: Room,
   }
  let Com = RegionCom[value]
  return (
    <CustContext.Provider value={propsData}>
    <Pagecount showserach={false}>   
       <Com projectId={projectId} CModal={CModal} />
    </Pagecount>
    </CustContext.Provider>
  )
}
