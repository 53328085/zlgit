import React, {useState} from 'react'

export default function Demo({x, y}) {
 const to = () => { let total = 10;
  for(let i=x; i< y; i++) {
    console.log(1)
    total+= 2
  }
  return total
}
  const [num, setNum] = useState(to) // 初始值第一次渲染时有 用
  return (
    <div>
        <p>total: {num}</p>
        <p><button onClick={() => setNum(100 + num)}>新增</button></p>
   </div>
  )
}
