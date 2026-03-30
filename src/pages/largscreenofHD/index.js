import React,{ useRef } from 'react'
 

import {Pagelayout} from './style'
 
 
 import Topcom from './comm/top'
 import Leftupcom from './comm/leftup'
 import Leftcentecom from './comm/leftupcenter'
 import Leftdowncom from './comm/leftdown'
 import Centerupcom from './comm/centerup' 
 import Centerdowncom from './comm/centerdown'
 import Rightupcom from './comm/rightup'
 import Rightup2ndcom from './comm/right2nd'
 import Rightup3ndcom from "./comm/right3rd"
 
 import Rightdowncom from './comm/rightdown'
 export default function Index() {
  const pgref= useRef()
  return (
    <Pagelayout ref={pgref}   >
       <Topcom pgref={pgref}  ></Topcom>
       <div className="content" key="content">
         <div className="left" key="left">
             <Leftupcom  /> 
             <Leftcentecom   />
             <Leftdowncom   /> 
         </div>
         <div className="center" key="center">
             <Centerupcom  /> 
             
            <Centerdowncom  /> 
         </div>
         <div className="right" key="right">
            <Rightupcom  />
            <Rightup2ndcom />
            <Rightup3ndcom />
            <Rightdowncom /> 
         </div>
       </div>
    </Pagelayout>
  )
}
