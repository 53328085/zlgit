import React, {useState, useEffect} from 'react'
import CustContext from '@com/content.js'
import Pagecount from '@com/pagecontent'
import Automate from './automate'
import Manual from './manual'
import CModal from '@com/useModal'
import {StorageControlRuntime} from '@api/api'
import {useSelector} from 'react-redux'

import {selectProjectId, selectOneLevelDefaultId} from '@redux/systemconfig.js'


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
    tabs: [
      {label: '自动模式', key: 'Automate'},
      {label: '手动模式', key: 'Manual'},
    ],
    value,
    setvalue,
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
    <Pagecount showserach={true}>   
        <ProjectCom projectId={projectId} CModal={CModal} areaId={AreaID} />
    </Pagecount>
    </CustContext.Provider>
  )
}
