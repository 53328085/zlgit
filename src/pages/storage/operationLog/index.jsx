import React, { useState, useRef, useCallback } from 'react'
import styled from 'styled-components'
import {Typography,  Form, Space, Input, Select, DatePicker,  Divider } from 'antd'
import {useAntdTable} from 'ahooks'
import {nanoid} from "@reduxjs/toolkit"
import {  useOutletContext} from 'react-router-dom'
import moment from 'moment'
import Titlelayout from '@com/titlelayout'
import Usetable from '@com/useTable'
import {OperationLogRuntime} from '@api/api'
import {  ExportExcel} from '@com/useButton'
import Pagecount from "@com/pagecontent";
 
const {Paragraph} = Typography
const {Item} = Form
const { RangePicker } = DatePicker;
const disabledDate = (current) => {   
  return current && current > moment().endOf('day');
};
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
        title: '操作时间',
        dataIndex: 'date',
        key: 'date',
        align: 'center'
    },
    {
        title: '事件类型',
        dataIndex: 'eventType',
        key: 'eventType',
        align: 'center'
    },
    {
      title: '事件描述',
      dataIndex: 'content',
      key: 'content',
      align: 'center'
     },
     {
      title: '状态',
      dataIndex: 'content',
      key: 'content',
      align: 'center'
     },
   ]
 
export default function Index() {
  let {exparams} = useOutletContext()
 
  let {stationName, areaId, projectId} = exparams
  const condition = Number.isInteger(areaId) && Number.isInteger(projectId) && stationName?.value
   const [form] = Form.useForm()
  
   const [total, setTotal] = useState(0)
 
  const QueryReports =  ({current, pageSize}, form) => {   
    if(!condition) return;
    let {time, ...rest} = form
    let start = time[0].format('YYYY-MM-DD')
    let end = time[1].format('YYYY-MM-DD')
    let params = {
      pageNum: current,
      pageSize,
      start,
      end,
      projectId,
   //  areaId,
      siteId: stationName?.value,
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
      siteId: stationName?.value,
      content : "",
      type: 0,
      status: 0

    }],
    refreshDeps: [projectId,  stationName]
  })
  
  const {submit} = search
  

  const tableref = useRef()
  //const getref = () => tableref.current
  const onExport = useCallback(() => {
    let formData = form.getFieldsValue()
    return  QueryReports({current: 1, pageSize: total}, formData)
}, [total])
 
 
  return (
    <Pagecount   pd="0px" bgcolor="transparent">  
    <Mainbox>    
    <Titlelayout title="操作日志" layout="flex" >
    <div className='content'>
        <Form form={form} className='top' layout='inline' initialValues={{
          content: '',
          deviceType:0,
          level: 0,
          time: [moment().subtract(7, 'day'), moment()]
        }}>
          <Space size={32}>
             <Item label="日志查询" name="content">
              <Input placeholder='操作内容' style={{width: '320px'}} allowClear onChange={submit} />
             </Item>
             <Divider style={{margin: '0', height: '32px'}}  type="vertical" />
             <Item label="设备类型" name="type">
              <Select options={[
                {label: '全部', value: 0},
                {label: 'PCS', value: 1},
                {label: '电堆', value: 2},
              ]}
              style={{width: '112px'}}
              onChange={submit}
              ></Select>
             </Item>  
             <Divider style={{margin: '0', height: '32px'}} type="vertical" />
             <Item label="状态" name="status">
              <Select options={[
                {label: '全部', value: 0},
                {label: '成功', value: 1},
                {label: '失败', value: 2},
              ]}
              style={{width: '112px'}}
              onChange={submit}
              ></Select>
             </Item>  
             <Divider style={{margin: '0', height: '32px'}} type="vertical" />
             <Item label="操作时间" name="time" >
               <RangePicker  onChange={submit}  format="YYYY-MM-DD" disabledDate={disabledDate} style={{width: '320px'}}/>
            </Item>
           </Space>
           <Item noStyle>
              <ExportExcel  tb={tableref} />
           </Item>
        </Form>
        
         <Divider style={{margin: '0px'}}/>
        <Usetable columns={columns} ref={tableref} {...tableProps}  hbg="#f0f9ff" hbc="#515151"  rowKey={nanoid()}   sheetName="操作日志" onExport={onExport} />   
           
    </div>
    </Titlelayout>
    </Mainbox>
    </Pagecount>
  )
}
 