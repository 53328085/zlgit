import React, {useState} from 'react'
import {Form, Space, Input, Button, Typography} from 'antd'
import styled from 'styled-components'
import Custtable from '@com/useTable'
const Mainbox = styled.div`
  display: grid;
  grid-template-rows: 32px 1fr;
  row-gap: 16px;
  flex: 1;
`
export default function Datagroup() {
 let {Text} = Typography
 const columns = [
    {
      dataIndex: "sn",
      title: "序号",  
      render: (text, record, index) => <span>{index + 1}</span>   
    },
    {
      dataIndex: "name",
      title: "数据组名称",
    },
    {
      dataIndex: "lastSampleTime", // status 1: 离线 2：在线
      title: "更新时间",
    },
    {
      dataIndex: "op",
      title: "操作",
      render: () => (<Space size={32}><Text underline>编辑</Text><Text underline>删除</Text></Space>),
      align: 'center'
    },
    
  ]
  const Data = [
    {name: '电参量', lastSampleTime: '2021-01-20 14:53:33', id: 1 }
  ]
  return (
    <Mainbox>
       <div>
          <Button type="primary" style={{width: '96px'}}>+&nbsp;新增</Button>
       </div>
       <Custtable columns={columns} rowkey="id" dataSource={Data}></Custtable> 
    </Mainbox>
  )
}
