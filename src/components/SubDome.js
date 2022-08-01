import React from 'react'
import Cdeomo from './Cdeomo'
import {useWinSize} from '../hooks/useWinSize'
export default function SubDome(props) {
  const postdata = props.postdata
  const size = useWinSize()
  return (

    <div>
      <div>
        <span>width: {size.width}</span>
      </div>
        <h1>子数据如何传到父数据</h1>
        <button onClick={() => postdata(123)}>子组件向父组件传值</button>
         <Cdeomo initialCount={2}></Cdeomo>
    </div>
  )
}
