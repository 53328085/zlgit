import React from 'react'
import {Spin} from 'antd'
export default function Loading() {
  const style ={
    display: 'flex',
    flex: 1,
    'justifyContent': 'center',
    'alignItems': 'center'
  }
  return (
    <div style={style}> <Spin tip='数据加载……'/></div>
  )
}
