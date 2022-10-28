import React, {useContext, useMemo}  from 'react'
import {Tabs} from 'antd'
import CustContext from '../content'

import styled from 'styled-components'
const Tabsbox = styled(Tabs)`
  .ant-tabs-nav {
    margin-bottom: 0px;
   .ant-tabs-nav-list {
    .ant-tabs-tab {
        border-radius: 4px 4px 0 0;
        height: 41px;
        width: 145px;
        justify-content: center;
        font-size: 14px;
        background-color: #fff;  
        transition: none;
        &:hover {
            background-color: var(--ant-primary-color);
            color: #fff;
            transition: all 0.3s;
        }
        .ant-tabs-tab-btn{
            transition: none;
        }
        .ant-tabs-tab-btn:active {
            color:#fff
        }
    }
    .ant-tabs-tab.ant-tabs-tab-active {
        background-color: var(--ant-primary-color);
       
        .ant-tabs-tab-btn {
            color:#fff;
            transition: none;
        }
    }
   }  
 
}
`
const Pagecontentbox = styled.div`
    display: flex;
    flex-direction: column;
    flex: ${p => p.beTabs ? '41px 1' :  1};
`
const PageContentMain = styled.div`  
    background-color: ${props => props.bgcolor};
    padding: ${props => props.pd};
    display: flex;
    flex-direction: column;
    position: relative;
    height:  ${props => {
         let {showserach, beTabs} = props
         if (!showserach) return beTabs ? '832px' : '873px'
         if (showserach) return beTabs ? '764px' : '805px'
        
    }};
    overflow-y: auto;
`
PageContentMain.defaultProps = {
    pd: "16px",
    bgcolor: "#fff"
}
export default function Maincontent(props) {
 const {tabs, value, setvalue} = useContext(CustContext)
 const beTabs = useMemo(() => Array.isArray(tabs) && tabs.length > 0, [tabs])
 //const {tabs, value, setvalue} = props
 const tabstyl = {
     background: '#237ae4',
     color: '#fff'
 }
 const onChange = (key) => {
    setvalue(key)
 }
 const TabsEl = () => {   
     if (!beTabs) return null    
     return (
        <Tabsbox  
        onChange={onChange} 
        defaultActiveKey={value} 
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
    <Pagecontentbox beTabs={beTabs}>
        <TabsEl></TabsEl>
       {/*  <div className='page--content--main'>{props.children}</div> */}
        <PageContentMain pd={props.pd} bgcolor={props.bgcolor} beTabs={beTabs} showserach={props.showserach}>
          {props.children}
        </PageContentMain>
    </Pagecontentbox>
  )
}
