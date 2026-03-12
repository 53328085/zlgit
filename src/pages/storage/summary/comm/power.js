import React from 'react'


import Chartdouble from './chartdouble'

export default function Index() {
   
  
 
 
 
  return (
    <div className='power'>
        <Chartdouble title="关口表功率" type={101} />
       <div className="down">
       <Chartdouble title="充放电功率" type={102} /> 
       <Chartdouble title="负载总表功率" type={103} />  
       </div>
    </div>
  )
}
