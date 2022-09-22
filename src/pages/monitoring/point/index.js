import React, {useState, useEffect} from 'react'
import {useSelector} from 'react-redux'
import {useAntdTable, usePagination} from 'ahooks'
import {Form} from 'antd'
import Pagecount from '@com/pagecontent'
import UserTable from '@com/useTable'
import UserCard from '@com/useCard'
import {Meter} from '@api/api.js'
import {selectCurProject} from '@redux/user.js'
import CustContext from '@com/content.js'
import columns,  { onDesc} from './columns'
export default function Index() {
  const [form] = Form.useForm()

  const [formparams, setFormparams] = useState(form.getFieldValue())
  const [key, setKey] = useState('electric')
  const projectId = useSelector(selectCurProject)?.id 
  let [display, setDisplay] = useState(true)  
  const meterType = {
    electric: 1,
    water: 2,
    gas: 3
  }

  const tabs = [
    {label: '电表', key: 'electric'},
    {label: '水表', key: 'water'},
    {label: '燃气表', key: 'gas'}
  ]
  
  let params = {
    projectId: projectId,
    meterType: meterType[key],
    lineStatus: 0,
    bindStatus: 0,
    pageNum: 1,
    pageSize: 12,
    alike: '',
  }
  const getTableData = ({current, pageSize}, formData) => {  
    setFormparams((form) => ({...form, ...formData}))
   
    if (!display) return;
    params = Object.assign({}, params, {pageNum: current, pageSize}, formData)
    return  Meter.Overview(params).then(res => {
      let {success, data, totalNum} = res
      if (success && Array.isArray(data?.data)) {
        return {
          total: totalNum,
          list: data.data
        }
      
      }else {
        return {
          total: 0,
          list: []
        }
      }
    })
  }
  const getCardData = ({current, pageSize}) => {  
    params = Object.assign({}, params, {pageNum: current, pageSize}, formparams)
    return  Meter.Overview(params).then(res => {
      let {success, data, totalNum} = res
      if (success && Array.isArray(data?.data)) {
        return {
          total: totalNum,
          list: data.data
        }
      
      }else {
        return {
          total: 0,
          list: []
        }
      }
    })
  }
  const {tableProps, search} = useAntdTable(getTableData, {
    form,
    refreshDeps: [projectId, key, display],
    defaultPageSize: 12,
   })
 
   const {data, pagination} = usePagination(getCardData, {
    refreshDeps: [projectId, key, formparams],
    defaultPageSize: 12,

   })
  const propsData ={
    tabs,
    key,
    setKey,
    form,
    search,
    display,
    setDisplay,
  }
  return (
    <CustContext.Provider value={propsData}>
    <Pagecount>   
   
       {display ? <UserTable columns={columns}  expandable={onDesc} {...tableProps} rowKey='id'/> : 
        <UserCard   {...{data, pagination}} /> 
    }
    </Pagecount>
    </CustContext.Provider>
  )
}
