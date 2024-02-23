import React, {useEffect, useState, memo} from 'react'
function Test() {
  console.log('render: test')
  return (
    <div>测试</div>
  )
}
export default function Index() {
  const [id, setId] = useState(1);
  const [name, setName] = useState(null);
  const onchange = () => {
    setId(id => id + 1);
    setTimeout(() => {
      console.log(id);
    }, 0)
  }
  useEffect(() => {
  }, [id, name])
  return (
    <div>
      <button onClick={onchange}>change</button>
       <pre>{id}</pre>
       <pre>{name}</pre>
       <Test />
      </div>
  )
}
