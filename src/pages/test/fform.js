import React from 'react'
import {useParamPostMutation, useGetPostQuery,selectUsersResult} from './apiSlice'
export default function Index() {
   let objf = useGetPostQuery(2)
  

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
    </div>
  )
}
