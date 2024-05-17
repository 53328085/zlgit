import React from 'react'
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
