import React from 'react'
import Pagecount from '@com/pagecontent'
import CustContext from '@com/content.js'
import {Form} from 'antd'
export default function Index() {
  const tabs =[]
  const form = Form.useForm()
  
  const {Provider} =CustContext
  const propsData = {
    tabs,
    form,
    search:''
  }
  return (
    <Provider value={propsData}>
      <Pagecount/>
    </Provider>
  )
}
