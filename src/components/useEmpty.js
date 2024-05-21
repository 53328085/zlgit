import React from 'react'
import {Empty} from 'antd'
import img from './empty.jpg'
export default function Index(props) {
  let tip = props.tip ?? ''
  return (
    <div style={{flex: 1,display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
        <Empty 
          image={img}
          description={tip}
        />
    </div>
  )
}
