import React, {useState, useRef, useEffect} from 'react'
import {useRequest, useAntdTable} from 'ahooks'
import {Typography, Space, Form, Input, Select, Switch, message} from 'antd'
import {WarningFilled} from '@ant-design/icons'
import styled from 'styled-components'
import {User} from '@api/api.js'
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
 const title = isAdd ? '新增账号' : '编辑账号';
const showModl = () => { 
   setIsAdd(true)
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

   custMsg({success, content: '删除成功',  onClose: () => {
      refresh()
      dref.current.onCancel()
    }})
    custMsg({success: !success, content: errMsg, type: 'warning'} )
   
  } catch (error) {
    
  }
 }
 const reset = (record) => {
  setRecord({...Record, ...record});
  newpwd.current = Math.random().toString().slice(2,8)
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
 const edit = (record) => {
    setRecord({...Record, ...record});
    setIsAdd(false)
    mform.setFieldsValue({
      ...record,
      rpwd: record.pwd,
      enabled: Number(record.enabled)
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
    let data = await mform.validateFields();
    delete data.rpwd
    let handler = isAdd ? AddOperationManager : Update;
    let content = isAdd ? '新增成功' : '编辑成功';
    let params = isAdd ? {...data, enabled: data.enabled ? 1 : 0} : {...data, enabled: data.enabled ? 1 : 0, id: Record.id};
    console.log(params);
    let {success, errMsg} = await handler(params)
    success && custMsg({success, content,  onClose: () => {
      mref.current.onCancel();
      refresh()
    }})
    !success && custMsg({success, content: errMsg, type: 'warning'} )

  
   
  } catch (error) {
    console.log(error)
  } 
}
 
  return (
     <Mainbox>
        <Form form={form} layout="inline" initialValues={{alike: ''}}>
            <Form.Item name="alike" label="账号查询">
                <Input.Search placeholder='请输入账号名称/手机号' allowClear enterButton="查询" style={{width: '550px'}} onSearch={submit}/>
            </Form.Item>
            <Form.Item>
                <CustButton style={{justifyContent: 'center'}} onClick={showModl}>+新增</CustButton>
            </Form.Item>
        </Form>
     <UserTable columns={columns} {...tableProps} rowKey='id'/>
     <CModal width={554} title={title} ref={mref} mold='cust' onOk={onOk}>
         <Form 
         form={mform}   
         size="middle"  
         labelCol={{flex: '7em'}}
          labelAlign="left" 
          preserve={false}
          validateMessages = {{
              required: "'${name}' 是必选字段"
           }}  
           >
             <Item label="用户角色">
                <Select disabled defaultValue="1"  options={[
                  {
                    value: '1',
                    label: '运营管理员',
                  },
                ]}>
                            
                </Select>
             </Item>
             <Item label="用户名" name="name" rules={[
                  {
                    required: true,
                    message: '请输入用户名！',
                  }]}>
                <Input />
             </Item>
             <Item label="用户姓名" name="nickName" rules={[
                  {
                    required: true,
                    message: '请输入用户姓名！',
                  }]}
                  >
                <Input />
             </Item>
             {
              isAdd &&
             (<>
             <Item label="密码" name="pwd" rules={[
                  {
                    required: true,
                    message: '请输入密码！',
                  }]}>
                <Input.Password  />
             </Item>   
             <Item label="确认密码" dependencies={['pwd']} name='rpwd'
                rules={[
                  {
                    required: true,
                    message: '请确认你的密码！',
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('pwd') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('密码不一致'));
                    },
                  }),
                ]}
             >
                <Input.Password  />
             </Item>  
            </>)
            }
             <Item label="手机号码" name="mobile" rules={[
                  {
                    required: true,
                    message: '请输入手机号码！',
                  }]}>
                <Input  />
             </Item> 
             <Item label="是否启用" name="enabled" valuePropName="checked">
               <Switch checkedChildren="是" unCheckedChildren="否"  />
             </Item> 
             <Item label="备注信息" name="remark">
               <Input.TextArea  autoSize={{
                    minRows: 2,
                    maxRows: 6,
                    }} />
             </Item> 
         </Form>
     </CModal>
     <CModal width={554} title="重置密码" ref={rref} onOk={restOk}  mold='cust' >
         <p>账号： <Link>{Record.name}</Link>， 密码将被重置为<Link>{newpwd.current}</Link></p>
         
     </CModal>
     <CModal width={554} title="删除提示" ref={dref} onOk={delOk} type="warn" mold='cust'>
         <p><WarningFilled />是否确认删除 <Text type="danger">{Record.name}</Text>账号?</p>
     </CModal>
     </Mainbox>
     
  )
}
