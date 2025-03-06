// 遥调 框架断路器  NA8-2500-2500H

import React from 'react'
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
const {Title} = Typography
export default function romoteRegulating({deviceData}) {
  const [form] = Form.useForm();
  const itemsty = {
    width: "160px",
  };
  /* 1：电子式长延时；2，热磁式长延时，3，电子式短延时；4，电子式瞬动；5，电磁式瞬动；6，接地保护；7，剩余电流保护；8，欠压；9，过压；后续可扩展 */
  const toptions = [
    { label: "热磁式长延时", value: 2 },
    
  ];
  const toptions2 = [
    { label: "固定", value: 0 },
    
  ];
  const loptions = [
    { label: "12t", value: 0 },
    { label: "1t", value: 1 },
    { label: "14t", value: 2 },
    { label: "定时限", value: 3 },
  ];
  const options3 = [
    { label: 100, value: 100 },
    { label: 200, value: 200 },
    { label: 300, value: 300 },
    { label: 400, value: 400 },
  ];
  const options4 = [
    { label: "反是限", value: 1 },
    { label: "定时限", value: 0 },
  ];
  const options5 = [
    { label: "峰值", value: 0 },
    { label: "有效值", value: 1 },
  ];
  useEffect(()=> {
    if(Array.isArray(deviceData)&& deviceData.length > 0) {
      let formdata = {}
       deviceData.forEach(d => {
         formdata[d.name]=parseFloat(d.value)
       })
      
      form.setFieldsValue({...formdata})
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
                  <Form.Item label="保护类型" name="protect_type" initialValue={2}>
                  <Select options={toptions} style={itemsty} disabled ></Select>
                  </Form.Item>
                  <Form.Item label="整定方式" name="protect_set" initialValue={0}>
                    <Select options={toptions2} style={itemsty}  ></Select>
                  </Form.Item>
                  <Form.Item label="长延时电流整定值" name="protect_2007" initialValue={"1.05In"}>
                    <Input></Input>
                  </Form.Item>
                </Space>              
                <Title level={5}>瞬动保护</Title>
                <Space size="large">
                  <Form.Item label="保护类型" name="structType">
                  <Select options={toptions} style={itemsty} disabled ></Select>
                  </Form.Item>
                  <Form.Item label="整定方式" name="structType" initialValue={0}>
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
