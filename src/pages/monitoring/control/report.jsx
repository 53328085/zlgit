import React, { useState, useRef, useEffect, useCallback } from 'react'
import styled from 'styled-components'
import {Typography, Image, Form, Space, Button, Input,   DatePicker,  Divider, Drawer } from 'antd'
import {useAntdTable} from 'ahooks'
import {nanoid} from "@reduxjs/toolkit"

import Titlelayout from '@com/titlelayout'
 
import Usetable from '@com/useTable'
import {RunAutoValve} from '@api/api'
import {Serach, Cdivider} from "@com/comstyled"
const {Paragraph, Link} = Typography
const {Item} = Form

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
  .ant-drawer-header {
    border-bottom: none;
  }
  .ant-drawer-title {
    padding-left: 16px;
    border-left: 4px solid ${props => props.theme.primaryColor} ;
    color: #2a2f55;
    font-size: 16px;
    line-height: 32px;
  }
 .ant-table-container .ant-table-content .ant-table-thead {
    
    tr>th{
       background-color: ${props => props.theme.primaryColor};
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
    title: '设备状态',
    dataIndex: 'status',   
    align: 'center',
    render: (text) => {     
      return  Number(text) === 1 ? "开闸" : "合闸"
     // return text['1'] === 'Open' ? "开闸" : "合闸"
    }
  },
  {
    title: '策略是否启用',
    dataIndex: 'enabled',   
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
        setViewtb(Array.isArray(data) ? data : [])
      
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
              <Serach placeholder='请输入策略名称' style={{width: '370px'}}    onSearch={submit}   />
             </Item>
           </Space>
          
        </Form>
        
         <Cdivider type="h" style={{margin: '0px'}} />
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
       <Cdivider  borderColor="#2a2f55" type="h" margin='0 0 16px 0' />
       <div style={{flex: 1, backgroundColor: "#fff"}}>
       <Usetable columns={controlcolumns}  dataSource={viewtb} istheme="y"  rowKey={nanoid()}  scroll={{
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