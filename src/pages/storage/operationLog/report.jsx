import React, { useState, useRef, useEffect } from 'react'
import styled from 'styled-components'
import {Typography, Image, Form, Space, Button, Input, Select, DatePicker, Checkbox, Calendar, Descriptions,Tag, Divider } from 'antd'
import {CaretRightOutlined, CaretUpFilled, CaretDownFilled}  from '@ant-design/icons'
import {nanoid} from "@reduxjs/toolkit"
import moment from 'moment'
import Titlelayout from '@com/titlelayout'
import Usetable from '@com/useTable'
import {StorageAlarmRuntime} from '@api/api'
 
const {Text, Link, Title, Paragraph} = Typography
const {Item} = Form
const { RangePicker } = DatePicker;
const Mainbox = styled.div`
    && { 
        display: grid;
        grid-template-rows: 32px 4px 1fr;
        row-gap: 16px; 
        flex: 1;
        color:#515151;
        padding-top: 16px;
        .top {
            display: flex;
            justify-content: space-between;
            align-items: center;

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
        title: '操作时间',
        dataIndex: 'warningTime',
        key: 'warningTime',
        align: 'center'
    },
    {
        title: '时间类型',
        dataIndex: 'alarmEvent',
        key: 'alarmEvent',
        align: 'center'
    },
    {
      title: '事件描述',
      dataIndex: 'address',
      key: 'address',
      align: 'center'
  },
  {
    title: '状态',
    dataIndex: 'level',
    key: 'level',
    align: 'center'
   },
   ]
 
 function Main({projectId, areaId }) {
   const [form] = Form.useForm()
   const [statistics ,setStatistics] = useState([])
   const [tableData, setTableData] = useState([])
   const startime = '2023-03-20'
   const endtime = '2024-03-20'
   const [dates, setDates] = useState([moment(startime, 'YYYY-MM-DD'), moment(endtime, 'YYYY-MM-DD')])
   const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 15,
    total: 0
  })
  const getData = async() => {
    try {
        let {success, data} = await StorageAlarmRuntime.AlarmStatistics(projectId, areaId)
        console.log(Object.keys(data))
        console.log(Object.values(data))
        success && setStatistics([...Object.values(data)])
        !success && setStatistics([])
    } catch (error) {
        console.log(error)
    }
   
  } 
 const timechange = (data, dateStrings) => { 
     setDates([...data])
 }
  let params = {
    start: '2023-03-20',
    end: '2024-03-20',
    projectId,
    pageNum: pagination.current,
    pageSize: pagination.pageSize,
    content : "",
    deviceType: 0,
    level: 0
  }
 
  const QueryReports = async() => {   
    try {
        let {success, data, total} = await StorageAlarmRuntime.QueryStorageAlarmByPage(params)
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
  const onQuery = () => {
    try {
      let {time, ...other} = form.getFieldsValue()
      
      if(Array.isArray(time) && time.length >1) {
        params.start = time[0].format('YYYY-MM-DD') || ''
        params.end = time[1].format('YYYY-MM-DD') || ''
      }
     
      params = {...params, ...other};
      QueryReports()
    } catch (error) {
      console.log(error)
    }
    
  }
  const rest = () => { 
    form.resetFields()
    onQuery()

  }
  const tableOnchange = (e) => { 
    let {current} = e
      setPagination({
        ...pagination,
        current,
      })
   
  }
  const tbref = useRef()
  const onExport = () => {
    tbref.current.download()
  }
  useEffect(() => {
    QueryReports()
  }, [])
  useEffect(() => {
    getData()
    QueryReports()
  }, [areaId])
 
  return (   
    <Titlelayout title="操作日志" layout="flex" >
        <Mainbox>
    
        <Form form={form} className='top' layout='inline' initialValues={{
          content: '',
          deviceType:0,
          level: 0,
          time: dates
        }}>
          <Space size={16}>
             <Item label="日志查询" name="content">
              <Input placeholder='操作内容' style={{width: '320px'}} />
             </Item>
             <Divider style={{margin: '0', height: '32px'}}  type="vertical" />
             <Item label="设备类型" name="deviceType">
              <Select options={[
                {label: '全部', value: 0},
                {label: 'PCS', value: 1},
                {label: '电堆', value: 2}
              ]}
              style={{width: '112px'}}
              ></Select>
             </Item>
             <Divider style={{margin: '0', height: '32px'}} type="vertical" />
             <Item label="告警等级" name="level">
              <Select options={[
                {label: '全部告警', value: 0},
                {label: '一级告警', value: 2},
                {label: '二级告警', value: 3},
                {label: '三级告警', value: 4},
              ]}
              style={{width: '112px'}}
              ></Select>
             </Item>
             <Divider style={{margin: '0', height: '32px'}} type="vertical" />
             <Item label="告警时间" name="time" >
               <RangePicker  onChange={timechange}  format="YYYY-MM-DD" style={{width: '320px'}}/>
            </Item>
            <Item noStyle>
              <Space>
                <Button onClick={onQuery}>查询</Button>
                <Button onClick={rest}>重置</Button>
                </Space>
            </Item>
           </Space>
           <Item noStyle>
              <Button onClick={onExport} type="primary">导出</Button>
           </Item>
        </Form>
        
         <Divider style={{margin: '0px'}}/>
        <Usetable columns={columns} dataSource={tableData} rowKey={nanoid()} pagination={pagination} onChange={tableOnchange} sheetName="操作日志" ref={tbref} />
    </Mainbox>
    </Titlelayout>
  
  )
}
export default function Index(props) {
    return (
        <Main {...props}     />
    )
}