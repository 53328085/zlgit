import React, {useState } from 'react'

import Pagecount from '@com/pagecontent'


import CustContext from '@com/content.js'

import Account from './account'
import Power from './power'
import {useSelector} from 'react-redux'
import {selectProjectId} from '@redux/systemconfig.js' 
import {selectUser} from '@redux/user'  
import CModal from '@com/useModal'
import {useTranslation} from "react-i18next"
export default function Index() {
  const projectId = useSelector(selectProjectId);


  const {roleType} = useSelector(selectUser)
  const {t} = useTranslation("common")
  console.log(roleType)
  const tabs = roleType ==1 ?  [
    {label:t("common:AccountManagement"), key: 'account'},
    {label:t("common:PermissionsManagement"), key: 'power'},
  ] : [
    {label: '权限管理', key: 'power'},
  ]
  const [value, setvalue] = useState(tabs[0].key)
  const propsData ={
    tabs,
    value,
    setvalue,
    tabwidth:'auto'
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
