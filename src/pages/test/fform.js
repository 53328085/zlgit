import React, {useState, useMemo} from 'react'
import {flushSync} from 'react-dom'
import DemoEffect from './DemoEffect'
export default function Fform() {
  console.log('更新')
  // useState 比较状态。状态一样不更新
  let [x, setX] = useState(10),
    [y, setY] = useState(30),
    [z, setz] = useState(0);
  const handlerx = () => { 
    
        setX((prev) => prev + 1 ) 
  } 
  const handlery = () => { 
    
    setY((prev) => prev + 1 ) 
}
  const child1 = useMemo(() => <DemoEffect x={x} type='x' />, [x])
  const child2 = useMemo(() => <DemoEffect x={y} type='y' />, [y])
  return (
    <div> 
       <p>
         <button onClick={handlerx}>x更新</button>
       </p>
       <p>
         <button onClick={handlery}>y更新</button>
       </p>
       {child1}
       {child2}
    </div>
  )
}
