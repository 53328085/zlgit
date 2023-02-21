import React, {useState, useRef, useEffect} from 'react'
import {Form, Space, Input, Button, Typography,Row, Col, message} from 'antd'
import styled from 'styled-components'
import Custtable from '@com/useTable'
import {DataGroups} from '@api/api.js'
const Mainbox = styled.div`
  display: grid;
  grid-template-rows: 32px 1fr;
  row-gap: 16px;
  flex: 1;
`
export default function Datagroupc({projectId, CModal}) {
 const {QueryDataGroups, InsertDataGroup, DeleteDataGroup, UpdateDataGroup} = DataGroups
 let {Text, Link} = Typography
 const eref = useRef()
 const dref = useRef();
 const [form] = Form.useForm();
 const [title, setTitle] = useState()
 const [tableData, setTableData] = useState([])
 const [groupId, setGroupId] = useState(null)
 const [type, setType] = useState(0)
 const getData = async () => {

      QueryDataGroups().then(({success, data}) => {       
        success && setTableData(() => [...data])
        return true;
      }).catch()
   
 }
 const add = () => {
   setTitle('新增数据组') 
   setType(0)
   eref.current.onOpen();
 }
 const edit = ({id, name}) => {
   setTitle('编辑数据组')
   setGroupId(id);
   setType(1)
   eref.current.onOpen();
   console.log(name);
   form.setFieldValue('name', name)
 }
 const del = (id) => { 
  setGroupId(id)
  dref.current.onOpen()
 }
 
 const onOk = async() => { // type: 0 新增， 1 编辑；
   
   try {
     let data = await form.validateFields()
     let {success} = type == 0 ? await InsertDataGroup(data) : await UpdateDataGroup({name: data.name, id: groupId})
     success && message.success({
      content:  ['新增字段成功', '编辑字段成功'][type],
      onClose:  () =>  { 
          getData().then((_) => eref.current.onCancel() ) 
          
        },       
      duration: 0.3,
     })
   } catch (error) {
     console.log(error)
   }   
 }
 const onOkDel = async () => {
  try {
   if(!groupId) return;
   console.log(groupId);
   let {success, errMsg} = await DeleteDataGroup({id:groupId});
   success && message.success({
     content: '删除字段成功',
     onClose:  () =>  { 
         getData().then(_ => dref.current.onCancel());
         
       },       
     duration: 0.3,
    })
  } catch (error) {
     console.log(error)
  }
  
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
      key: 'name',
    },
    {
      dataIndex: "updateTime", // status 1: 离线 2：在线
      title: "更新时间",
      key: 'updateTime',
    },
    {
      dataIndex: "op",
      title: "操作",
      render: (_,{id,name}) => (<Space size={32}><Link underline  onClick={() => edit({id,name})}>编辑</Link><Link underline type="danger" onClick={() => del(id)}>删除</Link></Space>),
      align: 'center'
    },
    
  ]
  useEffect(() => {
    getData();
  }, [])
  return (
    <Mainbox>
       <div style={{display: 'flex', justifyContent: 'flex-start', alignItems: 'center'}}>
          <Button type="primary" style={{width: '96px'}} onClick={add}>+&nbsp;新增</Button>
       </div>
       <Custtable columns={columns} rowKey="id" dataSource={tableData}></Custtable> 
       <CModal title={title} ref={eref}  mold="cust" width={592} onOk={onOk}>
             <Form style={{display:"flex", height: '48px'}} form={form}  labelAlign="left" preserve={false}>   
               
                <Form.Item label="数据组名称" name="name" rules={
                    [
                      {
                        required: true,
                        message: '请输入数据组名称'
                      }
                    ]
                 }>
                    <Input style={{width: '412px'}} />
                 </Form.Item>    
                 
                        
                
             </Form>
        </CModal>
        <CModal title='删除提示' ref={dref}  mold="cust" width={512} type="warn" onOk={onOkDel} >
             <div style={{display:"flex", alignItems: "center"}}>
                 <span> 是否确认删除数据组名称？ </span>
               
             </div>
        </CModal>
    </Mainbox>
  )
}
