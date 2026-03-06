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
  let { nested = "", primary, meterType } = state??{}; // meterType 从运行监控 =》 运行监控 跳转到 运行监控-》 设备管理

  let whole = ["runtimeMonitor", "runtimeSafe", "runtimeEnergy", "runtimeStorage", "runtimeMaintenance", "runtimeSolar", "designerSolar"]; // 需要显示搜索 ***（全部）的模块
  let include =useMemo(() => { // 需要显示搜索 ***（全部）的页面
   let nesteds = {
      [primary]:[""]
    }[primary] || []
    return  nesteds.includes(nested) ? {} : false
  }, [primary, nested]);

  console.log("include",include)

  let includemodule=useMemo(() => {  // 需要显示搜索 ***（全部）的模块中排除的页面
    let primaries = {
      runtimeEnergy:[nested]
    }[primary]

    return  Array.isArray(primaries) ? primaries.includes("summary") : false
  }, [primary, nested]);
  console.log("includemodule",includemodule)

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
      "summary",
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
      "comm",
      'timePeriodEnergy'
    ],
    runtimeStorage: [ // 储能管理
      "storageOverview",
      "cabinetMonitor",
      "pCSMonitor",
      "bMSMonitor",
      "ENVMonitor",
      "earningsStatistics",
      "alarmMessage",
      "operationLog",
     // "storageReport",
    ],
    runtimeMaintenance: [ // 运维管理
      "summary",
      "alarm",
      "order",
      "inspection",
      "class",
      "chart"
    ],
    runtimeSolar: [//光伏发电
      "stationTopo",
      "cabinetMonitor",
      "inverterMonitor",
      "statistic",
      "warning",
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
      "energy",
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
    //  "streetLightEnergyMonitor",
      "lightControl",
   //   "streetLightDataReport",

    ],
    streetLightManagement: [ // 照明控制 设置态
      "streetLightLineConfig",
    ],
    designerSolar: [//光伏发电
      "station",
      "inverter"
    ],
    storage:[
      'storageDevice',
      'storageEnvironment'
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
      gridTemplateRows: "auto 1fr",
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
      console.log(primary)
      if (primary == "runtimeMonitor") {
        switch(nested) {
          case "point":
          setConfig({ isdevsty: true, meterType })
          break;
          default:
            setConfig({ isdevsty: false });
        }
      }  
      if (primary == "runtimeEnergy") {   //issubarea
        switch (nested) {
          case "summary":
            setConfig({ isdate: true,shiftNo: true });
            break;
          case "area":
            setConfig({ isview: true, publicDate: true, shiftNo:false, rangeDate:45 });
            break;
          case "assorting":
            setConfig({ isview: true, isdate: true, shiftNo:false , issubarea:true});
            break;
          case "range":
            setConfig({ energytype: false, isdate: false, custview: true, isAreaId: false, });
            break;
          case "comm":
            setConfig({ shiftNo: true });
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
            setConfig({ energytype: true, shiftNo: true, publicDate: true, formsty: { justifyContent: "flex-start", columnGap: "16px" } });
            break;
          case "air":
          case "grading":
          case "light":
            setConfig({ isview: true, isdate: true, shiftNo: true });
            break;
          case "region":
            setConfig({ energytype: true, isdate: true, shiftNo: true, gas: false, isAreaId:false,isLevles:true });
            break;
          case "timePeriodEnergy":
            setConfig({ isdate: true , shiftNo: true });
            break;
          default:
            setConfig({});
            break;
        }
      }
      if (primary == "runtimeStorage") {
        switch (nested) {
          case "cabinetMonitor":
            setConfig({ isSite: true, isTank: true, isPcs: false });
            break;
          case "pCSMonitor":
            setConfig({ isSite: true, isTank: true, isPcs: true });
            break;
          case "bMSMonitor":
            setConfig({ isSite: true, isTank: true, isBms: true });
            break;
          case "earningsStatistics":
            setConfig({ isSite: true, isdate: true,shiftNo: true });
            break;
          case "alarmMessage":  //definedaterange
          setConfig({ isSite: true, definedaterange: true  });
          break;
          case "ENVMonitor":
          case "storageOverview":
          case "operationLog":
          case "storageReport":
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
      } else if (primary == "cabinets") {
        setConfig({})
      } else if (primary == "lightManagement") {
        switch (nested) {
          case "lightControl":
            setConfig({ isview: true, isdate: true, shiftNo: true });
            break;
         /*  case "streetLightDataReport":
            setConfig({ isview: false, isdate: true, shiftNo: true });
            break; */
        }

      }
      else if (primary == "runtimeSolar") {
        switch (nested) {
          case "cabinetMonitor":
            setConfig({ refresh: true, cabinet: true, photovoltaicPowerStation: true })
            break
          case "inverterMonitor":
            setConfig({ refresh: true, cabinet: true, inverter: true, photovoltaicPowerStation: true });
            break;
          case "statistic":
            setConfig({ isdate: true,   shiftNo: true, photovoltaicPowerStation: false, inverter: false });
            break;
          case "warning":
            setConfig({ dateR: true, cabinet: false, shiftNo: true, photovoltaicPowerStation: true, inverter: false });
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
            setConfig({ custview: true });
            break;
        }

      } else if (primary == "streetLightManagement") {
        switch (nested) {
          case "streetLightLineConfig":
            setConfig({});
            break;
          default:
            break;
        }
      } else if (primary == "designerSolar") {
        switch (nested) {
          case "station":
            setConfig({ custview: true });
            break;
          case "inverter":
            setConfig({ custview: true });
            break;
        }
      }else if(primary == "storage"){
        switch (nested) {
          case 'storageDevice':
            setConfig({ isSite: true, isTank: true });
            break;
          case 'storageEnvironment':
            setConfig({ isSite: true, isTank: true });
            break;
        }
      }

      // custview
    } catch (error) { }
  };

  useEffect(() => {
    if ((whole.includes(primary) && !includemodule) || include) {
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
      console.log("不需要添加全部")
      let level = onelevel.filter((l) => l.id != 0);
      dispatch(setCurrentlevel(level?.[0]))
      dispatch(getOnelevel([...level]));
    }
  }, [primary,include,includemodule]);

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
