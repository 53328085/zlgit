 import React from 'react'
 import {Button, Input} from 'antd'
 import './index.css'
 export default function Index() {
  const getsty = () => {
    
    let bgcolor = getComputedStyle(document.documentElement).getPropertyValue('--ant-primary-color');
    document.documentElement.style.setProperty('--main-bg-color','#2f57a4');
  }
   return (
     <div className='main'>
      <span>默认字体大小</span>
      <p className='ar'>继续样式的大小</p>
      <Button onClick={getsty}>style</Button>
      <Input.Search enterButton={<Button>查询</Button>}  ></Input.Search>
     </div>
   )
 }
 