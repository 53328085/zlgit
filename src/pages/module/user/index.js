import React, {useState } from 'react'

import Pagecount from '@com/pagecontent'


import CustContext from '@com/content.js'

import Account from './account'
import Power from './power'
import {useSelector} from 'react-redux'
import {selectProjectId} from '@redux/systemconfig.js' 
import {manager} from '@redux/user'  
import CModal from '@com/useModal'
export default function Index() {
  const projectId = useSelector(selectProjectId);


  const ismanager = useSelector(manager)
  const tabs = ismanager ? [ 
    {label: '权限管理', key: 'power'},
  ] : [
    {label: '账号管理', key: 'account'},
    {label: '权限管理', key: 'power'},
   
  ]
  const [value, setvalue] = useState(tabs[0].key)
  const propsData ={
    tabs,
    value,
    setvalue
  }
  const userCom = {
    account: Account ,
    power: Power,
     
   }
  let Com = userCom[value]
  return (
    <CustContext.Provider value={propsData}>
    <Pagecount showserach={false}>   
        <Com projectId={projectId} CModal={CModal} /> 
    </Pagecount>
    </CustContext.Provider>
  )
}
