import React, { useState } from 'react'
import Custmodal from '@com/useModal'
import { Button } from 'antd'
const Label = () => {
  console.log('label')
  return <p>label</p>
}
const Main =({Label}) => {
  const [count, setCount] = useState(0)
   return  (
    <div>
      <div>
        <Button onClick={() => setCount(c => c + 1)}>{count}</Button>
      </div>
     <Label />
    </div>
   )


}
export default function fform() {
  
  return (
    <div>
      <Main Label={<Label />} />
    </div>
  )
}
