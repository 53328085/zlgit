import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import styled from 'styled-components'
import style from './style.module.less'
import { Image, Form, Space, Button, Input, Select, DatePicker, Checkbox, Calendar, Descriptions, Tag, Divider } from 'antd'
import { useAntdTable } from 'ahooks'
import { nanoid } from "@reduxjs/toolkit"
import {getRoomId} from "@redux/systemconfig";
import moment from 'moment'
import Titlelayout from '@com/titlelayout'
import Usetable from '@com/useTable'
import { OperationLogRuntime, distributionRoom } from '@api/api'
import { ExportExcel } from '@com/useButton'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate, useLocation } from 'react-router-dom'
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
function Main({areaId, siteId }) {

  const projectId = useSelector(state => state.system.menus.projectId)
  const columns = [
    {
      title: '最新告警时间',
      dataIndex: 'date',
      key: 'date',
      align: 'center'
    },
    {
      title: '告警等级',
      dataIndex: 'eventType',
      key: 'eventType',
      align: 'center'
    },
    {
      title: ' 最新告警事件',
      dataIndex: 'content',
      key: 'content',
      align: 'center'
    },
    {
      title: '设备名称',
      dataIndex: 'content',
      key: 'content',
      align: 'center'
    },
    {
      title: '设备安装地址',
      dataIndex: 'content',
      key: 'content',
      align: 'center'
    },
    {
      title: '设备编号',
      dataIndex: 'content',
      key: 'content',
      align: 'center'
    },
    {
      title: '设备类型',
      dataIndex: 'content',
      key: 'content',
      align: 'center'
    },
    {
      title: '操作',
      key: 'action',
      align: 'center',
      render: (_, record) => (
        <Space size="middle">
          <span className={style.detailText} onClick={() => onDetail(record)}>详情</span>
        </Space>
      ),
    },
  ]
  const navigate = useNavigate()
  const [form] = Form.useForm()

  const dispatch =useDispatch()
  const [keycode, setKeycode] = useState(0)
  const [total, setTotal] = useState(0)
  const [roomlist, setRoomList] = useState([])
  const oneLevel = useSelector(state => state.system.onelevel)
  const areaOptions = oneLevel.length > 0 ? useMemo(() => ([{ name: oneLevel[0].levelName + '(全部)', id: 0 }, ...oneLevel]), [oneLevel]) : []
  const onDetail = (record) => {
    console.log(record);
    // ${record.sn}
    navigate('/deviceDetail?sn=87489220500687', {
      state: { type: 'index', primary: 'deviceDetail', title: '告警信息', nested: 'deviceDetail' }
    })
  }
  const QueryReports = ({ current, pageSize }, form) => {
    let { time, ...rest } = form
    let start = time[0]?.format('YYYY-MM-DD')
    let end = time[1]?.format('YYYY-MM-DD')
    let params = {
      pageNum: current,
      pageSize,
      start,
      end,
      projectId,
      areaId,
      siteId,
      ...rest
    }
    return OperationLogRuntime.QueryLogsByPage(params).then(res => {
      let { success, data, total } = res
      setTotal(total)
      if (success && Array.isArray(data) && data.length > 0) {
        return {
          list: data,
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
  const getAlarmData = () => {
    console.log(11)
  }
  const { tableProps, search } = useAntdTable(QueryReports, {
    form,
    defaultParams: [{ pageSize: 14, pageNum: 1 }, {
      start: moment().subtract(7, 'day').format('YYYY-MM-DD'),
      end: moment().format('YYYY-MM-DD'),
      projectId,
      siteId,
      content: "",
      type: 0,
      status: 0

    }],
    refreshDeps: [projectId, siteId]
  })

  const { submit } = search

  const tableref = useRef()
  const onExport = useCallback(() => {
    let formData = form.getFieldsValue()
    return QueryReports({ current: 1, pageSize: total }, formData)
  }, [total])
  const changeArea = () => {

  }
  const getRoomList = async (projectId, roomId) => {
    const resp = await distributionRoom.RoomList(projectId, roomId)
    if (resp.success) {
      console.log(resp)
      dispatch(getRoomId(resp.data))

      setRoomList(resp.data)
      form.setFieldValue('roomId', resp.data[0][['id']])
    }
  }
  useEffect(() => {
    if(areaOptions.length > 0)  getRoomList(projectId, areaOptions[0].id)
  }, [roomlist.length])

  return (
    <div>
      <Mainbox>
        <div style={{ backgroundColor: "#fff", display: 'flex', alignItems: 'center', padding: '8px 16px', marginBottom: 16, border: '1px solid #d7d7d7', borderRadius: 4 }}>
          <Form
            form={form}
            colon={false}
            layout="inline"
          >
            <Form.Item label={oneLevel[0]?.levelName} name="area" style={{ marginBottom: 0 }}>
              <Select style={{ width: 200 }} options={areaOptions} fieldNames={{ label: 'name', value: 'id' }} onChange={changeArea} defaultValue={oneLevel.length > 0 ? 0 : null}></Select>
            </Form.Item>
            <Form.Item>
              <Divider dashed type="vertical" style={{ borderColor: "#999", height: '30px' }}></Divider>
            </Form.Item>
            <Form.Item name="roomId" >
              <Select
                options={roomlist}
                fieldNames={{ label: 'name', value: 'id' }}
                style={{ width: 240 }}
                placeholder="请选择配电房"></Select>
            </Form.Item>
          </Form>
        </div>
        <Titlelayout title="告警列表" layout="flex">
          <div className='content'>
            <Form form={form} className='top' layout='inline' initialValues={{
              content: '',
              deviceType: 0,
              level: 0,
              time: [moment().subtract(7, 'day'), moment()]
            }}>
              <Space size={32}>
                <Item label="告警记录" name="content">
                  <Input placeholder='安装地址' style={{ width: '320px' }} allowClear onChange={submit} />
                  <Button style={{ width: 80, backgroundColor: '#F5F7FA', color: '#515151', borderLeft: 'none' }} size="middle" onClick={getAlarmData}>查询</Button>
                </Item>
                <Divider style={{ margin: '0', height: '32px' }} type="vertical" />
                <Item label="告警等级" name="type">
                  <Select options={[
                    { label: '全部告警', value: 0 },
                    { label: '一级告警', value: 1 },
                    { label: '二级告警', value: 2 },
                    { label: '三级告警', value: 3 },
                  ]}
                    style={{ width: '112px' }}
                    onChange={submit}
                  ></Select>
                </Item>
                <Divider style={{ margin: '0', height: '32px' }} type="vertical" />
                <Item label="告警时间" name="time" >
                  <RangePicker onChange={submit} format="YYYY-MM-DD" style={{ width: '320px' }} />
                </Item>
              </Space>
              <Item noStyle>
                <ExportExcel tb={tableref} />
              </Item>
            </Form>

            <Divider style={{ margin: '0px' }} />
            <Usetable columns={columns} ref={tableref} {...tableProps} rowKey={nanoid()} sheetName="告警记录" onExport={onExport} />

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