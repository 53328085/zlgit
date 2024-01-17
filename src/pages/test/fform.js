import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Form, Input } from 'antd';
import React from 'react';
const formItemLayout = {
  labelCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 4,
    },
  },
  wrapperCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 20,
    },
  },
};
const formItemLayoutWithOutLabel = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 20,
      offset: 4,
    },
  },
};
const App = () => {
  const onFinish = (values) => {
    console.log('Received values of form:', values);
  };
  return (
    <Form name="dynamic_form_item"  labelCol={{flex: "80px"}} wrapperCol={{flex: "400px"}} onFinish={onFinish}>
      <Form.List
        name="names"
        rules={[
          {
            validator: async (_, names) => {
              if (!names || names.length < 2) {
                return Promise.reject(new Error('At least 2 passengers'));
              }
            },
          },
        ]}
      >
        {(fields, { add, remove }, { errors }) => {
          console.log(fields)
        return   (
          <>
            {
            fields.map((field, index) => (
             
               <Form.Item label={`field${field.name}`} key={index} >
                   <Form.Item noStyle  {...field} 
                   validateTrigger={["onChange","onBlur"]}
                   rules={[
                    {
                      required: true,
                      whitespace: true,
                      message: "请输入字段值"
                    }
                   ]}>
                       <Input style={{width: "80%"}} /> 
                   </Form.Item>
                   <MinusCircleOutlined onClick={() => remove(field.name)}/>
                </Form.Item>
               
              ))
            }
            <Form.Item label=" ">
              <Button
                type="dashed"
                onClick={() => add()}
                style={{
                  width: '60%',
                }}
                icon={<PlusOutlined />}
              >
                Add field
              </Button>
              <Button
                type="dashed"
                onClick={() => {
                  add(`插入到第一项后面` , 1);
                }}
                style={{
                  width: '60%',
                  marginTop: '20px',
                }}
                icon={<PlusOutlined />}
              >
                Add field at head
              </Button>
              <Form.ErrorList errors={errors} />
            </Form.Item>
          </>
        )}
      }
      </Form.List>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};
export default App;