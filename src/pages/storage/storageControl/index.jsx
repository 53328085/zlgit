import React, {useState} from 'react'
import CustContext from '@com/content.js'
import Pagecount from '@com/pagecontent'
import Automate from './automate'
import Manual from './manual'
import CModal from '@com/useModal'
import {useSelector} from 'react-redux'
import {selectProjectId} from '@redux/systemconfig.js'
export default function Index() {
  const [value, setvalue] = useState('Manual')
  const projectId = useSelector(selectProjectId)
  const propsData ={
    tabs: [
      {label: '手动模式', key: 'Manual'},
      {label: '自动模式', key: 'Automate'}
    ],
    value,
    setvalue,
    
  }
  const coms = {
   Manual: Manual,
   Automate: Automate,  
  }
  const ProjectCom = coms[value] || Manual
  return (
    <CustContext.Provider value={propsData}>
    <Pagecount showserach={true}>   
        <ProjectCom projectId={projectId} CModal={CModal} />
    </Pagecount>
    </CustContext.Provider>
  )
}
