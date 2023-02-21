import React, {useState, useRef, useEffect} from 'react'
import {useRequest, useAntdTable} from 'ahooks'
import {Typography, Space, Form, Input, Select, Switch, message} from 'antd'
import {WarningFilled} from '@ant-design/icons'
import styled from 'styled-components'
import {User} from '@api/api.js'
import UserTable from '@com/useTable'
import {CustButton} from '@com/useButton'

const Mainbox = styled.div`
  display: grid;
  grid-template-rows: 65px 1fr;
  row-gap: 16px;
`
export default function Account({projectId, CModal}) {
 const {Text, Link} = Typography
 const {GetUsersPage, GetRoleType, ResetPassword, UpdateUser, DeleteUse, QueryOperationManager, AddOperationManager} = User 
 const [form] = Form.useForm()
 const [mform] = Form.useForm()
 const {Item} = Form
 const [isopen, setIsopen]=useState(false)
 const [roletype, setRoletype] = useState([])
 const [title, setTitle] = useState('新增账号')
 const [userinof, setUserinfo] = useState({
    loginName: '',
    nickName: '',
    pwd:'',
    rpwd: '',
    mobile: '',
    enabled: true,
    remark: ''
 })
 const mref = useRef(null)
const showModl = (type=0) => { 
   let text = ['新增账号', '编辑账号'][type]
   setTitle(text)
   mref.current.onOpen()
}

 const [record, setRecord] = useState({})
 const [isEdit, setIsEdit] = useState(false)
 
 const [pwdparms, setpwdparms] = useState({userId: '', pwd: ''})

 

 
 
 

 
 const updateuser = (record) => {
    setRecord(o => ({...o, ...record}))
    setIsopen(true)   
    let {loginName, nickName, mobile,  enabled, remark} = record
    mform.setFieldsValue({
      'loginName':loginName,
      'nickName': nickName,
      'mobile': mobile,
      'remark': remark,
      'enabled': enabled,
    })
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
            <Link underline onClick={ null}>编辑</Link>
            <Link underline onClick={null }>重置密码</Link>
            <Link underline type="danger" onClick={null}>删除</Link>
          </Space>
        }
     
 ]

 let params = {
   projectId,
   pageNum: 1,
   pageSize: 15,
   likeValue: ''
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
    refreshDeps: [projectId, params.likeValue, isEdit],
    defaultPageSize: 15,
    onError: (e) => {
      console.log(e)
    },
   
   })
 const {submit} = search;
 const onOk = async () => {
  try {
    let data = await mform.validateFields();
    console.log(data)
    let {success, errMsg} = await AddOperationManager({...data, enabled: data.enabled ? 1 : 0})
    success && message.success({
      content: '新增成功', 
      onClose: () => {
        mref.current.onCancel();
        refresh()
      },
      duration: 0.3,
    })
    !success && message.warning(errMsg || '数据出错, 请检查输入数据')
  } catch (error) {
    console.log(error)
  } 
}
 
  return (
     <Mainbox>
        <Form form={form} initialValues={{likeValue: params.likeValue}} layout="inline">
            <Form.Item name="likeValue" label="账号查询">
                <Input.Search placeholder='请输入账号名称/手机号' allowClear enterButton="查询" style={{width: '550px'}} onSearch={submit}/>
            </Form.Item>
            <Form.Item>
                <CustButton style={{justifyContent: 'center'}} onClick={showModl.bind(null, 0)}>+新增</CustButton>
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
             <Item label="用户名" name="nickName" rules={[
                  {
                    required: true,
                    message: '请输入用户名！',
                  }]}>
                <Input />
             </Item>
             <Item label="用户姓名" name="name" rules={[
                  {
                    required: true,
                    message: '请输入用户姓名！',
                  }]}
                  >
                <Input />
             </Item>
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
     <CModal width={554} title="重置密码"     >
         <p>账号： <Link>{record.loginName}</Link>， 密码将被重置为<Link>{pwdparms.pwd}</Link></p>
         
     </CModal>
     <CModal width={554} title="重置密码"   >
         <p><WarningFilled />是否确认删除 <Text type="danger">{record.loginName}</Text>账号?</p>
     </CModal>
     </Mainbox>
     
  )
}
