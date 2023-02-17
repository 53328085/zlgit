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
 const {QueryDataGroups, InsertDataGroup, DeleteDataGroup} = DataGroups
 let {Text, Link} = Typography
 const eref = useRef()
 const dref = useRef();
 const [form] = Form.useForm();
 const [title, setTitle] = useState()
 const [tableData, setTableData] = useState([])
 const [groupId, setGroupId] = useState(null)
 const getData = async () => {

      QueryDataGroups().then(({success, data}) => {
        console.log(data)
        success && setTableData(() => [...data])
      }).catch()
   
 }
 const add = () => {
   setTitle('新增数据组') 
   eref.current.onOpen();
 }
 const edit = (record) => {
   setValue(record.name)
   eref.current.onOpen()
 }
 const del = (id) => {
  setGroupId(id)
  dref.current.onOpen()
 }
 const onOk = async() => {
   try {
     let data = await form.validateFields()
     let {success} = await InsertDataGroup(data)
     success && message.success({
      content: '新增字段成功',
      onClose:  () =>  { 
          getData() 
          eref.current.onCancel() 
        },       
      duration: 0.3,
     })
   } catch (error) {
     console.log(error)
   }  
const onOkDel = async () => {
   if(!groupId) return;
    let {success, errMsg} = await DeleteDataGroup(gropuId);
    success && message.success({
      content: '删除字段成功',
      onClose:  () =>  { 
          getData() 
          eref.current.onCancel() 
        },       
      duration: 0.3,
     })
}
 /*  form.validateFields().then(res => {
     InsertDataGroup(res)
  }).catch(e => {
    console.log(e)
  }) */
    /* form.validateFields().then(res => {
      console.log(res)
    }).catch(err) {
      console.log(err)
    } */
 //  console.log(form.getFieldsValue());
   //form.submit()
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
      render: (_,record) => (<Space size={32}><Link underline  onClick={() => edit({id})}>编辑</Link><Link underline type="danger" onClick={() => del(id)}>删除</Link></Space>),
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
        <CModal title='删除提示' ref={dref}  mold="cust" width={512} type="warn" >
             <div style={{display:"flex", alignItems: "center"}}>
                 <span> 是否确认删除数据组名称？ </span>
               
             </div>
        </CModal>
    </Mainbox>
  )
}
