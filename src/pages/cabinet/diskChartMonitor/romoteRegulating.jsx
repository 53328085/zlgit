// 遥调 框架断路器  NA8-2500-2500H

import React , {useEffect} from 'react'
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
  const toptions = [
    { label: '15S', value: 15 },
    { label: '30S', value: 30 },
    { label: '60S', value: 60 },
    { label: '120S', value: 120 },
    { label: '240S', value: 240 },
    { label: '480S', value: 480 },
  ];
  const loptions = [
    { label: "12t", value: 0 },
    { label: "1t", value: 1 },
    { label: "14t", value: 2 },
    { label: "定时限", value: 3 },
  ];
  const options3 = [
    { label: '100S', value: 100 },
    { label: '200S', value: 200 },
    { label: '300S', value: 300 },
    { label: '400S', value: 400 },
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
                <CustButton style={{ marginRight: "-16px" }}>保存参数</CustButton>
              </div>
              <Form form={form} layout="vertical">
                <Title level={5}>长延时保护</Title>
                <Space size="large">
                  <Form.Item label="长延时电流整定值(A)" name="setIgTimeOver">
                    <InputNumber 
                       placeholder="" 
                      style={itemsty}
                    />
                  </Form.Item>
                  <Form.Item label="长延时时间整定值" name="setTr" initialValue={15}>
                    <Select options={toptions} style={itemsty}></Select>
                  </Form.Item>
                  <Form.Item label="长延时曲线类型" name="setIrCurve"  initialValue={0}>
                    <Select options={loptions} style={itemsty}></Select>
                  </Form.Item>
                </Space>
                <Title level={5}>短延时保护</Title>
                <Space >
                  <Form.Item label="短延时电流整定值(A)" name="setIsd" initialValue={1.5}>
                    <InputNumber
                      placeholder="" 
                      style={itemsty}
                        
                    />
                  </Form.Item>
                  <Form.Item label="短延时时间整定值" name="setTsd"  initialValue={100}>
                    <Select options={options3} style={itemsty}></Select>
                  </Form.Item>
                {/*   <Form.Item label="短延时曲线类型" name="setIsdCurve"  >
                    <Select options={options4} style={itemsty} disabled></Select>
                  </Form.Item> */}
                </Space>
                <Title level={5}>瞬动保护</Title>
                <Space size="large">
                  <Form.Item label="瞬动电流整定值(A)" name="setIi"  >
                    <InputNumber
                      placeholder=""
                     
                      style={itemsty}
                       
                    />
                  </Form.Item>
                 {/*  <Form.Item label="瞬时电流动作方式" name="setIiMethodh"  >
                  <Select options={options5} style={itemsty} disabled></Select>
                  </Form.Item> */}
                </Space>
              {/*   <Title level={5}>接地保护</Title>
                <Space size={laptop ? "small" : "large"}>
                  <Form.Item label="接地保护电流整定值" name="setOverIgThr"  >
                    <InputNumber min={0} style={itemsty} disabled placeholder=' ' />
                  </Form.Item>
                  <Form.Item label="接地保护电流曲线类型" name="setOverIgCurve"  >
                    <Select options={options4} style={itemsty} disabled></Select>
                  </Form.Item>
                  <Form.Item label="接地保护电流动作时间" name="setIgTimeOver">
                  <InputNumber min={0.1} max={0.4} style={itemsty} placeholder='0.1~0.4' disabled />
                  </Form.Item>
                </Space>
              
                <Title level={5}>剩余电流保护</Title>
                <Space size={laptop ? "small" : "large"}>
                  <Form.Item label="剩余电流保护阀值" name="setOverResidualCurrentThr" >
                    <InputNumber min={0} style={itemsty} addonAfter="A" disabled />
                  </Form.Item>
                  <Form.Item label="剩余电流保护延迟" name="setOverResidualCurrentTime">
                    <InputNumber min={0} style={itemsty} addonAfter="ms" disabled />
                  </Form.Item>
                </Space>
                <Title level={5}>欠压保护</Title>
                <Space size={laptop ? "small" : "large"}>
                  <Form.Item label="欠电压动作阀值整定值" name="setUndervoltageThr">
                    <InputNumber min={0} style={itemsty} addonAfter="A" disabled />
                  </Form.Item>
                  <Form.Item label="欠电压动作延时时间整定值" name="setUndervoltageTime">
                    <InputNumber min={0} style={itemsty} addonAfter="S" disabled />
                  </Form.Item>
                  <Form.Item label="欠电压返回阀值整定值" name="setUndervoltageRecoveryThr">
                    <InputNumber min={0} style={itemsty} addonAfter="A" disabled />
                  </Form.Item>
                  <Form.Item label="欠电压返回延时时间整定值" name="setUndervoltageRecoveryTime">
                    <InputNumber min={0} style={itemsty} addonAfter="A" disabled />
                  </Form.Item>
                </Space>
                <Title level={5}>过压保护</Title>
                <Space size={laptop ? "small" : "large"}>
                  <Form.Item label="过电压动作阀值整定值" name="setOvervoltageThr">
                    <InputNumber min={0} style={itemsty} addonAfter="A" disabled />
                  </Form.Item>
                  <Form.Item label="过电压动作延时时间整定值" name="setOvervoltageTime">
                    <InputNumber min={0} style={itemsty} addonAfter="S" disabled />
                  </Form.Item>
                  <Form.Item label="过电压返回阀值整定值" name="setOvervoltageRecoveryThr">
                    <InputNumber min={0} style={itemsty} addonAfter="A" disabled />
                  </Form.Item>
                  <Form.Item label="过电压返回延时时间整定值" name="setOvervoltageRecoveryTime">
                    <InputNumber min={0} style={itemsty} addonAfter="A" disabled />
                  </Form.Item>
                </Space> */}
              </Form>
    </>
  )
}
