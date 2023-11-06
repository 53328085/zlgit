import React, {useState, useRef, useEffect} from 'react'
import styled from 'styled-components';
import {Image, Spin} from 'antd'
 import {useSelector} from 'react-redux'
import {EnergyFlowRuntime, Monitoring} from "@api/api"
import Commport from './Commport';
import server from './icon/server.png';
import workstation from './icon/workstation.png'
import switchboard from './icon/switchboard.png';
import {selectProjectId} from '@redux/systemconfig.js'
 
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
    display: flex;
    align-items: center;
    height: 88px;
  }
  .center {
    position: absolute;
    top: 88px;
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 210px;
    padding-top: 10px;
  }
  .bottom {
    position: absolute;
    top: 308px;
    border-top: 3px solid #06c;
    display: grid;
    grid-auto-columns: 128px;
    grid-template-rows: 340px;
    grid-auto-flow: column;
    column-gap: 64px;
    .item {
      display: flex;
      flex-direction: column;
      align-items: center;
     
    }
    /*  .item.first {
      transform: translate(-64px,-3px)
     }
    .item.last {
      transform: translate(64px,-3px)
     } */
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
  background-repeat: no-repeat;
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
 
 const Fixed =React.memo(() => {
     return (
      <div style={{position: "absolute", left: "300px", height: "298px"}}>
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
      </div>
     )

 })
 
export default function Topology() {
  const [data, setData] = useState([])
  const [iscom, setIscom] = useState(true)
  const count = data.length - 1
  const [ids, setIds] = useState([])
  const [gateway, setGateway] = useState()
  const projectId = useSelector(selectProjectId);
  const getImage = async (data, group)=> {
      
      try {
        let imgurls = new Map()
        let {success, data: imgs} = await CategoryImages({projectId, group})
        if(success && Array.isArray(imgs) && imgs.length > 0) {
          for(let img of imgs) {
             imgurls.set(img.category, img.imageBase64)
          }
        }
        data.forEach(d => {
          d.imageBase64 = imgurls.get(d.category)
        })
        setData(data)
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
     {/*   <div className='top' >
         <Imgbox  bg={server} ><span>服务器</span></Imgbox>
         <LineSty width="234px" />
         <Imgbox  bg={workstation} ><span>操作员工作站</span></Imgbox>
       </div>
       <div className='center' >
        <LineSty height="56px" />
         <Imgbox  bg={switchboard} ><span>交换机</span></Imgbox>
         <LineSty height="56px" />
       </div> */}
       <Fixed />
       <div className='bottom'>
           {
            data.map((d, index) =>  (
              <div className={index ==0 ? "item first" : index==count ? "item last" : "item"} key={d.sn} onClick={() => jumcomm(d)}>
                 <LineSty height="42px" />
                <Image src={d.imageBase64 ? `data:image/png;base64,${d.imageBase64}` : gateway}   height={128} preview={false} /> 
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
