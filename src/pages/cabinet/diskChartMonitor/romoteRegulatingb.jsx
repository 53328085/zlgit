// 遥调 框架断路器  NA8-2500-2500H

import React,{useEffect} from 'react'
import {
    Form,
    Image,
    message,
    Progress,
    Button,
    InputNumber,
    Select,
    Space,
    Input,
    DatePicker,
    Typography,
    Drawer,
    Descriptions,
    Timeline,
  } from "antd"
  import {
    CustLink,
    i18t,
    i18warning,
    CustButton,
    CustButtonT,
    ConfirmBtn,
     
  } from "@com/useButton";
import { isObject } from '@com/usehandler';
const {Title} = Typography
export default function romoteRegulating({deviceData}) {
  const [form] = Form.useForm();
  const itemsty = {
    width: "160px",
  };
  /* 1：电子式长延时；2，热磁式长延时，3，电子式短延时；4，电子式瞬动；5，电磁式瞬动；6，接地保护；7，剩余电流保护；8，欠压；9，过压；后续可扩展 */
  const toptions = [
    { label: "电子式长延时", value: 1 },
    { label: "热磁式长延时", value: 2 },
    { label: "电子式短延时", value: 3 },
    { label: "电子式瞬动", value: 4 },
    { label: "电磁式瞬动", value: 5 },
    { label: "接地保护", value: 6 },
    { label: "剩余电流保护", value: 7 },
    { label: "欠压", value: 8 },
    { label: "过压", value: 9 },
  ];
// 0固定，1可远程整定；2可本地整定
  const toptions2 = [
    { label: "固定", value: 0 },
    { label: "可远程整定", value: 1 },
    { label: "可本地整定", value: 2 },
  ];

  useEffect(()=> {
    console.log(deviceData)
    if(isObject(deviceData)) {
      form.setFieldsValue({...deviceData})
    }else {
      form.resetFields()
    }

  }, [deviceData])
  return (
    <>
     <div className="htitle">
                <span>遥调</span>
               
              </div>
              <Form form={form} layout="vertical">
                <Title level={5}>长延时保护</Title>
                <Space size="large">
                  <Form.Item label="保护类型" name="type" initialValue={2}>
                  <Select options={toptions} style={itemsty} disabled ></Select>
                  </Form.Item>
                  <Form.Item label="整定方式" name="set" initialValue={0}>
                    <Select options={toptions2} style={itemsty}  ></Select>
                  </Form.Item>
                  <Form.Item label="长延时电流整定值" name="longset" initialValue={"1.05In"}>
                    <Input></Input>
                  </Form.Item>
                </Space>              
                <Title level={5}>瞬动保护</Title>
                <Space size="large">
                  <Form.Item label="保护类型" name="structType">
                  <Select options={toptions} style={itemsty} disabled ></Select>
                  </Form.Item>
                  <Form.Item label="整定方式" name="structint" initialValue={0}>
                  <Select options={toptions2} style={itemsty}  ></Select>
                  </Form.Item>
                  <Form.Item label="瞬动电流整定值" name="setIsd" initialValue={"10In"}>
                    <Input></Input>
                  </Form.Item>
                </Space>
              </Form>
    </>
  )
}
