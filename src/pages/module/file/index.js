import React from 'react'
import style from './style.module.less'
import { Tabs } from 'antd'
import styled from 'styled-components'
import RegionManage from './regionManage'
import BuildingManage from './buildingManage'
import RoomManage from './roomManage'


const Tabsbox = styled(Tabs)`
  .ant-tabs-nav {
    margin-bottom: 0px;
   .ant-tabs-nav-list {
    .ant-tabs-tab {
        border-radius: 4px 4px 0 0;
        height: 40px;
        width: 144px;
        justify-content: center;
        font-size: 14px;
        background-color: #fff;      
        &:hover {
            background-color: var(--ant-primary-color);
            color: #fff;
        }
    }
    .ant-tabs-tab-active {
        background-color: var(--ant-primary-color);
       
        .ant-tabs-tab-btn {
            color:#fff;
            transition: color 100ms;
        }
    }
   }  
 
}
`

export default function Index() {
  const region = ()=>{
    return <RegionManage></RegionManage>
  }
  const building = () => {
    return <BuildingManage></BuildingManage>
  }
  const room = () => {
    return <RoomManage></RoomManage>
  }
  const items = [
    { label: '园区管理', key: 'region', children: region() },
    { label: '建筑管理', key: 'building', children: building() },
    { label: '房间管理', key: 'room', children: room() },
  ]
  const onChange = (checkedValues) => {
    console.log('checked = ', checkedValues);
  };

  return (
    <div>
      <Tabsbox onChange={onChange} animated tabBarGutter={16} type="card" items={items}></Tabsbox>
    </div>
  )
}
