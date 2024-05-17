import React, {useEffect, useState} from 'react'
import Pagecount from '@com/pagecontent'
import styled from 'styled-components'
import {Form,  Space, DatePicker, Tooltip, InputNumber, message} from 'antd'
import Usetable from "@com/useTable"
import Titlelayout from "@com/titlelayout"
import {QutoSlice,  useQuotaQuery, useEmissionQuery,
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
    align: 'center',
    render: (text,_, index) =>{
       console.log(text)
       if(index == 1) {
         return <Form.Item name={i+1} style={{marginBottom: 0}} initialValue={0}>
           <InputNumber min={0} />
         </Form.Item>
       }else {
        return text
       }
    }
 })),
 {
  title: "合计",
  dataIndex: 'total',
    key: 'total',
    align: 'center',
    width: 80,
    render: (text,_, index) => {
      if(index ==1) {
        return <Form.Item noStyle shouldUpdate>
          {({getFieldsValue}) => {
             let values = getFieldsValue()             
             return Object.values(values).reduce((cur,pur) => cur+pur, 0)
          }}
        </Form.Item>
      }else {
        return text;
      }
    }
 }
]
export default function Index() { 
  const [form] = Form.useForm()
  const {id:enterpriseId} = useSelector(enterprise)
  const year = new Date().getFullYear()
  const {data: lastyear} = useEmissionQuery(enterpriseId, { // 当年
    skip: !Number.isInteger(enterpriseId)
  })
  const {isSuccess, data} = useQuotaQuery({enterpriseId, year: year}, {
    skip: !Number.isInteger(enterpriseId)
  }) //去年
  let tableData = []
 
  if(isSuccess && Array.isArray(data?.data)) {
     let obj = {},curyear = {}
    data?.data?.forEach(d => {
        obj[d.month] = d.carbonEmissionAmount
        curyear[d.month] = ''
       
     })
     curyear.year = year+'碳排放量(tCo2)'
     curyear.total=''
    tableData =[obj, curyear]
  }else {
    tableData = []
  }
  // 保存 
 
  const [saveQuota, {isLoading}] =useSaveQuotaMutation()
  const onSave = async () => {
    try {
      let values =await form.validateFields();
      let params = []
      for(let [key, value] of Object.entries(values)) {
         params.push({
          EnterpriseId:id,
          Year: year,
           Month: key,
           carbonEmissionAmount: value
         })
      }
      let {success,errMsg} = await saveQuota(params)
      if(success) {
        message.success('保存成功')
      }else {
        message.warning(errMsg || '数据出错')
      }

    } catch (error) {
      
    }
     
      
  }
  const CTitle = (
    <div style={{display: 'flex', alignItems: "center", justifyContent: "space-between"}}>
        <span>园区配额预分配</span>
        <Space>{/* <CustButtonT text="import" src='import' /><CustButtonT text="export" src='export' /> */}<CustButtonT loading={isLoading} text="save" onClick={onSave}  /></Space>
    </div>
  )
 
  const CTitleC = (
    <div style={{display: 'flex', alignItems: "center", justifyContent: "space-between"}}>
        <span>园区目标分解测算</span>
        <Space>{/* <CustButtonT text="import" src='import' /><CustButtonT text="export" src='export' /> */}<CustButtonT loading={isLoading} text="save" onClick={onSave}  /></Space>
    </div>
  )

  return (
    <Pagecount bgcolor="transparent" pd="0">
          <Titlelayout title={CTitle} layout="flex">
            <Mainbox> 
              <Form form={form} component={false}>             
               <Usetable columns={columns} dataSource={tableData} scroll={{x: 1648}} hbg="#ecf5ff" hbc="#515151" />
               </Form> 
             </Mainbox>
          </Titlelayout>
    </Pagecount>
  )
}
