import React, { useState, useEffect, useCallback } from "react";

import Pagecount from "@com/pagecontent";
import { useSelector } from "react-redux";
import { selectProjectId } from "@redux/systemconfig";
import { useRequest } from "ahooks"
import {useOutletContext} from 'react-router-dom'  
import { useQueryCurrent,useQueryHistoryTable } from "../common/api.js";

import { WasteWater } from "../common/style.js";
import Titlelayout from "@com/titlelayout";
import Ichart from '@com/useEcharts/Ichart'
import { getTime } from "@com/usehandler.js"
import moment from "moment";
import Comm from "../common/comm.js"
import { Cspin } from "@com/comstyled"
import Empty from "@com/useEmpty.js";
import ph from "./icon/ph.png"
import co2 from "./icon/co2.png"
import water from "./icon/water.png";
import {lineoptdoub} from "./data.js"
import { isObject } from "lodash";
export default function Index() {
let {exparams} = useOutletContext()
 
 let { publicdate:date, publictype:type, publicrangedate, projectId} = exparams 
 
 
  const getArg=async()=>{ 
     try {
      if (!Number.isInteger(parseInt(projectId))) {
        return {}
      }
      let {success, data} = await useQueryCurrent({projectId})
      if (success && isObject(data)){
        return data
      }else {
        return {}

      }
     } catch (error) {
      
     }
  }
  const getData = async () => {

    try {
     
      console.log("params", type, date)
      let flag =  [ projectId].every(d => Number.isInteger(parseInt(d))) && (type!=4 ? date : (publicrangedate?.[0]&&publicrangedate?.[1]) )
      console.log("flag",flag)
      if (!flag) {
        return {}
      }
         let difftype={
        1:"day",
        2:"month",
        3:"year",
        4:"day"
      }[type]
      let StartDate=type!=4 ? date.startOf(difftype).format("YYYY-MM-DD HH:mm") :publicrangedate?.[0].startOf?.("day")?.format("YYYY-MM-DD HH:mm") ,EndDate
      let datetype={
        1:"days",
        2:"months",
        3:"years",
        4:"days"
      } 
       
          let dif = type!=4 ? moment().diff(date, datetype[type]) :moment().diff(publicrangedate?.[1], datetype[type])
          console.log("dif",dif)
          if(dif>0) {
           
            EndDate = type!=4 ?  date.endOf(difftype).format("YYYY-MM-DD HH:mm") : publicrangedate?.[1].endOf(difftype).format("YYYY-MM-DD HH:mm")
          }else { 
            EndDate =type!=4 ? moment().format("YYYY-MM-DD HH:mm") : publicrangedate?.[1].format("YYYY-MM-DD HH:mm")
       
          }
    

      let { success, data, errMsg } = await useQueryHistoryTable({}, {
        projectId,
        type,
        StartDate,
        EndDate,
      });

      if (success && isObject(data)) {
        return data;
       

      } else {
        return []
      }
    } catch (error) {
      console.log(error)
    }
  };
  const { data, loading } = useRequest(getData, {
    refreshDeps: [ date, type, publicrangedate, projectId], 
  })
   const lineopt = lineoptdoub({data,type})
  const {data:arg} = useRequest(getArg, {
    refreshDeps: [  projectId], 
  })

  const config = {
    height: 122, width: 390
  }

  return (
    <Pagecount pd="0" bgcolor="none">
      <WasteWater>
        <Titlelayout title="实时监测数据" key="moniter" layout="flex" pv="5px 16px 16px" className="moniter" >
          <div className="cards">
            <div className="card" key="water">
              <div className="imgbox">
                <img className="img" src={water} />
              </div>
              <div className="note">
                <div className="title">流量</div>
                <div className="value">{arg?.flowData}</div>
              </div>

            </div>
            <div className="card" key="ph">
              <div className="imgbox">
                <img className="img" src={ph} />
              </div>
              <div className="note">
                <div className="title">PH值</div>
                <div className="value">{arg?.phData}</div>
              </div>
            </div>
            <div className="card" key="co2">
              <div className="imgbox">
                <img className="img" src={co2} />
              </div>
              <div className="note">
                <div className="title"><span>COD(mg/L)</span><span className="strong">正常范围(&lt;350)</span></div>
                <div className="value">{arg?.codData}</div>
              </div>
            </div>
          </div>
        </Titlelayout>
        <Titlelayout title="历史监测数据" key="history" layout="flex"   >
           <Ichart custoption={lineopt} />
        </Titlelayout>
      </WasteWater>
    </Pagecount>
  );
}
