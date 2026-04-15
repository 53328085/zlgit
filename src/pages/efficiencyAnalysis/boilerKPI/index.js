import React, {  useState, useEffect,  useCallback } from "react";
 
import Pagecount from "@com/pagecontent";
import { useSelector } from "react-redux";
import { selectProjectId } from "@redux/systemconfig";
import {useRequest} from "ahooks"
 
import { useQuerySNFReportData } from "../common/api.js";

import { Mainwrap } from "../common/style.js";
import Cform  from "../common";
 
import {getTime} from "@com/usehandler.js"
import dayjs from 'dayjs';
import Comm from "../common/comm.js"
import {Cspin} from "@com/comstyled"
import Empty from "@com/useEmpty.js";
export default function Index() {
 

  const projectId = useSelector(selectProjectId);
  const [params, setParams] = useState({});
  // const [datas, setDatas] = useState([]); 
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
         endDate: type==1 ?   date?.format("YYYY-MM-DD") : [2,3].includes(type) ? dayjs().format("YYYY-MM-DD"):  date?.[1]?.format("YYYY-MM-DD"),
         key:6,
         areaId
       });
      
      if (success && Array.isArray(data) && data.length) {
         return data;
        // setDatas(data);
           
      } else {
        return []
       //  setDatas([]);
        
      }
    } catch (error) {
       console.log(error)
    }
  };

/*  useEffect(()=>{ 
   getData();
  },[params,projectId]) */

    const {data,loading } = useRequest(getData,{
     refreshDeps:[params,projectId],
     loadingDelay:300,
    
   })
 
  return (
    <Pagecount pd="0" bgcolor="none">
      <Mainwrap>
        <Cform setexparams={setexparams} />
         <Cspin spinning={loading} tip={"loading.."}>
        <div className="contentwrap">
          {
            data?.map?.(d=> <Comm {...d} key={d.equipmentName
              } />)
          }
          {
                      data?.length==0  && <Empty />
                       
                    }
        </div>
        </Cspin>
      </Mainwrap>
    </Pagecount>
  );
}
