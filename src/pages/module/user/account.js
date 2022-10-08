import React, {useState} from 'react'
import {useSelector} from 'react-redux'
import {useRequest, useAntdTable} from 'ahooks'
import {Typography, Space, Form, Input, Modal, Select, Switch} from 'antd'
import {LockOutlined} from '@ant-design/icons'
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
 const {GetUsersPage, GetRoleType} = User
 const [form] = Form.useForm()
 const [mform] = Form.useForm()
 const {Item} = Form
 const [isopen, setIsopen]=useState(false)
 const [roletype, setRoletype] = useState([])
 const [userinof, setUserinfo] = useState({
    LoginName: '',
    NickName: '',
    RoleType: 1,
    Pwd: '',
    RePwd: '',
    Mobile: '',
    Enabled: true,
    Remark: ''
 })
 const {loading} = useRequest(GetRoleType, {
    onSuccess: (result) => {
        let {data, success} = result
        if (success) {
            setRoletype(data)
        }
    },

 })

 // setRoletype(data?.data || [])
 const showModal = (record) => {
    console.log(record)
    setIsopen(true)
 }
 const ok = () => {
    setIsopen(false)
 }
 const cancal = () => {
    setIsopen(false)
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
          render: (_,record) => <Space>
            <Link underline onClick={() => showModal(record)}>编辑</Link>
            <Link underline>重置密码</Link>
            <Link underline type="danger">删除</Link>
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
    refreshDeps: [projectId, params.likeValue],
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
                <Input/>
             </Item>
             <Item label="用户姓名" name="NickName">
                <Input/>
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
               <Switch checkedChildren="是" unCheckedChildren="否" defaultChecked />
             </Item> 
             <Item label="备注信息" name="Remark">
               <Input.TextArea  autoSize={{
                    minRows: 2,
                    maxRows: 6,
                    }} />
             </Item> 
         </Form>
     </Modal>
     </Mainbox>
     
  )
}
