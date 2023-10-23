import React, { useState, useRef, useEffect, useCallback } from 'react'
import styled from 'styled-components'
import style from './style.module.less'
import { Typography, Image, Form, Space, Button, Input, Select, DatePicker, Checkbox, Calendar, Descriptions, Tag, Divider } from 'antd'
import { useAntdTable } from 'ahooks'
import { nanoid } from "@reduxjs/toolkit"
import moment from 'moment'
import Titlelayout from '@com/titlelayout'
import Usetable from '@com/useTable'
import { OperationLogRuntime } from '@api/api'
import { ExportExcel } from '@com/useButton'
import { useSelector, useDispatch } from 'react-redux'
import { selectProjectId, selectOneLevel, levelDefaultLabel, selectOneLevelDefaultId, setCurrentlevel } from '@redux/systemconfig.js'
const { Paragraph } = Typography
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
const P = styled(Paragraph)`
&& {
  margin-bottom: 0px;
  line-height: 1;
  font-size: 18px;
  color:#666;
}
 
`
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
      align:'center',
      render: (_, record) => (
        <Space size="middle">
          <span className={style.detailText} onClick={() => onDetail(record)}>详情</span>
        </Space>
      ),
    },
]

function Main({ projectId, areaId, siteId }) {
  const [form] = Form.useForm()

  const [keycode, setKeycode] = useState(0)
  const [total, setTotal] = useState(0)

  const QueryReports = ({ current, pageSize }, form) => {
    let { time, ...rest } = form
    let start = time[0].format('YYYY-MM-DD')
    let end = time[1].format('YYYY-MM-DD')
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
    })

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
  const onDetail = (record) => {
  }

  const tableref = useRef()
  //const getref = () => tableref.current
  const onExport = useCallback(() => {
    let formData = form.getFieldsValue()
    return QueryReports({ current: 1, pageSize: total }, formData)
  }, [total])


  return (
    <div>
      <Mainbox>
        <div className={style.header}>
          <span style={{ marginLeft: '12px' }}>区域选择</span>
          <Select
            placeholder="请选择区域"
            size="middle"
            style={{ width: '330px', marginLeft: '12px' }}
          >
            <Option value="1">正泰物联全部园区</Option>
            <Option value="2">正泰物联滨江园区</Option>
            <Option value="3">正泰物联温州园区</Option>
          </Select>
        
          <span style={{ marginLeft: '12px' }}>配电房</span>
          <Select
            placeholder="请选择配电房"
            size="middle"
            style={{ width: '330px', marginLeft: '12px' }}
          >
            <Option value="1">配电房1</Option>
            <Option value="2">配电房2</Option>
            <Option value="3">配电房3</Option>
          </Select>
        </div>
        <Titlelayout title="告警列表" layout="flex" >
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