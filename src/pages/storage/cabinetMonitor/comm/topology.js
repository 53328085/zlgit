import React,{useContext, useEffect,useState,useRef} from 'react'
import {Button,Carousel} from 'antd'
import {CaretLeftOutlined,CaretRightOutlined} from "@ant-design/icons"
import Titlelayout from "@com/titlelayout";
import {isObject} from "@com/usehandler"
import {TopologySty} from "../style"
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
    const {areaId, stationName,  projectId,containerId} = useContext(Paramscontext)
    const [datas,setDatas]=useState({})
    const ref=useRef()
    const getData = async()=>{
      try {
        let params ={
            areaId:1,
            siteId: 1, //stationName?.value,
            projectId:1,
            containerId: 1, //containerId?.value
        }
        const {data, success} =  await useQueryContainerTopologyInfo(params)
        if(success && isObject(data)) {
            setDatas(data)
        }else {
            setDatas({})
        }
      } catch (error) {
        
      }
    }
  useEffect(()=>{
     if([areaId,  projectId ].every((id)=>Number.isInteger(parseInt(id))) && isObject(stationName) && isObject(containerId)) {
        getData()
     }
      
    },[areaId, stationName,  projectId,containerId])
    const next=()=>{
       ref.current.next()
    }
    const prev=()=>{
       ref.current.prev()
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
            <img src={imgurl["pcs"]} className='img' />
            </div>
        </div>
        </div>
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
