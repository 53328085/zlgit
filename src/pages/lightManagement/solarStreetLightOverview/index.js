import React, { useMemo, useRef, useState, useCallback, useContext} from "react";
import { Space, Form, message } from "antd";
import moment from "moment";
import Pagecount from "@com/pagecontent";
import { useNavigate, useLocation } from "react-router-dom";
import { useAntdTable, useRequest } from "ahooks";
 
import UserTable from "@com/useTable";
import Titlelayout from "@com/titlelayout";
import { useOutletContext } from "react-router-dom";
 
import {useOverview, useMonitor, usePage } from "./api.js";
import { getTime, isObject } from "@com/usehandler";
 
import { Tablewrap, Chartwrap,TitleBox, Mainbox } from "./style";
import {Cspin} from "@com/comstyled"
import {Streetligth,MapCard,Details} from "./components"
import {OverdataContext} from './context'
export default function Index() {
  const [datatype, setDataType] = useState("chart");
  const navigate = useNavigate();
  const { pathname, state } = useLocation();
  const [overview, setOverView] = useState(null)
  const tbref = useRef()
  const { exparams } = useOutletContext();
  
  const { areaId, projectId, type, date } = exparams || {};
  const pageTotal = useRef()
  const getOverview = async()=>{
    try {
      if(!Number.isInteger(parseInt(projectId))) return
      let {success, data,errMsg}= await useOverview({projectId, areaId})
      if(success && isObject(data)) {
        setOverView(data)
      }else {
        if(!success) return message.warning(errMsg)
        setOverView({})
      }
    } catch (error) {
      console.log(error)
    }
  }
  useRequest(getOverview, {
    refreshDeps:[projectId, areaId]
  })
 

  return (
  
    <Pagecount pd="0" bgcolor="none">
      <OverdataContext.Provider value={{lightdata: overview, projectId}}>
      <Mainbox>
      <div className="leftlayout">
        <Streetligth lightdata={overview}  />
        <MapCard lightdata={overview} projectId={projectId} />
      </div>
      <Details/>
      </Mainbox>
      </OverdataContext.Provider>
    </Pagecount> 
    );
}
