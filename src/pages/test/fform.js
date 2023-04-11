import React, {useState} from 'react'

export default function fform() {
  const [count, setCount] = useState({name: 'zl', age: 10});
  const change = () => {
    let obj = {name: 'zl'+Math.random(), age: Math.random()}
    console.log(obj)
    setCount({...obj})
  }
  const log = async () => {
    console.log(count)
  }
  return (
    <div>
      <h5>{count.toString()}</h5>
      <button onClick={change}>count</button>
      <button onClick={log}>log</button>
    </div>
  )
}
