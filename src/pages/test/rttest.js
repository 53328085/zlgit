 
import React from 'react'
import {Link, useLocation, NavLink, useOutletContext, useParams} from 'react-router-dom'
export default function Index() {
  const [count, setCount] = useOutletContext()
  const increment = () => setCount((c) => c + 1);
  const useId = useParams()
  console.log(useId)
  return (
    <div>
       <h>正泰物联</h>
       <button onClick={increment}>{JSON.stringify(count, 3)}</button>;
    </div>
    
  )
}
