import React,{useState} from 'react'
import style from './style.module.less'
import {Select,Tabs } from 'antd'
import styled from 'styled-components'
import EnergyRecord from './energyRecord'
import Refund from './refund'
const {Option} =Select
const Tabsbox = styled(Tabs)`
  .ant-tabs-nav {
    margin-bottom: 0px;
   .ant-tabs-nav-list {
    .ant-tabs-tab {
        border-radius: 4px 4px 0 0;
        height: 36px;
        width: 144px;
        justify-content: center;
        font-size: 14px;
        background-color: #fff;
        border:1px solid #ccc;      
        // &:hover {
        //     background-color: var(--ant-primary-color);
        //     color: #fff;
        // }
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
  const [section,setSection] = useState('device')
  const tabs = [{label:"能源账户充值",key:'customer'},{label:'退费',key:'device'}]
  const TabsEl = () => {
    if (!tabs) return null  
    return (
       <Tabsbox  
       onChange={onChange} 
       defaultActiveKey={section} 
       animated 
       tabBarGutter={16} 
       type="card"
        items={tabs}
       >
          {/*  {tabs.map(t => <TabPane tab={t.label} key={t.value} ></TabPane>)} */}
       </Tabsbox>
    )
} 
const onChange=(v)=>{
  setSection(v)
}
  return (
    <div className={style.container}>
      <div className={style.header}>
        <span style={{paddingRight: 16}} >区域选择</span>
        <Select style={{width:330}} size="default">
          <Option>正泰大厦</Option>
        </Select>
      </div>
      <div className={style.content}>
        <TabsEl></TabsEl>
        <div className={style.contentTable}>
          {
            section==='customer'?<EnergyRecord/>:<Refund/>
          }
            
        </div>
      </div>
     
    </div>
 
  )
}

