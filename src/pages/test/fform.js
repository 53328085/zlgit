import React from 'react'
import {Button} from 'antd'
export default function Index() {
  const getQuery = () => {
    let form = new FormData();
    form.append("name", "alice");
    form.append("password", "123456");
    fetch("auth/login", {
      method: "POST", 
      body:  form, 
    })
    .then(res => res.json())
    .catch(e=>{
      console.log(e)
    });
  }
  return (
    <div>
      <Button onClick={getQuery}>请求</Button>
    </div>
  )
}
