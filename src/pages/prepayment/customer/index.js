import React,{useState} from 'react'
import style from './style.module.less'
import {Select,Tabs } from 'antd'
import CustomerList from './customerList'
import DeviceChange from './deviceChange'
import Pagecount from '@com/pagecontent'
import CustContext from '@com/content.js'
const {Option} =Select
export default function Index() {
  const [value,setvalue] = useState('list')
  const tabs = [{label:"客户列表",key:'list'},{label:'设备变更',key:'device'}]
  const propsData = {
    tabs,
    value,
    setvalue
  }
  return (
    <CustContext.Provider value={propsData}>
      <Pagecount showserach={true}>
          <div className={style.content}>
            <div className={style.contentTable}>
              {value === 'list' ? <CustomerList /> : <DeviceChange />}
            </div>
          </div>
      </Pagecount>
    </CustContext.Provider>
  )
}
