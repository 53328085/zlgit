import React, {useState, useRef, useEffect} from 'react'


function Child({count}) {
  console.log('child')
  console.log(count)
  useEffect(() => {
    console.log('child')
  }, [])
  return (
    <div>{count}</div>
  )
}

export default function fform() {
  const count = useRef(0)
  console.log('parent')
  const onChange = () =>  {
    count.current = count.current + 1;
    console.log(count.current)
  }
  const log = () => {
    console.log(count.current)
  }
  useEffect(() => {
    log()
  }, [count.current])
  return (
    <div>
      <h1>父组件</h1>
      <h2>{count.current}</h2>
      <p><button onClick={onChange}>add</button></p>
      <Child count={count.current} />
    </div>
  )
}
