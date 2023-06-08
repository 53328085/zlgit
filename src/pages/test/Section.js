import React, {useEffect, useContext, useCallback, useMemo} from 'react'

import {levelContext, objCOntext} from './context'
export default function Section ({children}){
  let [name,setName] = React.useState('');
  let [age,setAge] = React.useState(0);
  const level = useContext(levelContext)
  const handler = useCallback(() => {
    console.log(new Date().toLocaleDateString())
  }, [])
  const cobj = useMemo(() => ({
    handler,
    name
  }), [name, handler])
  return (
      <levelContext.Provider value={level + 1}>
        <objCOntext.Provider value={cobj}>
            <div>
               <p><label>姓名： <input onChange={e => setName(e.target.value)} /></label></p> 

               <p><label>年龄：{age} <input onChange={e => setAge(e.target.value)} /></label></p> 
      <section style={{border: "1px solid #dedede", padding: '30px'}}>
         {children}
      </section>
      </div>
      </objCOntext.Provider>
      </levelContext.Provider>
  )
}
 
/* 
 1.父组件state, props更新，子组件也更新
 2.父组件的函数 useMemo或者 useCallback 缓存
 3.React.memo 比较 通过第二个参数函数来决定是否刷新，没有第二个函数 浅比较
 */