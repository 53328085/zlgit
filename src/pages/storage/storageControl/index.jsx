import React, {useState, useEffect} from 'react'
import CustContext from '@com/content.js'
import Pagecount from '@com/pagecontent'
import Automate from './automate'
import Manual from './manual'
import CModal from '@com/useModal'
import {StorageControlRuntime} from '@api/api'
import {useSelector} from 'react-redux'
import {Tabs, Typography} from 'antd'
import {selectProjectId, selectOneLevelDefaultId} from '@redux/systemconfig.js'
import styled from 'styled-components'
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
  const [value, setvalue] = useState('Manual')
  const projectId = useSelector(selectProjectId)
  const areaId = useSelector(selectOneLevelDefaultId)
  let [AreaID, setAreaid] = useState(areaId)
  const [infoData, setInfoData] = useState({})
  const [mode, setMode] = useState()
 
  const getinfo = async () => {
    try {
      let {success, data} = await StorageControlRuntime.QueryStorageControlInfo(projectId, areaId)

      if (success) {
        let {runtimeMode} = data;
        setMode(runtimeMode)
        setInfoData({...infoData, ...data})
      } else {
        setInfoData({})
      }
    } catch (error) {
      console.log(error)
    }
  }
 const tabs =  [
    {label: '手动模式', key: 1},
    {label: '自动模式', key: 2},
   
  ]
  const propsData ={
  /*   tabs: [
      {label: '自动模式', key: 'Automate'},
      {label: '手动模式', key: 'Manual'},
    ], */
   /*  value,
    setvalue, */
    handler: setAreaid
    
  }
   
  
  useEffect(() => {
    getinfo()
  }, [areaId, projectId])
 
  return (
    <CustContext.Provider value={propsData}>      
    <Pagecount showserach={true} pd="0px" bgcolor="transparent">   
         <Contentbox>
           <div className='info'>
              <span><span className='circle'>&#x25CF;</span><span>当前运行状态：{infoData.runtimeStatus}</span></span>
              <span><span className='circle'>&#x25CF;</span>当前运行模式：{infoData.runtimeModeStr}</span>
              <span><span className='circle'>&#x25CF;</span>运行计划：{infoData.runtimePlan}</span>
              <span><span className='circle'>&#x25CF;</span>策略模板：{infoData.strategyTemplate}</span>
              <span><span className='circle'>&#x25CF;</span>当前模式运行时长：{infoData.day}天{infoData.runHour}小时{infoData.runMin}分</span>
           </div>
           <div className='tabbox'>
                <Tabsbox items={tabs} activeKey={mode} onChange={setMode}></Tabsbox>
               {
                 mode==1 ?  <Manual projectId={projectId} CModal={CModal} areaId={AreaID} {...infoData}  /> : mode ==2 ? <Automate projectId={projectId} CModal={CModal} areaId={AreaID} {...infoData}  /> : null
               }  
           </div>
        </Contentbox>
    </Pagecount>
    </CustContext.Provider>
  )
}
