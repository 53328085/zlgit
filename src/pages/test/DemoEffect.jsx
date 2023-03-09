import React, {useState, useEffect, useLayoutEffect} from 'react'

export default function Demo({x,type}) {
  console.log('render' + type)
  const [num, setNum] = useState(0) // 初始值第一次渲染时有 用
   
  return (
    <div className='zl' style={{backgroundColor: num==0 ? 'red' : 'green'}}>
        <p >{type}:{x} 更新时渲染</p>
      
   </div>
  )
}
