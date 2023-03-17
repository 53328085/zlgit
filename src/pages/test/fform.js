import React, {useState, useRef, useEffect} from 'react'


function Child() {
  const [count, setCount] = useState(0)
  console.log('child111')
  useEffect(() => {
    console.log('child')
  })
  return (
    <div>
      <h1>child</h1>
       <button onClick={() => setCount(count + 1)}>child{count}</button>
    </div>
  )
}
function Parent(props) {
  const [num, setNum] = useState(0);
  
  useEffect(() => {
    console.log('parent' + num)
  })
  return (
    <div>
      <h1>parent</h1>
       <button onClick={() => setNum(num + 1)}>parent{num}</button>
       {props.children}
    </div>
  )
}
export default function Index() {
  const [count, setCount] = useState(0)
 
  const onChange = () =>  {
    setCount(count + 1)
  }
  const log = () => {
    console.log(count)
  }
  useEffect(() => {
    console.log('Index')
  }, [count])
  return (
    <div>
      <h1>Index</h1>
      <h2>{count}</h2>
      <p><button onClick={onChange}>index</button></p>
      <Parent>
         <Child  />
      </Parent>
     
    </div>
  )
}
