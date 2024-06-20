import React, {useState, useEffect} from 'react'
import {Form, Input, message} from 'antd'
import {useSelector} from 'react-redux'
import styled from 'styled-components';
import Pagecount from "@com/pagecontent";
import {CustButtonT, i18warning, i18success} from "@com/useButton"
import Titlelayout from '@com/titlelayout'
import {Cdivider} from "@com/comstyled"
import {selectProjectId} from "@redux/systemconfig"
import { Yingshi } from '@api/api';
import {isObject} from '@com/usehandler'
const Mainbox = styled.div`
&& {
  padding-top: 32px;

}
`
export default function Index() {
  const projectId = useSelector(selectProjectId)
 
  const [form] = Form.useForm()
  const rules = [
    {required: true}
  ]
  const onSave = async() => {
    try {
      let params = await form.validateFields()
      let {success ,errMsg} = await Yingshi.SaveProjectYinShiYun({...params,projectId})
       if(success) {
         i18success('save')
       }else {
         i18warning(errMsg)
       }
    } catch (error) {
      
    }
  }
  const getData =async () => {
     let {success, data,errMsg} = await Yingshi.QueryProjectYinShiYun(projectId)
     if(success && isObject(data)) {
       let {appKey, appSecret} = data;
       form.setFieldsValue({appKey, appSecret})
     }else {
        if(!success) i18warning(errMsg)
        form.resetFields()
     }
  }
  useEffect(() => {
    if(Number.isInteger(projectId)) {
       getData();
    }

  }, [projectId])
  return (
    <Pagecount>
      <Titlelayout style={{width:"578px", flex: "0 0 384px", boxShadow:'0px 2px 2px rgba(0, 0, 0, 0.349019607843137)'}} title="萤石云配置" >
        <Mainbox>
        <Cdivider type="h" style={{marginBottom: '32px'}} />
          <Form form={form} layout="vertical" requiredMark="optional">
              <Form.Item name="appKey" label="appKey" rules={rules} >
                <Input  />
              </Form.Item>
              <Form.Item name="appSecret" label="appSecret" rules={rules} >
                <Input />
              </Form.Item>
              <Form.Item>
                  <CustButtonT ns="button" text="save" onClick={onSave} style={{marginLeft: "auto"}} /> 
              </Form.Item>
          </Form>
          </Mainbox>
      </Titlelayout>
    </Pagecount>
  )
}
