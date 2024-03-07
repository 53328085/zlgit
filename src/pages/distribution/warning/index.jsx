import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import styled from 'styled-components'
import style from './style.module.less'
import { Image, Form, Space, Button, Input, Select, DatePicker,   Divider, message } from 'antd'
import { useAntdTable, useSetState } from 'ahooks'
import { nanoid } from "@reduxjs/toolkit"
import { selectcurlRommid, selectProjectId } from "@redux/systemconfig";
import moment from 'moment'
import Titlelayout from '@com/titlelayout'
import Usetable from '@com/useTable'
import { OperationLogRuntime, distributionRoom, DistributionRoomRuntime } from '@api/api'
import { ExportExcel } from '@com/useButton'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate, useLocation,Link  } from 'react-router-dom'
import {Serach, Cdivider, Borderleft} from "@com/comstyled"
import Pagecount from "@com/pagecontent";
const { Item } = Form
const { RangePicker } = DatePicker;
const Mainbox = styled.div`
    && {
      flex: 1;
      display: flex;
      flex-direction: column;
      .content {
        display: grid;
        grid-template-rows: 32px 4px 1fr;
        row-gap: 16px; 
        flex: 1;
        color:#515151;
        padding-top: 16px;
        height: 700px;   
        width: 1650px;
        .top {
            display: flex;
            justify-content: space-between;
            align-items: center;

        }
     
        .ant-form-inline {
          .ant-form-item {
            margin-right: 0;
          }
        }
      }
       
       }

`
export default  function Index() {

  const projectId = useSelector(selectProjectId)
  const roomId = useSelector(selectcurlRommid)
  const columns = [
    {
      title: '最新告警时间',
      dataIndex: 'alarmTime',
      key: 'alarmTime',
      align: 'center'
    },
    {
      title: '告警等级',
      dataIndex: 'level',
      key: 'level',
      align: 'center'
    },
    {
      title: ' 最新告警事件',
      dataIndex: 'alarmEvent',
      key: 'alarmEvent',
      align: 'center'
    },
    {
      title: '设备名称',
      dataIndex: 'name',
      key: 'name',
      align: 'center'
    },
    {
      title: '设备安装地址',
      dataIndex: 'address',
      key: 'address',
      align: 'center'
    },
    {
      title: '设备编号',
      dataIndex: 'sn',
      key: 'sn',
      align: 'center'
    },
    {
      title: '设备类型',
      dataIndex: 'category',
      key: 'category',
      align: 'center'
    },
    {
      title: '操作',
      key: 'action',
      align: 'center',
      render: (_, record) => (
        <Space size="middle">
          <Link className={style.detailText} target="blank" to={`/deviceDetail?sn=${record.sn}`}>详情</Link>
        </Space>
      ),
    },
  ]
  const navigate = useNavigate()
  const [form] = Form.useForm()

  const dispatch = useDispatch()
  const [keycode, setKeycode] = useState(0)
  const [total, setTotal] = useState(0)
 
  const [tabledata,setTabledata] = useState([])
  
  const [level,setLevel] =useState(0)
  const [pageInfo,setPageInfo] =useState({
    pageNum:1,
    pageSize:10,
    total:0
  })
  // const areaOptions = oneLevel.length > 0 ? useMemo(() => ([{ name: oneLevel[0].levelName + '(全部)', id: 0 }, ...oneLevel]), [oneLevel]) : []
  // const onDetail = (record) => {
  //   console.log(record);
  //   // ${record.sn}
  //   navigate('/deviceDetail?sn=87489220500687', {
  //     state: { type: 'index', primary: 'deviceDetail', title: '告警信息', nested: 'deviceDetail' }
  //   })
  // }
  const changeLevel=(v)=>{
    setLevel(v)
    setPageInfo({
      ...pageInfo,
      pageNum:1
    })
  }
  const changeTime=(v,m,n)=>{
    warnPage()
    setPageInfo({
      ...pageInfo,
      pageNum:1
    })
  }
  const disabledDate=(date)=>{
   return date&&date>moment()
  }
  const changePage=(page,pageSize)=>{
    console.log(page,pageSize)
    setPageInfo({
      pageNum:page.current,
      pageSize:page.pageSize,
      total:page.total
    })
  }


  const tableref = useRef()
  const onExport = useCallback(() => {
    let formData = form.getFieldsValue()
    return QueryReports({ current: 1, pageSize: total }, formData)
  }, [total])


 
 

  const warnPage =async () => {
    const {time,type} = form.getFieldsValue()
    let params = {
      projectId,
      pageNum:pageInfo.pageNum ,
      pageSize: pageInfo.pageSize,
      roomId,
      level:type,
      status: 1,
      start:time[0].format('YYYY-MM-DD 00:00:00 '),
      end: time[1].format('YYYY-MM-DD 23:59:59')
    }
   const resp =  await  DistributionRoomRuntime.WarningPage(params)
   if(resp.success){
      if(Array.isArray(resp.data)){
        setTabledata(resp.data)
      }else{
        setTabledata([])
      } 
      setPageInfo({
        pageNum:resp.pageNum,
        pageSize:resp.pageSize,
        total:resp.total,
      })
   }else{
    message.error(resp.errMsg)
   }

  }
  useEffect(() => {
    if(roomId) {
      warnPage()
    }

  }, [roomId,level,JSON.stringify(pageInfo) ])

  return (
    <Pagecount bgcolor="transparent" pd="0">
      <Mainbox>       
        <Titlelayout title="告警列表" layout="flex">
          <div className='content'>
            <Form form={form} className='top' layout='inline' initialValues={{            
              type: 0,
              time: [moment().subtract(7, 'day'), moment()]
            }}>
              <Space size={64} split={<Cdivider />}>               
                <Item label="告警等级" name="type">
                  <Select options={[
                    { label: '全部告警', value: 0 },
                    { label: '一级告警', value: 1 },
                    { label: '二级告警', value: 2 },
                    { label: '三级告警', value: 3 },
                  ]}
                    style={{ width: '112px' }}
                    value={level}
                    onChange={changeLevel}
                  ></Select>
                </Item>
                
                <Item label="告警时间" name="time" >
                  <RangePicker onChange={changeTime} format="YYYY-MM-DD" style={{ width: '320px' }} disabledDate={disabledDate}/>
                </Item>
              </Space>
              {/* <Item noStyle>
                <ExportExcel tb={tableref} />
              </Item> */}
            </Form>

            <Cdivider type="h" margin="0" />
            <Usetable 
            hbg="#f0f9ff"
            columns={columns} 
            ref={tableref} 
            rowKey={nanoid()} 
            sheetName="告警记录" 
            onExport={onExport} 
            dataSource={tabledata} 
            pagination={{
              current:pageInfo.pageNum,
              pageSize:pageInfo.pageSize,
              total:pageInfo.total
            }}
            onChange={changePage}
            />

          </div>
        </Titlelayout>
      </Mainbox>
      </Pagecount>
  )
}
 