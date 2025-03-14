import React, { useEffect } from 'react'

export default function Index() {
  const getfn = async function(){
     let obj =  await import("./import")
      obj.default?.()
  } 
  useEffect(()=> {
    getfn()
  }, [])
  return (
    <div>index</div>
  )
}

