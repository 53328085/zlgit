import React, {useState} from 'react'
import {Navigate, NavLink,Outlet, useOutlet, useResolvedPath} from 'react-router-dom'
export default function Home() {
 let [count, setCount] = useState(0)
 const add = () => {
     setCount(++count)
 }
  return (
    <div>
        <h1>Home</h1>
        <div>
            <h2>count: {count}</h2>
            <p>{count == 2 ? <Navigate to="/" /> : ''}</p>
            <p>
                <button onClick={() => add()}>increment</button>
            </p>
        </div>
        <div>
           <NavLink to="news">News</NavLink>
           <NavLink to="message">Message</NavLink>
        </div>
        <div>
            <Outlet></Outlet>
        </div>
     </div>
  )
}
// Navigate 跳转