import React, {useState} from 'react'
const From = ({count}) => {
    const [value, setValue] = useState(count);
    const [text, setText] = useState('')
    if (count > value) {
       setText('数据增加')
    }e
   return (
    <h1>{value}{text}  </h1>
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
      
      </div>
  )
}
