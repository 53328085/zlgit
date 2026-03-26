import React,{useState,useEffect,useRef, useMemo} from 'react'
 

import {Pagelayout} from './style'
import { useSelector } from "react-redux";
import { selectProjectId  } from "@redux/systemconfig";
import {isObject,chunkArray} from "@com/usehandler"
import {useFullscreen} from 'ahooks'
 import Topcom from './comm/top'
 import Leftupcom from './comm/leftup'
 import Leftcentecom from './comm/leftupcenter'
 import Leftdowncom from './comm/leftdown'
 import Centerupcom from './comm/centerup'
 import Centercom from './comm/center'
 import Centerdowncom from './comm/centerdown'
 import Rightupcom from './comm/rightup'
 import Rightup2ndcom from './comm/right2nd'
 import Rightup3ndcom from "./comm/right3rd"
  // import Rightcentercom from './comm/rightcenter'
 //import Rightdowncom from './comm/rightdown'
 
 
export default function Index() {
  const pgref= useRef()
  const projectId = useSelector(selectProjectId);
  
 
 
 
 
 
 
 
 
  return (
    <Pagelayout ref={pgref}   >
       <Topcom pgref={pgref}  ></Topcom>
       <div className="content" key="content">
         <div className="left" key="left">
             <Leftupcom  projectId={projectId}/> 
             <Leftcentecom projectId={projectId} />
             <Leftdowncom projectId={projectId} /> 
         </div>
         <div className="center" key="center">
             <Centerupcom projectId={projectId} /> 
             
            <Centerdowncom  /> 
         </div>
         <div className="right" key="right">
            <Rightupcom  />
            <Rightup2ndcom />
            <Rightup3ndcom />
            {/* <Rightcentercom datas={latest7DaysKPICurve} />
            <Rightdowncom /> */}
         </div>
       </div>
    </Pagelayout>
  )
}
