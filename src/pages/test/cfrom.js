import React from 'react'
import {Form, Button} from 'antd'
export default function Cform() {
 const form =Form.useFormInstance()
const rest = () => {
   console.log('rest')
   form.resetFields()
}
  return (
    <Button onClick={rest}>rest</Button>
  )
}
