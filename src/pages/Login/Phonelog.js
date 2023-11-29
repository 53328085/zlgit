import React, { useEffect, useState, useMemo, memo, forwardRef, useImperativeHandle, useRef } from "react";
import { useDispatch, useSelector, useStore } from "react-redux";
import {
  loginByName,
  selectLoading,
  selectMemorize,
  selectMemoPhone,
  clearToken,
  memorizeName,
  memorizePhone,
  selectUser,
} from "@redux/user";
 
import { useBoolean, useCountDown, useRequest } from "ahooks";
 
import { Button, Checkbox, Form, Input, message, Space, Image, Select,Tabs } from "antd";
import styled from "styled-components";
 
import { pwdValidator, phoneValidator, codeValidator, imgcodeValidator } from "@pages/rule";
import { Login as Logapi} from "@api/api";
import {Logselect, Itembox, Ipticon, Logipt, Logck, Logbtn} from '@com/comstyled'
import imgurl from "./icon";

export default  memo(({onSubmit})=> {
    const { GetVerification } = Logapi;
    const [phoneform] = Form.useForm();
    let initPhone = useSelector(selectMemoPhone);
    let { mobile } = useSelector(selectUser);
    const auto = useMemo(() => (initPhone ? "on" : "off"), [initPhone]);
    const initMobile = useMemo(() => (initPhone ? mobile : ""), [initPhone]);
    const ckchange = (e) => {
      dispatch(memorizePhone(e.target.checked));
    };
    const [targetDate, setTargetDate] = useState(0);
    const [countdown] = useCountDown({
      targetDate,
    });
    const { loading, run } = useRequest(GetVerification, {
      // 获取验证码
      manual: true,
      onSuccess: (res) => {
        let { success, data } = res;
        if (success) phoneform.setFieldValue("code", data.code);
      },
      onError: (error) => {
        console.log(error);
      },
    });
    const getCode = () => {
      const phone = phoneform.getFieldValue("mobile");
      phoneform
        .validateFields(["mobile"])
        .then((res) => {
          setTargetDate(Date.now() + 1000 * 60);
          run(phone);
        })
        .catch((e) => {
          console.log(e);
        });
    };
    const Countdown = () => {
      return (
        <Logbtn
          style={{ height: "42px", width: "112px", fontSize: "16px" }}
          onClick={() => getCode()}
          disabled={countdown !== 0}
        >
          {countdown === 0 ? "获取验证码" : ` ${Math.round(countdown / 1000)}s`}
        </Logbtn>
      );
    };
    
    let options = [
      {
         label: "15分钟",
         value: 15
      },
      {
         label: "30分钟",
         value: 30
      },
      {
         label: "1小时",
         value: 60
      },
      {
         label: "2小时",
         value: 120
      },
      {
         label: "4小时",
         value: 240
      }
    ]
    return (
      <Form
        layout="horizontal"
        labelCol={{ flex: "4em" }}
        wrapperCol={{ flex: 1 }}
        labelWrap
        form={phoneform}
        name="phonelogin"
        onFinish={(e) => onSubmit(e, 1)}        
        initialValues={{
          mobile: initMobile,
          remember: initPhone,
        }}
      >
        <Itembox
          name="mobile"
          hasFeedback
          rules={[
            {
              required: true,
              message: "请输入手机号",
            },
            {
              validator: phoneValidator,
            },
          ]}
        >
          <Logipt
            prefix={<Ipticon />}
            url={imgurl.phone}
            aurl={imgurl.phonea}
            placeholder="请输入手机号"
            autoComplete={auto}
          />
        </Itembox>
       <Itembox
          name="span" 
        >
          <Logselect
             url={imgurl.time}
             aurl={imgurl.timea}
             suffixIcon={<Ipticon />}
             w="402px"
             h="42px"
             placeholder="请选择登录时长"
            options={options}
          />
        </Itembox> 
        <Itembox>
          <Space size={16}>
            <Form.Item
              name="code"
              hasFeedback
              rules={[
                {
                  required: true,
                  message: "请输入验证码",
                },
                {
                  validator: codeValidator,
                },
              ]}
              noStyle
            >
              <Logipt
                prefix={<Ipticon />}
                url={imgurl.code}
                aurl={imgurl.codea}
                placeholder="请输入验证码"
                style={{ width: "275px" }}
              />
            </Form.Item>
            <Form.Item noStyle>               
              <Countdown />
            </Form.Item>
          </Space>
        </Itembox>
        <Itembox name="remember" valuePropName="checked">
          <Logck onChange={ckchange}>记住手机号</Logck>
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
  })