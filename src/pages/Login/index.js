import React, { useEffect,useState, useMemo, useCallback } from "react";
import { useDispatch, useSelector, useStore } from "react-redux";
import {useNavigate, useParams } from 'react-router-dom'
import { UserOutlined, LockOutlined, PhoneOutlined } from '@ant-design/icons';

import { loginByName, selectLoading, selectMemorize, selectMemoPhone, clearToken, memorizeName, memorizePhone, selectUser} from "@redux/user";
import { systemConfig } from "@redux/systemconfig";
import {useBoolean, useCountDown, useRequest } from 'ahooks'

import {
  Button,
  Checkbox,
  Form,
  Input,
  message,
  Space,
  Image
} from "antd";
import styled from 'styled-components'
import {LoginLayout} from "@com/layout";
import {pwdValidator, phoneValidator, codeValidator} from '../rule'
import {Login as Logapi} from '@api/api'
import logo from './logo.png'
import credentials from './credentials.png'
const Logmain = styled.div`
  && {
    padding: 142px 45px 0 100px;
    display: flex;
    height: calc(100vh - 138px - 24px);
    overflow-y: auto;
  }
`
const List = styled.div`
  width: 660px;
  display: flex;
  flex-direction: column;
  .chtitle {
    .text {
      color: #fff;
      font-style: italic;
      font-size: 56px;
      z-index: 2;
      position: absolute;
      width: 560px;
      left: 40px;
    }
    position: relative;
    height: 90px;
    text-align: center;
  }
  .block {
    display: block;
    width: 640px;
    height: 35px;
    background-color: #012BD2;
    position: absolute;
    top:59px;
    transform: skewX(-20deg);
  }
  .entitle {
    font-size: 28px;
    line-height: 2;
    color: rgba(255,255,255,0.3);
    padding-left: 40px;
    padding-bottom: 72px;
  }
  .itemlist {
    display: flex;
    flex-direction: column;
    padding-left: 40px;
    .item{
     
      display: flex;
      align-items: center;
    }
    .text {
      display: inline-block;
      font-size: 16px;
      color: rgba(255,255,255,0.6);
    }
    .icon {
      
      display: inline-block;
      width: 16px;
      height: 16px;
      background-color: #1F83FE;
      transform: rotate(45deg);
      margin-right: 16px;
    }
    .item + .item {
      margin-top: 24px;
    }
  }
`
const Logbox = styled.div`
  width: 402px;
  color: #fff;
  background: transparent;
  margin-left: auto;
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
const Logipt = styled(Input)`
  background-color: transparent !important;
  border: 1px solid #9c9ea4;
  &:focus, &:hover {    
    border-color: #1f83fe !important;
    .ant-input {
      color: #1f83fe;
    }
    .anticon.anticon-user {
      color: #1f83fe !important;
    }
  }
 
  .ant-input-affix-wrapper-status-error {
    background-color: transparent !important;
  }
  .ant-input {
    background-color: transparent;
    color:#999;
  
  } 
 .ant-input::placeholder {
    color: #999;
    }
  input:-internal-autofill-previewed,
  input:-internal-autofill-selected {
    -webkit-text-fill-color: #999 !important;
　　transition: background-color 5000s ease-in-out 0s !important;
  }
`
const Logpsd = styled(Input.Password)`
  background-color: transparent !important;
  border: 1px solid #9c9ea4;
  &:focus, &:hover {    
    border-color: #1f83fe !important;
    .ant-input {
      color: #1f83fe;
    }
    .anticon.anticon-lock {
      color: #1f83fe !important;
    }
  }
 
  .ant-input-affix-wrapper-status-error {
    background-color: transparent !important;
  }
  .ant-input {
    background-color: transparent;
    color:#999;
  
  } 
 .ant-input::placeholder {
    color: #999;
    }
`
const Logck = styled(Checkbox)`
  display: flex;
  align-items: center;
  &:hover {
    .ant-checkbox:hover {
      border-color: #9c9ea4;
    }
  
 }
 .ant-checkbox+span {
  padding-left: 0;
  padding-right: 0;
  color: #999;
  font-size: 16px;
 }
 .ant-checkbox-checked .ant-checkbox-inner:after {
  transform: rotate(45deg) scale(2) translate(-25%,-50%);
 }
  .ant-checkbox {
    width: 32px;
    height: 32px;
    margin-right: 16px;
    top:0px;
    .ant-checkbox-input, .ant-checkbox-inner {
      width: inherit;
      height: inherit;
      background-color: transparent;
    }
    .ant-checkbox-inner {
      border-color: #9c9ea4;
      background-color: transparent;
      &:hover {
        border-color: #9c9ea4;
      }
    }
  }
  
`
const Logbtn = styled(Button)`
  border-color: #0e2db3;
  background-color: #0e2db3;
  font-size: 18px;
  color:#fff;
  &:hover {
    border-color: #0728ae;
    background-color: #0728ae;
    color:#fff;
  }
`
const Title = styled.div`
  display: flex;
  height: inherit;
  flex: 1;
  padding: 0 84px 0 96px; 
  justify-content: space-between;
  align-items: flex-end;
`
const Logtitle = () => {
 return (  
 <Title>
    <Image src={logo} preview={false} width={120} />
    <Image src={credentials} preview={false} />
   </Title>
 )
}
const Loglist = () => {
  let items = ['运行监控', '电气安全', '配电管理', '结算收费', '光伏发电', '碳排管理', '运维管理']
  return (
    <List>
      <div className="chtitle">
        <p className="text">正泰智慧能源服务平台</p>
        <p className="block"></p>
       </div>
       <p className="entitle">Chint Smart Energy Service Platform</p>
       <div className="itemlist">        
         {items.map((i, index) =>  (<div className="item" key={index}><span className="icon"></span><span className="text">{i}</span></div>))}
       </div>
    </List>
  )
}
function UserLog() { 

  const store = useStore()
 
  const navigate = useNavigate();
  let initloaidng = useSelector(selectLoading)  
  let [loading, setLoading] = useState(initloaidng);  
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


 const iconsty = {
  fontSize: '26px', 
  color: '#999',
  marginRight: '16px'
 }
 const Userlog = () => {
  let initmemorize = useSelector(selectMemorize) 
  let {loginName} = useSelector(selectUser)
  const auto = useMemo(()=> initmemorize ? 'on' : 'off', [initmemorize])
  const userName = useMemo(()=> initmemorize ? loginName : '', [initmemorize])
  const ckChange = (e) => {
    dispatch(memorizeName(e.target.checked))
  }
  store.subscribe(() => {
    initmemorize = store.getState()?.memorize
  })
  return (
 
    <Form
    layout="horizontal"
    labelCol={{flex: '4em'}}
    wrapperCol={{flex:1}}
    labelWrap
    form={userform}
    name='login'
    onFinish={submit}
    onFinishFailed={onFinishFailed}
    initialValues={{
      name: userName
    }}
   
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
       <Logipt prefix={<UserOutlined style={iconsty}   />} placeholder="请输入用户名" allowClear autoComplete={auto} />
      </Itembox>
      <Itembox
       name="pwd"
       hasFeedback
       rules={[
        {
          required: true,
          message: '请输入密码',             
        },
       /*  {
            validator: pwdValidator
        }, */
     
      ]}
      >         
       <Logpsd prefix={<LockOutlined style={iconsty}   />} placeholder="请输入密码" />
      </Itembox>
      <Itembox
      
       valuePropName="checked"
      >
        <Logck   onChange={ckChange}  defaultChecked={initmemorize} >记住用户名</Logck>
      </Itembox>
      <Itembox>
          <Logbtn  htmlType="submit" block loading={loading} style={{height: '56px'}}>立即登录</Logbtn>
      </Itembox>
  </Form>
  )
    }
function Phonelog(){
    const {GetVerification} = Logapi
    const [phoneform] = Form.useForm()
    let initPhone = useSelector(selectMemoPhone)   
    let {mobile} = useSelector(selectUser)  
    const auto = useMemo(()=> initPhone ? 'on' : 'off', [initPhone])
    const initMobile = useMemo(()=> initPhone ? mobile : '', [initPhone])
    const ckchange = (e) => {
      dispatch(memorizePhone(e.target.checked))
    }
    store.subscribe(() => {
      initPhone = store.getState()?.memoPhone
    }) 
    const [targetDate, setTargetDate] = useState(0)
    const [countdown] = useCountDown({
      targetDate
    })
    const {loading, run } = useRequest(GetVerification, { // 获取验证码
      manual: true,   
      onSuccess: (res) => {
        let {success, data} = res
        if (success) phoneform.setFieldValue('code', data.code)
      },
      onError: (error) => {
        console.log(error)
      }
    })
    const getCode = () => {
      const phone = phoneform.getFieldValue('mobile')    
      phoneform.validateFields(['mobile']).then(res => {
        setTargetDate(Date.now() + 1000*60)
        run(phone)
        
      }).catch(e => {
        console.log(e)
      })
     
    }
    const Countdown = () => {
     
      return (
         <Logbtn  style={{height: '48px', width: '112px', fontSize: '16px'}} onClick={() => getCode()} disabled={countdown !== 0}>        
               {countdown === 0 ? '获取验证码' : ` ${Math.round(countdown / 1000)}s`}
         </Logbtn>
         )
}
   useEffect(() => {
   
   })
    return (
    <Form
    layout="horizontal"
    labelCol={{flex: '4em'}}
    wrapperCol={{flex:1}}
    labelWrap 
    form={phoneform}
    name='phonelogin'  
    onFinish={submit}
    onFinishFailed={onFinishFailed}   
    initialValues= {
      {
        mobile: initMobile,
        remember: initPhone
      }
    }
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
       <Logipt prefix={<PhoneOutlined style={iconsty}   />}  placeholder="请输入手机号" autoComplete={auto} />
      </Itembox>
      <Itembox   >         
      <Space size={16}> 
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
       <Logipt  prefix={<LockOutlined style={iconsty}  />}   placeholder="请输入验证码" style={{width: '275px'}} /> 
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
        <Logck   onChange={ckchange}  >记住手机号</Logck>
      </Itembox>
      <Itembox>
          <Logbtn  htmlType="submit" block loading={loading} style={{height: '56px'}}>立即登录</Logbtn>
      </Itembox>
  </Form>
  )
}

const Phone = React.memo(Phonelog)
  const params = useParams()
  const type = useMemo(() => {
    let param =  Object.values(params)?.[0]

      return !param || param == 'user'
  }, [params])
  return (
    <Logbox>  
      <Logtype>
        <span onClick={() => {
          navigate('user')
          toggle()
          }} style={stylefn(type)}>账户登录</span>
        <span onClick={() => {
           navigate('mobile')
           toggle()
        }} style={stylefn(!type)}>手机登录</span>
      </Logtype> 
      {type ? <Userlog />  : <Phonelog/>}
    
    </Logbox>
  );
}
export default function Login() {  
  return <LoginLayout login={true} header={<Logtitle />}>
        <Logmain>
          <Loglist>

          </Loglist>
          <UserLog /> 
          </Logmain>
    </LoginLayout>;
}
