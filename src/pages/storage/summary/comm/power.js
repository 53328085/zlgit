import React from 'react'
import { Space} from 'antd'
import Titlelayout from "@com/titlelayout";
import {CdatePicker} from '@com/comstyled/index'
export default function Index() {
  const extra=<Space><CdatePicker style={{width: "120px"}} /> <CdatePicker style={{width: "120px"}} /></Space>
  const props ={
    bg:'transparent',
    bordered:'no',
    extra
  }
  return (
    <div className='power'>
       <Titlelayout title='关口表功率' {...props} > 

       </Titlelayout>
       <div className="down">
        <Titlelayout title='充放电'{...props}></Titlelayout>
        <Titlelayout title='负载总功率' {...props}></Titlelayout>
       </div>
    </div>
  )
}
