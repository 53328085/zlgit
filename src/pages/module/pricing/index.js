import React, { useState } from 'react'
import { Tabs,Input,Button } from 'antd'
import style from './style.module.less'
import styled from 'styled-components'
import DashLine from '@imgs/dashed.png'
import Solution  from './solution'
import WaterSolution from './watersolution'
import FireSolution from './firesolution'
import CoalSolution from './coalsolution'
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
  const [key, setKey] = useState(1)
  const tabs = [{ label: "电", key: 1 }, { label: '水', key: 2 }, { label: "燃气", key: 3 }, { label: '煤炭', key: 4 }]
  const onChange =(v)=>{
    setKey(v)
  }
  const TabsEl = () => {
    if (!tabs) return null
    return (
      <Tabsbox
        onChange={onChange} 
        defaultActiveKey={key}
        animated
        tabBarGutter={16}
        type="card"
        items={tabs}
      >

      </Tabsbox>
    )
  }
  const solutionPropsList = [
    {
      name:'电价方案1',
      date:'2022-05-16',
      basePrice:'基准价',
      priceType:'step', 
      type:'阶梯费率' 
    },
    {
      name:'电价方案2',
      date:'2022-05-17',
      basePrice:'复费率',
      priceType:'even',  
      type:'复费率'
    },
    {
      name:'电价方案3',
      date:'2022-05-18',
      basePrice:'基准价',
      priceType:'odd',  
      type:'单费率'
    },
] 
  return (
    <div className={style.pricing}>
      <TabsEl></TabsEl>

      <div className={style.content}>
        <div className={style.searcHeader}>
          <div className={style.plan}>
            <span style={{paddingRight:16}}>方案查询</span>
            <Input addonAfter={<div style={{width:74}}>查询</div>} style={{width:538}}/>
          </div>
          <Button type='primary' size='default'>新增方案</Button>
        </div>
        <img src={DashLine} style={{margin:'0 auto',display:'block'}}></img>
        <div className={style.lists}> 
        {key===1? solutionPropsList.map((item,index)=>{
          return <Solution {...item} key={index}></Solution>
        }):key===2?<WaterSolution/>:key===3?<FireSolution/>:<CoalSolution/>}
        </div>
        
       
      </div>
    </div>
  )
}
