import React, { useState,   useEffect, useRef, useCallback } from 'react'

import styled from 'styled-components'
import {Typography,  Form, Space, Button,    Select, DatePicker, Descriptions,  Divider} from 'antd'
 import {useAntdTable} from 'ahooks'
import {nanoid} from "@reduxjs/toolkit"
import {  useOutletContext} from 'react-router-dom'
import moment from 'moment'
import Titlelayout from '@com/titlelayout'
import Usetable from '@com/useTable'
import {StorageOrderRuntime} from '@api/api'
import {  ExportExcel} from '@com/useButton'
import CModal from '@com/useModal'
import Pagecount from "@com/pagecontent";
import {Cdivider} from "@com/comstyled"
const {Text, Link,} = Typography
const {Item} = Form
const { RangePicker } = DatePicker;
const disabledDate = (current) => {   
  return current && current > moment().endOf('day');
}
const Mainbox = styled.div`
    && {
       display: grid;
       grid-template-rows: 32px 4px 32px 1fr;
       row-gap: 16px; 
       flex: 1;
       color:#515151;
       padding-top: 16px;
        .top {
            display: flex; 
            align-items: center;

        }
        .info {
          display: grid;
          grid-template-columns: repeat(7, 196px) 1fr;
          column-gap: 16px;
          .item {
             color: #fff;
             display: flex;
             align-items: center;
             justify-content: space-between;
             padding: 0 8px 0 12px;
             .ant-typography {
              color: #fff;
              max-width: 118px;
             }
             &:nth-of-type(1),&:nth-of-type(2), &:nth-of-type(3) {
              background-color: #56b653 ;
             }
             &:nth-of-type(4),&:nth-of-type(5), &:nth-of-type(6) {
              background-color: #4370ff ;
             }
             &:last-of-type {
              background-color: #9951fe ;
             }
          }

        }
        .ant-table-thead {
            tr:first-of-type th {
              background-color: #f0f9ff;
            }
        }
       }

`
 

 
 export default function Index() {
  let {exparams} = useOutletContext()
  let {areaId,  projectId} = exparams
   const [soption, setSoption] = useState([])
   const [toption, setToption] = useState([])
   
   const [form] = Form.useForm();
   const end = moment();
   const star = moment().subtract(7, 'day')
   const [dates, setDates] = useState([moment(star, 'YYYY-MM-DD'), moment(end, 'YYYY-MM-DD')])
 
  const getStatus = async() => {
    try {
        let {success, data} = await StorageOrderRuntime.QueryRuntimeStatus()
        if (success && Array.isArray(data)) {
          setSoption([...data])
        }else {
          setSoption([])
        }    
    } catch (error) {
        console.log(error)
    }
   
  } 

  const QueryType = async() => {
    try {
        let {success, data} = await StorageOrderRuntime.QueryType()
        if (success && Array.isArray(data)) {
          setToption([...data])
        }else {
          setToption([])
        }    
    } catch (error) {
        console.log(error)
    }
   
  }
const [Record, setRecord] = useState({})
  const rref = useRef()
 const onView = (record) => {
   setRecord(record)
   rref.current.onOpen()
 }

 const onclose = () => {
  rref.current.onCancel()
 }
 const labelStyle ={
    height: '32px',
    padding: '2px 16px',
    backgroundColor: "#f0f9ff",
    color: "#515151"
    
 }
 const contentStyle = {
  height: '32px',
    padding: '2px 16px'
 }
  /* {
  "projectId": 0,
  "pageNum": 0,
  "pageSize": 0,
  "start": "2023-03-30T06:32:19.204Z",
  "end": "2023-03-30T06:32:19.204Z"
} */

const columns = [
  {
      title: '充发单号',
      dataIndex: 'orderNo',
      key: 'orderNo',
      align: 'center'
  },
  {
      title: '充放类型',
      dataIndex: 'type',
      key: 'type',
      align: 'center',
      render: (text) =>  <span>{text == 1 ? '充电': text == 2 ? '放电' : null}</span>
  },
  {
    title: '电量(kwh)',
    dataIndex: 'e',
    key: 'e',
    align: 'center'
  },
  {
    title: '总金额（元）',
    dataIndex: 'income',
    key: 'income',
    align: 'center'
  },
  {
    title: '时长',
    dataIndex: 'duration',
    key: 'duration',
    align: 'center'
  },
  {
    title: '开始时间',
    dataIndex: 'startTime',
    key: 'startTime',
    align: 'center'
  },
  {
    title: '结束时间',
    dataIndex: 'endTime',
    key: 'endTime',
    align: 'center'
  },
  {
    title: '实时状态',
    dataIndex: 'status',
    key: 'status',
    align: 'center'
  },
  {
    title: '操作',
    key: 'op',
    align: 'center',
    export: false,
    render: (_,record) => <Space size={16}>
       <Link underline onClick={onView.bind(null, record)}>订单详情</Link>
  </Space>
  }
 ]

 
const [charData, setCharData] = useState({})
const [total, setTotal] = useState(0)

let getTableData = ({current, pageSize}, formData) => {
 
  let {state, type, date} = formData
  let start = date[0].format('YYYY-MM-DD')
  let end = date[0].format('YYYY-MM-DD')
  const params = {
    projectId,
    pageNum: current,
    pageSize,
    start,
    end

  }

   return StorageOrderRuntime.QueryStorageOrders(areaId, state, type, params).then(res => {
     let {success, data, total} = res    
     setTotal(total) 
     if (success && data) {
       let {orderDetails, ...values} = data 
      setCharData({...values})
      return {
        list: orderDetails,
        total
      }
     } else {
      return {
        list: [],
        total: 0
       }
     }
   }).catch(e => {
    console.log(e)
   })
     

 }
 const {tableProps, search,  runAsync} = useAntdTable(getTableData, {
   form,
   defaultParams: [
    {current: 1, pageSize: 15},
    {state: 1, type:1, date: [moment().subtract(7, 'day'), moment()]}
   ],
   manual: false,  
   onError: (error) => {
    console.log(error)
   }
 })
const {submit} = search

const tbref = useRef()

const onExport = useCallback(() => {
      let formData = form.getFieldsValue()
      return  getTableData({current: 1, pageSize: total}, formData)
  
  //  tbref.current.download()

}, [total])

 
/*   useEffect(() => {
    QueryReports()
  }, []) */


  useEffect(() => {
    getStatus()
    QueryType()
  }, [areaId])
 
  return (
    <Pagecount>
    <Titlelayout title="充放订单" layout="flex" >
    <Mainbox>
        <div className='top'>
          <Form form={form} layout="inline">
           <Space size={16}>
           <Item name="state" noStyle>
                 <Select options={soption}
                 placeholder="请选择运行状态"
                 style={{width: '200px'}}
                 fieldNames={{label: 'name', value: 'id'}}
                 onChange={submit}
                 ></Select>
           </Item>
           <Item name="type" noStyle>
                 <Select options={toption}
                  fieldNames={{label: 'name', value: 'id'}}
                 placeholder="请选择充放类型"
                 style={{width: '200px'}}
                 onChange={submit}
                 ></Select>
           </Item>
           </Space>
          <Space size={32} style={{marginLeft: '32px'}}>
              <Divider style={{margin: '0', height: '32px'}} type="vertical" />
             <Item name="date" label="订单时间">
                <RangePicker value={dates} onChange={submit}  format="YYYY-MM-DD" style={{width: '320px'}} disabledDate={disabledDate}/>
             </Item>
          </Space>
          </Form>
        </div>
        
         <Cdivider style={{margin: '0px'}} type="h" />
 

         <div className='info'>
           
               <div className='item'>
                 充电电量
                <Text ellipsis={{tooltip: charData.chargingAmount}}>{charData.chargingAmount} &nbsp;kWh</Text>
               </div>
               <div className='item'>
                 充电时长
                <Text ellipsis={{tooltip: charData.chargingDuration}}>{charData.chargingDuration} &nbsp;小时</Text>
               </div>
               <div className='item'>
                 充电金额
                <Text ellipsis={{tooltip: charData.chargingCapacity}}>{charData.chargingCapacity} &nbsp;元</Text>
               </div>

               <div className='item'>
                 放电电量
                <Text ellipsis={{tooltip: charData.disChargingAmount}}>{charData.disChargingAmount} &nbsp;kWh</Text>
               </div>
               <div className='item'>
                 充电时长
                <Text ellipsis={{tooltip: charData.disChargingDuration}}>{charData.disChargingDuration} &nbsp;小时</Text>
               </div>
               <div className='item'>
                 放电金额
                <Text ellipsis={{tooltip: charData.disChargingCapacity}}>{charData.disChargingCapacity} &nbsp;元</Text>
               </div>
               <div className='item'>
                 收益
                <Text ellipsis={{tooltip: charData.storageIncome}}>{charData.storageIncome} &nbsp;元</Text>
               </div>
             {/*  <ExportButton style={{marginLeft: 'auto'}} onClick={onExport} /> */}
            <ExportExcel style={{marginLeft: 'auto'}} tb={tbref} />
         </div>
        <Usetable columns={columns} ref={tbref}  rowKey={nanoid()}  {...tableProps} sheetName="充放订单"  onExport={onExport} />
        <CModal width={664} title="运行单详情" ref={rref}   mold='cust' footer={<Space><Button onClick={onclose}>取消</Button><Button type="primary" onClick={onclose}>确定</Button></Space>}>
        <Descriptions  column={1} bordered labelStyle={labelStyle} contentStyle={contentStyle}>
    <Descriptions.Item label="运行单号" key={nanoid()}>{Record.orderNo}</Descriptions.Item>
    <Descriptions.Item label="运行单状态" key={nanoid()}>{Record.status}</Descriptions.Item>
    <Descriptions.Item label="创建时间" key={nanoid()}>{Record.createTime}</Descriptions.Item>
    <Descriptions.Item label="更新时间" key={nanoid()}>{Record.updateTime}</Descriptions.Item>
    <Descriptions.Item label="运行单类型" key={nanoid()}>{Record.type== 1 ? '充电' : '放电'}</Descriptions.Item>
    <Descriptions.Item label="运行单电量" key={nanoid()}>{Record.e}</Descriptions.Item>
    <Descriptions.Item label="总金额" key={nanoid()}>{Record.income}</Descriptions.Item>
    <Descriptions.Item label="尖时段电量" key={nanoid()}>{Record.e1}</Descriptions.Item>
    <Descriptions.Item label="峰时段电量" key={nanoid()}>{Record.e2}</Descriptions.Item>
    <Descriptions.Item label="平时段电量" key={nanoid()}>{Record.e3}</Descriptions.Item>
    <Descriptions.Item label="谷时段电量" key={nanoid()}>{Record.e4}</Descriptions.Item>
    <Descriptions.Item label="开始SOC" key={nanoid()}>{Record.startSoc}</Descriptions.Item>
    <Descriptions.Item label="结束SOC" key={nanoid()}>{Record.endSoc}</Descriptions.Item>
    <Descriptions.Item label="开始时间" key={nanoid()}>{Record.startTime}</Descriptions.Item>
    <Descriptions.Item label="充电时长" key={nanoid()}>{Record.duration}</Descriptions.Item>
  </Descriptions> 
         
        </CModal>
    </Mainbox>
    </Titlelayout>
    </Pagecount>
  )
}
 