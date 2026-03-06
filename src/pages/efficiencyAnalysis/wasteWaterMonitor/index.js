import React, { useState, useEffect, useCallback } from "react";

import Pagecount from "@com/pagecontent";
import { useSelector } from "react-redux";
import { selectProjectId } from "@redux/systemconfig";
import { useRequest } from "ahooks"

import { useQuerySNFReportData } from "../common/api.js";

import { WasteWater } from "../common/style.js";
import Titlelayout from "@com/titlelayout";

import { getTime } from "@com/usehandler.js"
import moment from "moment";
import Comm from "../common/comm.js"
import { Cspin } from "@com/comstyled"
import Empty from "@com/useEmpty.js";
import ph from "./icon/ph.png"
import co2 from "./icon/co2.png"
import water from "./icon/water.png";
export default function Index() {


  const projectId = useSelector(selectProjectId);
  const [params, setParams] = useState({});
  // const [datas, setDatas] = useState([]); 
  const setexparams = useCallback((value) => {
    setParams(value)

  }, [])

  const getData = async () => {

    try {
      const { type, date, areaId } = params;
      let flag = Number.isInteger(parseInt(projectId)) && (type < 4 ? date : date?.[0] && date?.[1]);
      if (!flag) {
        return {}
      }
      let { success, data, errMsg } = await useQuerySNFReportData({}, {
        projectId,
        type,
        startDate: type < 4 ? getTime(date, type) : date?.[0]?.startOf()?.format("YYYY-MM-DD"),
        endDate: type == 1 ? date?.format("YYYY-MM-DD") : [2, 3].includes(type) ? moment().format("YYYY-MM-DD") : date?.[1]?.format("YYYY-MM-DD"),
        key: 1,
        areaId
      });

      if (success && Array.isArray(data) && data.length) {
        return data;
        //setDatas(data);

      } else {
        return []
        // setDatas([]);

      }
    } catch (error) {
      console.log(error)
    }
  };
  const { data, loading } = useRequest(getData, {
    refreshDeps: [params, projectId],
    loadingDelay: 300,

  })
  // console.log("loading",loading)
  /*  useEffect(()=>{ 
     getData();
    },[params,projectId]) */

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
                <div className="value">0.478</div>
              </div>

            </div>
            <div className="card" key="ph">
              <div className="imgbox">
                <img className="img" src={ph} />
              </div>
              <div className="note">
                <div className="title">PH值</div>
                <div className="value">0.478</div>
              </div>
            </div>
            <div className="card" key="co2">
              <div className="imgbox">
                <img className="img" src={co2} />
              </div>
              <div className="note">
                <div className="title"><span>COD(mg/L)</span><span className="strong">正常范围(&lt;350)</span></div>
                <div className="value">0.478</div>
              </div>
            </div>
          </div>
        </Titlelayout>
        <Titlelayout title="历史监测数据" key="history"></Titlelayout>
      </WasteWater>
    </Pagecount>
  );
}
