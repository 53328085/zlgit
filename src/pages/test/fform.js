import React, {useState} from 'react'

export default function Fform() {
  const [url, setUrl]= useState('')
  let bf = encodeURIComponent("萧山区西河路")
  let url1 =new URL(`http://site.com/?home=萧山区西河路南江公寓`)
 
  return (
      <div></div>
  )  
}
