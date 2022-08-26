import React, {useState} from "react";
import { Form, Input, Button, InputNumber, Space, Tooltip, Typography, Select, DatePicker, TimePicker } from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import Cfrom from "./ccform";

/* eslint-disable no-template-curly-in-string */

/* const validateMessages  = {
    required: "${label}是必选字段",
  } */
  /* eslint-enable no-template-curly-in-string */

export default function Fform() {
  const [form] = Form.useForm();
  const nameVal = Form.useWatch("name", form);
/* eslint-disable no-template-curly-in-string */
const {Option} = Select
const validateMessages  = {
  required: "${label}",
  types: {
    email: "${label}必须是邮箱",
     number: "${label}必须是数字",
  },
  number:  {
   range: "${label}必须在${min}到${max}之间"
  },

}
/* eslint-enable no-template-curly-in-string */

 const onFinish = (values) => {
   
 }
 const onValuesChange =(v1, v2) => {
 
 }
  return (
     <Form onFinish={onFinish} onFieldsChange={onValuesChange} form={form}>
        <Form.Item name="datepicker" label="Timepicker">
            <DatePicker/>
        </Form.Item>
        <Form.Item name="timepicker" label="Timepicker">
            <TimePicker/>
        </Form.Item>
      
        <Form.Item
          name="password"
          label="Password"
          rules={[
            {
              required: true,
              message: '请输入密码'
            }
          ]}
          hasFeedback
        >
         <Input.Password />
        </Form.Item>
        <Form.Item
        name="confirm"
        label="Confirm Password"
        dependencies={['password']}
        hasFeedback
        rules={[
          {
            required: true,
            message: 'Please confirm your password!',
          },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('password') === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error('The two passwords that you entered do not match!'));
            },
          }),
        ]}
      >
        <Input.Password />
      </Form.Item>
      <Form.Item shouldUpdate>
        {
        () =>  (<pre>{JSON.stringify(form.getFieldValue(), null, 3)}</pre>)
        }
      </Form.Item>
     </Form>
  );
}
