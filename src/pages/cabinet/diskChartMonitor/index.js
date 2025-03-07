import React, { useEffect, useState, useRef, useMemo } from "react";
import moment from "moment";
import { useSelector } from "react-redux";
import {useReactive} from 'ahooks'
import mqtt from 'mqtt'
import {
  Form,
  Image,
  message,
  Progress,
  Button,
  InputNumber,
  Select,
  Space,
  Input,
  DatePicker,
  Typography,
  Drawer,
  Descriptions,
  Timeline,
  
} from "antd";
import Pagecount from "@com/pagecontent";
import { CloseOutlined } from "@ant-design/icons";
import { isObject } from "@com/usehandler";
import {
  CustLink,
  i18t,
  i18warning,
  CustButton,
  CustButtonT,
  ConfirmBtn,
   
} from "@com/useButton";
import styled, { css } from "styled-components";

import { Radiogroup, Cdivider } from "@com/comstyled";
import {  adaptation } from "@redux/systemconfig";
 import { DiskChart } from "@api/api.js";
import Titlelayout from "@com/titlelayout";
import Custmodal from "@com/useModal";
import imgsrc from "./imgs";
import Ichart from "@com/useEcharts/Ichart";

import Usetable from "@com/useTable";

import temp from "./imgs/temp.png";
import Info from "./info";
import Electric from "./electric";
import RomoteRegulatin from './romoteRegulating' // 遥调 框架断路器  NA8-2500-2500H
import RomoteRegulatinB from './romoteRegulatingb'
import Sensor from './sensor' // 温度传感器、烟感，浪涌，水浸
import {
  Okt,
  Extrea,
  Mainbox, 
  DDrawer,
  Dot,
   IDrawer,
  
} from './comstyle'
import {Cspin} from "@com/comstyled"
const { Link, Text, Title } = Typography;
const { Item } = Descriptions;
const { RangePicker } = DatePicker;
const { TextArea } = Input;
const {QueryDeviceDataAll,QueryDevicesDataAll,DoOpenClose,QueryServiceResult,QueryDevicePointTrend,GetHMIHeart,QueryMqtt} =DiskChart
const getTemp = (arr) => {
   console.log(arr)
   if(Array.isArray(arr) && arr?.length> 0) {
     return arr.find(a => a.Name=="Temp")?.value
   }else {
    return ''
   }
}
const getState = (arr) => {
  console.log("getState", arr)
  if(Array.isArray(arr) && arr?.length > 0){
    return arr.find(a => a.Name=="BrokerStatus")?.Value
  }else{
    return NaN;
  }
}
const BreakerS = (arr) => {
   let state = parseInt(getState(arr))
  return (
    <div className="state">
            {
              state == 0 ? // 合闸
              <>
              <img src={imgsrc["red"]}></img>
              <img src={imgsrc["close"]}></img>
              </>
              : state == 32 ?
              <>
              <img src={imgsrc["close"]}></img>
              <img src={imgsrc["green"]}></img>
             </>
              : <>
                  <img src={imgsrc["close"]}></img>
                  <img src={imgsrc["close"]}></img>
              </>
            }   
     </div>
  )
}
const getiaData = (arr) => {
   
  if(Array.isArray(arr) && arr?.length > 0) {
    let item =  arr.find(a => a.Name=="Ia");
     
    return item?.Value + item?.Unit
  }else {
    return ''
  }
}

const BreakerSt = ({state}) => {
   
 return (
   <div className="state">
           {
             state == 0 ? // 合闸
             <>
             <img src={imgsrc["red"]}></img>
             <img src={imgsrc["close"]}></img>
             </>
            
             : state == 32 ?
             <>
              <img src={imgsrc["close"]}></img>
              <img src={imgsrc["green"]}></img>
             </>
             : <>
                 <img src={imgsrc["close"]}></img>
                 <img src={imgsrc["close"]}></img>
             </>
           }   
    </div>
 )
}
const Shownum = ({value}) => {
   return( 
    <div className="nums">
    <span className="type">1a</span>
    <Text>{value}</Text>
     </div>
   )


}

const GetIa =({sn})=> {
  const [values, setValue] =useState({})
  const getData =async () => {
    try {
      let {response} = await QueryDeviceDataAll(sn)
      let {success, data} = response ||{}
       
      if(success && Array.isArray(data) && data?.length > 0) {
        let item =  data.find(a => a.name=="Ia");
         let stateitem = data.find(a => a.name =="BrokerStatus") 
         setValue({
          value: item?.value + item?.unit,
          state: parseInt(stateitem?.value),
          unit: item?.unit
         })
      }
    } catch (error) {
      
    }
     
  }
  useEffect(()=> {
    let timerid=null
    if(sn) {
    timerid =setInterval(()=> {
        getData(sn)
      }, [30000])
     
    }
   return ()=> {
      clearInterval(timerid)
    }
  }, [sn])
   
  return (
    <>
     <Shownum value={values.value} unit={values.unit} />
     <BreakerSt state={values.state}  />
  </>
  )
}
const getValue =(data, name)=>{
   let item = data?.find?.(d=> d.name==name);
   let value =Number.isFinite(parseFloat(item?.value)) ?  item?.value+item?.unit : '' ;
   return [value, item?.unit]
}

const GetP1 =({sn}) => {
 
  const [values, setValue] =useState({})
  const [state] = getValue(values, "BrokerStatus")
  console.log("getp1", state)
  const getData =async (sn) => {
    try {
 
      let {response} = await QueryDeviceDataAll(sn)
      let {success, data} = response ||{}
      
      if(success && Array.isArray(data) && data?.length > 0) {   
         setValue(data)
      }
    } catch (error) { 
    }
     
  }
  useEffect(()=> {
    let timerid=null
    if(sn) {
    timerid =setInterval(()=> {
        getData(sn)
      }, [30000])
     
    }
  return ()=> {
      clearInterval(timerid)
    }
  },[sn])

  return (
    <>
    <BreakerSt state={state} />
    </>
    
  )
}


const GetHead = ({sn, ck}) => {
  const [values, setValue] =useState({})
  let [value, unit] = getValue(values,"Temp")

  const getData =async (sn) => {

    try {
 
      let {response} = await QueryDeviceDataAll(sn)
      let {success, data} = response ||{}
      
      if(success && Array.isArray(data) && data?.length > 0) {   
         setValue(data)
      }
    } catch (error) { 
    }
     
  }
  useEffect(()=> {
    let timerid=null
    if(sn) {
    timerid =setInterval(()=> {
        getData(sn)
      }, [30000])
     
    }
  return ()=> {
      clearInterval(timerid)
    }
  },[sn])
  return (
    <div className="title" onClick={ck} key="title">
    <Link>
      <img src={temp} alt="" />
       温度  {value}
    {/*   {value} */}
      {/* {getTemp(NTD30S119328)} */}
    </Link>
    
    <CustLink
      text="details"
      underline={false} 
    ></CustLink> 
  </div>
  )
}
const GetP4 =({sn, ck1, ck2}) => {
 
  const [values, setValue] =useState({})
  let DI = ["DigitalInstatus1","DigitalInstatus2","DigitalInstatus3"]
  let dival = values?.find?.(d =>  DI.includes(d.name) && d.value==1)?.name
  let [value, unit] = getValue(values,"Ia")
  let [temp] = getValue(values,"TempInA") 
  
  let text={
    DigitalInstatus1: "red",
    DigitalInstatus2: "green",
    DigitalInstatus3: "close"
  }[dival]
  let bashou={
     DigitalInstatus1: "B正常",
     DigitalInstatus2: "B分闸",
     DigitalInstatus3: "B故障"
 
  } [dival]

    


  //const {value, text, bashou, temp} = values
  const imgn = imgsrc[`${text}`]
  const imgbs = imgsrc[`${bashou}`]
  const getData =async (sn) => {
    try {
 
      let {response} = await QueryDeviceDataAll(sn)
      let {success, data} = response ||{}
      
      if(success && Array.isArray(data) && data?.length > 0) {   
         setValue(data)
      }
    } catch (error) { 
    }
     
  }
  useEffect(()=> {
    let timerid=null
    if(sn) {
    timerid =setInterval(()=> {
        getData(sn)
      }, [30000])
     
    }
  return ()=> {
      clearInterval(timerid)
    }
  },[sn])

  return (
    <div className="loop1" >  
    <div className="loopbashou" onClick={ck1}>
      <img
        src={imgbs}
      ></img>
    </div>

    <img
      className="state4"
      src={imgn}
    ></img>

    <div className="nums" onClick={ck2}>
      <span className="type">{unit}</span>
      <Text>{value}</Text>
      <Text>{temp}</Text>
    </div>
  
</div>
  )
}
const GetP42 =({sn, ck1, ck2}) => {
 
  const [values, setValue] =useState({})
  let DI = ["DigitalInstatus1","DigitalInstatus2","DigitalInstatus3"]
  let dival = values?.find?.(d =>  DI.includes(d.name) && d.value==1)?.name
  let [value, unit] = getValue(values,"Ia")
  let [temp] = getValue(values,"TempInA") 
  let text={
    DigitalInstatus1: "red",
    DigitalInstatus2: "green",
    DigitalInstatus3: "close"
  }[dival]
  let bashou={
     DigitalInstatus1: "B正常",
     DigitalInstatus2: "B分闸",
     DigitalInstatus3: "B故障"
 
  } [dival]

    


  //const {value, text, bashou, temp} = values
  const imgn = imgsrc[`${text}`]
  const imgbs = imgsrc[`${bashou}`]
  const getData =async (sn) => {
    try {
 
      let {response} = await QueryDeviceDataAll(sn)
      let {success, data} = response ||{}
      
      if(success && Array.isArray(data) && data?.length > 0) {   
         setValue(data)
      }
    } catch (error) { 
    }
     
  }
  useEffect(()=> {
    let timerid=null
    if(sn) {
    timerid =setInterval(()=> {
        getData(sn)
      }, [30000])
     
    }
   return  ()=> {
      clearInterval(timerid)
    }
  },[sn])

  

  return (
    <div className="loop2" > 
    <div className="loopbashou" onClick={ck1}>
      <img  src={imgbs}></img>
    </div>
    <div className="state42">
      <img
        src={imgn }
      ></img>
      <div className="nums" onClick={ck2}>
        <span className="type">{unit}</span>
        <Text>{value}</Text>
        <Text>{temp}</Text>
      </div>
    </div>
  </div>
  )
}

const GetP43 =({sn, ck1, ck2}) => {
 
  const [values, setValue] =useState({})
  let DI = ["DigitalInstatus1","DigitalInstatus2","DigitalInstatus3"]
  let dival = values?.find?.(d =>  DI.includes(d.name) && d.value==1)?.name
  let [value, unit] = getValue(values,"Ia")
  let [temp] = getValue(values,"TempInA") 
  let text={
    DigitalInstatus1: "red",
    DigitalInstatus2: "green",
    DigitalInstatus3: "close"
  }[dival] 
  //const {value, text, bashou, temp} = values
  const imgn = imgsrc[`${text}`]
 
  const getData =async (sn) => {
    try {
 
      let {response} = await QueryDeviceDataAll(sn)
      let {success, data} = response ||{}
      
      if(success && Array.isArray(data) && data?.length > 0) {   
         setValue(data)
      }
    } catch (error) { 
    }
     
  }
  useEffect(()=> {
    let timerid=null
    if(sn) {
    timerid =setInterval(()=> {
        getData(sn)
      }, [30000])
     
    }
   return  ()=> {
      clearInterval(timerid)
    }
  },[sn])

  

  return (
    <div className="loop3">
              <div className="loop3left"></div>
              <div className="state42">
                <img
                  src={imgn                 }
                ></img>
                <div className="nums" onClick={ck2}>
                  <span className="type">{unit}</span>
                  <Text>{value}</Text>
                  <Text>{temp}</Text>
                </div>
              </div>
              </div>
  )
}
/* 月，年。没有日 */
export default function Index() {
  const { laptop } = useSelector(adaptation);
  const [initval, setInitval] = useState({})
  const [copen, setCopen] = useState(false);
  const [iopen, setIopen] = useState(false);
  const [elopen, setElopen] = useState(false);
 
  const [eltitle, setEltitle] = useState(""); // 遥测 图表的标题
  const [state, setState] = useState(1); // 1 分闸2故障3正常
  const [iform] = Form.useForm()
  const [snapshot, setSnapshot] = useState([]) // 设备快照
  const [deviceData, setDeviceData] = useState([])
  const [runtimedata, setRuntimedata] = useState({})
  const [sensor, setSensor] = useState(null)
  const [deviceInfo, setDeviceInfo] =useState({
    deviceName: "", // 设备名称
    deviceType: 1, // 1: 框架断路器 2：塑壳断路器
   
  })
  let {NTD30S119328, NA5202522401,NTD30S119325, NTD30S119301,NA5202522402,NA5202522403,NA5202522404,   
    NTD30S119322,
    NTCJ20012241,NTCJ20012242,NTCJ20012243,NTCJ20012244,      
    NTCJ00122401,NTCJ00122402,NTCJ00122403,
   NTCJ00122404,PD6662555504} = runtimedata || {}
  console.log(runtimedata)
  const {part} = deviceInfo;
  const [swstate,setSwstate] = useState({})
  const [rState, setRstate] = useState(1);
  const [rsucs, setRsucs] = useState()
  const modal = useRef();
  const onControl = () => {
    modal.current.onOpen();
  };
  const onCopen = () => {
    setCopen(true);
  };
 
  const sref=useRef()
  const displaySensor=(type)=> { // 显示传感器弹窗
     sref.current.onOpen(type)
  }
  
 const getInitVal = async ()=> { // 获取初始数据
    try {
       // p1 温度
       // p1 分合闸


      let promises = [QueryDevicesDataAll(['NTD30S119328']),QueryDeviceDataAll("NA5202522401") ]
       const initData = await  QueryDevicesDataAll([
          'NTD30S119328', // p1 温度
          "NA5202522401",
          "NTD30S119325", // p2 温度
          "NTD30S119301", // p3 温度
          "NA5202522402","NA5202522403","NA5202522404",   
           "NTD30S119322", // p4 温度
          "NTCJ20012241","NTCJ20012242","NTCJ20012243","NTCJ20012244",      
          "NTCJ00122401","NTCJ00122402","NTCJ00122403",
          "NTCJ00122404","PD6662555504"
        ])
        console.log(initData)
     // let allData = await Promise.allSettled(promises);
     // let p1={}
      
     /*  allData.forEach(d => {
        let {status, value} = d
        let {success, data} = value || {}
        if(status=="fulfilled" && success && Array.isArray(data)&& data?.length > 0){

        }


      }) */
      
    } catch (error) {
      
    }
     


 }
// mqtt 获取数据
const ahstate = useReactive({
   
  guid:'',
  timer:null,
})
const sns =[
  'NTD30S119328', // p1 温度
  "NA5202522401",
  "NTD30S119325", // p2 温度
  "NTD30S119301", // p3 温度
  "NA5202522402","NA5202522403","NA5202522404",   
   "NTD30S119322", // p4 温度
  "NTCJ20012241","NTCJ20012242","NTCJ20012243","NTCJ20012244",      
  "NTCJ00122401","NTCJ00122402","NTCJ00122403",
  "NTCJ00122404","PD6662555504"
]
const S4 = () => {
  return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
}
// const guid = () => {
//     return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
// }



const getMqtt = (server, topic) => {
  let options = {
      clientId: "HMI_" + ahstate.guid,
      username: "",
      password: "",
  }
  ahstate.client = mqtt.connect('ws://101.133.168.242:9211/wshmi', options)
  ahstate.client.on("connect", e => {
    ahstate.client.subscribe(
          "ws/hmi/runtime",
          { qos: 0 },
          (error) => {
              if (!error) {
                  console.log("订阅成功");
                    getHeart();
              } else {
                  console.log("订阅失败");
              }
          }
      )
  })

  // 接收消息处理
  ahstate.client.on("message", (topic, message) => {
    
      let mqttData = JSON.parse(message.toString());
      if(mqttData?.SN) {
        setRuntimedata({
          ...runtimedata,
          [mqttData.SN]: mqttData.Points
        })
      }
     
      console.log('接所消息', mqttData)
      /* if ( mqttData.SN &&  mqttData.SN == 'NA5202522401') {
          state.incoming = mqttData.Points
      }
      if ( mqttData.SN &&  mqttData.SN == 'NXW202522201') {
          state.filtering = mqttData.Points
      }
      if (mqttData.SN &&  mqttData.SN == 'NA5202522402') {
          state.feederLine1 = mqttData.Points
      }
      if (mqttData.SN &&  mqttData.SN == 'NA5202522403') {
          state.feederLine2 = mqttData.Points
      }
      if (mqttData.SN &&  mqttData.SN == 'NA5202522404') {
          state.feederLine3 = mqttData.Points
      }
      if (mqttData.SN &&  mqttData.SN == 'NTCJ20012241') {
          state.loopLine1 = mqttData.Points
      }
      if (mqttData.SN &&  mqttData.SN == 'NTCJ20012242') {
          state.loopLine2 = mqttData.Points
      }
      if (mqttData.SN &&  mqttData.SN == 'NTCJ20012243') {
          state.loopLine3 = mqttData.Points
      }
      if (mqttData.SN &&  mqttData.SN == 'NTCJ20012244') {
          state.loopLine4 = mqttData.Points
      }
      if (mqttData.SN &&  mqttData.SN == 'NTCJ00122401') {
          state.loopLine5 = mqttData.Points
      }
      if (mqttData.SN &&  mqttData.SN == 'NTCJ00122402') {
          state.loopLine6 = mqttData.Points
      }
      if (mqttData.SN &&  mqttData.SN == 'NTCJ00122403') {
          state.loopLine7 = mqttData.Points
      }
      if (mqttData.SN &&  mqttData.SN == 'NTCJ00122404') {
          state.loopLine8 = mqttData.Points
      }
      if ( mqttData.SN &&  mqttData.SN == 'PD6662555504') {
          state.loopLine9 = mqttData.Points
      } */
  });
  // 断开发起重连
  ahstate.client.on("reconnect", (error) => {
      console.log("正在重连:", error);
  });
  // 链接异常处理
  ahstate.client.on("error", (error) => {
      console.log("连接失败:", error);
  });
}

const getHeart = () => {
  let params = {
      clientId: "HMI_" + ahstate.guid,
      devSns: sns
  }
  GetHMIHeart(params).then(res => {
      if(res.success){
        ahstate.timer = setTimeout(() => {
              getHeart()
          }, 120000)
      }
  })
}

useEffect(() => {
/*   ahstate.guid = S4()
  QueryMqtt().then(res => {
      if(res.success){
          getMqtt(res.data.mqttServer, res.data.topic)
      }
  }) */

   
}, [])
// mqtt end
  let currparams = useRef()
  const queryDeviceDataAll =async ({name, devSn, type,supsn,breaker=true, part}) => {
   
      currparams.current={
        name,
        devSn,
        type,
        supsn,
        breaker,
         part
      }
      try {
       const sn = type==2 ? supsn : devSn
       if(!sn) return message.warning("缺少设备Sn")
       const {response  } = await QueryDeviceDataAll(sn)
       const  {success, data, message:msg} = response
     
       if(success && Array.isArray(data)) {
          
          let NAB8Sn = ["NA5202522401","NA5202522402","NA5202522403","NA5202522404"]
          let NTCJ2=["NTCJ20012241","NTCJ20012242","NTCJ20012243","NTCJ20012244","NTCJ00122401","NTCJ00122402","NTCJ00122403","NTCJ00122404","PD6662555504",] // 
          let NTCJ=[]
          let DI = ["DigitalInstatus1","DigitalInstatus2","DigitalInstatus3"]
          let value = data.find(d => d.name="BrokerStatus")?.value
          let a125=["NTCJ20012241","NTCJ20012242","NTCJ20012243","NTCJ20012244","NTCJ00122401"] // 125A
          let a250=["NTCJ00122402","NTCJ00122403"] // 250A
          let IA= ["NTCJ20012241","NTCJ20012242"].includes(devSn) ? "63A" : ["NTCJ20012243","NTCJ20012244"].includes(devSn) 
          ? "80A" : devSn=="NTCJ00122401" ? "125A" : devSn=="NTCJ00122402" ? "160A" :  devSn=="NTCJ00122403" ? "250A"  : devSn=="NTCJ00122404" ?  "400A" : devSn=="PD6662555504" ? "630A" : null;
          let protect= ["NTCJ20012241","NTCJ20012242","NTCJ20012243","NTCJ20012244","NTCJ00122401"].includes(devSn) ? "热磁式配电保护" : ["NTCJ00122402","NTCJ00122403","NTCJ00122404","PD6662555504",].includes(devSn) ? "电子式配电保护" :null
          let state = {
            32:"分闸",
            16: "故障",
            0: "合闸"
          }[value]
          let dival = data.find(d =>  DI.includes(d.name) && d.value==1)?.name
          let distate={
            DigitalInstatus1: "合闸",
            DigitalInstatus2: "分闸",
            DigitalInstatus3: "故障"
          }[dival]
          setDeviceInfo({
            deviceName:name,
            deviceType:type,
            devSn,
            breaker,
            state: state || distate,
            part,
            
          })

          if(NAB8Sn.includes(devSn)) {
            setSnapshot([
              {
              name: "断路器状态",
              value: state, 
              },
              {
                name: "故障脱扣次数",
                value: 0,
              },
              {
                name: "开关操作次数",
                value: 4,
              },
              {
                name: "额定电流",
                value:  part==1 ? "2500A" : part==3 ? "1600A" : ''
              }
          ])
          }else if(NTCJ2.includes(devSn)){
            setSnapshot([
              {
              name: "断路器状态",
              value: distate, 
              },
              {
                name: "核定电流",
                value: IA,
              },
              {
                name: "保护类型",
                value:  protect,
              }
          ])
          }else if(NTCJ.includes(devSn)){
            setSnapshot([
              {
              name: "设备状态",
              value: distate, 
              },
              {
                name: "额定电流",
                value: IA,
              },
              
          ])
          }

          setDeviceData(data.filter(d => d.name!="BrokerStatus")?.filter(d=>  d.name.indexOf("DigitalInstatus")==-1));
          onCopen()
         
       }else {
          // if(data===null) message.info("缺少数据");
         // !success && message.info(msg||"请求失败")
       }
       
      } catch (error) {
         console.log(error)
      
  }
}
  let timerId  = null;
  let count = 0;
const queryResult = async(params) => {
    try {
      let {success, data} = await QueryServiceResult(params)
      count++;
      if((success && data.state==0) || count > 9){
      
        setRstate(4)
        clearInterval(timerId)
        if(data.start == 0 ) {
          setRsucs(true)
          queryDeviceDataAll(currparams.current)
        }else {
          setRsucs(false)
        }
      } 
    } catch (error) {
      
    }
}
 const getResult= (params)=> { // 超过10次或超过15秒
    try {
      timerId=setInterval(()=> {
        queryResult(params)
      }, [1000])
    } catch (error) {
       console.log(error)
    } 
 }
 const doOpenClose =async ()=> {
    try {
      // operation 1 分闸 2 合闸
      if(deviceInfo.state=="故障") return;
      let {devSn} = deviceInfo
      if(!devSn) return message.warning("缺少设备Sn")    
      let params = {
        devSn,
        operation: deviceInfo.state=="合闸" ? 1 : deviceInfo.state=="分闸" ? 2 : 0
      }

     let {success, data,message:msg} = await DoOpenClose(params)
     if(success) {
      if(!data) return   // message.warning("缺少key")
        let post = {tm: moment().format("YYYY-MM-DD HH:mm:ss"),key:data}
        setRstate(3) 
        getResult(post)
        
     }else {
       // message.warning(msg)
     }
    } catch (e) {
       console.log(e)
    }
 }

 const [dates, setDates] = useState([moment().startOf("day"), moment()]);
 const [eldata, setEldata] = useState()




 

  const columns = [
    {
      title: "等级",
      dataIndex: "level",
      key: "level",
      render: (text) => {
        return text == 1 ? <Text type="danger">高危</Text> : null;
      },
    },
    {
      title: "发生时间",
      dataIndex: "startTime",
      key: "startTime",
    },
    {
      title: "报警类型",
      dataIndex: "alarmType",
      key: "alarmType",
    },
    {
      title: "状态",
      dataIndex: "state",
      key: "state",
      render: (text) => {
        // 1确认2未确认
        return (
          <Space>
            {text == 1 ? (
              <ConfirmBtn
                state={2}
                text="noconfirm"
                opac={0.2}
                onClick={() => setIopen(true)}
              />
            ) : (
              <ConfirmBtn state={1} text="confirm" opac={0.2} />
            )}
          </Space>
        );
      },
    },
  ];
  const dataSource ={
   1:[
    {
      level: "--",
      startTime: "--",
      alarmType: "无告警",
      state: '',
    }],
   2:[
    {
      level: "--",
      startTime: "--",
      alarmType: "无报警",
      state: 2,
    }],
    3:[
      {
        level: 1,
        startTime:  "2025-02-09 17:45:12",
        alarmType: "正泰展厅变电站P3柜水平母排温度超限",
        state: 2,
      }
    ],
    4: [
      {
        level: 1,
        startTime:  "2025-01-02 14:15:38",
        alarmType: "正泰展厅变电站P4柜回路1断路器异常分闸",
        state: 2,
      }
    ]

  }[part] 
/*    [
    {
      level: 1,
      startTime: moment().subtract(7, "days").format("yyyy-MM-DD HH:mm:ss"),
      alarmType: "温度超限",
      state: 2,
    },
    {
      level: 1,
      startTime: moment().subtract(27, "days").format("yyyy-MM-DD HH:mm:ss"),
      alarmType: "设备离线",
      state: 2,
    },
  ]; */

  let eloption = {
    // color: ["#ff7345","#6a6e88"],
    series: [
      { type: "line", seriesLayoutBy: "row" },
      { type: "line", seriesLayoutBy: "row" },
    ],
    grid: {
      right: 0,
      left: 0,
      top: "32px",
      bottom: 0,
      containLabel: true,
    },
    legend: {
      top: "0px",
      left: "16px",
    },
     xAxis: {
            axisLabel: {
              formatter: (value, index) => {
                return moment(value, "YYYY-MM-DD HH:mm:ss").format("HH:mm");
              },
              interval: "auto",
            },
          },
    yAxis: [
      {
        axisLabel: {
          formatter: "{value}V",
        },
      },
    ],
    dataset: {
      dimensions: ["x", eltitle],
      source: eldata,
      sourceHeader: false,
    },
  };

  // 自定义告警详情描述类别样式
  const descsty = {
    backgroundColor: "#e1f3e7",
    padding: "8px 16px",
  };
  // 表单项宽度


const disabledDate = (current) => { 
    return current && current > moment().endOf('day');
  };

  const Extra = ({ ist,  fn }) => {
    return (
      <Extrea ist={ist}>
        {ist && <RangePicker value={dates} onCalendarChange={onchangedate} disabledDate={disabledDate}  format="YYYY-MM-DD" />}
        <CloseOutlined onClick={fn} className="close" />
      </Extrea>
    );
  };
  let params =useRef({
    devSn: '',
    point: '',
    start: dates[0].format("YYYY-MM-DD")+" 00:00:00",
    end:dates[1].format("YYYY-MM-DD HH:mm:ss")
 })
  const getElData = async() => {
    let {success, data} =  await  QueryDevicePointTrend(params.current)
    if(success && Array.isArray(data) && data?.length>0) {
        let x = data.map(d => d.x)
        let y= data.map(d=> d.y)
        setEldata([x, y])
    }else{
      setEldata([])
    }
  }
  const onelchart = async ({desc, name}) => { // 点击遥测
    setEltitle(desc);
     params.current.devSn=deviceInfo.devSn
     params.current.point = name  
    await getElData()
    setElopen(true);
  };
  const onchangedate=(date)=> { // 选择时间
    setDates(date)
    setEldata(null)
    params.current.start=date[0].format("YYYY-MM-DD")+" 00:00:00"
    params.current.end = date[1].format("YYYY-MM-DD HH:mm:ss")
    getElData()
 }
  const onCloseMain = ()=> {
      console.log("elopen", elopen)
      if(!elopen){
        setCopen(false)
      }
  }

 

  const onOk = async () => {
    try {
      if (rState == 1) {
        setRstate(2);
      }else if(rState == 2){
        await iform.validateFields() 
        doOpenClose()
      }else if(rState==3 || rState == 4) {
        modal.current.onCancel();
      }
    } catch (error) {
      
    }

  };
  const onCancel=()=> {
    setRstate(1)
    modal.current.onCancel();
  }
  useEffect(()=> {
   // getInitVal()

  },[])
  return (
    <Pagecount  style={{alignItems: "center", backgroundColor: "transparent"}} >
      <Mainbox>
        <div className="part" key="part1">
          <GetHead sn="NTD30S119328" ck={()=>displaySensor(1)} />
         {/*  <div className="title" onClick={()=>displaySensor(1)} key="title">
            <Link>
              <img src={temp} alt="" />
              {getTemp(NTD30S119328)}
            </Link>
            
            <CustLink
              text="details"
              underline={false} 
            ></CustLink> 
          </div> */}
          <div className="h3d" key="prateh3d" >
            <div className="detail" onClick={()=>queryDeviceDataAll({name:"框架断路器  NA8-2500-2500H", type: 1,devSn:"NA5202522401", part: 1})}>
          <GetP1 sn="NA5202522401" />
            {/* <BreakerS arr={NA5202522401} /> */}
             {/*  <div className="state">
                <img src={imgsrc["red"]}></img>
                <img src={imgsrc["close"]}></img>
              </div> */}
            </div>
          </div>
        </div>
        <div className="part" key="part2">
          <GetHead  sn="NTD30S119325" ck={()=>displaySensor(2)} />
          {/* <div className="title" onClick={()=>displaySensor(2)}>
            <Link>
              <img src={temp} alt="" />
              {getTemp(NTD30S119325)}
            </Link>
            <CustLink text="details" underline={false}></CustLink>
          </div> */}
          <div className="bashou">
            <div className="imgbox">
           {/*  <img
              src={
                state == 1
                  ? imgsrc[`A分闸`]
                  : state == 2
                  ? imgsrc["A故障"]
                  : imgsrc["A正常"]
              }
            ></img> */}
            <img
              src={imgsrc[`A正常`]}
            ></img>
            </div>
           
          </div> 
         
          <div className="guis" >
            <div className="guisimg"  onClick={()=>queryDeviceDataAll({name:"电能质量功率单元 NXWAPF N", devSn:"NXW202522201", breaker:false, part:2})}></div>
          </div>
        </div>
        <div className="part" key="part3">
        <GetHead  sn="NTD30S119301" ck={()=>displaySensor(3)} />
          {/* <div className="title" onClick={()=>displaySensor(3)}>
            <Link  >
              <img src={temp} alt="" />
              {getTemp(NTD30S119301)}
            </Link>
            <CustLink text="details" underline={false}></CustLink>
          </div> */}
          <div className="kuixians">
            <div className="kuixian" >
            <div className="values" onClick={()=>queryDeviceDataAll({name:"数显多功能表 PD666", devSn: "NA5202522402", part:3})}>
            {/* <div className="nums">
              <span className="type">1a</span>
              <Text>25.3A</Text>
              
            </div> */}
            <GetIa sn="NA5202522402" />
            {/* <div className="state">
              <img src={imgsrc["red"]}></img>
              <img src={imgsrc["close"]}></img>
            </div> */}
          </div>
          <div className="guizhi" onClick={()=>queryDeviceDataAll({name:"框架断路器  NA8", devSn: "NA5202522402", part:3})}>
            
          </div>
            </div>
            <div className="kuixian" >
            <div className="values" onClick={()=>queryDeviceDataAll({name:"数显多功能表 PD666", devSn: "NA5202522403", part:3})}>
           {/*  <div className="nums">
              <span className="type">1a</span>
              <Text>25.3A</Text>
              <Text>48.2°C</Text>
            </div>
            <div className="state">
              <img src={imgsrc["red"]}></img>
              <img src={imgsrc["close"]}></img>
            </div> */}
            <GetIa sn="NA5202522403" />
          </div>
          <div className="guizhi" onClick={()=>queryDeviceDataAll({name:"框架断路器  NA8", devSn: "NA5202522403", part:3})}>
            
          </div>
            </div>
            <div className="kuixian" >
            <div className="values" onClick={()=>queryDeviceDataAll({name:"数显多功能表 PD666", devSn: "NA5202522404", part:3})}>
              <GetIa sn="NA5202522404" />
         {/*    <div className="nums">
              <span className="type">1a</span>
              <Text>25.3A</Text>
              <Text>48.2°C</Text>
            </div> */}
            {/* <div className="state">
              <img src={imgsrc["red"]}></img>
              <img src={imgsrc["close"]}></img>
            </div> */}
          </div>
          <div className="guizhi" onClick={()=>queryDeviceDataAll({name:"框架断路器  NA8", devSn: "NA5202522404", part:3})}>
            
          </div>
            </div>
         
          </div>
        </div>
        <div className="part" key="part4">
        <GetHead  sn="NTD30S119322" ck={()=>displaySensor(4)} />
         {/*  <div className="title" onClick={()=>displaySensor(4)}>
            <Link >
              <img src={temp} alt="" />
              {getTemp(NTD30S119322)}
            </Link>
            <CustLink text="details" underline={false}></CustLink>
          </div> */}
          <div className="breaker">
          <div className="loops loops1">
            <GetP4  sn="NTCJ20012241"  ck1={()=>queryDeviceDataAll({name:"塑壳断路器  NM8N", devSn: "NTCJ20012241",part:4})} ck2={()=>queryDeviceDataAll({name:"智能接插件NTCJ", devSn: "NTCJ20012241", part:4})} />
           {/*  <div className="loop1" >  
                <div className="loopbashou" onClick={()=>queryDeviceDataAll({name:"塑壳断路器  NM8N", devSn: "NTCJ20012241",part:4})}>
                  <img
                    src={
                      state == 1
                        ? imgsrc[`B分闸`]
                        : state == 2
                        ? imgsrc["B故障"]
                        : imgsrc["B正常"]
                    }
                  ></img>
                </div>

                <img
                  className="state4"
                  src={
                    state == 1
                      ? imgsrc[`red`]
                      : state == 2
                      ? imgsrc["green"]
                      : imgsrc["close"]
                  }
                ></img>

                <div className="nums" onClick={()=>queryDeviceDataAll({name:"智能接插件NTCJ", devSn: "NTCJ20012241", part:4})}>
                  <span className="type">1a</span>
                  <Text>253.3A</Text>
                  <Text>483.2°C</Text>
                </div>
              
            </div> */}
             <GetP4  sn="NTCJ20012242"  ck1={()=>queryDeviceDataAll({name:"塑壳断路器  NM8N", devSn: "NTCJ20012242",part:4})} ck2={()=>queryDeviceDataAll({name:"智能接插件NTCJ", devSn: "NTCJ20012242", part:4})} />
           {/*  <div className="loop1" >   
                <div className="loopbashou" onClick={()=>queryDeviceDataAll({name:"塑壳断路器  NM8N", devSn: "NTCJ20012242",part:4})} >
                  <img
                    src={
                      state == 1
                        ? imgsrc[`B分闸`]
                        : state == 2
                        ? imgsrc["B故障"]
                        : imgsrc["B正常"]
                    }
                  ></img>
                </div>

                <img
                  className="state4"
                  src={
                    state == 1
                      ? imgsrc[`red`]
                      : state == 2
                      ? imgsrc["green"]
                      : imgsrc["close"]
                  }
                ></img>

                <div className="nums" onClick={()=>queryDeviceDataAll({name:"智能接插件NTCJ", devSn: "NTCJ20012242",part:4})} >
                  <span className="type">1a</span>
                  <Text>153.3A</Text>
                  <Text>283.2°C</Text>
                </div>
               
            </div> */}
             <GetP4  sn="NTCJ20012243"  ck1={()=>queryDeviceDataAll({name:"塑壳断路器  NM8N", devSn: "NTCJ20012243",part:4})} ck2={()=>queryDeviceDataAll({name:"智能接插件NTCJ", devSn: "NTCJ20012243", part:4})} />
          {/*   <div className="loop1" >
              
                <div className="loopbashou" onClick={()=>queryDeviceDataAll({name:"塑壳断路器  NM8N", devSn: "NTCJ20012243",part:4})} >
                  <img
                    src={
                      state == 1
                        ? imgsrc[`B分闸`]
                        : state == 2
                        ? imgsrc["B故障"]
                        : imgsrc["B正常"]
                    }
                  ></img>
                </div>

                <img
                  className="state4"
                  src={
                    state == 1
                      ? imgsrc[`red`]
                      : state == 2
                      ? imgsrc["green"]
                      : imgsrc["close"]
                  }
                ></img>

                <div className="nums" onClick={()=>queryDeviceDataAll({name:"智能接插件NTCJ", devSn: "NTCJ20012243",part:4})}>
                  <span className="type">1a</span>
                  <Text>153.3A</Text>
                  <Text>283.2°C</Text>
                </div>
              
            </div> */}
             <GetP4  sn="NTCJ20012244"  ck1={()=>queryDeviceDataAll({name:"塑壳断路器  NM8N", devSn: "NTCJ20012244",part:4})} ck2={()=>queryDeviceDataAll({name:"智能接插件NTCJ", devSn: "NTCJ20012244", part:4})} />
           {/*  <div className="loop1" >
              
                <div className="loopbashou" onClick={()=>queryDeviceDataAll({name:"塑壳断路器  NM8N", devSn: "NTCJ20012244",part:4})}>
                  <img
                    src={
                      state == 1
                        ? imgsrc[`B分闸`]
                        : state == 2
                        ? imgsrc["B故障"]
                        : imgsrc["B正常"]
                    }
                  ></img>
                </div>

                <img
                  className="state4"
                  src={
                    state == 1
                      ? imgsrc[`red`]
                      : state == 2
                      ? imgsrc["green"]
                      : imgsrc["close"]
                  }
                ></img>

                <div className="nums" onClick={()=>queryDeviceDataAll({name:"智能接插件NTCJ", devSn: "NTCJ20012244",part:4})}>
                  <span className="type">1a</span>
                  <Text>153.3A</Text>
                  <Text>283.2°C</Text>
                </div>
               
            </div> */}
          </div>
          <div className="loops loops2">
            <GetP42 sn="NTCJ00122401" ck1={()=>queryDeviceDataAll({name:"塑壳断路器  NM8N", devSn: "NTCJ00122401",part:4})} ck2={()=>queryDeviceDataAll({name:"智能接插件NTCJ", devSn: "NTCJ00122401",part:4})} />
           {/*  <div className="loop2" > 
              <div className="loopbashou" onClick={()=>queryDeviceDataAll({name:"塑壳断路器  NM8N", devSn: "NTCJ00122401",part:4})}>
                <img
                  src={
                    state == 1
                      ? imgsrc[`B正常`]
                      : state == 2
                      ? imgsrc["B故障"]
                      : imgsrc["B正常"]
                  }
                ></img>
              </div>
              <div className="state42">
                <img
                  src={
                    state == 1
                      ? imgsrc[`red`]
                      : state == 2
                      ? imgsrc["green"]
                      : imgsrc["close"]
                  }
                ></img>
                <div className="nums" onClick={()=>queryDeviceDataAll({name:"智能接插件NTCJ", devSn: "NTCJ00122401",part:4})}>
                  <span className="type">1a</span>
                  <Text>153.3A</Text>
                  <Text>283.2°C</Text>
                </div>
              </div>
            </div> */}
             <GetP42 sn="NTCJ00122402" ck1={()=>queryDeviceDataAll({name:"塑壳断路器  NM8N", devSn: "NTCJ00122402",part:4})} ck2={()=>queryDeviceDataAll({name:"智能接插件NTCJ", devSn: "NTCJ00122402",part:4})} />
           {/*  <div className="loop2" > 
              <div className="loopbashou" onClick={()=>queryDeviceDataAll({name:"塑壳断路器  NM8N", devSn: "NTCJ00122402",part:4})} >
                <img
                  src={
                    state == 1
                      ? imgsrc[`B正常`]
                      : state == 2
                      ? imgsrc["B故障"]
                      : imgsrc["B正常"]
                  }
                ></img>
              </div>
              <div className="state42" onClick={()=>queryDeviceDataAll({name:"智能接插件NTCJ", devSn: "NTCJ00122402",part:4})}>
                <img
                  src={
                    state == 1
                      ? imgsrc[`red`]
                      : state == 2
                      ? imgsrc["green"]
                      : imgsrc["close"]
                  }
                ></img>
                <div className="nums">
                  <span className="type">1a</span>
                  <Text>153.3A</Text>
                  <Text>283.2°C</Text>
                </div>
              </div>
            </div> */}
             <GetP42 sn="NTCJ00122403" ck1={()=>queryDeviceDataAll({name:"塑壳断路器  NM8N", devSn: "NTCJ00122403",part:4})} ck2={()=>queryDeviceDataAll({name:"智能接插件NTCJ", devSn: "NTCJ00122401",part:4})} />
           {/*  <div className="loop2" > 
              <div className="loopbashou" onClick={()=>queryDeviceDataAll({name:"塑壳断路器  NM8N", devSn: "NTCJ00122403",part:4})}>
                <img
                  src={
                    state == 1
                      ? imgsrc[`B正常`]
                      : state == 2
                      ? imgsrc["B故障"]
                      : imgsrc["B正常"]
                  }
                ></img>
              </div>
              <div className="state42">
                <img
                  src={
                    state == 1
                      ? imgsrc[`red`]
                      : state == 2
                      ? imgsrc["green"]
                      : imgsrc["close"]
                  }
                ></img>
                <div className="nums" onClick={()=>queryDeviceDataAll({name:"智能接插件NTCJ", devSn: "NTCJ00122403",part:4})}>
                  <span className="type">1a</span>
                  <Text>153.3A</Text>
                  <Text>283.2°C</Text>
                </div>
              </div>
            </div> */}
          </div>
          <div className="loops loops3">
            <GetP43 sn="NTCJ00122404" ck2={()=>queryDeviceDataAll({name:"智能接插件NTCJ", devSn: "NTCJ00122404",part:4})}  />
            {/*   <div className="loop3">
              <div className="loop3left"></div>
              <div className="state42">
                <img
                  src={
                    state == 1
                      ? imgsrc[`red`]
                      : state == 2
                      ? imgsrc["green"]
                      : imgsrc["close"]
                  }
                ></img>
                <div className="nums" onClick={()=>queryDeviceDataAll({name:"智能接插件NTCJ", devSn: "NTCJ00122404",part:4})}>
                  <span className="type">1a</span>
                  <Text>153.3A</Text>
                  <Text>283.2°C</Text>
                </div>
              </div>
              </div> */}
               <GetP43 sn="NTCJ00122404" ck2={()=>queryDeviceDataAll({name:"数显多功能表 PD666", devSn: "PD6662555504",part:4})}  />
             {/*  <div className="loop3">
               
              <div className="state42">
                <img
                  src={
                    state == 1
                      ? imgsrc[`red`]
                      : state == 2
                      ? imgsrc["green"]
                      : imgsrc["close"]
                  }
                ></img>
                <div className="nums" onClick={()=>queryDeviceDataAll({name:"数显多功能表 PD666", devSn: "PD6662555504",part:4})}>
                  <span className="type">1a</span>
                  <Text>153.3A</Text>
                  <Text>283.2°C</Text>
                </div>
              </div>
              </div> */}
          </div>
          </div>

        </div>
      </Mainbox>
     <Sensor  ref={sref} />
      <DDrawer
        // title={ctitle}
        //  ref={refdd}
        maskClosable={true}
        open={copen}
        bodyStyle={{
          padding: "0px",
        }}
        headerStyle={{
          backgroundColor: "#f2f2f2",
          padding: "16px",
          borderBottom: "none",
          display: "flex",
        }}
        onClose={()=> setCopen(false)}
        closable={false}
        
       
        //    extra={<Extra  fn={() => setCopen(false)} />}
      >
        <div className="left" onClick={onCloseMain}>
          <IDrawer
            title="告警详情"
            inner={true}
            wh="524px"
            open={iopen}
            bodyStyle={{
              backgroundColor: "#fff",
              padding: "16px 24px 16px 16px",
            }}
            headerStyle={{
              backgroundColor: "#fff",
              padding: "16px 24px 16px 16px",
              borderBottom: "none",
              display: "flex",
            }}
            placement="right"
            mask={false}
            closable={false}
            getContainer={false}
            extra={<Extra fn={() => setIopen(false)} />}
            footerStyle={{
              display: "flex",
              backgroundColor: "#fff",
              justifyContent: "flex-end",
            }}
            footer={
              <Space>
                <CustButtonT
                  text="cancel"
                  ghost
                  onClick={() => setIopen(false)}
                ></CustButtonT>
                <CustButtonT text="ok"></CustButtonT>
              </Space>
            }
          >
            <div className="leftmain">
              <Descriptions
                column={1}
                colon={null}
                bordered
                contentStyle={descsty}
                labelStyle={descsty}
              >
                <Item label="报警类别">温度超限报警</Item>
                <Item label="变电站">1#变电站</Item>
                <Item label="柜体">p2</Item>
                <Item label="回路名称">/</Item>
                <Item label="报警设备">B相温度传感器</Item>
                <Item
                  label="通信地址"
                  contentStyle={{ backgroundColor: "#fff" }}
                  labelStyle={{ backgroundColor: "#fff" }}
                >
                  215084530
                </Item>
              </Descriptions>
              <div>
                <Title level={4}>告警等级</Title>
                <CustButton danger>高风险</CustButton>
              </div>
              <div className="alarm">
                <div>
                  <Text>告警状态</Text>
                </div>
                <Timeline>
                  <Timeline.Item dot={<Dot state={1} />}>
                    <Space size={laptop ? 16 : 32}>
                      <Text type="danger">告警发生</Text>{" "}
                      <Text>
                        {moment()
                          .subtract(7, "hours")
                          .format("yyyy-MM-DD HH:mm:ss")}
                      </Text>
                    </Space>
                  </Timeline.Item>
                  <Timeline.Item dot={<Dot state={2} />}>
                    <Space size={laptop ? 16 : 32}>
                      <Link>告警确认</Link>{" "}
                      <Link>
                        {moment()
                          .subtract(1, "hours")
                          .format("yyyy-MM-DD HH:mm:ss")}
                      </Link>
                    </Space>
                  </Timeline.Item>
                  <Timeline.Item dot={<Dot state={3} />}>
                    <Space size={laptop ? 16 : 32}>
                      <Text type="success">报警解除</Text>{" "}
                      <Text>{moment().format("yyyy-MM-DD HH:mm:ss")}</Text>
                    </Space>
                  </Timeline.Item>
                </Timeline>
              </div>
              <div>
                <Title level={4}>告警记录</Title>
                <TextArea row={6} autoSize={false}></TextArea>
              </div>
            </div>
          </IDrawer>
          <IDrawer
            title={eltitle}
            wh="840px"
            open={elopen}
            inner={true}
            bodyStyle={{
              backgroundColor: "#fff",
              padding: "16px 24px 16px 16px",
            }}
            headerStyle={{
              backgroundColor: "#fff",
              padding: "16px 24px 16px 16px",
              borderBottom: "none",
              display: "flex",
            }}
            placement="right"
            mask={false}
            closable={false}
            getContainer={false}
            extra={<Extra ist={true} fn={() => setElopen(false)} />}
            zIndex={1001}
          >
            <div className="leftmain">
           { eldata ?   <Ichart {...eloption} /> : <Cspin tip="数据加载中" />}
            </div>
          </IDrawer>
        </div>
        <div className="mainbox">
          <div className="ctitle">
            <div className="text">{deviceInfo?.deviceName}</div>
            <CloseOutlined onClick={() => setCopen(false)} className="close" />
          </div>
          <div className="htitle">
            <span>设备快照</span>
            <span>{moment().format("yyyy-MM-DD HH:mm:ss")}</span>
          </div>
          <Info vstate={snapshot} />
          <div className="htitle">
            <span>报警信息</span>
          </div>
          <div>
            <Usetable hbg="#0066cc" columns={columns} dataSource={dataSource} />
          </div>

        {/* 遥测 */}
          <Electric datas={deviceData} onClick={onelchart} />
          {/* 遥调 */}
          {deviceInfo?.deviceType === 1 ? <RomoteRegulatin laptop={laptop} part={part} deviceData={deviceData} /> : deviceInfo?.deviceType === 2 ? <RomoteRegulatinB deviceData={deviceData} /> : null} 
          <div className="htitle"> 
            <span>遥控</span>
          </div>
       { deviceInfo.breaker && (<div
            style={{ display: "flex", columnGap: "64px", alignItems: "center" }}
          >
            <div style={{fontSize: "16px", color: "#515151"}}>
              当前状态：<span>{deviceInfo?.state}</span>
            </div>
            <Button
              type="primary"
              danger
              className="remote"              
              onClick={onControl}
              disabled={deviceInfo?.state=="故障"}
            >
              <img src={imgsrc["remote"]} width={32} height={32}></img>{
                deviceInfo?.state=="合闸" ? "远程分闸" :  deviceInfo?.state=="分闸" ? "远程合闸" : "设备故障"
              }
            </Button>
          </div>)
}
        </div>
        
        <Custmodal
          title="远程控制"
          ref={modal}
          mold="cust"
          width="592px"
          onCancel={onCancel}
          onOk={onOk}
        >
          <Okt>
            {rState == 1 ? (
              <div className="ok">
                <img src={imgsrc["ok"]}></img>{" "}
                当前状态为{deviceInfo?.state}，确认要进行{deviceInfo?.state=="合闸" ? "远程分闸" :  deviceInfo?.state=="分闸" ? "远程合闸" : ""}操作？
              </div>
            ) : rState == 2 ? (
              <Form form={iform} className="pwd" preserve={false}>
                <Form.Item label="请输入安全码" name="pwd" rules={[
                   {required: true},
                   {
                    validator: (_, value) => { 
                       if(value?.trim() == 1) return Promise.resolve()
                       return Promise.reject(new Error("安全码错误，请核对后重新输入！"))
                    }
                   }
                ]}>
                <Input></Input>
                </Form.Item> 
              </Form>
            )
            : rState == 3 ? <div className="tip"><Cspin tip="请求中……" /></div> : (<div className="suc">
              <img src={rsucs ? imgsrc['sucs'] : imgsrc["error"]} style={{width: "56px", height: "56psx"}}></img>
              <span>{
                rsucs ? "远程操作命令下发成功！" : "远程操作命令下发失败！"
                }</span>
            </div>)
          } 
          </Okt>
        </Custmodal>
      </DDrawer>
    </Pagecount>
  );
}
