import React, {useState, useRef, useEffect, useCallback, useMemo} from 'react'
import {Form, Space, Input, Button, Typography,Row, Col, message} from 'antd'
import styled from 'styled-components'
import {useTranslation} from "react-i18next"
import Custtable from '@com/useTable'
import {DataGroups} from '@api/api.js'
import {CustButtonT, CustLink} from "@com/useButton"
const Mainbox = styled.div`
  display: grid;
  grid-template-rows: 32px 1fr;
  row-gap: 16px;
  flex: 1;
`
export default function Datagroupc({projectId, CModal}) {
 const {QueryDataGroups, InsertDataGroup, DeleteDataGroup, UpdateDataGroup} = DataGroups
 let {Text, Link} = Typography
 const {t} =useTranslation("common")
 const eref = useRef()
 const dref = useRef();
 const [form] = Form.useForm();
 const [title, setTitle] = useState()
 const [tableData, setTableData] = useState([])
 const [groupId, setGroupId] = useState(null)
 const [type, setType] = useState(0)
 const getData = async () => {

      QueryDataGroups().then(({success, data}) => {  
        if(success) {
           Array.isArray(data) ? setTableData(() => [...data]) : setTableData([])
        }    
        
        
      }).catch()
   
 }
 const add =useCallback(() => {
   setTitle(t("AddDataGroup")) 
   setType(0)
   eref.current.onOpen();
 }, [type])
 const edit = ({id, name}) => {
   setTitle('编辑数据组')
   setGroupId(id);
   setType(1)
   eref.current.onOpen();
  
   form.setFieldValue('name', name)
 }
 const del = (id) => { 
  setGroupId(id)
  dref.current.onOpen()
 }
 
 const onOk = async() => { // type: 0 新增， 1 编辑；
   
   try {
     let data = await form.validateFields()
     console.log(data)
     let {success, errMsg} = type == 0 ? await InsertDataGroup(data) : await UpdateDataGroup({name: data.name, id: groupId})
     if (success) {
      let msg = ['新增字段成功', '编辑字段成功'][type]
       message.success(msg)
       getData();
       if(type == 0) form.resetFields();
       if(type == 1) eref.current.onCancel();
     }else {
       message.warning(errMsg||'数据出错')
     }
     
   } catch (error) {
     console.log(error)
   }   
 }
 const onOkDel = async () => {
  try {
   if(!groupId) return;
   console.log(groupId);
   let {success, errMsg} = await DeleteDataGroup({id:groupId});
   if(success) {
    message.success('删除字段成功')
    dref.current.onCancel()
    getData()
   }else {
    message.warning(errMsg || "数据出错")
   }
    
  } catch (error) {
     console.log(error)
  }
  
}
 const columns = [
    { 
    
      dataIndex: "sn",
      title: t("common:SerialNumber"),  
      render: (text, record, index) => <span>{index + 1}</span>   
    },
    {
   
      dataIndex: "name",
      title:  t("common:DataGroupName"),
      key: 'name',
    },
    {
      dataIndex: "updateTime", // status 1: 离线 2：在线
      title:t("common:UpdateTime"),
      key: 'updateTime',
    },
    {
      dataIndex: "op",
      title:t("common:Operation") ,
      render: (_,{id,name}) => (<Space size={32}><CustLink  onClick={() => edit({id,name})} text="edit" /> <CustLink  type="danger" onClick={() => del(id)} text="delete" /> </Space>),
      align: 'center'
    },
    
  ]
  useEffect(() => {
    getData();
  }, [])
  const addmodal = useMemo(() =>   <CModal title={title} ref={eref}  mold="cust" width={592} onOk={onOk} custft={type == 0}>
  <Form style={{display:"flex", height: '48px'}} form={form}  labelAlign="left" preserve={false}>   
    
     <Form.Item label={t("DataGroupName")} name="name" rules={
         [
           {
             required: true,
             message: t("titlegroupname")
           }
         ]
      }>
         <Input style={{width: '412px'}} allowClear />
      </Form.Item>    
      
             
     
  </Form>
</CModal>, [title, type])
  return (
    <Mainbox>
       <div style={{display: 'flex', justifyContent: 'flex-start', alignItems: 'center'}}>
          <CustButtonT   onClick={add} text="new" src="new" /> 
       </div>
       <Custtable columns={columns} rowKey="id" dataSource={tableData}></Custtable> 
        {addmodal}
        <CModal title={t("common:Deleteprompt")} ref={dref}  mold="cust" width={512} type="warn" onOk={onOkDel} >
             {t("common:deletedata")}
        </CModal>
    </Mainbox>
  )
}
