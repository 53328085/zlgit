import React, { useMemo, useRef, useState, useCallback, useContext} from "react";
import { Space, Form, message, Typography } from "antd";
import moment from "moment";
import Pagecount from "@com/pagecontent";
import { useNavigate, useLocation } from "react-router-dom";
import { useAntdTable, useRequest } from "ahooks";
 
 
import Titlelayout from "@com/titlelayout";
 
import { useOption  } from "../data";
 
import Ichart from "@com/useEcharts/Ichart";
import {  Ctitle} from "../style";
 
 
import {OverdataContext} from '../context'

import DetailModal from "./detailModal";
import benefit from './icon/benefit.png'
const {Link} = Typography
export default function Index() {
  const cRef = useRef()
  const {projectId, lightdata}= useContext(OverdataContext)
 
 
   const {day, month, year} =  useOption(lightdata)
  const onOpen=(type)=> {
     
    cRef.current?.onOpen({index:type, projectId})
  } 
  
  return ( 
      <div className="rightlayout">
         <Titlelayout layout="flex" title={<Ctitle><span>用电量信息</span><Link onClick={()=>onOpen(0)}>详情</Link></Ctitle>}>
           <div className="pies">
             {day && <Ichart {...day} key="day"></Ichart>  }
             {month && <Ichart {...month} key="month"></Ichart>  }
             {year && <Ichart {...year} key="year"></Ichart>  }
           </div>

         </Titlelayout>
         <Titlelayout layout="flex" title={<Ctitle><span>发电量信息</span><Link onClick={()=>onOpen(1)}>详情</Link></Ctitle>}>
           <div className="pies">
             <div className="item">
               <span>日发电量（kWh）</span>
               <span>{lightdata?.ecDay}</span>
             </div>
             <div className="item">
               <span>月发电量（kWh）</span>
               <span>{lightdata?.ecMonth}</span>
             </div>
             <div className="item">
               <span>年发电量（kWh）</span>
               <span>{lightdata?.ecYear}</span>
             </div>
           </div>
         </Titlelayout>
         <Titlelayout layout="flex" title={<Ctitle><span>发电量折算收益</span><Link onClick={()=>onOpen(2)}>详情</Link></Ctitle>}>
         <div className="pies">
             <div className="item">
               <span>日收益（元）</span>
               <span>{lightdata?.incomeDay}</span>
             </div>
             <div className="item">
               <span>月收益（元）</span>
               <span>{lightdata?.incomeMonth}</span>
             </div>
             <div className="item">
               <span>年收益（元）</span>
               <span>{lightdata?.incomeYear}</span>
             </div>
           </div>
         </Titlelayout>
         <Titlelayout layout="flex" title={<Ctitle><span>当年社会效益</span><Link onClick={()=>onOpen(3)}>详情</Link></Ctitle>}>
         <div className="pies center">
             <div>
                <img src={benefit} className="img"></img>
             </div>
             <div className="item">
               <span>减少标煤（t）</span>
               <span>{lightdata?.coal}</span>
             </div>
             <div className="item">
               <span>减少CO2排放（t）</span>
               <span>{lightdata?.cO2}</span>
             </div>
           </div>
         </Titlelayout>
         <DetailModal cRef={cRef}  ></DetailModal>
      </div>
    );
}
