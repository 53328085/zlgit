import React, { useEffect, useState, useMemo } from "react";
import { Layout } from "antd";
import { Outlet } from "react-router-dom";
import { useLocation } from "react-router-dom";
import Serach from "@com/useSerach/comhead";
import { useDispatch, useSelector } from "react-redux";
import {
  levelDefaultLabel,
  selectOneLevel,
  getOnelevel,
  enterprise,
  selectProjectId,
  setCurrentlevel,
  iszhCN
} from "@redux/systemconfig.js";
export default function Index() {
  const dispatch = useDispatch();
  const location = useLocation();
  let { state = {} } = location;
  let { nested = "", primary, meterType } = state; // meterType 从运行监控 =》 运行监控 跳转到 运行监控-》 设备管理
 
  let whole = ["runtimeMonitor", "runtimeSafe", "runtimeEnergy", "runtimeStorage", "runtimeMaintenance"]; // 需要显示搜索 ***（全部）的模块
  let include = {
    runtimeEnergy: ["area", "report"], // 模块里不需要显示全部的
    designerDistribution: ['room']
  };
  const onelevel = useSelector(selectOneLevel);
  const varlabel = useSelector(levelDefaultLabel);
  const projectId = useSelector(selectProjectId)
  const iszh = useSelector(iszhCN)
  const { enterpriseId } = useSelector(enterprise)
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
    runtimeMaintenance: [ // 运维管理
      "summary",
      "alarm",
      "order",
      "inspection",
      "class",
      "chart"
    ],
    /*    runtimeQuota: [
         "runtimeParkQuota", //园区是专门的接口
         "runtimeQuotaDetailed",
        "runtimeQuotaAlarms"
       ], */
    // 设计态
    designerEnergy: [ // 能源管理
      "price",
      "norm",
      "type", "energyRank"
    ],
    runtimeCarbonEmissionManager: [  //碳排管理
      "runtimeCarbonData",
      "runtimeCarbonExamine",
    ],
    ledger: [  //台账管理
      "deviceLedger",
      "spareParts", "ledgerManagement", "spareParts"
    ],
    lightManagement: [  // 照明控制
      "streetLightEnergyMonitor",
      "lightControl",
    ]
  }); // 需要显示搜索的页面

  const [showRoom, setShowroom] = useState(true); // 是否显示配电房选择框

  // const [exparams, setexparams] = useState({ deviceStyle: 1 });
  const [exparams, setexparams] = useState({});
  const [areaName, setAreaName] = useState()
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
  const context = useMemo(() => ({
    setInpage,
    setShowroom,
    setConfig,
    exparams,
    setCustview,
    areaName,
    enterpriseId,
    projectId,
    iszh,
  }), [exparams, areaName, enterpriseId, projectId, iszh]);
  const props = {
    config,
    setexparams,
    custview,
    setAreaName,
  };

  const sethandler = () => {
    try {
      
      if (primary == "runtimeMonitor" && nested == "point") {
        if (!config.isdevsty) setConfig({ isdevsty: true, meterType });
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
            setConfig({ energytype: false, isdate: false, custview: true, isAreaId: false, });
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
              custview: true,
            });
            break;
          case "direction":
            setConfig({
              energytype: true,
              isdate: true,
              shiftNo: true,
              isAreaId: false,
              gas: false,
              custview: true,
            });
            break;
          case "analysis":
            setConfig({ energytype: true, isdate: true });
            break;
          case "norm":
            setConfig({ custview: true });
            break;
          case "public":
            setConfig({ energytype: true, isdate: true,  isdaterange:true });
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
      if (primary == "runtimeStorage") {
        switch (nested) {
          case "PCSMonitor":
            setConfig({ isSite: true, isTank: true, isPcs: true });
            break;
          /*  case "BMSMonitor":
             setConfig({ isSite: true});
             break;   */
          case "storageControl":
            setConfig({ isSite: true, isPcs: true });
            break;
          case "earningsStatistics":
          case "environment":
          case "consumeStatistics":
          case "station":
          case "alarmMessage":
          case "operationLog":
            setConfig({ isSite: true });
            break;
          default:
            setConfig({});
            break;
        }
      }

      if (primary == "runtimeCarbonEmissionManager") {
        switch (nested) {
          case "runtimeCarbonExamine":
            setConfig({ isAreaId: false, dateY: true });
            break;
          case "runtimeCarbonData":
            setConfig({ isAreaId: false, isdate: true, shiftNo: true, dateType: 2, daterang: "week" });
            break;
        }
      }
      if (primary == "ledger") {
        switch (nested) {
          case "deviceLedger":
            setConfig({ custview: false });
            break;
          case "spareParts":
            setConfig({ custview: true, isAreaId: true });
            break;
          case "ledgerManagement":
            setConfig({ custview: false });
            break;
          case "spareParts":
            setConfig({ custview: false });
            break;
        }
      }
      if (primary == "runtimeMaintenance") {

        setConfig({});
      }else if(primary == "cabinets") {
        setConfig({})
      }else if(primary == "lightManagement") {
        switch(nested) {
          case "streetLightEnergyMonitor" :
            setConfig({isdate: true, shiftNo: true})
            break
         case "lightControl":
              setConfig({ isview: true, isdate: true, shiftNo: true });
              break;
        }
      }
      /*  if (primary == "runtimeQuota") {
         switch (nested) {
           case "runtimeQuotaDetailed":
             setConfig({ custview: true });
             break;
           case "runtimeQuotaAlarms":
             setConfig({ custview: true });
             break;
         }
 
       } */
      // 设计态
      if (primary == "designerEnergy") {
        switch (nested) {
          case "norm":
            setConfig({ custview: true });
            break;
          case "energyRank":
            setConfig({ isAreaId: false, custview: true });
            break;
            case "energy":
            setConfig({  custview: true });
            break;
        }

      }

      // custview
    } catch (error) { }
  };

  useEffect(() => {
    if (whole.includes(primary)) {
      let isin = onelevel.find((l) => l.id == 0);
      if (!isin) {
        dispatch(
          getOnelevel([
            { name: `${varlabel}(全部)`, id: 0, levelName: varlabel },
            ...onelevel,
          ])
        );
        dispatch(setCurrentlevel({ name: `${varlabel}(全部)`, id: 0, levelName: varlabel }))
      }
    } else {
      let level = onelevel.filter((l) => l.id != 0);
      dispatch(setCurrentlevel(level?.[0]))
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
