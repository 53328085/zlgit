import React,{useState} from 'react'
import {useSelector} from 'react-redux'
import Pagecount from '@com/pagecontent'
import CustContext from '@com/content.js'
import {selectProjectId, selectcurlRommid, selectOneLevelDefaultId} from '@redux/systemconfig.js'
import Approver from './approver'
import Group from './group'
export default function Index() {
  const [value, setvalue] = useState('approver')
  const projectId = useSelector(selectProjectId);
  const roomId = useSelector(selectcurlRommid)
  const areaId = useSelector(selectOneLevelDefaultId)
  const props ={
    projectId,
    roomId,
    areaId
  }
  const tabs = [
    {label: '工作票审批人管理', key: 'approver'},
    {label: '班组管理', key: 'group'},
  ]
  const propsData ={
    tabs,
    value,
    setvalue
    }
    const Com = {
      approver: Approver ,
      group: Group,
     }[value]
  return (
    <CustContext.Provider value={propsData}>      
    <Pagecount >   
    { <Com  {...props}  />}
    </Pagecount>
  </CustContext.Provider>
  )
}
