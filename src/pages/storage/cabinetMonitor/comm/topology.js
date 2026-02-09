import React,{useContext, useEffect,useState,useRef} from 'react'
import {Button,Carousel, Typography} from 'antd'
import { useNavigate} from 'react-router-dom'
import {CaretLeftOutlined,CaretRightOutlined} from "@ant-design/icons"
import Titlelayout from "@com/titlelayout";
import {isObject} from "@com/usehandler"
import {TopologySty,Custbtn} from "../style"
import {Paramscontext} from  '../context'
import {useQueryContainerTopologyInfo} from "../api"
import imgurl from '../imgs'
import Stack from './stack'
const setting ={
    slidesToShow:3, 
    infinite:true,
    dots:false,
    autoplay:true,
}
let moke={
    "containerId": 1, //储能柜Id
    "containerName": "储能柜1", //储能柜名称
    "pcsId": 1, //PCSId
    "pcsName": "PCS1", //PSC名称
    "status": "停机", //PSC运行状态 直接返回中文
    "batteryStackInfo": [ //电池堆信息列表
        {
            "id": 1, //电池堆Id
            "sn": "20260001", //电池堆Sn
            "name": "电池堆1", //电池堆名称
            "chargeState": "充电", //电池堆当前状态 静置 放电 充电
            "soc": "250", //电池堆soc
            "soh": "972", //电池堆soh
            "maxV": "52.4", //电池堆电压高值
            "minV": "51.3", //电池堆电压低值
            "maxTemp": "36.2", //电池堆温度高值
            "minTemp": "19.7" //电池堆温度低值
        },
        {
            "id": 2,
            "sn": "20260002",
            "name": "电池堆2",
            "chargeState": "2",
            "soc": "250",
            "soh": "972",
            "maxV": "52.4",
            "minV": "51.3",
            "maxTemp": "36.2",
            "minTemp": "19.7"
        },
        {
            "id": 3,
            "sn": "20260003",
            "name": "电池堆3",
            "chargeState": "2",
            "soc": "250",
            "soh": "972",
            "maxV": "52.4",
            "minV": "51.3",
            "maxTemp": "36.2",
            "minTemp": "19.7"
        },
        {
            "id": 4,
            "sn": "20260004",
            "name": "电池堆4",
            "chargeState": "2",
            "soc": "250",
            "soh": "972",
            "maxV": "52.4",
            "minV": "51.3",
            "maxTemp": "36.2",
            "minTemp": "19.7"
        }
    ]
}
export default function Index() {
    const {  projectId,containerId} = useContext(Paramscontext)
    const navigate = useNavigate()
    const [datas,setDatas]=useState({})
    const ref=useRef()
    const getData = async()=>{
      try {
        let params ={ 
            projectId,
            containerId: containerId?.value
        }
        const {data, success} =  await useQueryContainerTopologyInfo(params)
        if(success && isObject(data)) {
            setDatas(data)
        }else {
            setDatas(moke)
        }
      } catch (error) {
        console.log(error)
      }
    }
  useEffect(()=>{
     if([projectId ].every((id)=>Number.isInteger(parseInt(id)))   && Number.isInteger(parseInt(containerId?.value))) {
        getData()
     }
      
    },[ projectId,containerId])
    const next=()=>{
       ref.current.next()
    }
    const prev=()=>{
       ref.current.prev()
    }
    const toPage = (key, label, params) => {
      navigate(`/index/runtimeStorage/${key}`, {
        state: { type: 'index', primary: 'runtimeStorage', title: label, nested: key, params }
      })
    }
   
  return (
    <Titlelayout title={<span style={{color:"#fff"}}>储能柜拓扑图</span>} pv="28px" bgcolor="transparent" bg="transparent" layout="flex">
    <TopologySty>
      <div className="up">
        <div className="outwrap">
        <div className='box'>
            <Button type="primary">{datas?.containerName}</Button>
            <div className="imgbox">
            <img src={imgurl["stack"]} className='img' />
            
            </div>
            
        </div>
        <img src={imgurl["line1"]} className='line1'></img>
        <div className="box offset">
        <Button type="primary">{datas?.pcsName}</Button>
            <div className="imgbox2">
            <Typography.Link onClick={()=>{toPage("pCSMonitor","PCS监控",datas)}}><img src={imgurl["pcs"]} className='img' /></Typography.Link>
            </div>
        </div>
         <Custbtn status={datas.status}>  <div className="circle"></div>{datas.status}</Custbtn> 
        </div>
        <img src={imgurl["line2"]} className='line2'></img>
      </div>
      <div className='down'> 
      <CaretLeftOutlined  style={{fontSize: 30}}  onClick={next}/>
           
          <Carousel       style={{height: 455,width:900 }}  {...setting} ref={ref}  >
          {
            datas?.batteryStackInfo?.map(data=><Stack key={data.sn} data={data}></Stack>)

          }
        </Carousel>
        <CaretRightOutlined style={{fontSize: 30}}  onClick={prev}  />
      </div>
    </TopologySty>
    </Titlelayout>
  )
}
