import React from 'react'
const Box =({fiction}) => {
 return (<div style={{flex:1, border: "1px solid #dedede"}}>{fiction.toString()}</div>)
 
}
export default function Index() {
  try {
    return (
      <div>
        <div style={{display: "flex", width: "200px", height: "300px"}}>
            <Box />
        </div>
      </div>
    )
  } catch (error) {
     return <div>出错了</div>
  }
 
}
