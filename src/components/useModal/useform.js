import React, {useImperativeHandle, forwardRef, useRef} from 'react'
import {Form, Select, Input, Switch} from 'antd'
 function Useform(props, ref) {
  const [form] = Form.useForm()
  const {Item} = Form
  const {roletype, enable, ...rest} = props
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
      label="用户名"
      name="LoginName"
      rules={[
        {
          required: true,
          message: "用户名必填",
        },
      ]}
    >
      <Input />
    </Item>
    <Item label="用户姓名" name="NickName" required>
      <Input />
    </Item>
    <Item label="密码" name="Pwd" required>
      <Input.Password />
    </Item>
    <Item label="确认密码" name="RePwd" required>
      <Input.Password />
    </Item>
    <Item label="手机号码" name="Mobile" required>
      <Input />
    </Item>
    {enable && (
      <Item label="是否启用" name="Enabled">
        <Switch checkedChildren="是" unCheckedChildren="否" checked />
      </Item>
    )}
    <Item label="备注信息" name="Remark">
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