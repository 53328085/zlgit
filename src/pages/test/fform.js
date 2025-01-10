import { Radio, Tabs,Space, Form, Input, Button, DatePicker, Card} from 'antd';
import { useForm } from 'antd/lib/form/Form';
import React, { useState, useEffect, useRef} from 'react';
import styled from 'styled-components';
 
const App = () => {
  const [form] = useForm()
  const [show, setShow] = useState(true)
  
  const [cout, setCout] = useState(10)
  return (
    <div>
       <Space size="large">
        <Button>组件尺寸默认</Button>
       <Button size="large">组件尺寸large</Button>
        <Button size="small">组件尺寸small</Button>
       </Space>
       <div style={{width: "600px"}}>
       <Form size="large" form={form} >
          <Form.Item name="name" label="姓名">
             <Input></Input>
          </Form.Item>
          <Form.Item name="age" label="年龄">
             <DatePicker></DatePicker>
          </Form.Item>

       </Form>
       </div>
       <Tabs
        defaultActiveKey="1"
        type="card"
        size="large"
        items={new Array(3).fill(null).map((_, i) => {
          const id = String(i + 1);
          return {
            label: `Card Tab ${id}`,
            key: id,
            children: `Content of card tab ${id}`,
          };
        })}
      />
      <div>
          <Card title="card 尺寸">
          一种支持封面、头像、标题和描述信息的卡片。
          </Card>
      </div>
    </div>
  );
};
export default App;