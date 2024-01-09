import React, { useState, useRef, useEffect, useCallback } from 'react'
import styled from 'styled-components'
import {Typography, Image, Form, Space, Button, Input,   DatePicker,  Divider, Drawer } from 'antd'
import {useAntdTable} from 'ahooks'
import {nanoid} from "@reduxjs/toolkit"
import moment from 'moment'
import Titlelayout from '@com/titlelayout'
import {CustButton} from '@com/titlelayout'
import Usetable from '@com/useTable'
import {RunAutoValve} from '@api/api'
import {Serach} from "@com/comstyled"
const {Paragraph, Link} = Typography
const {Item} = Form
const { RangePicker } = DatePicker;
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

const controlcolumns = [
  {
      title: '序号',
      dataIndex: 'index',
      onHeaderCell:() => ({
        style: {
          backgroundColor: '#237ae4',
          color: "#fff"
        }
      }),
      align: 'center',
      render: (text, recoder, index) => <span>{index + 1}</span>
  },
  {
      title: '设备编号',
      dataIndex: 'sn',
      onHeaderCell:() => ({
        style: {
          backgroundColor: '#237ae4',
          color: "#fff"
        }
      }),
      align: 'center'
  },
  {
    title: '设备名称',
    dataIndex: 'name',
    onHeaderCell:() => ({
      style: {
        backgroundColor: '#237ae4',
        color: "#fff"
      }
    }),
    align: 'center'
   },
   {
    title: '设备型号',
    dataIndex: 'category',
    onHeaderCell:() => ({
      style: {
        backgroundColor: '#237ae4',
        color: "#fff"
      }
    }),
    align: 'center'
   },
   {
    title: '安装地址',
    dataIndex: 'address',
    onHeaderCell:() => ({
      style: {
        backgroundColor: '#237ae4',
        color: "#fff"
      }
    }),
    align: 'center'
   },
   {
    title: '设备状态',
    dataIndex: 'status',
    onHeaderCell:() => ({
      style: {
        backgroundColor: '#237ae4',
        color: "#fff"
      }
    }),
    align: 'center',
    render: (text) => {     
      return  Number(text) === 1 ? "开闸" : "合闸"
     // return text['1'] === 'Open' ? "开闸" : "合闸"
    }
  },
  {
    title: '策略是否启用',
    dataIndex: 'enabled',
    onHeaderCell:() => ({
      style: {
        backgroundColor: '#237ae4',
        color: "#fff"
      }
    }),
    align: 'center',
    render: (text) => {
      console.log(text)
      return text > 0 ? "启用" : "停用"
       
    }
  }
 ]
 let week =  [
  {label: '周一', value: 1},
  {label: '周二', value: 2},
  {label: '周三', value: 3},
  {label: '周四', value: 4},
  {label: '周五', value: 5},
  {label: '周六', value: 6},
  {label: '周日', value: 7},
]
let getweek = new Map();
week.forEach(w => {
  getweek.set(w.value, `每${w.label}`)
})
 function Main({projectId, areaId}) {
   const [form] = Form.useForm()
   const [open, setOpen] = useState(false)
   const [keycode, setKeycode] = useState(0)
   const [total, setTotal] = useState(0)
   const [viewtb, setViewtb] = useState([])
   const view = async (planId) =>{
    try {
      let params = {
        planId,
        projectId,
        areaId,
      }
     let {success, data, errMsg} = await  RunAutoValve.QueryUsedDevice(params)
     if(success) {
       if(Array.isArray(data)) {
        setViewtb(data);
       }else {
        setViewtb([])
       }
       setOpen(true)
     }else {
       message.warning(errMsg || '数据出错')
     }
    } catch (error) {
      
    }
     
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
        render: (_, record) => {
          let {cycle, cycleTime} = record
          if(cycle == 1) return <span>每日</span>
          if(cycle == 2) return  cycleTime.map(t =>  getweek.get(t)).join()
          if(cycle == 3) return  cycleTime.map(d => `${d}号`).join()
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
      render: (_, record) => <Link underline onClick={() => view(record.id)}>查看详细</Link>
     },
   ] 
 
  const QueryReports =  ({current, pageSize}, form) => { 
      
       let {alike=''} = form;
      let  params = {
        pageNum: current,
        pageSize, 
        projectId,
        areaId,
        alike,
         
      }
    
     
    return RunAutoValve.getPageData(params).then(res => {
      if(isNaN(areaId)) return
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
    }).catch(e => {
      console.log(e)
    })
   
  }
  const {tableProps, search} = useAntdTable(QueryReports, {
    form,
    refreshDeps: [projectId, areaId]
  })
  
  const {submit} = search
  

  const tableref = useRef()
  
 
 
  return (
    <Mainbox>    
    <Titlelayout title="自动控制" layout="flex" >
    <div className='content'>
        <Form form={form} className='top' layout='inline' >
          <Space size={32}>
             <Item   name="alike">
              <Serach placeholder='请输入策略名称'   allowClear onSearch={submit} enterButton="查询" />
             </Item>
           </Space>
          
        </Form>
        
         <Divider style={{margin: '0px'}}/>
        <Usetable columns={columns} ref={tableref} {...tableProps}   rowKey={nanoid()}    />   
       <CDrawer
        title="被控设备"
        width={928}
        open= {open}
        closable={false}
        bodyStyle={{
          backgroundColor: '#f2f2f2',
          padding: '32px'
        }}
        headerStyle={{
          backgroundColor: '#f2f2f2',
          padding: '32px 32px 0 32px'
        }}
        

        extra={<Button type="primary" onClick={() => setOpen(false)} style={{width: '96px'}}>关闭</Button>}
       >    
       <Divider  style={{margin: '0 0 16px 0', color: "#2a2f55", borderWidth: "1px"}} dashed />
       <div style={{flex: 1, backgroundColor: "#fff"}}>
       <Usetable columns={controlcolumns}  dataSource={viewtb}   rowKey={nanoid()}  scroll={{
            y: 867
          }}   />  
       </div>
       </CDrawer>
    </div>
    </Titlelayout>
    </Mainbox>
  )
}
export default function Index(props) {
    return (
        <Main {...props}     />
    )
}