import React, { useState, useRef, useEffect, useCallback, memo } from 'react'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import { Typography, Image, Form, Space, Button, Input, InputNumber, Select, DatePicker, TimePicker, Divider, Drawer, Checkbox, message } from 'antd'
import { useAntdTable } from 'ahooks'
import { nanoid } from "@reduxjs/toolkit"
import moment from 'moment'
import Titlelayout from '@com/titlelayout'
import { CustButton, ExportExcel, NewButton, AllExportButton } from '@com/useButton'
import UseSerach, { AreaSelect } from '@com/useSerach'
import Usetable from '@com/useTable'
import { AutoValve } from '@api/api'
import Custmodal from '@com/useModal'
import { getdays } from '@com/usehandler'

import successIcon from '@imgs/success.png'
import Drag from './Drag'
import CDraw from './draw'

const { Paragraph, Link } = Typography
const { Item } = Form


const CDrawer = styled(Drawer)`
&& {
  .ant-drawer-content-wrapper {
    width: 928px !important;
    top: 0;
    height: 100%;
  }
  .ant-drawer-body {
    display: flex;
    flex-direction: column;
  }
  .ant-drawer-title {
    padding-left: 16px;
    border-left: 4px solid #2828a4 ;
    color: #2a2f55;
    font-size: 16px;
  }
  .ant-table-container .ant-table-content .ant-table-thead {
    
     tr>th{
        background-color: #237ae4;
        color: #fff;
        height: 32px;
        padding: 0;
      }
     
  }
}`
const Stepconent = styled.div`
  border-top: 1px dotted #2a2f55;
  padding-top: 16px;
  display: grid;
  grid-template-rows: 32px 1fr;
  row-gap: 32px;
 && {
  .ant-table-container .ant-table-content .ant-table-thead {
    
    tr>th{
       background-color: #2a2f55;
       color: #fff;
       height: 32px;
       padding: 0;
     }
    
 }
 } 
`
const Mainbox = styled.div`
    && {
      flex: 1;
      display: flex;
      flex-direction: column;
      .content {
        display: grid;
        grid-template-rows: 50px 1fr;
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

const controlcolumns = [
  {
    title: '序号',
    dataIndex: 'index',
    align: 'center',
    render: (text, recoder, index) => <span>{index + 1}</span>
  },
  {
    title: '设备编号',
    dataIndex: 'sn',
    align: 'center'
  },
  {
    title: '设备名称',
    dataIndex: 'name',
    align: 'center'
  },
  {
    title: '设备型号',
    dataIndex: 'category',
    align: 'center'
  },
  {
    title: '安装地址',
    dataIndex: 'address',
    align: 'center'
  },
  {
    title: '启用策略',
    dataIndex: 'enabled',
    align: 'center',
    render: (text) => text ? <span>启用</span> : <span style={{ color: "f00" }}>停用</span>

  },
]

const errColumns = [
  {
    title: '错误行号',
    dataIndex: 'date',
    key: 'date',
    align: 'center'
  },
  {
    title: '错误原因',
    dataIndex: 'eventType',
    key: 'eventType',
    align: 'center'
  },
]

let week = [
  { label: '周一', value: 1 },
  { label: '周二', value: 2 },
  { label: '周三', value: 3 },
  { label: '周四', value: 4 },
  { label: '周五', value: 5 },
  { label: '周六', value: 6 },
  { label: '周日', value: 0 },
]
let getweek = new Map();
week.forEach(w => {
  getweek.set(w.value, `每${w.label}`)
})
let days = Array.from({ length: getdays() }, (v, i) => ({ label: i < 9 ? '0' + (i + 1) : (i + 1).toString(), value: i + 1 }))

const Addmodal = memo(({ title, modal, isAdd, onOk, form }) => {
  const rules = [
    {
      required: true
    }
  ]
  return <Custmodal
    title={title}
    ref={modal}
    mold="cust"
    width="820px"
    custft={isAdd}
    onOk={onOk}
  >
    <Form
      form={form}
      layout="horizontal"
      labelCol={{ span: 5 }}
      colon={false}
      labelAlign='left'
      preserve={false}
      style={{ width: "496px" }}
    >
      <Form.Item label="选择园区" name="areaId" rules={rules}>
        <AreaSelect disabled={!isAdd} />
      </Form.Item>
      <Form.Item label="策略名称" name="name" rules={rules}>
        <Input />
      </Form.Item>
      <Form.Item label="执行周期" name="cycle" rules={rules}>
        <Select

          options={[
            { value: 1, label: "每日" },
            { value: 2, label: "每周" },
            { value: 3, label: "每月" }
          ]}></Select>
      </Form.Item>


      <Item shouldUpdate noStyle  >
        {
          ({ getFieldValue }) => {
            let type;
            type = getFieldValue('cycle')
            let options = [[], [], week, days][type]
            if (type === 1 || !type) return null
            return (
              <Item name="cycleTime" label="选择重复" rules={rules}>
                <Checkbox.Group options={options} />
              </Item>
            )
          }
        }
      </Item>

      <Form.Item label="执行分闸" name="autoOpenTime" rules={[
        {
          required: true,
          message: '请选择执行分闸时间'
        }
      ]}>
        <TimePicker format="HH:mm" minuteStep={15} style={{ width: "200px" }} placeholder='执行分闸时间' />
      </Form.Item>
      <Form.Item label="执行合闸" name="autoCloseTime" rules={[
        {
          required: true,
          message: '请选择执行合闸时间'
        }
      ]}>
        <TimePicker format="HH:mm" minuteStep={15} style={{ width: "200px" }} placeholder='执行合闸时间' />
      </Form.Item>
      <Form.Item label="备注" name="remark">
        <Input />
      </Form.Item>
    </Form>
  </Custmodal>
})


function Main({ projectId, areaId }) {
  const { t } = useTranslation(["button"])
  const [form] = Form.useForm()



  const [open, setOpen] = useState(false)

  const [total, setTotal] = useState(0)
  const modal = useRef()
  const [viewtb, setViewtb] = useState([])
  const delmo = useRef()
  const delId = useRef()
  const exportref = useRef()
  const [isAdd, setIsAdd] = useState(true)

  const title = isAdd ? '新增自动策略控制' : '编辑自动策略控制'
  const editId = useRef()
  const edit = (record) => {
    editId.current = record.id
    setIsAdd(false)
    let { autoCloseTime, autoOpenTime, ...rest } = record
    form.setFieldsValue({
      autoCloseTime: moment(autoCloseTime, "HH:mm"),
      autoOpenTime: moment(autoOpenTime, "HH:mm"),
      ...rest
    })
    modal.current.onOpen()
  }

  const add = () => {
    setIsAdd(true)
    modal.current.onOpen()
  }

  /*    const config = async (planId) => {
       try {
         let params = {
           projectId,
           planId,
           device: []
         }
         await AutoValve.QueryUsedDevice({projectId, areaId, planId})
         await AutoValve.ConfigureDevice(params)
       } catch (error) {
        
       }
  
     } */

  const view = async (planId) => {
    try {
      let params = {
        planId,
        projectId,
        areaId,
      }
      let { success, data, errMsg } = await AutoValve.QueryUsedDevice(params)
      if (success) {
        if (Array.isArray(data)) {
          setViewtb(data);
        } else {
          setViewtb([])
        }
        setOpen(true)
      } else {
        message.warning(errMsg || '数据出错')
      }
    } catch (error) {

    }

  }
  const drawref = useRef()
  const [params, setParams] = useState()
  const config = async (planId) => {

    setParams({
      projectId,
      areaId,
      planId,
      dedeviceStyle: 0,
      alike: ''
    })
    drawref.current.drawOpen()

  }
  const columns = [
    {
      title: '策略名称',
      dataIndex: 'name',
      key: 'name',
      align: 'center'
    },
    {
      title: '周期',
      dataIndex: 'cycleTime',
      key: 'cycleTime',
      align: 'center',
      render: (_, record = {}) => {
        let { cycle, cycleTime } = record

        if (cycle == 1) return <span>每日</span>
        if (cycle == 2) return cycleTime?.map(t => getweek.get(t)).join()
        if (cycle == 3) return cycleTime?.map(d => `${d}号`).join()
      }
    },
    {
      title: '分闸执行时间',
      dataIndex: 'autoOpenTime',
      key: 'autoOpenTime',
      align: 'center'
    },
    {
      title: '合闸执行时间',
      dataIndex: 'autoCloseTime',
      key: 'autoCloseTime',
      align: 'center'
    },
    {
      title: '策略说明',
      dataIndex: 'remark',
      key: 'remark',
      align: 'center'
    },
    {
      title: '被控设备',
      dataIndex: 'device',
      key: 'device',
      align: 'center',
      render: (_, record) => <Link underline onClick={() => view(record.id)}>{t("button:viewDetails")}</Link>
    },
    {
      title: '操作',
      dataIndex: 'op',
      key: 'op',
      align: 'center',
      render: (_, record) => {
        return <Space size={32}>
          <Link underline onClick={() => config(record.id)}>{t("button:configure")}</Link>
          <Link underline onClick={() => edit(record)}>{t("button:edit")}</Link>
          <Link underline type="danger" onClick={() => del(record.id)}>{t("button:delete")}</Link>
        </Space>
      }
    },
  ]

  const QueryReports = ({ current, pageSize }) => {
    if (![areaId, projectId].every(d => Number.isInteger(parseInt(d)))) return;

    let params = {
      pageNum: current,
      pageSize,
      areaId,
      projectId,
      alike: ''


    }
    return AutoValve.getPageData(params).then(res => {



      let { success, data, total } = res
      setTotal(total)
      if (success && Array.isArray(data) && data.length > 0) {
        return {
          list: data,
          total,
        }
      } else {
        return {
          list: [],
          total: 0
        }
      }
    })

  }
  const { tableProps, refresh } = useAntdTable(QueryReports, {
    defaultPageSize: 14,
    refreshDeps: [areaId]
  })

  const onExport = useCallback(() => {
    return QueryReports({ current: 1, pageSize: total })
  }, [total])

  const del = (id) => {
    delId.current = id
    delmo.current.onOpen()
  }
  const delOk = async () => {
    try {
      let param = {
        projectId,
        id: delId.current
      }
      let { success, errMsg } = await AutoValve.Delete(param);
      if (success) {
        message.success("删除成功")
        delmo.current.onCancel()
        refresh()
      } else {
        message.warning(errMsg || "数据出错")
      }
    } catch (error) {

    }

  }


  const tableref = useRef()
  const onOk = useCallback(async () => {
    try {
      let { autoCloseTime, autoOpenTime, ...rest } = await form.validateFields();

      let params = isAdd ? {
        ...rest,
        autoCloseTime: autoCloseTime.format("HH:mm"),
        autoOpenTime: autoOpenTime.format('HH:mm'),
        projectId,
      } : {
        ...rest,
        autoCloseTime: autoCloseTime.format("HH:mm"),
        autoOpenTime: autoOpenTime.format('HH:mm'),
        projectId,
        id: editId.current
      }
      let handler = isAdd ? 'Add' : 'Update'
      let { success, errMsg } = await AutoValve[handler](params)
      let content = isAdd ? '新增成功' : '编辑成功';
      if (success) {
        message.success(content);
        //  if(isAdd) form.resetFields();
        if (!isAdd) modal.current.onCancel();
        refresh()
      } else {
        message.warning(errMsg || "数据出错")
      }

    } catch (error) {
      console.log(error)
      return Promise.reject(error)

    }
  }, [isAdd])





  const successRef = useRef()
  const errorRef = useRef()
  const onResult = () => { // 导入需后端接口
    let result = 'success'
    if (result == 'success') {
      // successRef.current.onOpen();

      errorRef.current.onOpen()
    }
  }
  return (
    <Mainbox>
      <Titlelayout title="自动控制" layout="flex" >
        <div className='content'>
          <UseSerach isHaveAll={true}
            style={{ padding: '0 0 16px 0', borderTop: "none" }}
            custview={<Space size={16} style={{ marginLeft: 'auto' }} >
              <NewButton key="add" onClick={add} />
              {/*  <AllExportButton key="export" onClick={onExport} /> 此处缺少接口暂时隐藏 */}
              <ExportExcel tb={tableref} />
            </Space>} />



          <Usetable columns={columns} ref={tableref} {...tableProps} rowKey={nanoid()} onExport={onExport} sheetName="自动控制" />
          <CDrawer
            title="被控设备"
            width={928}
            open={open}
            bodyStyle={{
              backgroundColor: '#f2f2f2',
              padding: '32px'
            }}
            headerStyle={{
              backgroundColor: '#f2f2f2',
              padding: '32px 32px 0 32px',
              borderBottom: 'none'
            }}
            closable={false}

            extra={<Button type="primary" onClick={() => setOpen(false)} style={{ width: '96px' }}>关闭</Button>}
          >
            <Divider style={{ margin: '0 0 16px 0', color: "#2a2f55", borderWidth: "1px" }} dashed />
            <div style={{ flex: 1, backgroundColor: "#fff" }}>
              <Usetable columns={controlcolumns} dataSource={viewtb} istheme={true} rowKey={nanoid()} scroll={{
                y: 867
              }}

              />
            </div>
          </CDrawer>
        </div>
      </Titlelayout>
      <CDraw params={params} ref={drawref} />
      <Custmodal
        key="export"
        mold="cust"
        width={560}
        ref={exportref}
        title="批量导入"
        onOk={onResult}

      >
        <Drag />
      </Custmodal>
      {/* 导入成功 */}
      <Custmodal
        key="success"
        mold="cust"
        width={560}
        ref={successRef}
        title="批量导入"
        okText="关闭"

      >
        <div style={{ display: "flex", alignItems: "center", fontSize: "18px", color: "#1e1e1e", padding: "0 32px" }}>  <Image src={successIcon} preview={false} style={{ marginRight: "32px" }} width={48} />
          <span style={{ marginLeft: "32px" }}>批量导入成功</span>
        </div>
      </Custmodal>

      <Custmodal
        key="error"
        mold="cust"
        width={560}
        type="warn"
        ref={errorRef}
        title="参数下发失败"
        okText="确认"

      >
        <Usetable columns={errColumns} ></Usetable>
      </Custmodal>
      <Addmodal title={title} modal={modal} isAdd={isAdd} onOk={onOk} form={form} />

      <Custmodal
        key="warning"
        mold="cust"
        type="warn"
        width={592}
        ref={delmo}
        title="删除"
        onOk={delOk}

      >
        是否确认删除该自动控制策略?
      </Custmodal>
    </Mainbox>
  )
}
export default function Index(props) {
  return (
    <Main {...props} />
  )
}