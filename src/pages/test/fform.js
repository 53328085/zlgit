import { Button, Modal } from 'antd';
import { divide } from 'lodash';
import React, { useState, useCallback } from 'react';

// 缓存 1. 组件  通过Props的形式传递 2. react.memo
const Loger = React.memo((props) => {
  console.log(`${props.label}  render `)
  return null
})
const set  = new Set()
export default () => {
  const [count, setCount] = useState(0)
  const increment = useCallback(() => setCount((c) => c + 1), [])
  const Log =  <Loger label="counter" onfn={increment} />
  set.add(Log)
  console.log(set)
  return (
      <div>
        <Button onClick={increment}>count</Button>
        {Log}
      </div>   
  )
}



