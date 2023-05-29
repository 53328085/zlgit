import React, {useImperativeHandle, forwardRef, useRef} from 'react'
import {Form, Select, Input, Switch, DatePicker} from 'antd'
import {pwdValidator, phoneValidator} from '@pages/rule.js'
import moment from 'moment'
 function Useform(props, ref) {
  const [form] = Form.useForm()
  const {Item} = Form
  const {roletype, enable, password=true, ...rest} = props

  const disabledDate = (current) => {
    // Can not select days before today and today
    return current && current < moment().endOf('day');
  }
  const getValue = () => {
   return  new Promise((resolve, reject) => {
    form.validateFields().then(res => {
       resolve(res)
    }).catch(e => {
        reject(e)
    })
   })
    
  }
  useImperativeHandle(ref, () => ({
    resetfrom: form.resetFields,
    getValue,
    validateFields: form.validateFields
  }))
  return (
    <Form
    form={form}
    name="modalform"
   // initialValues={initialValues}
    size="middle"
    labelCol={{ flex: "7em" }}
    labelAlign="left"
    preserve={false}
    {...rest}
  >
    {roletype && (
      <Item label="用户角色" name="RoleType">
        <Select>
          {roletype.map((r) => (
            <Select.Option key={r.id} value={r.id}>
              {r.name}
            </Select.Option>
          ))}
        </Select>
      </Item>
    )}
    <Item
      label="登录账号"
      name="name"
      tooltip="用户名不能超过16个字符"
      rules={[
        {
          required: true,
          message: "登录账号必填",
        },
        {
          min: 1,
          max: 16,
          message: "登录账号不能超过16个字符"
        }
      ]}
    >
      <Input />
    </Item>
    <Item label="用户姓名" name="nickName"      
     tooltip="不能超过32个字符"
     rules={[
      {
        required: true,
        message: "用户姓名必填",
      },
      {
        min: 1,
        max: 32,
        message: "用户姓名不能超过32个字符"
      }
    ]}
     >
      <Input />
    </Item>
    <Item label="账号有效期" name="validStageTime" rules={[
                  {
                    required: true,
                    message: '请选择有效期！',
                  }]}
                  >
                 <DatePicker format="YYYY-MM-DD" style={{width: '100%'}} disabledDate={disabledDate} />
   </Item>
    {
      password &&
      <>
    <Item label="密码" name="pwd" rules={[
                  {
                    required: true,
                    message: '请输入密码',
                  },
                  {
                    validator: pwdValidator
                   }, 
                  
                  ]}>
      <Input.Password />
    </Item>
    <Item label="确认密码" name="repwd" rules={[
                  {
                    required: true,
                    message: '请确认密码',
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('pwd') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('两次输入的新密码不匹配'));
                    },
                  }),
                  
                  ]}>
      <Input.Password />
    </Item>
    </>
    }
    <Item label="手机号码" name="mobile" rules={[
                  {
                    required: true,
                    message: '请输入手机号码',
                  },
                  {
                    validator: phoneValidator
                   }, 
                  
                  ]}>
      <Input />
    </Item>
    {enable && (
      <Item label="是否启用" name="enabled" valuePropName="checked">
        <Switch checkedChildren="是" unCheckedChildren="否"   />
      </Item>
    )}
    <Item label="备注信息" name="remark">
      <Input.TextArea
        autoSize={{
          minRows: 2,
          maxRows: 6,
        }}
      />
    </Item>
  </Form>
  )
}
export default forwardRef(Useform)