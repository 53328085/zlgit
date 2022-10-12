import React, {useMemo, useState} from 'react'
import styled from 'styled-components'
import {Typography,Select, Row, Col, Button, Input, Space, Drawer, Modal, Form, message} from 'antd'
import {useRequest} from 'ahooks'
import {Project} from '@api/api.js'
import Custmodal from './modal'
const {Title, Text} = Typography
const {Option} = Select
const {Item} = Form
const {getOperationManagerUsers, ProjectAddOperationManager, addProjectUser} = Project

export default function Account() {
  const Mainbox = styled.div`
  display: grid;
  grid-template-rows: repeat(3, 1fr);
  grid-template-columns: 1090px  1fr;
  row-gap: 16px;

   div.admin {
    padding: 16px 0;
    display: grid;
    grid-auto-rows: 32px;    
    row-gap: 16px;
    border-bottom: 1px dotted #dedede;
    .item {
      display: grid;
      grid-template-columns: 160px 160px 256px 1fr;
      column-gap: 16px;
      .as {
        grid-area: 1 / 1 / 2/ 3;
      }
    }
    .title {
      font-size: 14px; 
      width: 336px;
    }
  }
`
const [operate, setOperate] = useState([])
const [opvalue, setOpvalue] = useState('')
const [open , setOpen] = useState(false)
 useRequest(getOperationManagerUsers, {
  onSuccess: (res) => {
    console.log(res)
    const {success, data} = res
    if (success) setOperate(data)
    console.log(operate)
  }
 })

 const addOperation =  () => {
   
    setOperate(arr => {
      let item = arr.find(i=> i.id == opvalue)
      if (item) item.disabled = true
      return [...arr]
    }) 
 }
const delop = (id) => {
  setOperate(arr => {
    let item = arr.find(i=> i.id == id)
    if (item) item.disabled = false
    return [...arr]
  }) 
}
 const handChange = (value, options) => {
    console.log(options)
     setOpvalue(value)
 }
 const delsty = {
     width: '96px'
 }
 const addstyl = {
   width: "112px",
   padding: "0px"
 }
 const oplist = useMemo(() => {  
  return operate.filter(item => item.disabled)
}, [operate])

const addProjectadmin = () => {
  setOpen(true)
}
const cancal = () => {
  setOpen(false)
}
const ok = async (values) => {
  const params = {...values, RoleType: 3, ProjectId: '1'
  }
  try {
    let {success, errMsg} =await addProjectUser(params)
    console.log(success)
    if (!success) message.error(errMsg, 1)
    return success
  } catch (error) {
    console.log(error)
    return
  }
  
}
const Pributton = ({children='', width="112px", onClick=()=>{}}={}) => {
 return <Button size="middle" style={{width: width, padding: '0px'}} onClick={onClick} type="primary" ghost >{children}</Button>
}
  return (
    <Mainbox>
      <div>
       <div className='admin'>
            <Title level={5} className="title">运营管理员（支持添加多位运营管理员）</Title>
             <div className='item'>
                 <Select 
                  size='middle'
                   className='as'
                  value={opvalue}
                 onChange={handChange}
                 fieldNames={{label: 'loginName', value: 'id', disabled: 'disabled'}}
                 options={operate}  placeholder="请选择运营管理员">

                 </Select>
             
          {/*   <Button size="middle" style={addstyl} onClick={addOperation} type="primary" ghost >+&nbsp;添加</Button> */}
            <Pributton onClick={addOperation}>+&nbsp;添加</Pributton>
           </div>
          <div className='item'>
              <Text type=''>用户名</Text> <Text>姓名</Text> <Text span={4}>手机号</Text>
          </div>
          { oplist.map((item) => (
          <div className='item' key={item.id}>             
                <Input size='middle' value={item.loginName} readOnly /><Input size="middle" readOnly value={item.nickName}/><Input size="middle" readOnly value={item.mobile}/>
                <Button size='middle' danger style={delsty} onClick={() => delop(item.id)}>删除</Button>
          </div>))
          }
       </div>
       <div className='admin'>
          <Space size={16}>
            <Title level={5}  className="title">项目管理员（仅支持添加一位项目管理员）</Title>
            <Pributton onClick={addProjectadmin}>添加项目管理员</Pributton>
            </Space> 
          <div className='item'>
              <Text type=''>用户名</Text> <Text>姓名</Text> <Text span={4}>手机号</Text>
          </div>  
          <Form.Provider
            onFormFinish={(name, {values, forms}) => {                 
                 const {LoginName, NickName, Mobile} = values
                 if (name=='modalform') {
                  const {useform} = forms
                  useform.setFieldsValue({
                    ...values
                  })
                 }
                 
              }
            }
          >
           <Form name="useform" layout="inline" className='item'>
              
               <Item name="LoginName" noStyle>
                  <Input size="middle" />
               </Item>
               <Item name="NickName" noStyle>
                  <Input size="middle" />
               </Item>
               <Item name="Mobile" noStyle>
                  <Input size="middle" />
               </Item>
               <Item noStyle>
                  <Pributton>菜单权限</Pributton>
               </Item>
           </Form>
           <Custmodal title="新增项目管理员" open={open} cancal={cancal} ok={ok}></Custmodal>
          </Form.Provider>
       </div>
       <div className='admin'>
        <Space size={16}>
          <Title level={5} className="title">运维人员（支持添加多位运维人员）</Title>
          <Button size="middle" style={addstyl}  type="primary" ghost >添加运维人员</Button>
          </Space> 
       </div>
       </div>

      {/*  <Drawer open={open} title="项目权限选择" width={608} closable={false} extra={<Button type="primary">保存</Button>}>
          抽屉
       </Drawer> */}
    </Mainbox>
  )
}
