import React, {useEffect} from 'react'
import {Link, NavLink, useNavigate, useLocation} from 'react-router-dom'
export default function Index() {
  const loction = useLocation()
  const navigate = useNavigate()
  navigate('/rrtest', {state: {name: 'zz'}})
  useEffect(() =>{
    console.log(loction)
  }, [loction])
  return (
    <div>
      <Link to="?a=b">ab</Link>
      <Link to="?c=d">cd</Link>
       <h2> </h2>
 
    </div>
  )
}
