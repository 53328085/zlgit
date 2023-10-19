import React, {useState, useRef, useEffect} from 'react'
import styled from 'styled-components';
import { drawEcharts } from "@com/useEcharts";
import {EnergyFlowRuntime, Monitoring} from "@api/api"
import Commport from './Commport';
import server from './icon/server.png';
import workstation from './icon/workstation.png'
import switchboard from './icon/switchboard.png';
import gateway1 from './icon/gateway1.png'
import imgurl from './icon'
 
const {QueryTopologyGatewayState, QueryTopologyGatewayCommports} = EnergyFlowRuntime
const {RuntimeGateway:{CategoryImages}} = Monitoring
const Mainbox = styled.div`
  flex: 1;
  position: relative;
  padding: 10px;
  color: #515151;
  font-size: 14px;
  .top {
    position: absolute;
    left: 300px;
    display: flex;
    align-items: center;
    height: 88px;
  }
  .center {
    position: absolute;
    left: 300px;
    top: 98px;
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 200px;
  }
  .bottom {
    position: absolute;
    top: 298px;
    border-top: 3px solid #06c;
    display: flex;
    margin-left: 64px;
    .item {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-right: 64px;
      &&:first-child {
        transform: translate(-64px,-3px)
      }
    }
     .item.first {
      transform: translate(-64px,-3px)
     }
    .item.last {
      transform: translate(64px,-3px)
     }
     .info {
      width: 124px;
      border: 1px solid #d7d7d7;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 8px;
      cursor: pointer;
      .num {
        font-size: 24px;
      }
      .num.blue {
        color: #237ae4;
      }
      .num.red {
        color: #f00;
      }
     }
    }
 
`
const Imgbox = styled.div`
  background-image: url(${props =>props.bg});
  background-size: contain;
   width:${props => props.widht || "90px"} ;
   height: ${props => props.height || "88px"} ;
   position: relative;
  span {
    position: absolute;
    bottom: 0px;
    right: -60px;
    color: #515151;
  }
`
const Imgboxh = styled.div`
  background-image: url(${props =>props.bg});
  background-size: contain;
   width: 128px;
   height: 128px;   
`
 
const LineSty = styled.div`
  background-color: #06c;
  height: ${props => props.height|| "4px" };
  width: ${props => props.width || "4px"};
`
 
 
 
export default function Topology({projectId}) {
  const [data, setData] = useState([])
  const [iscom, setIscom] = useState(true)
  const count = data.length - 1
  const [ids, setIds] = useState([])
  const [gateway, setGateway] = useState()
  const getImage = async (data, group)=> {
      try {
        let {success, data: imgs} = await CategoryImages({projectId, group})
        if(success && Array.isArray(imgs) && imgs.length > 0) {
          
        }
      } catch (error) {
        
      }

  }
  const getData = async () => {
      try {
        let {data, success} = await QueryTopologyGatewayState(projectId)
        // group:[]
        // projectId
         
        if(success && Array.isArray(data)) {
          let group =[...new Set(data.map(d => d.category))]
            
          getImage(data, group)
         // setData(data)
        }else {
          setData([])
        }
      } catch (e) {
        ooo
      }
  }
  
 const jumcomm = async (item) => {
    try {
      let {data, success} = await QueryTopologyGatewayCommports({projectId, gatewayId: item.gatewayId})
      if(success && Array.isArray(data)) {
        setGateway(item)
        setIds(data)
        setIscom(false)
      }
    } catch (e) {
      console.log(e)
    }
 }
 






  useEffect(() => {
    getData()
  }, [projectId])
  const sty = {
    flex: 1,
    position: "re"
  }
  return  <>
  { iscom ? <Mainbox count={count}>
       <div className='top' >
         <Imgbox  bg={server} ><span>服务器</span></Imgbox>
         <LineSty width="234px" />
         <Imgbox  bg={workstation} ><span>操作员工作站</span></Imgbox>
       </div>
       <div className='center' >
        <LineSty height="56px" />
         <Imgbox  bg={switchboard} ><span>交换机</span></Imgbox>
         <LineSty height="56px" />
       </div>
       <div className='bottom'>
           {
            data.map((d, index) =>  (
              <div className={index ==0 ? "item first" : index==count ? "item last" : "item"} key={d.sn} onClick={() => jumcomm(d)}>
                 <LineSty height="42px" />
                <Imgboxh bg={gateway1} ></Imgboxh>
                <span>{d.name}</span>
                <div className='info'>
                    <span>设备总数</span>
                    <span className='num blue'>{d.deviceCount}</span>
                    <span>失联设备</span>
                    <span className='num red'>{d.offlineCount}</span>
                </div>
            </div>
            ))
           }
       </div>
    </Mainbox>
    : <Commport ids={ids} projectId={projectId} gateway={gateway} back={setIscom}/> 
  }
  </>
}
