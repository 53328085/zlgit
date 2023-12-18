import React from 'react'
import {Empty} from 'antd'
import img from './empty.jpg'
export default function Index() {
  return (
    <div style={{flex: 1,display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
        <Empty 
          image={img}
          description="暂无数据"
        />
    </div>
  )
}
