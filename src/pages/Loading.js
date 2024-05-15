import React from 'react'
import {Spin} from 'antd'
import {useSelector}  from 'react-redux'
import { iszhCN } from '../redux/systemconfig'
const style ={
  display: 'flex',
  flex: 1,
  'justifyContent': 'center',
  'alignItems': 'center'
}
export default function Loading() {
  console.log(localStorage.getItem('i18nextLng')?.toLowerCase().slice(0,2))
  const iszh = useSelector(iszhCN)
  console.log(iszh)
   const tip = iszh ? "数据加载……" : 'Data loading'
  
  return (
    <div style={style}> <Spin tip={tip}  /> </div>
  )
}
