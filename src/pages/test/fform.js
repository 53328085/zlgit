import React from 'react'
const Box =() => {
   return (
    <div style={{flex:1, border: "1px solid #dedede"}}></div>
   )
}
export default function Index() {
  return (
    <div>
      <div style={{display: "flex", width: "200px", height: "300px"}}>
          <Box />
      </div>
    </div>
  )
}
