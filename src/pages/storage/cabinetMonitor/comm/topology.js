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
            setDatas([])
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
         <Custbtn runstatus={datas.status}>  <div className="circle"></div>{datas.status}</Custbtn> 
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
