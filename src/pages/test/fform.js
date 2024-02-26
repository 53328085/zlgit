import React, {useEffect, useState, memo} from 'react'
import {useDispatch} from 'react-redux'
import {testthunk, getpropject} from '@redux/reduxTest'
import {FixedSizeList} from 'react-window' 

// FixedSizeList 固定尺寸列表

const Row = ({index, style}) => (<div style={style}>Row{index}</div>)
export default function Index() {
  
  return (
    <FixedSizeList
      height={150} // 列表可视区域的高度
      itemCount={10000} // 列表数据长度
      itemSize={35} //
    >
      
      
    </FixedSizeList>
  )
}
