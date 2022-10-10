import React, {useState} from 'react'
import {useSelector} from 'react-redux'
import {useRequest, useAntdTable} from 'ahooks'
import {Typography, Space, Form, Input, Modal, Select, Switch, message} from 'antd'
import {WarningFilled} from '@ant-design/icons'
import styled from 'styled-components'
import {selectCurProject} from '@redux/user.js'
import {User} from '@api/api.js'
import UserTable from '@com/useTable'


const Mainbox = styled.div`
  display: grid;
  grid-template-rows: 65px 1fr;
  row-gap: 16px;
`
export default function Account() {
 const {Text, Link} = Typography
 const {GetUsersPage, GetRoleType, ResetPassword, UpdateUser, DeleteUse} = User 
 const [form] = Form.useForm()
 const [mform] = Form.useForm()
 const {Item} = Form
 const [isopen, setIsopen]=useState(false)
 const [roletype, setRoletype] = useState([])
 const [userinof, setUserinfo] = useState({
    LoginName: '',
    NickName: '',
    RoleType: 1,
  //  Pwd: '',
   // RePwd: '',
    Mobile: '',
    Enabled: true,
    Remark: ''
 })
 const [record, setRecord] = useState({})
 const [isEdit, setIsEdit] = useState(false)
 const [isrepd, setIsrepd] = useState(false)
 const [pwdparms, setpwdparms] = useState({userId: '', pwd: ''})

 const {loading} = useRequest(GetRoleType, { // 获取用户角色 list
    onSuccess: (result) => {
        let {data, success} = result
        if (success) {
            setRoletype(data)
        }
    },

 })

 // setRoletype(data?.data || [])
 const delcancal = () => {}
 const delok =() => {}
 const deluser = () => {}
 const repdcancal = () => {
  setIsrepd(false)
}
 const repdupdate = () => {
     repdcancal()
     setIsEdit(f => !f)
 }
 const {run} = useRequest(ResetPassword, {
   manual: true,
   onSuccess: (res) => {
    console.log(res)
    let {success, errMsg} = res 
    success ? message.success('修改成功', 1).then(() => repdupdate()) : message.error(errMsg || '数据出错', 1).then(() => repdupdate())
   },
   onError: (e) => {
     console.log(e)
   }

 })
 const restpd = (record) => {
   setRecord(o => ({...o, ...record}))
   let {id} = record;
   let pwd = Math.random().toString().slice(2, 8);
   setpwdparms(o => ({...o, userId: id, pwd,}))
   setIsrepd(true)

 }
 const repdok = () => {
    run(pwdparms)
 }

 
 const updateuser = (record) => {
    setRecord(o => ({...o, ...record}))
    setIsopen(true)   
    let {loginName, nickName, mobile, roleType, enabled, remark} = record
    mform.setFieldsValue({
      'LoginName':loginName,
      'NickName': nickName,
      'Mobile': mobile,
      'Remark': remark,
      'RoleType': roleType,
      'Enabled': enabled === 1
    })
 }
 /* Enabled: 1
Id: 1
LoginName: "admin"
Mobile: "15844165233"
NickName: "admin"
ProjectId: 1
Remark: "超级管理员123"
RoleType: 1
SpliteLedgerEnable: 0 */
const cancal = () => {
  form.resetFields()
  setIsopen(false)
}
const update = () => {
  cancal()
  setIsEdit(f => !f)
}
 const ok = () => {
   let params =   mform.getFieldsValue(true)
   const {projectId, spliteLedgerEnable, id} = record
   params.Enabled = params.Enabled ? 1 : 0
   params.ProjectId = projectId
   params.SpliteLedgerEnable = spliteLedgerEnable
   params.Id = id  
   UpdateUser(params).then(res => {
      let {success, errMsg} = res 
       success ? message.success('修改成功', 1).then(() => update()) : message.error(errMsg || '数据出错', 1).then(() => update())
   }).catch(e => {
      message.error(e.message)
   })
 }


 const columns = [  
        {
          dataIndex: "loginName",
          title: "用户名",      
        },
        {
          dataIndex: "nickName",
          title: "用户姓名",
        },
        {
          dataIndex: "roleTypeStr", // status 1: 离线 2：在线
          title: "用户角色",
         
        },
        {
          dataIndex: "mobile",
          title: "手机号码",
        },
        {
          dataIndex: "enabled",
          title: "状态",
          render: (text) => <span>{text===1 ? '启用' : '停用' }</span>
        },
        {
          dataIndex: "remark",
          title: "备注",
        },
        {
          dataIndex: "op",
          title: "操作",
          render: (_,record) => <Space size={16}>
            <Link underline onClick={() => updateuser(record)}>编辑</Link>
            <Link underline onClick={() => restpd(record)}>重置密码</Link>
            <Link underline type="danger" onClick={deluser(record)}>删除</Link>
          </Space>
        }
     
 ]
 const projectId = useSelector(selectCurProject)?.id 
 let params = {
   projectId,
   pageNum: 1,
   pageSize: 15,
   likeValue: ''
 }
 const getTableData = ({current, pageSize}, formData) => {  
    params = Object.assign({}, params, {pageNum: current, pageSize}, formData)
    return  GetUsersPage(params).then(res => {
      let {success, data, totalNum} = res
      console.log(totalNum)
      if (success && Array.isArray(data)) {
        return {
          total: totalNum,
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
  const {tableProps, search} = useAntdTable(getTableData, {  
    form,
    refreshDeps: [projectId, params.likeValue, isEdit],
    defaultPageSize: 15,
   })
 const {submit} = search

  return (
     <Mainbox>
        <Form form={form} initialValues={{likeValue: params.likeValue}}>
            <Form.Item name="likeValue" label="账号查询">
                <Input.Search placeholder='请输入账号名称/手机号' allowClear enterButton="查询" style={{width: '550px'}} onSearch={submit}/>
            </Form.Item>

        </Form>
     <UserTable columns={columns} {...tableProps} rowKey='id'/>
     <Modal width={554} title="新增账号" open={isopen} onOk={ok} onCancel={cancal} >
         <Form form={mform} initialValues={userinof} size="middle"  labelCol={{flex: '7em'}} labelAlign="left" preserve={false}>
             <Item label="用户角色" name="RoleType">
                <Select>
                 { roletype.map(r => (<Select.Option key={r.id} value={r.id}>{r.name}</Select.Option>)) }
                </Select>
             </Item>
             <Item label="用户名" name="LoginName">
                <Input />
             </Item>
             <Item label="用户姓名" name="NickName">
                <Input />
             </Item>
           {/*   <Item label="密码" name="Pwd">
                <Input.Password  />
             </Item>   
             <Item label="确认密码" name="RePwd">
                <Input.Password  />
             </Item>   */}
             <Item label="手机号码" name="Mobile">
                <Input  />
             </Item> 
             <Item label="是否启用" name="Enabled">
               <Switch checkedChildren="是" unCheckedChildren="否" checked />
             </Item> 
             <Item label="备注信息" name="Remark">
               <Input.TextArea  autoSize={{
                    minRows: 2,
                    maxRows: 6,
                    }} />
             </Item> 
         </Form>
     </Modal>
     <Modal width={554} title="重置密码" open={isrepd} onOk={() => repdok()} onCancel={repdcancal} >
         <p>账号： <Link>{record.loginName}</Link>， 密码将被重置为<Link>{pwdparms.pwd}</Link></p>
         
     </Modal>
     <Modal width={554} title="重置密码" open={isrepd} onOk={() => delok()} onCancel={delcancal} >
         <p><WarningFilled />是否确认删除 <Text type="danger">{record.loginName}</Text>账号?</p>
     </Modal>
     </Mainbox>
     
  )
}
