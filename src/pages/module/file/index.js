import React, {useState} from 'react'
import style from './style.module.less'
import RegionManage from './regionManage'
import BuildingManage from './buildingManage'
import RoomManage from './roomManage'

import CustContext from '@com/content.js'
import Pagecount from '@com/pagecontent'

export default function Index() {
  const [value, setvalue] = useState('region')

  const tabs = [
    { label: '园区管理', key: 'region' },
    { label: '建筑管理', key: 'building'},
    { label: '房间管理', key: 'room' },
  ]
  const propsData ={
    tabs,
    value,
    setvalue
  }

  return (
    <CustContext.Provider value={propsData}>
    <Pagecount showserach={false}>   
      {
        value == 'region' ? <RegionManage /> : value == 'building' ? <BuildingManage /> : <RoomManage />
      }
    </Pagecount>
    </CustContext.Provider>
  )
}
