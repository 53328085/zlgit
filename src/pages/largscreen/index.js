import React,{useState,useEffect,useRef} from 'react'
 

import {Pagelayout} from './style'

 import Topcom from './comm/top'
 import Leftupcom from './comm/leftup'
 import Leftdowncom from './comm/leftdown'
 import Centerupcom from './comm/centerup'
 import Centercom from './comm/center'
 import Centerdowncom from './comm/centerdown'
export default function Index() {
  const pgref= useRef()

  return (
    <Pagelayout ref={pgref}>
       <Topcom pgref={pgref}></Topcom>
       <div className="content">
         <div className="left">
             <Leftupcom /> 
             <Leftdowncom /> 
         </div>
         <div className="center">
            <Centerupcom /> 
            <Centercom/>
            <Centerdowncom />
         </div>
         <div className="right"></div>
       </div>
    </Pagelayout>
  )
}

