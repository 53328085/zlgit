import React, {useRef, useState, useEffect} from 'react'
 
import styled, {keyframes} from 'styled-components'

 const textscrol = keyframes`
   form {
      transform: translateX(0);
   }
   to {
     transform: translateX(-100%);
   }
 `
 const roop = keyframes`
   from {
     transform: translateX(80px);
   }
   to {
     transform: translateX(-100%);
   }
 `
 const Wrapper = styled.div`
  position: relative;
  width: 80px;
  height: 40px;
  overflow: hidden;
  line-height: 40px;
  .textContent{
    position: absolute;
    white-space: nowrap;
    animation-name: ${textscrol};
    animation-timing-function: linear;
    animation-iteration-count: infinite;
 
  }
 `
 

export default function Index() {
  const boxRef = useRef();
  const [duration, setDuration] = useState('')
  useEffect(() => {
    if(boxRef.current) {
      let {width} = boxRef.current.getBoundingClientRect()
      if(width > 80) {
        setDuration(width / 16 + 's')
      }else {
        setDuration('')
      }
    }else {
      setDuration('')
    }
  }, [])
  return (
    <div>
      <Wrapper>
         <div className="textContent" ref={boxRef} style={{animationDuration: duration, animationDelay: duration ? duration  : ''}}>
         这里主要使用了useRef进行DOM操作，使用useEffect进行副作用，使用useState记录duration。
         </div>
      </Wrapper>
    </div>
  )
}






/* import React from 'react'
import {useDispatch} from 'react-redux'
import {useParamPostMutation, useGetPostQuery,selectUsersResult} from './apiSlice'
import { Area, ProjectList,ProjectSetting, BigScreen, eneryShift, Monitoring} from "@api/api.js"; 
import {getWebsiteMenu, selectAll} from "@redux/reduxTest"
export default function Index() {
  const think =(a, b, c ) => {
    console.log(a)
    console.log(c)  
  }
  const dispatch = useDispatch()
   let objf = useGetPostQuery(2)
  
  const asyncthink = (id) => {
     dispatch(think)
  }

  let [onpost, data] = useParamPostMutation()
   console.log(data)
   const mutation = async() => {
      
    let   data =  await onpost(1).unwrap()
      console.log(data)
   }
  return (
    <div>
      <button onClick={mutation}>mutation</button>
     <button onClick={() => data.reset(2)}>reset</button> 
     <button onClick={asyncthink}>asyncthink</button> 
    </div>
  )
}
 */