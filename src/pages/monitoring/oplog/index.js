import React, {useState, useEffect} from 'react'
import {nanoid} from '@reduxjs/toolkit'
import {useRequest, useToggle, useAntdTable} from 'ahooks'
import {GetLogOperation, OpLog} from '@api/api.js'
import {Form, DatePicker, Input, Button} from 'antd'
import Pagecount from '@com/pagecontent'
import UserTable from '@com/useTable'
import CustContext from '@com/content.js'
import moment from 'moment'
const { RangePicker } = DatePicker;

export default function Index() {

  let  posts = {
    start: '2022-07-20 00:00:00',
    end: '2022-08-19 23:59:59',
    pageNum: 1,
    pageSize: 10,
  }
 const getTableData = ({ current, pageSize }, formData) => {
    //console.log(formData)
  // console.log(formData[0]?.local())
  console.log(formData)
  let {date} = formData
  let start = date[0]?.local()?.format('YYYY-MM-DD HH:mm:ss')
  let end = date[1]?.local()?.format('YYYY-MM-DD HH:mm:ss')
 
    posts = Object.assign({}, posts, {pageNum: current, pageSize}, {start, end})
    console.log(posts)
    return OpLog(posts).then(res => {
      //console.log(res)
      return {
        total: res.totalNum,
        list: res.data
      }
    })
  }
  const [inform] = Form.useForm()
  const [form] = Form.useForm()
  let {tableProps, search, params} = useAntdTable(getTableData, {   
    form,
    defaultParams: [
      {current: 2, pageSize: 5}
    ],
    cacheKey: 'useAntdTableCache',
  })
  const {type, changeType, submit, reset} = search

  const columns = [
    {
      title: '操作时间',
      dataIndex: 'updateTime'
    },
    {
      title: '操作者',
      dataIndex: 'creator'
    },
    {
      title: '设备编号',
      dataIndex: 'sn'
    },
    {
      title: '操作内容',
      dataIndex: 'content'
    },
    {
      title: '操作结果',
      dataIndex: 'result'
    },
     
  ]  
 useEffect(() => {
  
 })
  const propsData= {
     form,
     search
  }

  return (
    <div>
    {/* // <CustContext.Provider value={propsData}>
    // <Pagecount showserach={true}> */}
      <Form form={form}  layout="inline"  initialValues={{
        date: [moment().subtract(1, 'M'), moment(),],
        like: ''
      }}
       style={{marginBottom: '16px'}}
      >
        <Form.Item name="like">
          <Input placeholder='请输入设备编号/安装地址' onChange={submit}></Input>
        </Form.Item>
        <Form.Item name="date" >
            <RangePicker separator='至'  onCalendarChange={submit} format="YYYY-MM-DD HH:mm:ss"   />
           
        </Form.Item>
        <Form.Item>
        <Button type="primary" onClick={reset}>
          重置
        </Button>
      </Form.Item>
      <Form.Item>
        <Button type="primary" onClick={changeType}>
          高级查询
        </Button>
      </Form.Item>
      </Form>
      <UserTable columns={columns} rowKey={(record) => record.updateTime + record.sn} {...tableProps} ></UserTable>
    {/* // </Pagecount>
    // </CustContext.Provider> */}
    </div>
  )
}
