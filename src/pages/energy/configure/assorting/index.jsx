import React, { useState } from 'react'
import {useSelector} from 'react-redux'
import Pagecount from '@com/pagecontent'
import {selectProjectId} from '@redux/systemconfig.js'
import CustContext from '@com/content.js'
import Electric from './electric'
import Water from './water'
import Gas from './gas'
import style from './style.module.less'

export default function Index() {
  const [value, setvalue] = useState('electric')
  const projectId = useSelector(selectProjectId);
  const tabs = [
    {label: '电', key: 'electric'},
    {label: '水', key: 'water'},
    {label: '燃气', key: 'gas'},
  ]
 const propsData ={
  tabs,
  value,
  setvalue
  }
  const ProjectCom = {
    electric: Electric ,
    water: Water,
    gas: Gas,
   }
   const [tag, setTag] = useState('')
   const getFromChild = val => {
    setTag(val)
   }
   let Com = ProjectCom[value]
  return (
    <CustContext.Provider value={propsData}>
      {tag == 'open' ? <div className={style.mask}></div> : null}
      <Pagecount showserach={false} pd="32px">   
      { <Com projectId={projectId} getValues={getFromChild}/>}
      </Pagecount>
    </CustContext.Provider>
  )
}
