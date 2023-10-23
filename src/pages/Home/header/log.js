import React, {useState, useRef, useEffect, useMemo, useCallback} from "react";
import { Dropdown, Menu, Form, Input, message } from "antd";
import styled from "styled-components";
import { useSelector, useDispatch, useStore } from "react-redux";
import {useNavigate, useLocation} from "react-router-dom"
import { clearToken, selectUser, userRest} from "@redux/user";
import { configProject, comSetFirst, getJump, currentscreen, isGranary, configState, systemConfigRest} from "@redux/systemconfig";
// import restStore from "@redux/rest";
 import './log.less'
import CModal from "@com/useModal"
import imgurl from "./icon";
import {pwdValidator, phoneValidator} from '@pages/rule.js'
import {Login} from '@api/api' 
const Cdiv = styled.div`
  display: flex;
  height: 62px;
  overflow: hidden;
`;
const Ldiv = styled.div`
  height: inherit;
  background-color: #135abd;
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;
const Idiv = styled.div`
  border-right: 1px solid rgba(255, 255, 255, 0.3);
  height: inherit;
  width: 112px;
  display: flex;
  justify-content: center;
  align-items: end;
  padding-bottom: 4px;
  background-repeat: no-repeat;
  background-position: top 4px center;
  &:last-child {
    border-right: none;
  }
  &:hover {
    background-color: #3988e7;
    cursor: pointer;
    border-right: 1px solid rgba(255, 255, 255, 0.1);
  }
  span {
    line-height: 1;
  }
`;
const Idiv1 = styled(Idiv)`
  background-image: url(${imgurl['31N']});
  &:hover {
    background-image: url(${imgurl['31H']});
  }
`;
const Idiv2 = styled(Idiv)`
  background-image: url(${imgurl['32N']});
  &:hover {
    background-image: url(${imgurl['32H']});
  }
`;
const Idiv3 = styled(Idiv)`
  background-image: url(${imgurl['33N']});
  &:hover {
    background-image: url(${imgurl['33H']});
  }
`;
const Idiv4 = styled(Idiv)`
  background-image: url(${imgurl['34N']});
  &:hover {
    background-image: url(${imgurl['34H']});
  }
`;
const Idiv5 = styled(Idiv)`
  background-image: url(${imgurl['35N']});
  &:hover {
    background-image: url(${imgurl['35H']});
  }
`;
const Triangle = styled.div`
    width: 0; 
     height: 0;
     border-width: 32px;
     border-style: solid;
     border-color: transparent #135abd transparent transparent;
`;
const Cipt = styled(Input)`
  && {
    height: 36px;
    line-height: 36px;
    border-radius: 18px;
  }
`
const Ciptpd = styled(Input.Password)`
  && {
    height: 36px;
    line-height: 36px;
    border-radius: 18px;
  }
`
export default function Log() {
  // const [user, setUser] = useState('')
 
  const store = useStore();
  const user = useRef()
  const navgite = useNavigate()
 
  const  screenadr = useSelector(currentscreen)
  const  isgranary = useSelector(isGranary)
  const showscreen =  screenadr?.type==1 || screenadr?.type==2
  const dispatch = useDispatch()
  const {name, roleType} = useSelector(selectUser) || {};
 
  const comurl = useSelector(comSetFirst) 
  const config = useSelector(configState)
/*   const isconfig = store.getState()?.system.configState
  let [config , SetConfig] = useState(isconfig)
  const unsubscribe = store.subscribe(() => {
    
    SetConfig(store.getState()?.system.configState)
 
  }) */
  const Item = Form.Item
  const [form] = Form.useForm()
  const onExit = async () => {
      try {
      await dispatch(userRest());
       await dispatch(systemConfigRest())
        return navgite('/')
      } catch (error) {
        return navgite('/')
      }
  }
  const account = () => {
    user.current.onOpen()
  }
const onJump = useCallback(() => {
   let {type, key, primary} = screenadr   
 
   if(type == 0) return ;
   if(!key.trim() && type > 0) {
    return  message.warn({content: '请配置大屏地址', duration: 0.5})
    
   }else {
    let url =  type == 1 ?  '\\'+ primary+key : type == 2 ? key : '';  
    if (!url) return;
    window.open(url, '_blank')
   }
  
  
}, [screenadr, isgranary])


  const items = [
    {label: '账户管理', key:"mg"},
    {label: '退出系统', key:"exit"},
  ]
  const onClick = ({key}) => {
      if(key == 'mg') {
        account()
      }else if(key == 'exit') {
        onExit()
      }
  
  }
  const onOk = () => {
    form.validateFields().then(() => {
      let {mobile, pwd, oldPwd} = form.getFieldsValue()
      console.log(oldPwd)
      Login.UpdateCurrentAccount({mobile, pwd, oldPwd}).then(res => {
         let {success, errMsg} = res
         if(success) {
          return message.success("保存成功", 1, user.current.onCancel())
         }
         return message.warning(errMsg || '保存失败', 1)
      })
      
    }).catch(e => {
      message.warning(e.message || '保存失败', 1)
    })
  }
  const back = () => {
     dispatch(configProject(false));
     dispatch(getJump(true))
     navgite("/index/runtimeProject", {
      // state: { type: 'index',  primary: key,  index: true, title: label }
      state: { type: 'index', primary: "runtimeProject", index: true, title: "项目概述" },
    })
  }

  const onConfigure = () => {   // 
     dispatch(getJump(false))
     let {key, label} = comurl || {}
    if (!!comurl && comurl.key) {
      dispatch(configProject(true));
      navgite(`/config/designerCommon/${key}`, {
        state: {type: 'config', nested: key,  title: label, primary: 'designerCommon' },
      })
      
    }else {
      return message.warning('请先设置用户权限')
    }
   
  }
  const projectcfg =() => {
    navgite("/projectList")
  }
/*   useEffect(() => {
    return () => {
      unsubscribe()
    }
  }) */
  return (
    <Cdiv>
      <Triangle />
      <Ldiv>
        {
          config ? 
          (<Idiv5 onClick={back}>
            <span> 返回</span>
          </Idiv5>)
          :
        <>
      { isgranary ? <Idiv1 onClick={() => window.open('http://10.5.7.60:4242/ses', '_blank')}>
          <span> 数据大屏</span>
        </Idiv1> : showscreen  &&  <Idiv1 onClick={onJump}>
          <span> 数据大屏</span>
        </Idiv1>
        }
 
 
 
        { roleType < 4 ? (<Idiv4 onClick={onConfigure}> 
          <span>项目设置</span>
        </Idiv4>):null}
        { roleType < 3 ? (<Idiv2 onClick={projectcfg}>
          <span>平台配置</span>
        </Idiv2>):null}
        </>
        }
        <Dropdown
         menu={{items, 
         onClick, 
        }} 
         placement="bottom" 
        trigger={['click']
      } 
       
        overlayClassName="custDropdown">
        <Idiv3>
          
            <span>{name}</span>
          
        </Idiv3>
        </Dropdown> 
     
       
      </Ldiv>
      <CModal  title="账户信息" mold="cust"  ref={user} width="440px" onOk={onOk}>
      <Form
        form={form}
        name="modalform"
        colon={false}
        initialValues={{
          name: name
        }}
        size="middle"
        labelCol={{ flex: "7em" }}
        labelAlign="left"
        preserve={false}
        requiredMark={false}
      >
    <Item
      label="账户名"
      name="name"
    >
      <Cipt disabled />
    </Item>
    <Item label="手机号" name="mobile"  rules={[
        {
          required: true,
          message: '请输入手机号码',             
        },
       {
            validator: phoneValidator
        }, 
     
      ]}>
      <Cipt placeholder="请输入手机号码" />
    </Item>
    <Item label="输入旧密码" name="oldPwd"  rules={
      [
        {
          required: true,
          message: '请输入旧密码',             
        },
        {
            min: 6,
            max: 20,
            message: "密码6位到18位之间"
         }, 
      ]
    }>
    <Ciptpd placeholder="请输入旧密码" />
    </Item>
    <Item label="输入新密码" name="pwd" rules={
      [
        {
          required: true,
          message: '请输入新密码',             
        },
        {
            validator: pwdValidator
         }, 
      ]}>
      <Ciptpd placeholder="请输入新密码"  />
    </Item>
    <Item label="确认新密码" name="RePwd" rules={
      [
        {
          required: true,
          message: '请确认新密码',             
        },
        ({ getFieldValue }) => ({
          validator(_, value) {
            if (!value || getFieldValue('pwd') === value) {
              return Promise.resolve();
            }
            return Promise.reject(new Error('两次输入的新密码不匹配'));
          },
        }),
      ]}>
    <Ciptpd placeholder="请确认新密码"  />
    </Item>
  
  
  </Form>
 
      </CModal>
    </Cdiv>
  );
}
