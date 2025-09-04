import React, {useState,memo} from 'react'
import {Button} from 'antd'

export default function Index() {
  const [change, setChange] = useState({})
  console.log("rendr", change)
  return (
    <div>
      <Button onClick={()=>setChange({})}>更改</Button>
    </div>
  )
}
