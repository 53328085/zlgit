import React, { useEffect,useState } from "react";
import { useDispatch, useSelector, useStore } from "react-redux";
import { UserOutlined, LockOutlined, PhoneOutlined, ConsoleSqlOutlined } from '@ant-design/icons';
import { loginByName, selectLoading} from "@redux/user";
import { systemConfig } from "@redux/systemconfig";
import {clearToken} from '@redux/user'
import { useNavigate } from "react-router-dom";
import {useBoolean, useCountDown, useRequest } from 'ahooks'

import {
  Button,
  Checkbox,
  Form,
  Input,
  message,
  Space
} from "antd";
import styled from 'styled-components'
import {LoginLayout} from "@com/layout";
import {pwdValidator, phoneValidator, codeValidator} from '../rule'
import {Login as Logapi} from '@api/api'


const Logbox = styled.div`
  width: 402px;
 margin: 280px 50px 0 auto;
 color: #fff;
 background: transparent;
`
const Logtype = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 32px;
  height: 44px;
  span {
    font-style: italic;
    transition: font-size 0.3s, color 0.3s;
    &:hover{
      cursor: pointer;
    }
  }
`
const {Item} = Form
const Itembox = styled(Item)`
   &:not(:last-child) {
    margin-bottom: 64px;
  }
  .ant-input-affix-wrapper-lg {
    height: 48px;
  }
`


function UserLog() { 

  const store = useStore()
 
  const navigate = useNavigate();
  let initloaidng = useSelector(selectLoading)
  let [loading, setLoading] = useState(initloaidng);  
  let [auto, setAuto] = useState('off')
  const dispatch = useDispatch();
  store.subscribe(() => {   
    setLoading(store.getState()?.user?.loading)
  })
  const hostname = process.env.NODE_ENV === "production" ? new URL(window.location.href).hostname  : "10.5.7.60";
  const submit = async (value) => {
    const {name, pwd} = value
   let { success,errMsg } = await dispatch(loginByName({ name, pwd })).unwrap();
   if (success) navigate("/projectlist", {});
   if (!success) message.warning(errMsg || '系统繁忙,请稍后再试')
  };
  const onFinishFailed = (error) => {
    console.log(error)
  }
  useEffect(() => {
    dispatch(clearToken()) // 返回登录页面时清楚token
  }, [])
  useEffect(() => {
    document.title = 'NES600智慧能源服务平台'

  }, [])
  useEffect(() => {
    
    dispatch(systemConfig(hostname));
  }, [hostname]);

  const [userform] = Form.useForm()
  
  const [state, { toggle  }] = useBoolean(true);
  const stylefn = (state) => {
    return state ? {fontSize: '28px', color: '#fff'} : {fontSize: '26px', color: '#515151'}
  }
  const [targetDate, setTargetDate] = useState(0)
  const [countdown] = useCountDown({
    targetDate
  })
 
 
 const Userlog = () => (
    <Form
    layout="horizontal"
    labelCol={{flex: '4em'}}
    wrapperCol={{flex:1}}
    labelWrap
    form={userform}
    name='login'
    initialValues={{
      remember: true,
      name: '',
      pwd: ''
    }}
    onFinish={submit}
    onFinishFailed={onFinishFailed}
    autoComplete={auto}
  >
    <Itembox
       name="name"
       hasFeedback
       rules={[
        {
          required: true,
          message: '请输入用户姓名',             
        },
        {
          type: 'string',
          min: 2,
          max: 20,
          message: '用户名2至20个字符串'
        }
      ]}
      >
       <Input prefix={<UserOutlined style={{fontSize: '24px'}}  placeholder="请输入用户名" />} />
      </Itembox>
      <Itembox
       name="pwd"
       hasFeedback
       rules={[
        {
          required: true,
          message: '请输入密码',             
        },
        {
            validator: pwdValidator
        },
     
      ]}
      >         
       <Input.Password prefix={<LockOutlined style={{fontSize: '24px'}}  placeholder="请输入密码" />} />
      </Itembox>
      <Itembox
       name='remember'
       valuePropName="checked"
      >
        <Checkbox style={{color: '#fff', fontSize: '16px'}}>记住用户名</Checkbox>
      </Itembox>
      <Itembox>
          <Button type="primary" htmlType="submit" block loading={loading} style={{height: '56px'}}>立即登录</Button>
      </Itembox>
  </Form>
  )

function Phonelog(){
    const {GetVerification} = Logapi
    const [phoneform] = Form.useForm()
    const [phone, setPhone] = useState('')
    const onValuesChange = (value) => {
      setPhone(value)
    }
    const {loading, run } = useRequest(GetVerification, { // 获取验证码
      manual: true,
    
      onError: (error) => {
        console.log(error)
      }
    })
    const getCode = () => {
      phoneform.validateFields(['mobile']).then(res => {
        setTargetDate(Date.now() + 1000*60)
        //run(phone)
        
      }).catch(e => {
        console.log(e)
      })
     
    }
    const Countdown = () => {
     
      return (
         <Button type="primary" style={{height: '48px', width: '112px'}} onClick={() => getCode()} disabled={countdown !== 0}>        
               {countdown === 0 ? '获取验证码' : ` ${Math.round(countdown / 1000)}s`}
         </Button>
         )
}
   useEffect(() => {
    console.log('111111')
   })
    return (
    <Form
    layout="horizontal"
    labelCol={{flex: '4em'}}
    wrapperCol={{flex:1}}
    labelWrap
    onValuesChange={onValuesChange}
    form={phoneform}
    name='phonelogin'
    initialValues={{
      remember: true,
      mobile: '',
      code: ''
    }}
    onFinish={submit}
    onFinishFailed={onFinishFailed}
    autoComplete={auto}
  >
    <Itembox
       name="mobile"
       hasFeedback
       rules={[
        {
          required: true,
          message: '请输入手机号',             
        },
        {
          validator: phoneValidator
        }
      ]}
      >
       <Input prefix={<PhoneOutlined style={{fontSize: '24px'}}  placeholder="请输入手机号" />} />
      </Itembox>
      <Itembox   >         
      <Space> 
        <Item   
        name="code"
        hasFeedback
        rules={[
        { 
          required: true,
          message: '请输入验证码',             
        },
        {
          validator: codeValidator
        }
       
      ]} noStyle> 
       <Input  prefix={<LockOutlined style={{fontSize: '24px'}}  placeholder="请输入验证码" />} style={{width: '275px'}} /> 
       </Item>
       <Item noStyle>
       {/*  <Button type="primary" style={{height: '48px', width: '112px'}} onClick={() => getCode()} disabled={countdown !== 0}>        
               {countdown === 0 ? '获取验证码' : ` ${Math.round(countdown / 1000)}s`}
         </Button> */}
         <Countdown/>
         </Item>
      </Space>
      </Itembox>
      <Itembox
       name='remember'
       valuePropName="checked"
      >
        <Checkbox style={{color: '#fff', fontSize: '16px'}}>记住手机号</Checkbox>
      </Itembox>
      <Itembox>
          <Button type="primary" htmlType="submit" block loading={loading} style={{height: '56px'}}>立即登录</Button>
      </Itembox>
  </Form>
  )
}

const Phone = React.memo(Phonelog)
console.log(Phone)
  return (
    <Logbox>  
      <Logtype>
        <span onClick={toggle} style={stylefn(state)}>账户登录</span>
        <span onClick={toggle} style={stylefn(!state)}>手机登录</span>
      </Logtype> 
      {state ? <Userlog />  : <Phone/>}
    
    </Logbox>
  );
}
export default function Login() {  
  return <LoginLayout login={true}>
          <UserLog /> 
    </LoginLayout>;
}
