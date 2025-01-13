import React from 'react'
import Common from './common'
export default function electric() {
  const addMainLine=()=>{
    
  }
  let commonProps ={
    addMainLine
  }
  return (
    <div style={{ overflow: 'hidden' ,width:'100%',height:"inherit", overflowY: "auto"}}>
        <Common type={1}/>
    </div>
  )
}

