import React from 'react'
import Cont from './cont'

import {useSelector, useDispatch} from 'react-redux'
import {setzl , zltest} from '@redux/reduxTest.js'

export default function Index() {
  console.log('render')
  const name = useSelector(zltest)
  const dispatch = useDispatch()
  const onChange = () => {
     dispatch(setzl('zzl'))
  }
  return (
    <div>
       <h1>{name}</h1>
       <p>
        <button onClick={onChange}>CHANGE</button>
       </p>
       <Cont id="ddd" /> 
    </div>
  )
}
