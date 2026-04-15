import React, {useImperativeHandle, forwardRef, useRef} from 'react'
import {Form, Select, Input, Switch, DatePicker} from 'antd'
import {pwdValidator, phoneValidator} from '@pages/rule.js'
import {useTranslation} from "react-i18next"
import dayjs from 'dayjs'
 const auto = "off"
 function Useform(props, ref) {
  const [form] = Form.useForm()
  const {Item} = Form
  const {roletype, enable, password=true, ...rest} = props
  const {t} = useTranslation("platformcig")
  const disabledDate = (current) => {
    // Can not select days before today and today
    return current && current < dayjs().endOf('day');
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
    labelCol={{ flex: "10em" }}
    labelAlign="left"
    preserve={false}
    labelWrap={true}
    {...rest}
  >
    {roletype && (
      <Item label={t("userrole")} name="RoleType">
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
      label={t("LoginAccount")}
      name="name"
      tooltip={t("usercharacters")}
      rules={[
        {
          required: true,
          message: t("Loginaccountrequired"),
        },
        {
          min: 1,
          max: 16,
          message:  t("accountcharacters")
        }
      ]}
    >
      <Input autoComplete={auto} />
    </Item>
    <Item label={t("UserName")} name="nickName"      
     tooltip={t("usernamecharacters")}
     rules={[
      {
        required: true,
        message: t("usernamerequired"),
      },
      {
        min: 1,
        max: 32,
        message: t("user32characters")
      }
    ]}
     >
      <Input  autoComplete={auto}/>
    </Item>
    <Item label={t("AccountValidityPeriod")} name="validStageTime" rules={[
                  {
                    required: true,
                    message: t("exdate"),
                  }]}
                  >
                 <DatePicker format="YYYY-MM-DD" style={{width: '100%'}} disabledDate={disabledDate} />
   </Item>
    {
      password &&
      <>
    <Item label={t("Password")} name="pwd" rules={[
                  {
                    required: true,
                    message: t("enterpas"),
                  },
                  {
                    validator: pwdValidator
                   }, 
                  
                  ]}>
      <Input.Password autoComplete={auto} />
    </Item>
    <Item label={t("ConfirmPassword")} name="repwd" rules={[
                  {
                    required: true,
                    message: t("cfipassword"),
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('pwd') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error(t("passwordmatch")));
                    },
                  }),
                  
                  ]}>
      <Input.Password autoComplete={auto} />
    </Item>
    </>
    }
    <Item label={t("comm:MobileNumber")}  name="mobile" rules={[
                  {
                    required: true,
                    message: t("entermobile"),
                  },
                  {
                    validator: phoneValidator
                   }, 
                  
                  ]}>
      <Input autoComplete={auto} />
    </Item>
    {enable && (
      <Item label={t("isenable")} name="enabled" valuePropName="checked">
        <Switch checkedChildren={t("comm:Yes")} unCheckedChildren={t("comm:No")}   />
      </Item>
    )}
    <Item label={t("comm:remark")} name="remark">
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