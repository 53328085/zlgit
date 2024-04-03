import React, { useEffect,  memo, useRef, useState,  } from "react";
import { useDispatch, useSelector,  } from "react-redux";
import { useNavigate,} from "react-router-dom"; 
import {
  loginByName, 
  clearToken, 
  getPassword,
  getLang,
} from "@redux/user";
import {   getJump,  getIsGranary, configProject, getSystemconfiginfo,   getWebsiteState, getWebsiteMenu} from "@redux/systemconfig";
 
import { Login as LoginApi, I18N } from "@api/api.js";
import { message, Tabs, Form, Input } from "antd";
import styled from "styled-components";
import CModal from "@com/useModal"
import {cipher} from "@com/usehandler"
import { phoneValidator} from "@pages/rule";
import imgurl from "./icon";
 
 import  Headicon from './Headicon'
import Listitem from "./Listitem";
import Username from "./Username";
import Phonelog from "./Phonelog";
import Copyright from './Copyright'
 
const Loginpage =  styled.div`
  display: flex;
  flex:1;
  flex-direction: column;
  position: relative;
  background-image: ${props => `url(${props.bgImg})`};
  background-size: cover;
`
const CTabs = styled(Tabs)`
   && {
      width: 402px;
      .ant-tabs-nav {
         margin-bottom: 32px;
         &::before {
           border: none;
         }
      }
     
      .ant-tabs-tab .ant-tabs-tab-btn{
         font-size: 26px;
         color: #515151;
         font-style: italic;
         transition: none;
      }
      .ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn{
         font-size: 28px;
         color: #fff;
         transition: none;
      }
      .ant-tabs-ink-bar.ant-tabs-ink-bar-animated{
         background-color: transparent;
      }
      .ant-tabs-ink-bar {
        display: none;
      }
   }

`
const Logmain = styled.div`
  && {
    padding: 142px 45px 0 100px;
    display: flex;
    height: calc(100vh - 138px - 24px);
    overflow-y: auto;
    justify-content: space-between;
  }
`;

 
function UserLog() {
   
  const navigate = useNavigate();
 
 
  const dispatch = useDispatch();
 
  const projectRun = ({ key, label }) => {
    dispatch(getJump(true))
    navigate(`/index/${key}`, {
      state: { type: "index", primary: key, index: true, title: label },
    });
  };
 
 const ref = useRef()
 const regRef = useRef()
 const [msg, setMsg] = useState('')
 const [form] = Form.useForm()
 const onOK = () => {
    ref.current.onCancel()
    regRef.current.onOpen()
 }
 const params = useRef({
  value: {},
   type: 0,
   codekey: '',
   setLoading: null
 })
 const regOk = async () => {  //注册成功后需要授权
    try {
      let values = form.getFieldsValue(true)
      let {success, data}  = await LoginApi.Registe(values)
      if(success) {
        let {code, message:info} = data
        if(code!=0) {
          message.info(info)
          regRef.current.onCancel()
        }else if(code == 0 ) {
            message.success(info || '注册成功')
            regRef.current.onCancel()
         /*  message.success({
            content: info,
            duration: 2,
            onClose: onSubmit(value, type, codekey, setLoading)
          }) */
          
        }
      }
    } catch (error) {
       
    }

 }

const CheckAuthorization = async (value, type=0, codekey, setLoading) => {
    let {success, data} = await LoginApi.CheckAuthorization()
    if(success) {
        let {code, message:msg} = data  // 0 成功, 1 注册, 2 等待处理提示
        if(code==1) {
          params.current = {
            value,
            type,
            codekey,
            setLoading
          }
          setMsg(msg);          
          ref.current.onOpen()
        }else if(code==2) {
          message.success(msg) //处理中
        }else if(code == 0) {  // 成功
          onSubmit(value, type, codekey, setLoading)
        }
    }
}
 
 let onSubmit = async (value, type=0, codekey, setLoading) => {  
   
   try {   
    setLoading && setLoading(true) 
    const {name, pwd, code, mobile} = value;  
  
    value.pwd = cipher(name, pwd)
    value.type = type;
    if(type == 0){
     value.code = code
     value.key = codekey
    } else if(type == 1) {
      value.code = cipher(mobile, code)
    }
    let { success, errMsg, data} = await dispatch(loginByName(value)).unwrap();
    if(success) {
      dispatch(getPassword(pwd))
      setLoading &&  setLoading(false) 
       let {projectId, roleType} = data   
       if (roleType == 1 || roleType == 2)  return navigate("/projectlist", {})
       if (roleType == 3 || roleType == 4) {     
         dispatch(getWebsiteState(projectId)) 
         dispatch(configProject(false)) // 项目是否处于设计状态
         let {runMenus} = await dispatch(getWebsiteMenu(projectId)).unwrap()
         let ismenu = runMenus?.find(item => item.no == '0104') || runMenus[0]  
         if(!ismenu) return message.error({content: '没有设置菜单，请联系管理人员', duration: 0.5})
         projectRun(ismenu)
       }
 
    }else {
      dispatch(getPassword(''))
      setLoading &&   setLoading(false) 
     return message.warning(errMsg || "数据出错,请重试");
    }
   } catch (error) {
    setLoading &&   setLoading(false) 
     console.log(error)
   }
  

 }
  const ongetLang = () => {
    I18N.GetsupportLanguages().then(res => {
       let {success,data} = res
       if(success && Array.isArray(data)) {
          let cdata = data.map(d => ({...d, name: d.name=='cn' ? 'zh' : d.name, }))
          dispatch(getLang(cdata))
       }else {
          dispatch(getLang([]))
       }
    }).catch()
  }
 
  useEffect(() => {
    dispatch(clearToken()); // 返回登录页面时清楚token
    window.sessionStorage.removeItem('chintwuliu')
    dispatch(getIsGranary(false))
    ongetLang()
  }, []);
 

  const items = [
   {
      label: "账户登录",
       key: '1',
       children:   <Username onSubmit={CheckAuthorization} />,
   },
   {
      label: "手机登录",
       key: '2',
       children:   <Phonelog onSubmit={CheckAuthorization} />,
   }
  ]
  const rules = [
    {
      required: true
    }
  ]
  return (     
        <>
         <CTabs 
           defaultActiveKey="1"
           items={items}
          
           tabBarGutter={128}
           
         >
         </CTabs>    
         <CModal
            width={554}
            ref={ref}
            onOk={onOK}
            type="warn"
            mold="cust"
          >
            <p>{msg}</p>
          </CModal>

          <CModal
            width={554}
            ref={regRef}
            onOk={regOk}
            mold="cust"
            title="系统授权申请"
          >
            <Form form={form} layout="vertical">
              <Form.Item label="服务器网站" name="url" rules={[
                 ...rules,
                 {
                  type: "url"
                 }
              ]}>
                  <Input /> 
              </Form.Item>
              <Form.Item label="公司名称" name="customer" rules={rules}>
                  <Input /> 
              </Form.Item>
              <Form.Item label="公司地址" name="address" rules={rules}>
                  <Input /> 
              </Form.Item>
              <Form.Item label="申请人" name="user" rules={rules}>
                  <Input /> 
              </Form.Item>
              <Form.Item label="手机号" name="mobile" rules={[
                ...rules,
                {
                  validator: phoneValidator,
                },
              ]}>
                  <Input /> 
              </Form.Item>
            </Form>
          </CModal>

         </>
  );
}
const Log = memo(UserLog)
export default function Login() {
  const {systemBackImage} = useSelector(getSystemconfiginfo) || {}
  const bgImg= systemBackImage ? `data:image/png;base64,${systemBackImage}` : imgurl.logBg
  return (
    <Loginpage bgImg={bgImg}>
      <Headicon /> 
      <Logmain>
         <Listitem />
         <Log />
      </Logmain>
      <Copyright/>
    </Loginpage>
  );
}
