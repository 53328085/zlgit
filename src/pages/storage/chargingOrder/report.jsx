import React, { useState, useRef, useEffect } from 'react'
import styled from 'styled-components'
import {Typography, Image, Form, Space, Button, Input, Select, DatePicker, Checkbox, Calendar, Descriptions,Tag, Divider } from 'antd'
 import {useAntdTable} from 'ahooks'
import {nanoid} from "@reduxjs/toolkit"
import moment from 'moment'
import Titlelayout from '@com/titlelayout'
import Usetable from '@com/useTable'
import {StorageOrderRuntime} from '@api/api'
import {ExportButton} from '@com/useButton'
const {Text, Link, Title, Paragraph} = Typography
const {Item} = Form
const { RangePicker } = DatePicker;
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
 

 
 function Main({projectId, areaId }) {
  
   const [soption, setSoption] = useState([])
   const [toption, setToption] = useState([])
   const [tableData, setTableData] = useState([])
   const [form] = Form.useForm();
   const startime = moment().add(7, 'day')
   const endtime = moment()
   const [dates, setDates] = useState([moment(startime, 'YYYY-MM-DD'), moment(endtime, 'YYYY-MM-DD')])
   const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 15,
    total: 0
  })
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
      render: (text) => {}
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
    render: (_,record) => <Space size={16}>
       <Link underline onClick={onView.bind(null, record)}>订单详情</Link>
  </Space>
  }
 ]

const defuldata = [
  {label: '充电电量', value: '', key: 'chargingAmount'},
  {label: '充电时长', value:  '', key: 'chargingDuration'},
  {label: '充电金额', value: '', key: 'chargingCapacity'},
  {label: '放电电量', value: '', key: 'disChargingAmount'},
  {label: '放电时间', value: '', key: 'disChargingDuration'},
  {label: '放电金额', value: '', key: 'disChargingCapacity'},
  {label: '收益', value: '', key: 'torageIncome'},
]
const [charData, setCharData] = useState([])
 const getTableData = ({current, pageSize}, formData) => {
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
     if (success && data) {
       let {orderDetails, ...values} = data 
      Object.entries(values).forEach(v => {
            
      })
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
 const {tableProps, search} = useAntdTable(getTableData, {
   form,
   defaultParams: [
    {current: 1, pageSize: 15},
    {state: 1, type:1, date: [moment(), moment().add(7, 'day')]}
   ]
   
 })
const {submit} = search


 


 
/*   useEffect(() => {
    QueryReports()
  }, []) */
  useEffect(() => {
    getStatus()
    QueryType()
  }, [areaId])
 
  return (
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
                <RangePicker value={dates} onChange={submit}  format="YYYY-MM-DD" style={{width: '320px'}}/>
             </Item>
          </Space>
          </Form>
        </div>
        
         <Divider style={{margin: '0px'}}/>
         <div className='info'>
           
               {charData.map(v => <div className='item' key={v.key}>
                {v.label}
                <Text ellipsis={{tooltip: v.value}}>{v.value}</Text>
               </div>)}
              <ExportButton style={{marginLeft: 'auto'}}/>
         </div>
        <Usetable columns={columns}   rowKey={nanoid()}  {...tableProps} />
      
    </Mainbox>
    </Titlelayout>
  )
}
export default function Index(props) {
    return (
        <Main {...props}     />
    )
}