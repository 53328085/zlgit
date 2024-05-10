import React, {useEffect, useState} from 'react'
import Pagecount from '@com/pagecontent'
import styled from 'styled-components'
import {Form,  Space, DatePicker, Tooltip} from 'antd'
import Usetable from "@com/useTable"
import Titlelayout from "@com/titlelayout"
import {QutoSlice,  useQuotaQuery,
  useSaveQuotaMutation} from "./quotaslice"
import {CustButtonT} from "@com/useButton"
import {Cdivider} from "@com/comstyled"
import {useSelector} from 'react-redux'
import {selectProjectId, enterprise} from '@redux/systemconfig'
const Mainbox = styled.div`
  margin-top: 16px;
    padding-top: 16px;
    border-top: 1px dotted #d7d7d7;
    display: flex;
    flex-direction: column;
    gap: 16px;
    flex:1;
`
const columns = [
  {
      title: '年份',
      dataIndex: 'year',
      width: 180
  },
 ...Array.from({length: 12}, ( index,i) => ({
    title: i+1+'月',
    dataIndex: i+1,
    key: i+1,
    width: 80,
    align: 'center'

 })),
 {
  title: "合计",
  dataIndex: 'total',
    key: 'total',
    align: 'center',
    width: 80
 }
]
export default function Index() { 
  console.log('render')
  const [form] = Form.useForm()
  const {id} = useSelector(enterprise)
 
  const {isSuccess, data} = useQuotaQuery(id)
  let tableData = []
  if(isSuccess && Array.isArray(data?.data)) {
     let obj = {}
    data?.data?.forEach(d => {
        obj[d.month] = d.carbonEmissionAmount
        obj.year = ''
        obj.total=''
     })
      console.log(obj)
    tableData =[obj]
  }else {
    tableData = []
  }
 
  const CTitle = (
    <div style={{display: 'flex', alignItems: "center", justifyContent: "space-between"}}>
        <span>园区配额预分配</span>
        <Space><CustButtonT text="import" src='import' /><CustButtonT text="export" src='export' /><CustButtonT text="save" src='save' /></Space>
    </div>
  )
 
  return (
    <Pagecount bgcolor="transparent" pd="0">
     
    
          <Titlelayout title={CTitle} layout="flex">
            <Mainbox>               
               <Usetable columns={columns} dataSource={tableData} scroll={{x: 1648}} hbg="#ecf5ff" hbc="#515151" />
            
             </Mainbox>

          </Titlelayout>
        
    </Pagecount>
  )
}
