import React, {useState, useRef, memo, useCallback, useMemo} from 'react'

export default function New() {
  console.log('Demo1 Parent')
      let [count,setCount] = useState(0)
      let [name,setName] = useState('-')
      let refbt = useRef()
      const handleClick = ()=>{
          setCount(count+1)
      }
      const handleInput = (e)=>{
          setName(e.target.value)
      }
      const handleChange = useCallback(() => {  // 缓存函数
         let v = refbt.current.innerText*1       
        setCount(v + 1)
     }, [])
     let totalv = ''
     const total = useCallback(() => { //  缓存函数
       console.log('total求和__1')
       let arr = Array.from({length: 100}).fill(1)
       
       totalv = arr.reduce((p,r) => p+r, 0)
        console.log(totalv)
     })

     const total2 = useMemo(() => { // 缓存值
      console.log('total求和___2')
      let arr = Array.from({length: 100}).fill(1)
      
      let t = arr.reduce((p,r) => p+r, 0)
      return t
    }, [])
      return (
          <div>
                <h1>缓存值</h1>
                <div>
                total:{totalv}
               <p> <button onClick={() => total()}>total缓存函数</button></p>
                </div>
                <div>
                total2:{total2}
                </div>
              <div className='l50'>
                  <label>计数器：</label>
                  <span className='mr10' ref={refbt}>{count}</span>
                  <button className='ml10' onClick={handleClick}>Increase</button>
              </div>
              <div className='l50'>
                  <label htmlFor="">改变子组件：</label>
                  <input type="text" onChange={handleInput}/>
              </div>
              <Child name={name} handleClick={handleChange}/>
          </div>
      )
}
const Child = memo((props)=>{
      console.log('Demo1 Child')
      return (
          <div className='l50'>
              子组件渲染：{props.name}
              <button onClick={props.handleClick}>更改count</button>
          </div>
      )
  })