 
import React from 'react'
import {Link, useLocation, NavLink, useOutletContext, useParams, useLoaderData} from 'react-router-dom'
export default function Index() {
 // const [count, setCount] = useOutletContext()
  //const increment = () => setCount((c) => c + 1);
  const useId = useParams()
 // const data = useLoaderData()
  //console.log(data)
  console.log(useId)
  return (
    <div>
       <h>正泰物联</h>
     
    </div>
    
  )
}
