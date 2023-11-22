import React, {useState, useRef, useEffect, useMemo} from 'react'
import {flushSync} from 'react-dom'
import {useRequest, useAntdTable} from 'ahooks'
import {Typography, Space, Form, Input, Select, Switch, message, DatePicker} from 'antd'
import {WarningFilled} from '@ant-design/icons'
import styled from 'styled-components'
import moment from 'moment';
import {User} from '@api/api.js'
import {useSelector} from 'react-redux'
import {selectUser} from "@redux/user";
import UserTable from '@com/useTable'
import {CustButton} from '@com/useButton'
import {custMsg} from '@com/usehandler'
const Mainbox = styled.div`
  display: grid;
  grid-template-rows: 65px 1fr;
  row-gap: 16px;
`
export default function Account({projectId, CModal}) {
 const {Text, Link} = Typography
 const {QueryOperationManager, AddOperationManager, DeleteAccount, ResetPassword, Update} = User 
 const [form] = Form.useForm()
 const [mform] = Form.useForm()
 const {Item} = Form
 const mref = useRef(null)
 const dref = useRef(null)
 const rref = useRef(null)
 const newpwd = useRef(null)
 const [Record, setRecord] = useState({})
 const [isAdd, setIsAdd] = useState(true)
 const {roleType} = useSelector(selectUser) || {};
 const showview = roleType == 1 || roleType == 2
 const title = isAdd ? '新增账号' : '编辑账号';
 let initvalue = {
  password: true,
  enable: true,
  initialValues: {
    enabled: true,
    RoleType: '1'
  },
  roletype: [
    {
      id: '1',
      name: '运营管理员',
    },
  ]
 }

 const [initform, setInitialValues] = useState(initvalue)
const showModl = () => { 
   setIsAdd(true)
   setInitialValues({...initvalue})
   mref.current.onOpen()
}
 const del = async (record) => {
  setRecord({...Record, ...record})
  dref.current.onOpen()
 }    
 const delOk = async () => {
  let {id} = Record
  try {
    let {success, errMsg} =  await DeleteAccount(id)
   if(success) {
     dref.current.onCancel()
     refresh()
     custMsg({ content: '删除成功'})
   }
   
   !success &&  custMsg({content: errMsg, type: 'warning'} )
   
  } catch (error) {
    
  }
 }
 const reset = (record) => {
  setRecord({...Record, ...record});
  newpwd.current = `wuLian@${Math.random().toString().slice(2,8)}`
  rref.current.onOpen();
 }
 const restOk = async () => {
   try {
    const {id} = Record
    const {success, errMsg} =  await ResetPassword({id, pwd: newpwd.current})
    console.log(success)
    success && custMsg({success, content: '密码重置成功',  onClose: () => {
     
      rref.current.onCancel()
      refresh()
    }})
    !success && custMsg({success, content: errMsg, type: 'warning'} )
    
   } catch (error) {
     console.log(error)
   }
 
 }
/*  const edit = (record) => {
    setRecord({...Record, ...record});
     
    setIsAdd(false)
    let {validStageTime} = record;
    record.validStageTime = moment(validStageTime);
    console.log(record.validStageTime)
    mform.setFieldsValue({
      ...record,
      rpwd: record.pwd,
      enabled: Number(record.enabled),
    })
    mref.current.onOpen()

 }
 */

 const edit = (item) => {
  setRecord({...item});
   
  setIsAdd(false)
  item.validStageTime = moment(item.validStageTime, 'YYYY-MM-DD HH:mm:ss')
 item.enabled = item.enabled  == 1
 flushSync(() => {
  setInitialValues({
    ...initform, 
    password: false,
    initialValues: {...item, RoleType: '1'}})
}) 
  mref.current.onOpen()

}
 const columns = [  
        {
          dataIndex: "name",
          title: "用户名", 
          key: 'name',     
        },
        {
          dataIndex: "nickName",
          title: "用户姓名",
          key: "nickName",
        },
        
        {
          dataIndex: "mobile",
          title: "手机号码",
          key: 'mobile'
        },
        {
          dataIndex: "enabled",
          title: "状态",
          key: 'enabled',
          render: (text) => <span>{text===1 ? '启用' : '停用' }</span>
        },
        {
          dataIndex: "remark",
          key: 'remark',
          title: "备注",
        },
        {
          dataIndex: "op",
          title: "操作",
          render: (_,record) => <Space size={16}>
            <Link underline onClick={edit.bind(null, record)}>编辑</Link>
            <Link underline onClick={reset.bind(null, record)}>重置密码</Link>
            <Link underline type="danger" onClick={del.bind(null, record)}>删除</Link>
          </Space>
        }
     
 ]

 let params = { 
   pageNum: 1,
   pageSize: 15,
   alike: ''
 }
 const getTableData = ({current, pageSize}, formData) => {  
    params = Object.assign({}, params, {pageNum: current, pageSize}, formData)
    return  QueryOperationManager(params).then(res => {
      let {success, data: {data, total}} = res 
      if (success && Array.isArray(data)) {
        return {
          total,
          list: data
        }
      
      }else {
        return {
          total: 0,
          list: []
        }
      }
    })
  }
  const {tableProps, search, refresh} = useAntdTable(getTableData, {  
    form,
    refreshDeps: [projectId, params.alike],
    defaultPageSize: 15,
    onError: (e) => {
      console.log(e)
    },
   
   })
 const {submit} = search;
 const onOk = async () => {
  try {
    let data = await mref.current.onGetvalue();
    console.log(data)
    delete data.rpwd
    delete data.RoleType
    let handler = isAdd ? AddOperationManager : Update;
    let content = isAdd ? '新增成功' : '编辑成功';
    let params = isAdd ? {...data, enabled: data.enabled ? 1 : 0, validStageTime: data.validStageTime.format('YYYY-MM-DD')} : {...data, enabled: data.enabled ? 1 : 0, id: Record.id, validStageTime: data.validStageTime.format('YYYY-MM-DD')};
    
    let {success, errMsg} = await handler(params)
    
    if(success) {
      message.success(content)
      if(isAdd) mref.current.onResetform()
      if(!isAdd) mref.current.onCancel();
      refresh()
    }else {
      message.error(errMsg || '数据出错')
    }
    
  } catch (error) {
    console.log(error)
  } 
}
  const addcmodal = useMemo(() => <CModal width={554} title={title} ref={mref} mold='default' onOk={onOk} custft={isAdd}  fromprops={initform} > 

  </CModal>, [title, isAdd] )
  return (
  <Mainbox>
     {  showview ? 
        <>
        <Form form={form} layout="inline" initialValues={{alike: ''}}>
            <Form.Item name="alike" label="账号查询">
                <Input.Search placeholder='请输入账号名称/手机号' allowClear enterButton="查询" style={{width: '550px'}} onSearch={submit}/>
            </Form.Item>
            <Form.Item>
                <CustButton style={{justifyContent: 'center'}} onClick={showModl}>+新增</CustButton>
            </Form.Item>
        </Form>
     <UserTable columns={columns} {...tableProps} rowKey='id'/>

     {/*  {addcmodal} */}

     <CModal width={554} title={title} ref={mref} mold='default' onOk={onOk} custft={isAdd}  fromprops={initform} > 

     </CModal>
   
     <CModal width={554} title="重置密码" ref={rref} onOk={restOk}  mold='cust' >
         <p>账号： <Link>{Record.name}</Link>， 密码将被重置为<Link>{newpwd.current}</Link></p>
         
     </CModal>
     <CModal width={554} title="删除提示" ref={dref} onOk={delOk} type="warn" mold='cust'>
     <p style={{paddingLeft: '32px',color:"#333", display: 'flex', alignItems: 'center', fontSize: '18px'}}>
        <WarningFilled style={{color: '#ff4d4f', fontSize: '38px', marginRight: '32px'}}/>是否确认删除 <Text type="danger">{Record.name}</Text>账号?</p>
     </CModal>
     </>
       : null
                  }
     </Mainbox>
     
  )
}
