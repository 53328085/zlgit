import React, {useImperativeHandle, forwardRef, useRef} from 'react'
import {Form, Select, Input, Switch, DatePicker} from 'antd'
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
      name="name"
      tooltip="用户名不能超过16个字符"
      rules={[
        {
          required: true,
          message: "用户名必填",
        },
        {
          min: 1,
          max: 16,
          message: "用户名不能超过16个字符"
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
        message: "用户名必填",
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
                 <DatePicker format="YYYY-MM-DD" style={{width: '100%'}} />
   </Item>
    <Item label="密码" name="pwd" required>
      <Input.Password />
    </Item>
    <Item label="确认密码" name="repwd" required>
      <Input.Password />
    </Item>
    <Item label="手机号码" name="mobile" required>
      <Input />
    </Item>
    {enable && (
      <Item label="是否启用" name="enabled">
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