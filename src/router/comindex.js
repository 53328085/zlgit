import React, { useEffect, useState } from "react";
import { Layout } from "antd";
import { Outlet } from "react-router-dom";
import { useLocation } from "react-router-dom";
import Serach from "@com/useSerach/comhead";
import { useDispatch, useSelector } from "react-redux";
import {
  levelDefaultLabel,
  selectOneLevel,
  getOnelevel,
} from "@redux/systemconfig.js";
export default function Index() {
  const dispatch = useDispatch();
  const location = useLocation();
  let { state = {} } = location;
  let { nested = "", primary } = state;
  let whole = ["runtimeMonitor", "runtimeSafe", "runtimeEnergy", "runtimeStorage"]; // 需要显示搜索 ***（全部）的模块
  let include = {
    runtimeEnergy: ["area", "report"], // 模块里不需要显示全部的
    designerEnergy: ''
  };
  const onelevel = useSelector(selectOneLevel);
  const varlabel = useSelector(levelDefaultLabel);
  const [inpage, setInpage] = useState({
    runtimeMonitor: [
      "monitor",
      "gateway",
      "point",
      "camera",
      "remote",
      "control",
      "call",
    ], // 运行监控
    runtimeSafe: ["summary", "alarmDetail"], // 电气安全
    runtimeEnergy: [ // 能源管理
      "area",
      "assorting",
      "range",
      "time",
      "report",
      "direction",
      "analysis",
      "norm",
      "public",
      "air",
      "grading",
      "light",
      "region",
    ], 
    runtimeStorage: [ // 储能管理
      "station",
      "PCSMonitor", // pcs监控     
     // "BMSMonitor",
     "storageControl",
     "consumeStatistics",
     "earningsStatistics",
     "chargingOrder",
     "environment",
     "alarmMessage",
     "operationLog",
    ], 
    runtimeCarbon: [ // 碳排管理
       "summary",
       "examining",
       "manager",
       "analysis",
    ],

    // 设计态
    designerEnergy: [ // 能源管理
       "price",
       "norm",
       "type",
    ]
  }); // 需要显示搜索的页面

  const [showRoom, setShowroom] = useState(true); // 是否显示配电房选择框

  const [exparams, setexparams] = useState({ deviceStyle: 1 });
  const [config, setConfig] = useState({});
  const [custview, setCustview] = useState(undefined);
  let showSerach = inpage[primary]?.includes(nested);
  let style = showSerach
    ? {
        flex: 1,
        display: "grid",
        gridTemplateRows: "48px 1fr",
        rowGap: "16px",
      }
    : {
        display: "flex",
        flex: 1,
      };
  const context = {
    setInpage,
    setShowroom,
    setConfig,
    exparams,
    setCustview,
  };
  const props = {
    config,
    setexparams,
    custview,
  };

  const sethandler = () => {
    try {
      if (primary == "runtimeMonitor" && nested == "point") {
        if (!config.isdevsty) setConfig({ isdevsty: true });
      } else {
        setConfig({ isdevsty: false });
      }
      if (primary == "runtimeEnergy") {
        switch (nested) {
          case "area":
          case "assorting":      
            setConfig({ isview: true, isdate: true });
            break;
          case "range":
            setConfig({ energytype: true, isdate: true });
            break;
          case "time":
            setConfig({ shiftNo: true, isdate: true }); // shiftNo: true 不显示
            break;
          case "report":
            setConfig({
              energytype: true,
              isdate: true,
              shiftNo: true,
              gas: false,
            });
            break;
          case "direction":
            setConfig({
              energytype: true,
              isdate: true,
              shiftNo: true,
              isAreaId: false,
              gas: false,
            });
            break;
          case "analysis":
            setConfig({ energytype: true, isdate: true });
            break;
          case "norm":
            setConfig({});
            break;
          case "public":
            setConfig({ energytype: true, isdate: true });
            break;
          case "air":
          case "grading":
          case "light":     
            setConfig({ isview: true, isdate: true, shiftNo: true });
            break;
           case "region":     
            setConfig({ energytype: true, isdate: true, shiftNo: true, gas: false, });
            break;  
          default:
            setConfig({});
            break;
        }
      }
      if(primary == "runtimeStorage") {
         switch(nested) {
           case "PCSMonitor":
            setConfig({ isSite: true, isTank: true,  isPcs: true});
            break; 
           /*  case "BMSMonitor":
              setConfig({ isSite: true});
              break;   */
           case "storageControl":
            setConfig({ isSite: true, isPcs: true});
            break;           
            case "earningsStatistics":
            case "environment":
            case "consumeStatistics":  
            case "station":
            case "alarmMessage":
            case "operationLog":
                setConfig({ isSite: true});
                break;   
            default:
              setConfig({});
              break;
         }
      }
      if(primary == "runtimeCarbon") {
        switch(nested) {
          case "examining":
           setConfig({ dateY: true });
           break;
         case "analysis":
           setConfig({ dateR: true });
           break;
        }
      }
      // 设计态
      if(primary == "designerEnergy") {
        switch(nested) {
          case "norm":
           setConfig({ custview: true });
           break;
        }
         
      }
      // custview
    } catch (error) {}
  };

  useEffect(() => {
    console.log(123)
    if (whole.includes(primary)) {
      let isin = onelevel.find((l) => l.id == 0);
      if (!isin)
        dispatch(
          getOnelevel([
            { name: `${varlabel}(全部)`, id: 0, levelName: varlabel },
            ...onelevel,
          ])
        );
    } else {
      let level = onelevel.filter((l) => l.id != 0);
      console.log(level)
      dispatch(getOnelevel([...level]));
    }
  }, [primary]);

  useEffect(() => {
    sethandler();
  }, [nested, primary]);
  const { Content } = Layout;
  return (
    <Content className="page--main">
      <div style={style}>
        {showSerach && <Serach {...props} />}
        <Outlet context={context} />
      </div>
    </Content>
  );
}
