import React, { useState, useRef, useEffect, useCallback } from 'react'
import styled from 'styled-components'
import {Typography, Image, Form, Space, Button, Input,  Select, DatePicker, TimePicker, Divider, Drawer  } from 'antd'
import {useAntdTable} from 'ahooks'
import {nanoid} from "@reduxjs/toolkit"
import moment from 'moment'
import Titlelayout from '@com/titlelayout'
import {CustButton, ExportExcel} from '@com/useButton'
import UseSerach from '@com/useSerach'
import Usetable from '@com/useTable'
import {OperationLogRuntime} from '@api/api'
import Custmodal from '@com/useModal'
import redwarn from '@imgs/redwarn.png'
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

 function Main({projectId, areaId}) {
   const [form] = Form.useForm()
   const [open, setOpen] = useState(false)
   const [keycode, setKeycode] = useState(0)
   const [total, setTotal] = useState(0)
   const modal = useRef()
   const delmo = useRef()
   const edit = () => {
    modal.current.onOpen()
   }
   const del = () => {
    delmo.current.onOpen()
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
 const vdata = [
  {date: "自动控制策略01", eventType: "每日", "time": "07:00：00", info: "学生寝室定时通断电策略", device: ''}
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
  
 
 
  return (
    <Mainbox>    
    <Titlelayout title="自动控制" layout="flex" >
    <div className='content'>
        <UseSerach 
        style={{padding: '0 0 16px 0', borderTop: "none"}}
        custview={ <Space size={16} style={{marginLeft: 'auto'}} >
              <CustButton key="add">新增</CustButton>
              <CustButton key="export">批量导入</CustButton>
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
     title="自动控制策略"
     ref={modal}
     mold="cust"
     >
       <Form
         form={form}
        layout="horizontal"
      
      >
        <Form.Item label="选择园区" name="area">
          <Select></Select>
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
          <TimePicker   format='HH:mm' />
        </Form.Item>
        <Form.Item label="执行合闸" name="life">
          <TimePicker   format='HH:mm' />
        </Form.Item>
        <Form.Item label="备注">
          <Input />
        </Form.Item>
      </Form>
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