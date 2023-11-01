import React, {useCallback, useEffect, useMemo, useState} from 'react'
import {Form, Input} from 'antd'
 
 

export default function Index() {
  const [form] = Form.useForm()
  const [name, setName] = useState('zl')
  const [title, setTitle] = useState('')
  useEffect(() => {
    
  }, [])
  return (
    <div>
       <h1>{title}</h1>
       <input value={name} onChange={(e) => setName(e.target.value)}></input>
     <Form form={form}>
      <Form.Item name="name" label="姓名">
      <Input  ></Input>
      </Form.Item>
       
     </Form>
     
    </div>
  )
}
