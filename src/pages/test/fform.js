import React from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {testthunk, zltest, asyncthunk, setzl, status, sysinfo, error } from "@redux/reduxTest.js";
export default function Index() {

  const dispatch = useDispatch()
  const data = useSelector(zltest)
  const statuse = useSelector(status)
  const sysinfoe = useSelector(sysinfo)
  const errore = useSelector(error)
  const requst = () => {
    dispatch(asyncthunk()).then(res => {
      console.dir(res)
    }).catch(e => {
      console.log(e)
    })
  }
  return (
    <div>
      <h3>{data}</h3>
      <h3>{statuse}</h3>
      <h3>{JSON.stringify(sysinfoe, 3)}</h3>
      <h3>{errore}</h3>
      <button onClick={() => dispatch(testthunk(new Date().getTime()))}>thunk</button>
      <button onClick={requst}>asyncthunk</button>
      <button onClick={() => dispatch(setzl(new Date().getTime()))}>asyncthunk</button>
    </div>
  )
}
