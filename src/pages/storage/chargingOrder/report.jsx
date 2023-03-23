import React, { useState, useRef, useEffect } from 'react'
import styled from 'styled-components'
import {Typography, Image, Form, Space, Button, Input, Select, DatePicker, Checkbox, Calendar, Descriptions,Tag, Divider } from 'antd'
import {CaretRightOutlined, CaretUpFilled, CaretDownFilled}  from '@ant-design/icons'
import {nanoid} from "@reduxjs/toolkit"
import moment from 'moment'
import Titlelayout from '@com/titlelayout'
import Usetable from '@com/useTable'
import {StorageReportRuntime} from '@api/api'
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
 
const columns = [
    {
        title: '充发单号',
        dataIndex: 'order',
        key: 'order',
        align: 'center'
    },
    {
        title: '充放类型',
        dataIndex: 'type',
        key: 'type',
        align: 'center'
    },
    {
      title: '电量',
      dataIndex: 'electric',
      key: 'electric',
      align: 'center'
    },
    {
      title: '总金额（元）',
      dataIndex: 'amount',
      key: 'amount',
      align: 'center'
    },
    {
      title: '时长',
      dataIndex: 'time',
      key: 'time',
      align: 'center'
    },
    {
      title: '开始时间',
      dataIndex: 'start',
      key: 'start',
      align: 'center'
    },
    {
      title: '结束时间',
      dataIndex: 'start',
      key: 'start',
      align: 'center'
    },
    {
      title: '实时状态',
      dataIndex: 'state',
      key: 'state',
      align: 'center'
    },
    {
      title: '操作',
      key: 'op'
    }
   ]
 
 function Main({projectId, areaId }) {
   const [price ,setPrice] = useState({})
   const [tableData, setTableData] = useState([])
   const [form] = Form.useForm();
   const startime = '2023-03-03'
   const endtime = '2023-03-23'
   const [dates, setDates] = useState([moment(startime, 'YYYY-MM-DD'), moment(endtime, 'YYYY-MM-DD')])
   const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 15,
    total: 0
  })
  const getPrice = async() => {
    try {
        let {success, data} = await StorageReportRuntime.QueryPrice(projectId, areaId)
        success && setPrice({...price, ...data})
        !success && setPrice({})
    } catch (error) {
        console.log(error)
    }
   
  } 
 const timechange = (data, dateStrings) => { 
     setDates([...data])
 }
  const params = {
    start: '',
    end: '',
    projectId,
    pageNum: pagination.current,
    pageSize: pagination.pageSize,
  }
  const vdata = [
    {label: '充电电量', value: '20000120000000.00 kWh'},
    {label: '充电时长', value: '1252.25 小时'},
    {label: '充电金额', value: '7200.00 元'},
    {label: '放电电量', value: '16000.00 kwh'},
    {label: '放电时间', value: '1523.36 小时'},
    {label: '放电金额', value: '20160.00 元'},
    {label: '收益', value: '12960.00 元'},
  ]
  const QueryReports = async() => {   
    try {
        let [start, end] = dates;
        if ( start instanceof moment) {
            
            params.start = start.format('YYYY-MM-DD')
        }
        if (end instanceof moment) {
            params.end = end.format('YYYY-MM-DD')
        }
        let {success, data, total} = await StorageReportRuntime.QueryReports(params, areaId)
        if (success && Array.isArray(data) && data.length >0) {
           
           setTableData([...data])   
           setPagination({...pagination, total: total})
        } else {
            setTableData([])
            setPagination({...pagination, total: 0})
        }
    } catch (error) {
        console.log(error)
    }
   
  }
  const rest = () => {
    params.end = endtime;
    params.start = startime;
    QueryReports();
  }
  const tableOnchange = (e) => { 
    let {current} = e
      setPagination({
        ...pagination,
        current,
      })
   
  }
  useEffect(() => {
    QueryReports()
  }, [])
  useEffect(() => {
    getPrice()
    QueryReports()
  }, [areaId])
 
  return (
    <Titlelayout title="充放订单" layout="flex" >
    <Mainbox>
        <div className='top'>
          <Form form={form} layout="inline">
           <Space size={16}>
           <Item name="runstate" noStyle>
                 <Select options={[{
                  label: '正在充电',
                  value: 1
                 },
                 {
                  label: '正在放电',
                  value: 2
                 },
                 {
                  label: '已完成',
                  value: 3
                 },
                 {
                  label: '异常',
                  value: 4
                 }
                 ]}
                 placeholder="请选择运行状态"
                 style={{width: '200px'}}
                 ></Select>
           </Item>
           <Item name="runstate" noStyle>
                 <Select options={[{
                  label: '充电',
                  value: 1
                 },
                 {
                  label: '在放电',
                  value: 2
                 }
                 
                 ]}
                 placeholder="请选择充放类型"
                 style={{width: '200px'}}
                 ></Select>
           </Item>
           </Space>
          <Space size={32} style={{marginLeft: '32px'}}>
              <Divider style={{margin: '0', height: '32px'}} type="vertical" />
             <Item name="date" label="订单时间">
                <RangePicker value={dates} onChange={timechange}  format="YYYY-MM-DD" style={{width: '320px'}}/>
             </Item>
          </Space>
          </Form>
        </div>
        
         <Divider style={{margin: '0px'}}/>
         <div className='info'>
           
               {vdata.map(v => <div className='item'>
                {v.label}
                <Text ellipsis={{tooltip: v.value}}>{v.value}</Text>
               </div>)}
              <ExportButton style={{marginLeft: 'auto'}}/>
         </div>
        <Usetable columns={columns} dataSource={tableData} rowKey={nanoid()} pagination={pagination} onChange={tableOnchange} />
      
    </Mainbox>
    </Titlelayout>
  )
}
export default function Index(props) {
    return (
        <Main {...props}     />
    )
}