import React, { useRef, useState, useEffect, useCallback } from "react";

import Pagecount from "@com/pagecontent";
import { useSelector } from "react-redux";
import { selectProjectId } from "@redux/systemconfig";
import Titlelayout from "@com/titlelayout";
import { getTime } from "@com/usehandler";
import { useQuerySNFReportData } from "../common/api";
import {useRequest} from "ahooks"
import { Mainwrap ,TitleBox} from "./style";

import Cform from "../common";
import Aircom from "./air";
import {Cspin} from "@com/comstyled"
import Empty from "@com/useEmpty.js";
export default function Index() {
  const projectId = useSelector(selectProjectId);
  const [params, setParams] = useState({});
//  const [datas, setDatas] = useState([]);
  const setexparams = useCallback((value) => {
    setParams(value);
  }, []);
 
  const getData = async () => {
    try {
      const { type, date, areaId } = params;
      let flag =
        Number.isInteger(parseInt(projectId)) &&
        (type < 4 ? date : date?.[0] && date?.[1]);
      if (!flag) {
        return {};
      }
      let { success, data, errMsg } = await useQuerySNFReportData(
        {},
        {
          projectId,
          type,
          startDate:
            type < 4
              ? getTime(date, type)
              : date?.[0]?.startOf()?.format("YYYY-MM-DD"),
          endDate:
            type == 1
              ? date?.format("YYYY-MM-DD")
              : [2, 3].includes(type)
              ? moment().format("YYYY-MM-DD")
              : date?.[1]?.format("YYYY-MM-DD"),
          key: 3,
          areaId,
        }
      );

      if (success && Array.isArray(data) && data.length) {
        return data;
       // setDatas(data);
      } else {
        return [];
       // setDatas([]);
      }
    } catch (error) {
      console.log(error);
    }
  };

   const {data,loading } = useRequest(getData,{
    refreshDeps:[params,projectId],
    loadingDelay:300,
   
  })

  return (
    <Pagecount pd="0" bgcolor="none">
      <Mainwrap>
        <Cform setexparams={setexparams} />
        <Cspin spinning={loading} tip={"loading.."}>
          <Titlelayout
            layout="flex"
            title={<TitleBox>Air-Conditioner KPI</TitleBox>}
            dr="column"
          >
             <div className="contentwrap">
             
            {data?.map?.((d) => (
              <Aircom  {...d} key={d.kpiName}></Aircom>
            ))}
             {
                        data?.length==0  && <Empty />
                         
                      }
           
            </div>
          </Titlelayout>
          </Cspin>
      </Mainwrap>
    </Pagecount>
  );
}
