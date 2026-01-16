import React,{useState,useEffect,useRef} from 'react'
 

import {Pagelayout} from './style'
import { useSelector } from "react-redux";
import { selectProjectId  } from "@redux/systemconfig";
 import Topcom from './comm/top'
 import Leftupcom from './comm/leftup'
 import Leftdowncom from './comm/leftdown'
 import Centerupcom from './comm/centerup'
 import Centercom from './comm/center'
 import Centerdowncom from './comm/centerdown'
 import Rightupcom from './comm/rightup'
 import Rightcentercom from './comm/rightcenter'
 import Rightdowncom from './comm/rightdown'
 import {useQueryData} from './api'
export default function Index() {
  const pgref= useRef()
  const projectId = useSelector(selectProjectId);
  const getData=async ()=>{  
    try {
      let {data, success } = useQueryData({projectId, })
    } catch (error) {
      
    }   
  }
  return (
    <Pagelayout ref={pgref} >
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
         <div className="right">
            <Rightupcom />
            <Rightcentercom />
            <Rightdowncom />
         </div>
       </div>
    </Pagelayout>
  )
}

