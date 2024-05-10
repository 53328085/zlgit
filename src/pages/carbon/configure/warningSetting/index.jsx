import React, {useEffect, useState} from 'react'
import Pagecount from '@com/pagecontent'
import styled from 'styled-components'
import {Form,  Space, DatePicker, Tooltip} from 'antd'
import Usetable from "@com/useTable"
import Titlelayout from "@com/titlelayout"
 import {  useDeleteStrategyMutation,
  useEnableStrategyMutation,
  useInsertStrategyMutation,
  useStrategyAllQuery,
  useUpdateStrategyMutation,} from "./warningslice"
import {CustButtonT,CustLink} from "@com/useButton"
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

export default function Index() { 

  const columns = [
    {
        title: '序号',
        dataIndex: 'year',
         key: ''
    },
   
      {
        title: '规则名称',
        dataIndex: 'ruleName',
         key: 'ruleName'
     },
     {
      title: '预期周期',
      dataIndex: 'expectedPeriod',
       key: 'expectedPeriod'
   },
   {
    title: '预期限制计算方法',
    dataIndex: 'Calculation',
     key: 'Calculation'
 }, 
 {
  title: '限值及等级',
  dataIndex: 'LimitsAndLevels',
   key: 'LimitsAndLevels'
}, 
{
  title: '是否启用',
  dataIndex: 'Enabled',
   key: 'Enabled'
}, 
   {
    title: "操作",
    dataIndex: 'total',
      key: 'total',
      align: 'center',
      render: (text,record) => {
        return <Space><CustLink text="edit" /></Space>
      }
   }
  ]
  console.log('render')
  const [form] = Form.useForm()
  const {id} = useSelector(enterprise)
 
  const {isSuccess, data} = useStrategyAllQuery()
  let tableData = []
  if(isSuccess && Array.isArray(data?.data)) {
     console.log(data?.data)
  }else {
    tableData = []
  }  
 
  const CTitle = (
    <div style={{display: 'flex', alignItems: "center", justifyContent: "space-between"}}>
        <span>预警策略配置</span>
        <Space><CustButtonT text="new"   /></Space>
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
