import React from 'react'
import Pagecount from '@com/pagecontent'
import notfound from './404.png'
import {Image} from 'antd'
export default function Index() {
 
  return (
    <div style={{display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'center'}}>
       <Image src={notfound} preview={false} />
    </div>
  )
}
