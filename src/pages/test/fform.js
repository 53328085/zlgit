import React, {useState} from 'react'
const From = () => {
    const [value, setValue] = useState('zl')
    console.log(1111)
   return (
    <label>{value}  <input value={value} onChange={
      (e) => setValue(e.target.value)
    }></input></label>
   )
}
export default function Fform() {
  const initfn = () => {
    console.log(111)
    const lis = []
    for(let i=0;i<3; i++) {
      lis.push(<li key={i}>{i}Item</li>)
    }
    return <ul>{ lis.map(l => l)}</ul>
  }
  const [list, setList] =useState(initfn)
  const [name, setName] =useState('zl')
  const [keyId, setKeyId] = useState(0)
  return (
    <div>
      <button onClick={() => setName(Math.random().toString())}>{name}</button>
      {list}
      <button onClick={() => setKeyId(keyId + 1)}>reset</button>
      <From key={keyId}></From>
      </div>
  )
}
