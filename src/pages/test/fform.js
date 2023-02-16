import React from "react";
import { Form, Input, Row, Col, Button } from "antd";

//initalValue.files 有一元素 可直接显示一行样式 可以实验性看下样式
//可以看到 { add , remove } 暴漏的这两个方法显而易见可用来添加删除项
//可各种组合 华山论剑

export default () => (
  <Form initialValues={{ files : [{ file : '' , name : '' }] }}>  
    <Form.Item label="文件">
      <Form.List name="files">
        {
            (fields , {add, remove}) => fields.map(
              field => (
                <>
                  <Row key={ field.key }>
                    <Col span={ 11 }>
                      <Form.Item name={[ field.name , 'file']}>
                        <Input />
                      </Form.Item>
                    </Col>
                    <Col span={ 11 }>
                      <Form.Item  name={[ field.name , 'name']}>
                        <Input />
                      </Form.Item>
                    </Col>
                    <Col span={ 2 } onClick={ () => remove( field.name ) }>x</Col>
                  </Row>
                  <Row>
                    <Button onClick={ () =>  add( field.name ) }>添加一行</Button>
                  </Row>
                </>
              )
            )
        }
      </Form.List>
    </Form.Item>
  </Form>
);