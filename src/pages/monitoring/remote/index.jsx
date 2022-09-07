import React from 'react'
import { useAntdTable, usePagination } from 'ahooks'
import { Remote } from '@api/api.js'
import {Form} from 'antd'
import Pagecount from '@com/pagecontent'
import UserTable from '@com/useTable'
import {columns} from './columns'
import CustContext from '@com/content.js'
export default function Index() {
  const tabs = [
    {label: '电表', value: 'electric'},
    {label: '水表', value: 'water'},
    {label: '燃气表', value: 'gas'}
  ]
  const [form] =Form.useForm()
  let params = {
    meterType: 0,
    projectId: 1,
    regionId: 0,
    buildingId: 0,
    floorId: 0,
    roomId: 0,
    type: 0,
    pageNum: 1,
    pageSize: 14,
    alike: ''
  }
  const getTableData =async ({current,pageSize},formData)=>{
    const res =await Remote.AllMeter(params)
    let {success,data,totalNum} =res
    console.log('current,pageSize',current,pageSize,formData)
    if(success&&Array.isArray(data)){
      return {
        total:totalNum,
        list:data
      }
    }else{
      return{
        total:0,
        list:[]
      }
    }
    console.log('result',res)
  }
 
  const {tableProps,search} = useAntdTable(getTableData,{
    form
  })
  const {submit} =search
  const propsData ={
    tabs,
    form,
    search,

  }
  console.log('search',search)
  return (
    <CustContext.Provider value={propsData}>
    <Pagecount tabs={tabs} form={form} search={search}>
      
        <UserTable columns={columns}  {...tableProps}></UserTable>
    </Pagecount>
    </CustContext.Provider>
  )
}
