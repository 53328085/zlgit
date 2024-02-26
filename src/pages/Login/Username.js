import React, { useEffect, useState, useMemo, memo,  useRef } from "react";
import {  useSelector, useDispatch} from "react-redux";

import {
  selectMemorize,
  memorizeName,
  selectUser,
} from "@redux/user";
 
import { Button, Checkbox, Form, Input, message, Space, Image, Select,Tabs } from "antd"; 
import { pwdValidator, imgcodeValidator } from "@pages/rule";
import { Login as Logapi, } from "@api/api";
import {Ipticon, Itembox, Logipt, Logpsd, Logck, Logbtn} from '@com/comstyled'
import imgurl from "./icon";
 
 

 
export default memo(function({onSubmit}){
    const [userform] = Form.useForm();
    const dispatch = useDispatch()
    let initmemorize = useSelector(selectMemorize);
    let { name, password } = useSelector(selectUser);
    let [loading, setLoading] = useState(false);
    let [codeUrl, setCodeUrl] =useState()
    const auto = useMemo(() => (initmemorize ? "on" : "off"), [initmemorize]);
    const userName = useMemo(() => (initmemorize ? name : ""), [initmemorize]);
    const usepassword = useMemo(() => (initmemorize ? password : ''), [initmemorize])    
    const ckChange = (e) => {
      dispatch(memorizeName(e.target.checked));
    };   
    const keyvalue = useRef()
    const getCode = async () => {
      try {
        let {data, success} = await  Logapi.GetCode()
        if(success) {  
          let {key, image} = data || {}
          keyvalue.current = key
          setCodeUrl(image)
  
        }else {
          keyvalue.current = null
          setCodeUrl(null)
        }
      } catch (error) {
        keyvalue.current = null
         setCodeUrl(null)
      }
        
   }
 
    useEffect(() => {
      getCode();
      return () => {
        setLoading(false);
      };
    }, []);
    return (
      <Form
        layout="horizontal"
        labelCol={{ flex: "4em" }}
        wrapperCol={{ flex: 1 }}
        labelWrap
        form={userform}
        name="login"
        onFinish={(value) => {         
          onSubmit(value, 0, keyvalue.current, setLoading)
        }}       
        initialValues={{
          name: userName,
          pwd: usepassword,
          code: '',
        }}
      >
        <Itembox
          name="name"
          hasFeedback
          btm="32px"
          rules={[
            {
              required: true,
              message: "请输入用户姓名",
            },
            {
              type: "string",
              min: 2,
              max: 20,
              message: "用户名2至20个字符串",
            },
          ]}
        >
          <Logipt
            prefix={<Ipticon />}
            url={imgurl.user}
            aurl={imgurl.usera}
            placeholder="请输入用户名"
            allowClear
            autoComplete={auto}
          />
        </Itembox>
        <Itembox
          name="pwd"
          hasFeedback
          btm="32px"
          rules={[
            {
              required: true,
              message: "请输入密码",
            },
             {
            validator: pwdValidator
            },  
          ]}
        >
          <Logpsd
            prefix={<Ipticon />}
            url={imgurl.pwd}
            aurl={imgurl.pwda}
            placeholder="请输入密码"
          />
        </Itembox>
       
        
          <Itembox
         hasFeedback
         btm="32px"
         style={{alignItems: "center"}}
       >
        <Input.Group compact style={{display: 'flex'}}>
          <Form.Item  name="code" noStyle  rules={[
           {
             required: true,
             message: "请输入验证码",
           },
            {
           validator: imgcodeValidator
           },  
         ]}>
          <Logipt
            style={{width: "256px", borderTopRightRadius: "0px", borderBottomRightRadius: "0px"}}
            prefix={<Ipticon />}
            url={imgurl.pwd}
            aurl={imgurl.pwda}
            autoComplete="off"
            placeholder="请输入验证码"
          />
          </Form.Item>
          <div style={{display: "inline-block", marginLeft: 'auto'}}> {codeUrl && <Image src={"data:image/gif;base64," + codeUrl} style={{height: "42px", width: "136px", border: '1px solid #9c9ea4'}} preview={false} onClick={getCode} />} </div>
         
         {/*   {codeUrl && <Image src={"data:image/gif;base64," + codeUrl} style={{height: "42px", width: "136px"}} preview={false} onClick={getCode} /> } */}
           </Input.Group>
           </Itembox>
         
       
        <Itembox valuePropName="checked">
          <Logck onChange={ckChange} defaultChecked={initmemorize}>
            记住用户名和密码
          </Logck>
        </Itembox>
        <Itembox>
          <Logbtn
            htmlType="submit"
            block
            loading={loading}
            style={{ height: "56px" }}
          >
            立即登录
          </Logbtn>
        </Itembox>
      </Form>
    );
  });