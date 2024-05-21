import React, {useEffect, useRef, useState} from 'react'
import Pagecount from '@com/pagecontent'
import styled from 'styled-components'
import {Form,  Space, DatePicker, Tooltip, InputNumber, Input} from 'antd'
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
import CModal from "@com/useModal"

 
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
export default function Index() { 


  
  const [form] = Form.useForm()
  const {id} = useSelector(enterprise)

  const [title, setTitle] = useState('')
  const [tableData, setTableData] = useState([])
  const ref= useRef()
/*   const {isSuccess, data} = useStrategyAllQuery()
  let tableData = []
  if(isSuccess && Array.isArray(data?.data)) {
     console.log(data?.data)
  }else {
    tableData = []
  }  
  */
 const onAdd =() => {
  setTitle('新增预警策略配置')
   ref.current.onOpen()
 }
  const CTitle = (
    <div style={{display: 'flex', alignItems: "center", justifyContent: "space-between"}}>
        <span>预警策略配置</span>
        <Space><CustButtonT text="new" onClick={onAdd}   /></Space>
    </div>
  )
 
  const onOk = async () => {
      try {
        let values =  await form.validateFields()
        console.log(values)
      } catch (error) {
        
      }
  }
  const rules = [
    {
      required: true
    }
  ]
  const onChange = (v) => {
    let max = (v-0.01).toFixed(2)
    form.setFieldValue(['2', 'LimitValueMax'],max)
  }
  const onChangel = (v) => {
    let max = (v+0.01).toFixed(2)
    form.setFieldValue(['2', 'LimitValueMin'],max)
  }
  return (
    <Pagecount bgcolor="transparent" pd="0">
     
    
          <Titlelayout title={CTitle} layout="flex">
            <Mainbox>               
               <Usetable columns={columns} dataSource={tableData} scroll={{x: 1648}} hbg="#ecf5ff" hbc="#515151" />
            
             </Mainbox>

          </Titlelayout>
    <CModal title={title} ref={ref} mold="cust" onOk={onOk} width={424}>
        <Form form={form}   preserve={false} labelCol={{span: 4}} labelAlign='left'>
           <Form.Item label="紧急  ≥" >
              <Space>
                <Form.Item name={['1', 'LimitValueMin']} rules={rules}>
                   <InputNumber min={0} style={{width: '100px'}} max={99} step={0.01} onChange={onChange} />
                </Form.Item>
                <strong>%</strong>
                <Form.Item name={['1', 'LimitValueMax']} noStyle initialValue={100}>
                   <InputNumber   type="hidden" style={{border: "none"}} />
                </Form.Item>
              </Space>  
           </Form.Item>
           <Form.Item label="严重"   >
                      <Space>
                         <Form.Item name={['2', 'LimitValueMin']} rules={rules}>
                             <InputNumber min={0} style={{width: '100px'}} step={0.01} disabled />
                         </Form.Item>
                         <p>% ~</p>
                         <Form.Item name={['2', 'LimitValueMax']} >
                             <InputNumber min={0} style={{width: '100px'}} step={0.01} disabled />
                         </Form.Item>
                      </Space>
           </Form.Item>
           <Form.Item label="一般  ≤" shouldUpdate>
            {
             ({getFieldValue}) => {
              let init = (getFieldValue(['2', 'LimitValueMax']) -0.02).toFixed(2)
               
               return (
                <Space>
                <Form.Item name={['3', 'LimitValueMax']} noStyle>
                     <InputNumber   style={{width: '100px'}} min={0.01} max={init} onChange={onChangel} />
                 </Form.Item>
                 <strong>%</strong>
                 <Form.Item name={['3', 'LimitValueMin']} noStyle initialValue={0}>
                     <InputNumber type="hidden" style={{border: "none"}} />
                 </Form.Item>                        
                </Space>
               )


             }


            }
                     
           </Form.Item>
           <Form.Item >
              <p style={{color: "#f00"}}>注：输入的值为已排放量占配额的百分比</p>
           </Form.Item>
        </Form>

     </CModal>
    </Pagecount>
  )
}
