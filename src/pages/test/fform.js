import React, {useCallback, useEffect, useMemo, useState, memo, useContext, createContext} from 'react'
import {Form, Input, Button} from 'antd'
import { FundTwoTone } from '@ant-design/icons'
 const Context = createContext(null)
 const Userson =  memo((props) => {
  console.log('Userson')
   return (
    <h>{props.num}</h>
   )
 })
 const User =  memo(() => {
  const {data, num} = useContext(Context);
  console.log('user')
  return (
    <div>
      <h1>{data}</h1>
       <Userson num={num} />
      </div>
  
  )
 })
 function  Box({children, ch}) {
  const [form] = Form.useForm()
  const [name, setName] = useState('zl')
  const [title, setTitle] = useState('')
  const person =useMemo(() => ({
    name
  }), [name])
  const onCK= useCallback(() => {
    alert(name)
  }, [name])
  useEffect(() => {
    
  }, [])
  return (
    <div>
       <h1>{title}</h1>
      <label> 父组件<input value={name} onChange={(e) => setName(e.target.value)}></input></label>
       <input value={title} onChange={(e) => setTitle(e.target.value)}></input>
     <Form form={form}>
      <Form.Item name="name" label="姓名">
      <Input  ></Input>
      </Form.Item>
       
     </Form>
      <div style={{backgroundColor: "#ff7313", height: '300px'}}>
            {ch}
      </div>
     
    </div>
  )
}
export default function Index() {
   const [data, setData] = useState("")
   const [num, setNum] = useState(0);
   return (
     <div>
      <label>顶层组件<input value={data} onChange={e => setData(e.target.value)} /> </label>
      <label>数字<input type="number" onChange={e => setNum(e.target.value)} /> </label>
      <Context.Provider value={{data, num}}>
       <Box ch={<User />}> 
      
       </Box>
       </Context.Provider>
     </div>
   )
}