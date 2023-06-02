import React from 'react'
import Building from '@com/building'
export default function Index({pagename}) {
  return (
    <div style={{flex: 1, display:"flex", justifyContent: 'center', alignContent: 'center'}}>
      <Building pagename={pagename}/>
    </div>
  )
}
