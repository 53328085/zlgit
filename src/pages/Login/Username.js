import React, { useEffect, useState, useMemo, memo,  useRef } from "react";
import {  useSelector, useDispatch} from "react-redux";

import {
  selectMemorize,
  memorizeName,
  selectUser,
} from "@redux/user";
import { adaptation } from "@redux/systemconfig";
import { Form, Input,  Image,Space } from "antd"; 
import {useTranslation, Trans, Translation} from 'react-i18next';
import { pwdValidator, imgcodeValidator } from "@pages/rule";
import { Login as Logapi, } from "@api/api";
import {Ipticon, Itembox, Logipt, Logpsd, Logck, Logbtn} from '@com/comstyled'
import imgurl from "./icon";
 
 

 
export default memo(function({onSubmit}){
    const {t} =useTranslation("login")
    const [userform] = Form.useForm();
    const dispatch = useDispatch()
    let initmemorize = useSelector(selectMemorize);
    let { name, password } = useSelector(selectUser);
    let {laptop} = useSelector(adaptation)
    let [loading, setLoading] = useState(false);
    let [codeUrl, setCodeUrl] =useState()
    const auto = useMemo(() => (initmemorize ? "on" : "off"), [initmemorize]);
    const userName = useMemo(() => (initmemorize ? name : ""), [initmemorize]);
    const usepassword = useMemo(() => (initmemorize ? password : ''), [initmemorize])    
    const ckChange = (e) => {    
      dispatch(memorizeName(e.target.checked));
    };   
    const keyvalue = useRef()
 
 
   
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
              message: t('EnUserName'),
            },
            {
              type: "string",
              min: 2,
              max: 20,
              message: t("UserNameFormat"),
            },
          ]}
        >
          <Logipt
            prefix={<Ipticon />}
            url={imgurl.user}
            aurl={imgurl.usera}
            placeholder={t("Enusername")}
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
              message: t("Enpassword"),
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
            visibilityToggle={false}
            placeholder={t("Enpassword")}
          />  
        </Itembox>
       
    {/*     
          <Itembox
         hasFeedback
         btm="32px"
         style={{alignItems: "center"}}
       >
        <Space.Compact   style={{display: 'flex'}}>
          <Form.Item  name="code" noStyle  rules={[
           {
             required: true,
             message: t("Envercode"),
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
            placeholder={t("Envercode")}
          />
          </Form.Item>
          <div style={{display: "inline-block", marginLeft: 'auto'}}> {codeUrl && <Image src={"data:image/gif;base64," + codeUrl} style={{height: "42px", width: "136px", border: '1px solid #9c9ea4'}} preview={false} onClick={getCode} />} </div>
         
      
           </Space.Compact>
           </Itembox> */}
         
       
        <Itembox valuePropName="checked">
          <Logck onChange={ckChange} defaultChecked={initmemorize}>
           {t("ReUserPassword")}
          </Logck>
        </Itembox>
        <Itembox>
          <Logbtn
            htmlType="submit"
            block
            loading={loading}
            style={{ height: laptop ? "42px" : "56px" }}
          >
            {t("Login")}
          </Logbtn>
        </Itembox>
      </Form>
    );
  });