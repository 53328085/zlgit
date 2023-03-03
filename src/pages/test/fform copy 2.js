import React, {useEffect, useCallback, useMemo} from 'react'

export default function Father1 (){
  let [name,setName] = React.useState('');
  const countContainer = React.useRef(0);
  const getData=(count)=>{
      //依据异步获取数据
      setTimeout(()=>{
          setName("异步获取回来的数据"+count)
          countContainer.current = count++;
      },200)
  }
  return (
      <div>
          <button onClick={()=>getData(++countContainer.current)}>点击获取数据</button>
          {name}
      </div>
  )
}
 
/* 
 1.父组件state, props更新，子组件也更新
 2.父组件的函数 useMemo或者 useCallback 缓存
 3.React.memo 比较 通过第二个参数函数来决定是否刷新，没有第二个函数 浅比较
 */