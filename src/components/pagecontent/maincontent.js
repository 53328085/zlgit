import React, {useContext}  from 'react'
import {Tabs} from 'antd'
import CustContext from '../content'

import styled from 'styled-components'
import { set } from 'lodash'
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

export default function Maincontent(props) {
 const {tabs, key, setKey} = useContext(CustContext)
 console.log(tabs)
 //const {tabs, value, setvalue} = props
 const tabstyl = {
     background: '#237ae4',
     color: '#fff'
 }
 const onChange = (key) => {
     setKey(key)
 }
 const TabsEl = () => {
     if (!tabs) return null  
     const {TabPane} = Tabs
     return (
        <Tabsbox  
        onChange={onChange} 
        defaultActiveKey={key} 
        animated 
        tabBarGutter={16} 
        type="card"
         items={tabs}
        >
           {/*  {tabs.map(t => <TabPane tab={t.label} key={t.value} ></TabPane>)} */}
        </Tabsbox>
     )
 } 
  return (
    <div className='page--content--box'>
        <TabsEl></TabsEl>
        <div className='page--content--main'>{props.children}</div>
    </div>
  )
}
