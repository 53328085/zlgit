import React, {useContext} from 'react'
import {useParams, useMatch, useSearchParams, useLocation, useNavigate} from 'react-router-dom'
export default function Wkl() {
 // const {id, title, content} = useParams()
 // useParams, useMatch  param方式传参接受
 // useSearchParams, useLocation query方式传参接受
 // useLocation state 方式传参
  const [search, setSearch] = useSearchParams()
  const match = useMatch('/home/message/wkl/:id/:title/:content')

  const {state: {id, title, content}} = useLocation()
  const navigate = useNavigate()
/*  navigate 编程式导航 navigate('path', {
     replace: true,
     state: {

     }
  }) 如果需要 params, serach 写在path路径里*/
 
  return (
    <div>
      <button onClick={() => setSearch('id=2&title=悟空&content=悟空大闹天宫')}>update</button>
      <button onClick={() =>navigate(1)}>前进</button>
      <button onClick={()=> navigate(-1)}>后退</button>
    <ul>
      <li>id: {id}</li>
      <li>title: {title}</li>
      <li>content: {content}</li>
    
    </ul>
    </div>
  )
}
