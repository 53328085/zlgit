import { Button, Modal, Space } from 'antd';
import React, { createContext, useEffect } from 'react';
import {useSearchParams, useLocation, useNavigate} from 'react-router-dom'
const ReachableContext = createContext(null);
 
const App = () => {
  const {serach, pathname} = useLocation()
  const navigate = useNavigate()
  const urlserach = new URLSearchParams(serach)
 
 useEffect(() => {
  urlserach.append('name', 'zz')
  urlserach.set('job', 'web')
  navigate(`${pathname}?${urlserach.toString()}`) 
 }, [])
 
 
  const onUP =() => {
    let obj ={};
     urlserach.append('name', 'dfdfasdfa')
     urlserach.set('job', 'adfasdf')
     navigate(`${pathname}?${urlserach.toString()}`) 
  }
 const onJUMP =() => {
    urlserach.set('age', 45)
    navigate(`${pathname}?${urlserach.toString()}`) 
 }
 
  return (
    <div>
      <button onClick={onUP}>serch</button>
      <button onClick={onJUMP}>age</button>
    </div>
  )
};
export default App;