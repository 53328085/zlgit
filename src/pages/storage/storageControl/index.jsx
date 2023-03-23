import React, {useState, useEffect} from 'react'
import CustContext from '@com/content.js'
import Pagecount from '@com/pagecontent'
import Automate from './automate'
import Manual from './manual'
import CModal from '@com/useModal'
import {StorageControlRuntime} from '@api/api'
import {useSelector} from 'react-redux'
import {Tabs} from 'antd'
import {selectProjectId, selectOneLevelDefaultId} from '@redux/systemconfig.js'
import styled from 'styled-components'
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
  const getinfo = async () => {
    try {
      await StorageControlRuntime.QueryStorageControlInfo(projectId, areaId)
    } catch (error) {
      console.log(error)
    }
  }
  const propsData ={
  /*   tabs: [
      {label: '自动模式', key: 'Automate'},
      {label: '手动模式', key: 'Manual'},
    ], */
   /*  value,
    setvalue, */
    handler: setAreaid
    
  }
  const coms = {
   Manual: Manual,
   Automate: Automate,  
  }
  useEffect(() => {
    getinfo()
  }, [areaId, projectId])
  const ProjectCom = coms[value] || Manual
  return (
    <CustContext.Provider value={propsData}>      
    <Pagecount showserach={true} pd="0px" bgcolor="transparent">   
         <Contentbox>
           <div className='info'>
               &spades;
           </div>
           <ProjectCom projectId={projectId} CModal={CModal} areaId={AreaID} />
        </Contentbox>
    </Pagecount>
    </CustContext.Provider>
  )
}
