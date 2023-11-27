import React, {useState, useRef, useEffect} from 'react'
import styled from 'styled-components';
import {Image, Spin, message} from 'antd'
import {CaretLeftFilled, CaretRightFilled} from '@ant-design/icons'
import {EnergyFlowRuntime, Monitoring} from "@api/api"
import Commport from './Commport';
import server from './icon/server.png';
import workstation from './icon/workstation.png'
import switchboard from './icon/switchboard.png';
import TitleLayout from '@com/titlelayout'
 
const {QueryTopologyGatewayState, QueryTopologyGatewayCommports} = EnergyFlowRuntime
const {RuntimeGateway:{CategoryImages}} = Monitoring
const Mainbox = styled.div`
  flex: 1;
  position: relative;
  padding: 10px;
  color: #515151;
  font-size: 14px;
  background-color: #fff;
  .fixed {
    margin-left: 300px;
   // height: 298px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }
  .top {
    display: flex;
    align-items: center;
   // height: 88px;
    padding-left: 15px;
  }
  .center {
   
    display: flex;
    flex-direction: column;
    align-items: center;
  //  height: 210px;
    padding-top: 10px;
  }
  .box {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .bottom {
   /*  position: absolute;
    top: 308px; */
    border-top: 3px solid #06c;
    display: grid;
   // grid-auto-columns: 128px;
    grid-template-columns: repeat(8, 128px);
    grid-template-rows: 340px;
    grid-auto-flow: column;
    column-gap: 64px;    
    width: 1472px;
    overflow-x: auto;
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
  background-size: cover;
  background-repeat: no-repeat;
   width:${props => props.w || "90px"} ;
   height: ${props => props.h || "88px"} ;
   background-position: center;
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
      <div className="fixed">
         <div className='top' >
         <Imgbox  bg={server} ><span>服务器</span></Imgbox>
         <LineSty width="234px" />
         <Imgbox  bg={workstation} ><span>操作员工作站</span></Imgbox>
        </div>
       <div className='center' >
        <LineSty height="56px" />
         <Imgbox  bg={switchboard} w="128px" h="80px" ><span>交换机</span></Imgbox>
         <LineSty height="56px" />
       </div>
      </div>
     )

 })
 
export default function Topology({projectId, areaId}) {
  const [data, setData] = useState([])
  const [iscom, setIscom] = useState(true)
  const count = data.length - 1
  const total = data.length
  const [ids, setIds] = useState({})
  const [gateway, setGateway] = useState()
  const [items, setItems] = useState([])
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
        let {data, success} = await QueryTopologyGatewayState({areaId, projectId})
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
         
      }
  }
  
 const jumcomm = async (item) => {
    try {
      let {data, success} = await QueryTopologyGatewayCommports({projectId, gatewayId: item.gatewayId})
      if(success && data.constructor === Object) {
        setGateway(item)     
        setIds({...data})
        setIscom(false)
      }
    } catch (e) {
      console.log(e)
    }
 }
const  index = useRef(0) // 
const move =(type) => {
 
  console.log(index.current)
  if(type == 1) {
    let  len = total-index.current
    if  (len >8 ) {
      index.current+=8
    } else {
      message.warning('最后一屏了')
    }
    
     
  }else if(type == 2) {
    let i = index.current - 8
    if(i >= 0) {
      index.current-=8;
    }else {
      message.warning("已到第一屏")
    }
  }
   
   items[index.current].scrollIntoView({
    behavior: 'smooth',
    block: 'nearest',
    inline: 'start'
  })
}

  useEffect(() => {
    if(data.length < 1) return;
    let els =   document.querySelectorAll('.item')
    setItems(els)
  }, [data])



  useEffect(() => {
    getData()
  }, [areaId, projectId])
  const sty = {
    flex: 1,
    position: "re"
  }
  const icosty = { 
    fontSize: "64px",
    cursor: "pointer",
    
  }
  return <>  { 
    iscom ? <TitleLayout> 
    <Mainbox count={count}>
       <Fixed />
       
       <div className="box">
       {total > 8 &&  < CaretLeftFilled style={{...icosty}} onClick={() =>move(1)} />}
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
       {total > 8 &&  < CaretRightFilled style={{...icosty}} onClick={() => move(2)} />}
       </div>
        
    </Mainbox>
    </TitleLayout>
    : <Commport device={ids} projectId={projectId} gateway={gateway} back={setIscom}/> 
   
  }
   </>
}
