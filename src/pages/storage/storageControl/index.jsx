import React, {useState, useEffect} from 'react'
 
import Pagecount from '@com/pagecontent'
import Runmode from './runmode'
import Onoff from './onoff'
import CModal from '@com/useModal'
import {StorageControlRuntime} from '@api/api'
 
import {Tabs, Typography } from 'antd'
 
import styled from 'styled-components'
import { useOutletContext} from 'react-router-dom'
const {Text} = Typography
const Contentbox = styled.div`
  display: grid;
  grid-template-rows: 48px 1fr;
  row-gap: 16px;
  .info {
    background-color: #000033;
    color:#fff;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: rgba(0, 0, 51, 1); 
    border: 1px solid rgba(215, 215, 215, 1);
    border-radius: 4px;
    padding: 0 16px;
    .circle {
      font-size: 18px;
      color: #0f0;
      padding-right: 16px;
    }
  }
  .tabbox {
    display: grid;
    grid-template-rows: 40px 1fr;
  }
`
const Tabsbox = styled(Tabs)`
 && {
  .ant-tabs-nav {
    margin-bottom: 0px;
   .ant-tabs-nav-list {
    .ant-tabs-tab {
        border-radius: 4px 4px 0 0;
        height: 41px;
        width: 114px;
        justify-content: center;
        font-size: 14px;
        background-color: #fff;  
        transition: none;
        &:hover:not(.ant-tabs-tab-disabled) {
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
    .ant-tabs-tab + .ant-tabs-tab {
      margin: 0 0 0 16px;
    }
    .ant-tabs-tab.ant-tabs-tab-active {
        background-color: var(--ant-primary-color);
       
        .ant-tabs-tab-btn {
            color:#fff;
            transition: none;
        }
    }
   }  
   .ant-tabs-content-holder {
     display: none;
   }
  }
}
`
 
export default function Index() {
  let {exparams} = useOutletContext()
  let {areaId,   projectId, pcsId} = exparams
  const [infoData, setInfoData] = useState({})
  const [mode, setMode] = useState(1) // 运行模式
  const [tab, setTab] = useState(1)
  const modestr = ['待机', '手动模式', '自动模式'][mode] // 0 待机， 1 手动 2 自动
  const tabs = [
   /*  {label: '手动模式', key: 1, disabled: mode==2},
    {label: '自动模式', key: 2, disabled: mode==1}, */
    {label: '开关机控制', key: 1,  },
    {label: '运行模式', key: 2,   },
  ]
  const getinfo = async () => {
    try {
      let {success, data} = await StorageControlRuntime.QueryStorageControlInfo(projectId, areaId, pcsId?.value)

      if (success) {
        let {runtimeMode, systemStatus} = data;
        setMode(runtimeMode)
        setInfoData({ ...data})
      } else {
        setInfoData({})
      }
    } catch (error) {
      console.log(error)
    }
  }

 
 
   const tabChange = (e) => {
     setTab(e)
   }
  
  useEffect(() => {
    if(Number.isInteger(areaId) && Number.isInteger(projectId) && pcsId?.value) {
      getinfo()
    }
    
  }, [areaId, projectId, pcsId])
  const ProjectCom = [Onoff, Onoff, Runmode][tab]
  return (
    <Pagecount  pd="0px" bgcolor="transparent">   
         <Contentbox>
           <div className='info'>
              <span><span className='circle'>&#x25CF;</span><span>当前运行状态：{infoData.systemStatus == 1 ? '开机' : infoData.systemStatus == 2 ? '关机': null }</span></span>
              <span><span className='circle'>&#x25CF;</span>当前运行模式：{modestr }</span>
              <span><span className='circle'>&#x25CF;</span>运行计划：{infoData.runtimePlan}</span>
              <span><span className='circle'>&#x25CF;</span>策略模板：{infoData.strategyTemplate}</span>
             {/*  <span><span className='circle'>&#x25CF;</span>当前模式运行时长：{infoData.runDay}天{infoData.runHour}小时{infoData.runMin}分</span> */}
           </div>
           <div className='tabbox'>
                <Tabsbox items={tabs} activeKey={tab} onChange={tabChange}></Tabsbox>
              {  !isNaN(mode) &&  <ProjectCom projectId={projectId} mode={mode} CModal={CModal} pcsId={pcsId?.value}    areaId={areaId} {...infoData} getinfo={getinfo}   />   }
           </div>
        </Contentbox>
    </Pagecount>
    
  )
}
