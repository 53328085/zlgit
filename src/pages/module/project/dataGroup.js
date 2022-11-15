import React, {useState, useRef} from 'react'
import {Form, Space, Input, Button, Typography} from 'antd'
import styled from 'styled-components'
import Custtable from '@com/useTable'
import Custmodl from '@com/useModal'
const Mainbox = styled.div`
  display: grid;
  grid-template-rows: 32px 1fr;
  row-gap: 16px;
  flex: 1;
`
export default function Datagroup() {
 let {Text, Link} = Typography
 const eref = useRef()
 const dref = useRef()
 const [value, setValue] = useState()
 const edit = (record) => {
   setValue(record.name)
   eref.current.onOpen()
 }
 const del = (record) => {
  dref.current.onOpen()
 }
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
      render: (text, record, index) => (<Space size={32}><Link underline  onClick={() => edit(record)}>编辑</Link><Link underline type="danger" onClick={() => del(record)}>删除</Link></Space>),
      align: 'center'
    },
    
  ]
  const Data = [
    {name: '电参量', lastSampleTime: '2021-01-20 14:53:33', id: 1 },
    {name: '电能质量', lastSampleTime: '2022-03-20 11:53:33', id: 2 }
  ]
  return (
    <Mainbox>
       <div>
          <Button type="primary" style={{width: '96px'}}>+&nbsp;新增</Button>
       </div>
       <Custtable columns={columns} rowKey="id" dataSource={Data}></Custtable> 
       <Custmodl title='编辑数据组' ref={eref}  mold="cust" width={512} >
             <div style={{display:"flex", alignItems: "center"}}>
                 <span> 数据组名称&nbsp;&nbsp; </span>
                 <Input style={{flex: 1}} value={value} />
             </div>
        </Custmodl>
        <Custmodl title='删除提示' ref={dref}  mold="cust" width={512} type="warn" >
             <div style={{display:"flex", alignItems: "center"}}>
                 <span> 是否确认删除数据组名称？ </span>
               
             </div>
        </Custmodl>
    </Mainbox>
  )
}
