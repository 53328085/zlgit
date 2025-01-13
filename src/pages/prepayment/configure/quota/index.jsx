import React, {useState, useEffect, useRef} from 'react'
import styled, {css} from 'styled-components'
import {useTranslation} from 'react-i18next'
import Titlelayout from '@com/titlelayout'
import {Button, Typography, Space, Input, Form, Radio, message} from 'antd'
import {PrepayConfig} from '@api/api'
import {selectProjectId } from '@redux/systemconfig.js'
import {useSelector} from 'react-redux'
import UseTable from "@com/useTable"
import Custmodal from "@com/useModal"
import {cipher} from '@com/usehandler'
import {CustButton} from "@com/useButton"
const {Title, Link} = Typography
let {QueryPrepayServerUrl, SaveUrl, QueryUsers, SavePreapyUser, DeletePreapyUser} = PrepayConfig
const sty = css`
  padding: 16px;
  .left{
    padding-right: 16px;
  }
  .right{
    padding-left: 16px;
  }
`
const Mainbox = styled.div`
  margin-top: 16px;
  padding: 32px 16px;
  border-top: 1px dotted #d7d7d7;
  display: flex;
  flex:1;
  color:#515151;
  .title {
    font-weight: bold;
  }
  .left {
   // width: 500px;
     padding-right: 32px;
     border-right: 1px dotted #d7d7d7;
  }
  .right {
    padding-left: 32px;
    flex: 1;
  }
  ${props=>props.theme.laptop ? sty : null}
`




export default function Index() {
  const {t} = useTranslation(["button"])
   
  const [data, setData] = useState([])
  const ref = useRef()
  const dref=useRef()
  const [form] = Form.useForm()
  const [forms] = Form.useForm()
  const projectId = useSelector(selectProjectId)
  const id = useRef()
  const [state, setState] = useState(1)
  
  let title = ['', t("button:new"), t("button:edit")][state]
  const add =(obj, type) => {
    let {prepayUserName, userId, enabled} = obj
    id.current = userId
    setState(type)
     if(type == 2) {
      forms.setFieldsValue({prepayUserName,enabled: enabled.toString()})
     }
     ref.current.onOpen()
  }
  const del =({userId}) => {
    id.current = userId
    dref.current.onOpen()
  }
  const delonOk = async () => {
    let param = {
       projectId,
       userId: id.current,
    }
   let {success, errMsg} = await DeletePreapyUser(param)
   if(success) {
    message.success("删除成功")
    dref.current.onCancel();
    getUser();
   }else {
    message.warning(errMsg|| "数据出错")
   }
  }
  const columns = [
    {
      dataIndex: "userName",
      title: "用户",
    },
    {
      dataIndex: "enabled",
      title: "控制台启用",
      render: (text) =>  <span>{text==0 ? '否' : '是'}</span>
    },
    {
        dataIndex: "prepayUserName",
        title: "对应用户",
         
    },
    {
      dataIndex: "op",
      title: "操作",
       render: (_, record) => (<Space size={32}>
        {record.prepayUserName ? <><Link underline onClick={() => add(record, 2)}>{t("button:edit")}</Link><Link underline type="danger" onClick={() => del(record)}>{t("button:delete")}</Link></> : <Link underline onClick={() => add(record, 1)}>{t("button:new")}</Link>}   
       </Space>)
  },
  
  ]
  const geturl = async () => {
    try {
      let {data, success} = await  QueryPrepayServerUrl(projectId)
      if(success && data.constructor===Object) {
          form.setFieldValue('url', data.url)
      }else {
        form.setFieldValue('url', '')
      }
    } catch (error) {
        
    }
  }
  const saveurl = async () => {
    try {
       let {url} = await form.validateFields()
       let {success} = await SaveUrl({projectId, url})
       if(success) {
        geturl()
       }
    } catch (error) {
      console.log(error)
    }
  }
  const getUser = async () => {
     try {
      let {success, data} = await QueryUsers(projectId)
      if(success && Array.isArray(data)) {
         setData(data)
      }else {
        setData(data)
      }
     } catch (error) {
      
     }
    

  }
  const validateMessages={
    required: "'${label}' 是必选字段",
  }
  const rules=[
    {
      required: true
    }
  ]
  const onOk = async() => {
    
     try {
      let msg = ['', '新增成功', '编辑成功'][state]
      let {prepayUserName, prepayUserPassword, enabled} = await forms.validateFields()
      let params = {
        prepayUserName,
        prepayPassword: cipher(prepayUserName, prepayUserPassword),
        enabled: Number(enabled),
        userId: id.current,
        projectId
      }
      let {success, errMsg} =await SavePreapyUser(params)
      if(success) {
        message.success(msg);
       // ref.current.onCancel();
        getUser();
      }else {
        message.warning(errMsg || '数据出错')
      }
     } catch (e) {
      
     }
  
  }
  const onRow = (_, index) => {
    console.log(index) 
    return {
      style: () => ({background: index%2==1 ? "#f9f9f9" : 'transparent'})
    }
  }
  useEffect(() => {
    geturl()
    getUser()
  }, [projectId])
  return (
    <Titlelayout title="结算设置" layout="flex">
        <Mainbox>
            <div className='left'>
                 <Title level={5} style={{fontSize: "14px", marginBottom: "16px"}}>控制台地址设置</Title>
                
                 <Form form={form}>
                  <Space align='start' size={16}>
                    <Form.Item name="url" label="控制台地址" rules={[
                      {
                        required: true,
                        message: "请输入控制台地址"
                      },
                      {
                         type: "url",
                         message: "请输入正确的url地址"
                      }
                    ]}>
                       <Input placeholder='输入跳转连接的地址' allowClear  style={{width: "320px", marginBottom: "0px"}}></Input>
                    </Form.Item>
                    <CustButton wh="auto" onClick={saveurl}>{t("button:saveSet")}</CustButton>
                    </Space>
                 </Form>
            </div>
            <div className='right'>
               <Title level={5} style={{fontSize: "14px", marginBottom: "16px"}}>控制台用户管理</Title>
               <UseTable columns={columns} dataSource={data} size="small"   onRow={onRow}></UseTable>
            </div>
          </Mainbox>  
          <Custmodal title={title} width={540} ref={ref} mold="cust" custft onOk={onOk} >
                 <Form form={forms} preserve={false} validateMessages={validateMessages} labelCol={{span: 6}} labelAlign='left' initialValues={{enabled: "1"}}>
                     <Form.Item name="prepayUserName" label="控制台对应用户" rules={rules}><Input /></Form.Item>
                     <Form.Item name="prepayUserPassword" label="控制台密码" rules={rules}>
                         <Input.Password /> 
                     </Form.Item>
                     <Form.Item name="enabled" label="控制台密码" >
                      <Radio.Group><Radio value="1"> 是 </Radio>
                      <Radio value="0"> 否 </Radio>
                      </Radio.Group>
                     </Form.Item>
                 </Form>
          </Custmodal>
          <Custmodal title="删除" width={540} ref={dref} mold="cust" onOk={delonOk} type="warn">
             是否确认删除对应用户？
          </Custmodal>
    </Titlelayout>
  )
}
