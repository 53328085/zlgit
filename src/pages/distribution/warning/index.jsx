import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import styled from 'styled-components'
import style from './style.module.less'
import { Image, Form, Space, Button, Input, Select, DatePicker, Checkbox, Calendar, Descriptions, Tag, Divider, message } from 'antd'
import { useAntdTable, useSetState } from 'ahooks'
import { nanoid } from "@reduxjs/toolkit"
import { getRoomId } from "@redux/systemconfig";
import moment from 'moment'
import Titlelayout from '@com/titlelayout'
import Usetable from '@com/useTable'
import { OperationLogRuntime, distributionRoom, DistributionRoomRuntime } from '@api/api'
import { ExportExcel } from '@com/useButton'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate, useLocation,Link  } from 'react-router-dom'
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
        .ant-table-thead {
            tr:first-of-type th {
              background-color: #f0f9ff;
            }
        }
        .ant-form-inline {
          .ant-form-item {
            margin-right: 0;
          }
        }
      }
       
       }

`
function Main({ areaId, siteId }) {

  const projectId = useSelector(state => state.system.menus.projectId)
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
  const roomopts = useSelector(state => state.system.roomId)
  const [roomlist, setRoomList] = useState(roomopts)
  const [roomId, setRoomId] = useState(roomopts[0]?.id)
  const [tabledata,setTabledata] = useState([])
  const oneLevel = useSelector(state => state.system.onelevel)
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
  const changeAddress=()=>{}
  const getAlarmData = () => {
    console.log(11)
  }
  // const QueryReports = ({ current, pageSize }, form) => {
  //   let { time, ...rest } = form
  //   let start = time[0].format('YYYY-MM-DD')
  //   let end = time[1].format('YYYY-MM-DD')
  //   let params = {
  //     pageNum: current,
  //     pageSize,
  //     start,
  //     end,
  //     projectId,
  //     areaId,
  //     siteId,
  //     ...rest
  //   }
  //   return OperationLogRuntime.QueryLogsByPage(params).then(res => {
  //     let { success, data, total } = res
  //     setTotal(total)
  //     if (success && Array.isArray(data) && data.length > 0) {
  //       return {
  //         list: data,
  //         total
  //       }
  //     } else {
  //       return {
  //         list: [],
  //         total: 0
  //       }
  //     }
  //   })

  // }

  // const { tableProps, search } = useAntdTable(QueryReports, {
  //   form,
  //   defaultParams: [{ pageSize: 14, pageNum: 1 }, {
  //     start: moment().subtract(7, 'day').format('YYYY-MM-DD'),
  //     end: moment().format('YYYY-MM-DD'),
  //     projectId,
  //     siteId,
  //     content: "",
  //     type: 0,
  //     status: 0

  //   }],
  //   refreshDeps: [projectId, siteId]
  // })

  // const { submit } = search

  const tableref = useRef()
  const onExport = useCallback(() => {
    let formData = form.getFieldsValue()
    return QueryReports({ current: 1, pageSize: total }, formData)
  }, [total])


  const changeArea = (v) => {
    getRoomList(v)
    setPageInfo({
      ...pageInfo,
      pageNum:1
    })
  }
  const changeRoom=(v)=>{
    setRoomId(v)
    setPageInfo({
      ...pageInfo,
      pageNum:1
    })
  }
  const getRoomList = async (areaId) => {
    const resp = await distributionRoom.RoomList(projectId, areaId)
    if (resp.success) {
      setRoomList(resp.data)
      if (Array.isArray(resp.data) && resp.data.length > 0) {
        form.setFieldValue('roomId', resp.data[0][['id']])
        setRoomId(resp.data[0][['id']])
       
      } else {
        form.setFieldValue('roomId', [])
        setRoomId(null)
        setTabledata([])
        setPageInfo({
          pageNum:1,
          pageSize:1,
          total:0
        })
      }
    }
  }

  const warnPage =async () => {
    const {area, content,roomId,time,type} = form.getFieldsValue()
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
    console.log(pageInfo)
    roomId&&warnPage()
  }, [roomId,level,JSON.stringify(pageInfo) ])

  return (
    <div>
      <Mainbox>
        <div style={{ backgroundColor: "#fff", display: 'flex', alignItems: 'center', padding: '8px 16px', marginBottom: 16, border: '1px solid #d7d7d7', borderRadius: 4 }}>
          <Form
            form={form}
            colon={false}
            layout="inline"
            initialValues={{
              area: oneLevel[0]?.id,
              roomId: roomlist[0]?.id
            }}
          >
            <Form.Item label={oneLevel[0]?.levelName} name="area" style={{ marginBottom: 0 }}>
              <Select 
              style={{ width: 200 }} 
              options={oneLevel} 
              fieldNames={{ label: 'name', value: 'id' }} 
              onChange={changeArea} 
              placeholder="请选择配电房"
              ></Select>
            </Form.Item>
            <Form.Item>
              <Divider dashed type="vertical" style={{ borderColor: "#999", height: '30px' }}></Divider>
            </Form.Item>
            <Form.Item name="roomId" >
              <Select
                options={roomlist}
                fieldNames={{ label: 'name', value: 'id' }}
                style={{ width: 240 }}
                placeholder="请选择配电房"
                onChange={changeRoom}
                ></Select>
            </Form.Item>
          </Form>
        </div>
        <Titlelayout title="告警列表" layout="flex">
          <div className='content'>
            <Form form={form} className='top' layout='inline' initialValues={{
              content: '',
              type: 0,
              time: [moment().subtract(7, 'day'), moment()]
            }}>
              <Space size={32}>
                {/* <Item label="告警记录" name="content">
                  <Input placeholder='安装地址' style={{ width: '320px' }} allowClear onChange={changeAddress} />
                  <Button style={{ width: 80, backgroundColor: '#F5F7FA', color: '#515151', borderLeft: 'none' }} size="middle" onClick={getAlarmData}>查询</Button>
                </Item> */}
                {/* <Divider style={{ margin: '0', height: '32px' }} type="vertical" /> */}
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
                <Divider style={{ margin: '0', height: '32px' }} type="vertical" />
                <Item label="告警时间" name="time" >
                  <RangePicker onChange={changeTime} format="YYYY-MM-DD" style={{ width: '320px' }} disabledDate={disabledDate}/>
                </Item>
              </Space>
              {/* <Item noStyle>
                <ExportExcel tb={tableref} />
              </Item> */}
            </Form>

            <Divider style={{ margin: '0px' }} />
            <Usetable 
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
      </Mainbox></div>
  )
}
export default function Index(props) {
  return (
    <Main {...props} />
  )
}