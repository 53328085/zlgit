import React, { useEffect,  memo, useRef, useState,  } from "react";
import { useDispatch, useSelector,  } from "react-redux";
import { useNavigate,} from "react-router-dom"; 
 
import {
  loginByName, 
  clearToken, 
  getPassword,
  getLang,
} from "@redux/user";
import {   getJump,  getIsGranary, configProject,   systemConfigInfo, getWebsiteState, getWebsiteMenu} from "@redux/systemconfig";
 
import { Login as LoginApi, I18N,  } from "@api/api.js";
import { message, Tabs, Form, Input } from "antd";
import {useTranslation, Trans, Translation} from 'react-i18next';
import styled, {css} from "styled-components";
import CModal from "@com/useModal"
import {cipher, isObject} from "@com/usehandler"
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
  background-size:cover;
  background-repeat: no-repeat;
  overflow:auto;

`
const tabsty = css`
.ant-tabs-nav{
  margin-bottom: 24px;
}
.ant-tabs-tab .ant-tabs-tab-btn{
  font-size: 22px;
}
.ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn{
  font-size: 24px;
}
`
const CTabs = styled(Tabs)`
   && {
      width: 402px;
      .ant-tabs-nav-list {
         display: flex;
         flex: 1;
        justify-content: space-between;
      }
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
      ${props=> props.theme.laptop ? tabsty : null}
   }

`
const mainsty = css`
 padding: 0 32px;
`
const Logmain = styled.div`
  && {
    padding: 142px 45px 0 100px;
    display: flex;
    flex: 1;
   // flex: 1 calc(100vh - 138px - 24px);
   // overflow-y: auto;
    justify-content: space-between;
    ${props => props.theme.laptop ? mainsty : null}
  }
`;

 
function UserLog() {
  

  const [defaultlogin] = useState(window.localStorage.getItem("default_login"))
   
  const navigate = useNavigate();
  const {t, i18n} = useTranslation(["login", "comm"]);
 
  const dispatch = useDispatch();
 
  const projectRun = ({ key, label },jumpath, substate) => {
    dispatch(getJump(true))
    navigate(`/index/${key}`, {
      state: { type: "index", primary: key, index: true, title: label, jumpath, substate },
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
            message.success(info || t("RegistSuccess", {ns: 'login'}))
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

const CheckAuthorization = async (value, type=0, codekey, setLoading,getCode) => {
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
          onSubmit(value, type, codekey, setLoading,getCode)
        }
    }
}
 
 let onSubmit = async (value, type=0, codekey, setLoading,getCode) => {  
   
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
       let {projectId, roleType, userId } = data          
       if (roleType == 1 || roleType == 2)  return navigate("/projectlist", {})
       if (roleType == 3 || roleType == 4) {     
         dispatch(getWebsiteState({id: projectId, userId})) 
       //  dispatch(configProject(false)) // 项目是否处于设计状态
         let {runMenus,siderRunMenus, homeMenuNO} = await dispatch(getWebsiteMenu(projectId)).unwrap()
         let ismenu = runMenus?.find(item => item.no == homeMenuNO) || runMenus[0]  
         if(!ismenu) return message.error({content:  t("comm:NoSetMenu"), duration: 0.5})
         // navigate("/websitmap", {})
        //  return  //香炉山项目
          
         let  jumpath, substate;
         let sider = siderRunMenus?.[ismenu.key]?.[0] 
         if(sider) { 
           let {key, label} = sider
           jumpath = `/index/${ismenu.key}/${key}`
           substate = {
             nested: key,
             title: label,
             primary: ismenu.key
           }
   
         } 
        projectRun(ismenu, jumpath, substate) 
       }
 
    }else {
      dispatch(getPassword(''))
      setLoading &&   setLoading(false) 
      getCode()
     return message.warning(errMsg || t("comm:DataError"));
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
 
  const tabChange=(key)=> {
    window.localStorage.setItem("default_login", key)
  }
  const items = [
    {
      label:  t("login:MoLogin"), //"手机登录",
       key: '2',
       children:   <Phonelog onSubmit={CheckAuthorization} />,
   },
   {
      label:  t("login:Aclogin"), //"账户登录",
       key: '1',
       children:   <Username onSubmit={CheckAuthorization} />,
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
           defaultActiveKey={defaultlogin}
           items={items}
           onChange={tabChange}
         >
         </CTabs>    
         <CModal
            width={554}
            ref={ref}
            onOk={onOK}
            type="warn"
            mold="cust"
            title="提示"
          >
            <p>{msg}</p>
          </CModal>

          <CModal
            width={554}
            ref={regRef}
            onOk={regOk}
            mold="cust"
            title={ t("login:SysAuRe")}
          >
            <Form form={form} layout="vertical">
              <Form.Item label={t("login:SerWbe")} name="url" rules={[
                 ...rules,
                 {
                  type: "url"
                 }
              ]}>
                  <Input /> 
              </Form.Item>
              <Form.Item label={t("login:ComName")} name="customer" rules={rules}>
                  <Input /> 
              </Form.Item>
              <Form.Item label={t("login:ComAdd")} name="address" rules={rules}>
                  <Input /> 
              </Form.Item>
              <Form.Item label={t("login:Applicant")} name="user" rules={rules}>
                  <Input /> 
              </Form.Item>
              <Form.Item label={t("login:Mophonenum")} name="mobile" rules={[
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
  const {systemBackImage, literal} = useSelector(systemConfigInfo) || {}
  const bgImg= systemBackImage ? `data:image/png;base64,${systemBackImage}` : imgurl.logBg
  return (
    <Loginpage bgImg={bgImg}>
      <Headicon /> 
      <Logmain>
         <Listitem />
         <Log />
      </Logmain>
    {literal==1 &&  <Copyright/>}
    </Loginpage>
  );
}
