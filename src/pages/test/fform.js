import { Form, InputNumber, Input, Button } from 'antd';
import React, { useState } from 'react';
const validatePrimeNumber = (number) => {
  if (number < 15) {
    return {
      validateStatus: 'error',
      errorMsg: "去儿科挂号",
    };
  }
  return {
    validateStatus: 'success',
    errorMsg: '可以看成人科室',
  };
};
const formItemLayout = {
  labelCol: {
    span: 7,
  },
  wrapperCol: {
    span: 12,
  },
};
const App = () => {
  const [form] = Form.useForm()
  const [number, setNumber] = useState({
    value: 11,
  });
  const tips ="医院挂号指南";
  const onNumberChange = (value) => {
    console.log(value)
    setNumber({
      ...validatePrimeNumber(value),
      value,
    });
  };
  const onFinish = () => {
     try {
      let values = form.getFieldsValue()
      console.log(values)
     } catch (error) {
       console.log(error)
     }
     
  }
  return (
    <Form onFinish={onFinish} form={form} initialValues={{
      name: 'zl',
      age: 12
    }}>
      <Form.Item
        {...formItemLayout}
        label="患者年龄"
        validateStatus={number.validateStatus}
        help={number.errorMsg || tips}
        name="age"
      >
        <InputNumber min={10} max={20} value={number.value} onChange={onNumberChange} />
      </Form.Item>
      <Form.Item name="name"   validateStatus='warning' label="姓名" rules={[
        {
          require: true,
          message: "请输入姓名"
        }
      ]}>
        <Input /> 
      </Form.Item>
      <Form.Item dependencies={["age"]} name="keshi" rules={[
        
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('age') > 14) {
                return Promise.resolve();
              }
              return Promise.reject(new Error('挂成人科室年龄必须大于14周岁'));
            },
          })
        
      ]}>
          {
            () => {
              
            }
          }
              <Input />
      </Form.Item>
      <Form.Item label=" ">
         <Button htmlType='submit'>submit</Button>
      </Form.Item>
    </Form>
  );
};
export default App;