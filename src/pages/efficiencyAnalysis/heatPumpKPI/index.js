import React, {  useState, useEffect,  useCallback } from "react";
 
import Pagecount from "@com/pagecontent";
import { useSelector } from "react-redux";
import { selectProjectId } from "@redux/systemconfig";

 
import { useQuerySNFReportData } from "../common/api.js";

import { Mainwrap } from "../common/style.js";
import Cform  from "../common";
 
import {getTime} from "@com/usehandler.js"
import moment from "moment";
import Comm from "../common/comm.js"
export default function Index() {
 

  const projectId = useSelector(selectProjectId);
  const [params, setParams] = useState({});
  const [datas, setDatas] = useState([]); 
  const setexparams =useCallback((value)=>{
  setParams(value)

  },[])

   const getData =async () => {

    try {
      const {type, date,areaId} = params;
      let flag = Number.isInteger(parseInt(projectId)) &&  (type<4 ? date : date?.[0]&& date?.[1]);
      if(!flag) {
         return {}
      }
      let { success, data, errMsg } = await useQuerySNFReportData({},{
         projectId,
         type,
         startDate: type<4 ? getTime(date, type) :date?.[0]?.startOf()?.format("YYYY-MM-DD"),
         endDate: type==1 ?   date?.format("YYYY-MM-DD") : [2,3].includes(type) ? moment().format("YYYY-MM-DD"):  date?.[1]?.format("YYYY-MM-DD"),
         key:7,
         areaId
       });
      
      if (success && Array.isArray(data) && data.length) {
       
         setDatas(data);
           
      } else {
         setDatas([]);
        
      }
    } catch (error) {
       console.log(error)
    }
  };

 useEffect(()=>{ 
   getData();
  },[params,projectId])

 
 
  return (
    <Pagecount pd="0" bgcolor="none">
      <Mainwrap>
        <Cform setexparams={setexparams} />
        <div className="contentwrap">
          {
            datas?.map?.(d=> <Comm {...d} key={d.equipmentName
              } />)
          }
        
        </div>
      </Mainwrap>
    </Pagecount>
  );
}
