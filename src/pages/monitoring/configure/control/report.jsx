import React, { useState, useRef, useEffect, useCallback } from 'react'
import styled from 'styled-components'
import {Typography, Image, Form, Space, Button, Input,  Select, DatePicker, TimePicker, Divider, Drawer} from 'antd'
import {useAntdTable} from 'ahooks'
import {nanoid} from "@reduxjs/toolkit"
import moment from 'moment'
import Titlelayout from '@com/titlelayout'
import {CustButton, ExportExcel} from '@com/useButton'
import UseSerach, {AreaSelect} from '@com/useSerach'
import Usetable from '@com/useTable'
import {OperationLogRuntime} from '@api/api'
import Custmodal from '@com/useModal'
import redwarn from '@imgs/redwarn.png'
import Drag from './Drag'
const {Paragraph, Link} = Typography
const {Item} = Form
const { RangePicker } = DatePicker;

const CDrawer = styled(Drawer)`
&& {
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
        dataIndex: 'sn',
        key: 'date',
        align: 'center'
    },
    {
        title: '设备编号',
        dataIndex: 'bh',
        key: 'eventType',
        align: 'center'
    },
    {
      title: '设备名称',
      dataIndex: 'name',
      key: 'content',
      align: 'center'
     },
     {
      title: '设备型号',
      dataIndex: 'caty',
      key: 'content',
      align: 'center'
     },
     {
      title: '安装地址',
      dataIndex: 'address',
      key: 'content',
      align: 'center'
     },
   ]
   const stepcolumns = [
   
    {
        title: '设备编号',
        dataIndex: 'bh',
        key: 'eventType',
        align: 'center'
    },
    {
      title: '设备名称',
      dataIndex: 'name',
      key: 'content',
      align: 'center'
     },
     {
      title: '设备型号',
      dataIndex: 'caty',
      key: 'content',
      align: 'center'
     },
     {
      title: '安装地址',
      dataIndex: 'address',
      key: 'content',
      align: 'center'
     },
   ]
  const Stepcom = () => {
    const onSearch = () => {}
    const [form] = Form.useForm()
    const tableProps = {}
    return (
      <Stepconent>
      <Form
       form={form}  
      layout="inline"
      colon={false}
      labelAlign='left'
      style={{justifyContent: "space-between"}}
    >
      
      <Form.Item label="设备查询" name="name">
         <Input.Search placeholder='输入设备编号/安装地址' allowClear style={{width: "320px"}} onSearch={onSearch} enterButton="查询"  />
      </Form.Item>
      <Form.Item label="设备型号" name="life">
         <Select style={{width: "200px"}} options={[
          {value: "0", label: "全部型号"},
          {value: "1", label: "断路器1"},
          {value: "2", label: "断路器2"}
         ]}></Select>
      </Form.Item>
    </Form>
    <Usetable columns={stepcolumns}  {...tableProps}   rowKey={nanoid()} rowSelection={{ columnWidth: "112px"}}   />
    </Stepconent>
    )
  }
 function Main({projectId, areaId}) {
   const [form] = Form.useForm()
  
   const [open, setOpen] = useState(false)
   const [keycode, setKeycode] = useState(0)
   const [total, setTotal] = useState(0)
   const modal = useRef()
   const stepmodl = useRef()
   const delmo = useRef()
   const exportref = useRef()
   const [title, setTitle] = useState('')
   const edit = () => {
    setTitle('自动策略控制')
    modal.current.onOpen()
   }
   const del = () => {
    delmo.current.onOpen()
   }
   const add = () => {
    setTitle('新增自动策略控制')
    modal.current.onOpen()
   }
   const onExport = () => {
    exportref.current.onOpen()
   }
   const columns = [
    {
        title: '策略名称',
        dataIndex: 'date',
        key: 'date',
        align: 'center'
    },
    {
        title: '周期',
        dataIndex: 'eventType',
        key: 'eventType',
        align: 'center'
    },
    {
      title: '分闸执行时间',
      dataIndex: 'time',
      key: 'time',
      align: 'center'
     },
     {
      title: '合闸执行时间',
      dataIndex: 'runtime',
      key: 'runtime',
      align: 'center'
     },
     {
      title: '策略说明',
      dataIndex: 'info',
      key: 'info',
      align: 'center'
     },
     {
      title: '被控设备',
      dataIndex: 'device',
      key: 'device',
      align: 'center',
      render: (text) => {
        return <Link onClick={() => setOpen(true)}>查看详细</Link>
      }
     },
     {
      title: '操作',
      dataIndex: 'op',
      key: 'op',
      align: 'center',
      render: (text) => {
        return <Space size={32}>
          <Link underline onClick={() => edit(true)}>编辑</Link>
          <Link underline type="danger" onClick={() => del(true)}>删除</Link>
          </Space>
      }
     },
   ]

 const QueryReports =  ({current, pageSize}, form) => {   
    let {time, ...rest} = form
   // let start = time[0].format('YYYY-MM-DD')
   // let end = time[1].format('YYYY-MM-DD')
    let params = {
      pageNum: current,
      pageSize,
    //  start,
    //  end,
      projectId,
    
     
      ...rest
    }
    return OperationLogRuntime.QueryLogsByPage(params).then(res => {
      let {success, data, total} = res
      setTotal(total)
      if (success && Array.isArray(data) && data.length >0) {
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
  const {tableProps, search} = useAntdTable(QueryReports, {
    form,
    defaultParams: [{pageSize: 14, pageNum: 1}, {
      start: moment().subtract(7, 'day').format('YYYY-MM-DD'),
      end: moment().format('YYYY-MM-DD'),
      projectId, 
      
      content : "",
      type: 0,
      status: 0

    }],
    refreshDeps: [projectId]
  })
  
  const {submit} = search
  

  const tableref = useRef()
  const onStep = () => {
    modal.current.onCancel()
    stepmodl.current.onOpen()
  }
  const onBack =() => {
    stepmodl.current.onCancel()
    modal.current.onOpen()
  }
 
  return (
    <Mainbox>    
    <Titlelayout title="自动控制" layout="flex" >
    <div className='content'>
        <UseSerach 
        style={{padding: '0 0 16px 0', borderTop: "none"}}
        custview={ <Space size={16} style={{marginLeft: 'auto'}} >
              <CustButton key="add" onClick={add}>新增</CustButton>
              <CustButton key="export" onClick={onExport}>批量导入</CustButton>
             <ExportExcel tb={tableref} />
          </Space>}  />
       
        
       
        <Usetable columns={columns} ref={tableref} {...tableProps}   rowKey={nanoid()}    />   
       <CDrawer
        title="被控设备"
        width={928}
        open= {open}
        bodyStyle={{
          backgroundColor: '#f2f2f2',
          padding: '32px'
        }}
        headerStyle={{
          backgroundColor: '#f2f2f2',
          padding: '32px 32px 0 32px'
        }}
        closable={false}

        extra={<Button type="primary" onClick={() => setOpen(false)} style={{width: '96px'}}>关闭</Button>}
       >    
       <Divider  style={{margin: '0 0 16px 0', color: "#2a2f55", borderWidth: "1px"}} dashed />
       <Usetable columns={controlcolumns}  {...tableProps}   rowKey={nanoid()}    />  
       </CDrawer>
    </div>
    </Titlelayout>

    <Custmodal
        key="export"
        mold="cust"
        width={560}
        ref={exportref}
        title="批量导入"
       
       
      >
         <Drag />
      </Custmodal>
    <Custmodal
     title={title}
     ref={modal}
     mold="cust"
     width="820px"
     okText="下一步"
     onOk={onStep}
     >
       <Form
         form={form}
        layout="horizontal"
        labelCol={{span: 5}}
        colon={false}
        labelAlign='left'
        style={{width: "496px"}}
      >
        <Form.Item label="选择园区" name="area">
           <AreaSelect />
        </Form.Item>
        <Form.Item label="策略名称" name="name">
           <Input />
        </Form.Item>
        <Form.Item label="执行周期" name="life">
           <Select options={[
            {value: "day", label: "每日"},
            {value: "week", label: "每周"},
            {value: "month", label: "每月"}
           ]}></Select>
        </Form.Item>
        <Form.Item label="执行分闸" name="life">
          <TimePicker   format='HH:mm' style={{width: "200px"}} placeholder='执行分闸时间' />
        </Form.Item>
        <Form.Item label="执行合闸" name="life">
          <TimePicker   format='HH:mm' style={{width: "200px"}} placeholder='执行合闸时间' />
        </Form.Item>
        <Form.Item label="备注">
          <Input />
        </Form.Item>
      </Form>
     </Custmodal>
     

     <Custmodal
     title="选择执行设备"
     ref={stepmodl}
     mold="cust"
     width="820px"
     okText="完成"
     cancelText="上一步"
     onOk={onStep}
     onCancel={onBack}
     >
      <Stepcom />
     </Custmodal>


     <Custmodal
        key="warning"
        mold="cust"
        type="warn"
        width={592}
        ref={delmo}
        title="删除"
       
       
      >
        <div
          style={{ display: "flex", alignItems: "center", padding: "0 32px" }}
        >
          <img src={redwarn} style={{ width: "48px" }}></img>
          <p style={{ fontSize: "16px", paddingLeft: "16px" }}>
             是否确认删除该自动控制策略?
          </p>
        </div>
      </Custmodal>
    </Mainbox>
  )
}
export default function Index(props) {
    return (
        <Main {...props}     />
    )
}