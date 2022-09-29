import React from 'react'
import style from './style.module.less'
import { Tabs } from 'antd'
import styled from 'styled-components'
import Elec from './elec'
import Water from './water'
import Gas from './gas'


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
  const elec = ()=>{
    return <Elec></Elec>
  }
  const water = () => {
    return <Water></Water>
  }
  const gas = () => {
    return <Gas></Gas>
  }
  const items = [
    { label: '电', key: 'elec', children: elec() },
    { label: '水', key: 'water', children: water() },
    { label: '燃气', key: 'gas', children: gas() },
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
