import React, {useState} from 'react'
import CustContext from '@com/content.js'
import Pagecount from '@com/pagecontent'
import CModal from '@com/useModal'
import {useSelector} from 'react-redux'
import {selectProjectId} from '@redux/systemconfig.js'
export default function Index() {  
  const projectId = useSelector(selectProjectId)
  const coms = {
   Manual: Manual,
   Automate: Automate,  
  }
  const ProjectCom = coms[value] || Manual
  return (
    <CustContext.Provider>
    <Pagecount showserach={true}>   
        <ProjectCom projectId={projectId} CModal={CModal} />
    </Pagecount>
    </CustContext.Provider>
  )
}
