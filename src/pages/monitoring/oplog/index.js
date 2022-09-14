import React, {useState, useEffect} from 'react'
import {nanoid} from '@reduxjs/toolkit'
import {useRequest, useToggle, useAntdTable} from 'ahooks'
import {GetLogOperation, OpLog} from '@api/api.js'
import {Form, DatePicker, Input, Button} from 'antd'
import Pagecount from '@com/pagecontent'
import UserTable from '@com/useTable'
import moment from 'moment'
import server from '../../../axios'
const { RangePicker } = DatePicker;

export default function Index() {
/*   let [params, setparams] = useState({
    start: '2022-07-20 00:00:00',
    end: '2022-08-19 23:59:59',
    pageNum: 1,
    pageSize: 10,
  }) */
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
  const [form] = Form.useForm()
  let {tableProps, search, params} = useAntdTable(getTableData, {   
    form,
    defaultParams: [
      {current: 2, pageSize: 5}
    ],
    cacheKey: 'useAntdTableCache',
  })
  const {type, changeType, submit, reset} = search
  console.log(type)
 // let {loading, run, runAsync, refresh, cancel} = useRequest(OpLog, { //自动请求
    // ready,
    /* ready : 当 manual=false 自动请求模式时，每次 ready 从 false 变为 true 时，都会自动发起请求，会带上参数 options.defaultParams。
       当 manual=true 手动请求模式时，只要 ready=false，则通过 run/runAsync 触发的请求都不会执行。 */
    // manual: true, // 手动请求
   // pollingInterval: 3000, 轮询
    //debounceWait: 600, //防抖
   // throttleWait: 600, // 节流
   // defaultParams: params, //默认参数
    //refreshDeps: [params],   // 依赖
   // refreshOnWindowFocus: true,
  
   /*  onBefore: () => {
        console.log('请求之前')
    },
    onSuccess: (result, params) => {
        
    },
    onError: (error) => {
        message.error(error.message)
    },
    onFinally: () => {
        console.log('请求完成')
    }
    
  })  */
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
  /* const columns = [
    {
      title: 'name',
      dataIndex: ['name', 'last'],
    },
    {
      title: 'email',
      dataIndex: 'email',
    },
    {
      title: 'phone',
      dataIndex: 'phone',
    },
    {
      title: 'gender',
      dataIndex: 'gender',
    },
  ];
  const getTableData = ({ current, pageSize }) => {
    let query = `page=${current}&size=${pageSize}`;
  
    return fetch(`https://randomuser.me/api?results=55&${query}`)
      .then((res) => res.json())
      .then((res) => ({
        total: res.info.results,
        list: res.results,
      }));
  };
  
  const { tableProps } = useAntdTable(getTableData);
  
  console.log(tableProps) */
 useEffect(() => {
  //console.log(moment().local().format('YYYY-MM-DD HH:mm:ss'))
 })


  return (
    <Pagecount>
      <Form form={form}  layout="inline"  initialValues={{
        date: [ moment().subtract(1, 'M'), moment(),],
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
    </Pagecount>
  )
}
