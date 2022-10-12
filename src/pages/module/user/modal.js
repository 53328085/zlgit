import React from "react";
import { Modal, Form, Select, Input, Switch } from "antd";
import styled from "styled-components";

export default function Custmodal({
  title,
  initialValues = {},
  open = () => {},
  ok = () => {},
  cancal = () => {},
  roletype,
  enable = false,
  type = "normal",
} = {}) {
  const [form] = Form.useForm();
  const { Item } = Form;
  const theme = {
    normal: "2px solid #337af0",
    warn: "2px solid #ff4d4f",
  };
  console.log(theme[type]);
  const CModal = styled(Modal)`
    .ant-modal-header {
      padding: 32px;
      border-bottom: none;
      .ant-modal-title {
        font-size: 18px;
        color: #666;
        padding-left: 16px;
        border-left: ${theme[type]};
        height: 32px;
        line-height: 32px;
      }
    }
    .ant-modal-body {
      padding: 0 32px 32px 32px;
    }
    .ant-modal-footer {
      border-top: none;
      padding: 0 32px 32px 32px;
      .ant-btn {
        padding: 0px;
        width: 96px;
        height: 36px;
      }
      .ant-btn + .ant-btn {
        margin-left: 16px;
      }
      .ant-btn-primary {
        border-color: ${theme[type]};
        background-color: ${theme[type]};
      }
    }
    .ant-form-item:last-of-type {
      margin-bottom: 0px;
    }
  `;
  return (
    <CModal
      width={554}
      title={title}
      open={open}
      onOk={ () => {
       
        form.validateFields().then(values => {
          form.submit()
          ok(values).then((f)=> {
            if (f) {
              form.resetFields()
              cancal()
            }
          })
        }).catch((info) => {
          console.log(info)
        })
      }}
      onCancel={cancal}
      closable={false}
      centered
    >
      <Form
        form={form}
        name="modalform"
        initialValues={initialValues}
        size="middle"
        labelCol={{ flex: "7em" }}
        labelAlign="left"
        preserve={false}
      >
        {roletype && (
          <Item label="用户角色" name="RoleType"        
          >
            <Select>
              {roletype.map((r) => (
                <Select.Option key={r.id} value={r.id}>
                  {r.name}
                </Select.Option>
              ))}
            </Select>
          </Item>
        )}
        <Item label="用户名" name="LoginName" rules={[
            {
              required: true,
              message: '用户名必填',
            },
          ]}>
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
    </CModal>
  );
}
