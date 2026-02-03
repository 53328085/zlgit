import React,{useEffect,useState} from 'react'
import { List, Typography,Badge } from "antd";
import {  TitleBox } from "./style";
import {useGauge, useLine,Custitem } from './index'
import Titlelayout from "@com/titlelayout";
import Ichart from '@com/useEcharts/Ichart' 
export default function Index(data) { 
     const lineopt=useLine(data?.detail)
     const goption = useGauge({data:data?.ranges});  
  return (
    <Titlelayout
            layout="flex"
            title={<TitleBox>{data?.equipmentName}</TitleBox>}
            dr="column"
            pv="16px"
          >
            <div className="innerlayout">
              <div className="sublayout">
                <div className="sub rows" >
                  <div className='scrollbox' style={{height: 120}}>
                    {
                        Array.isArray(data?.kpiKeyData) &&  <Custitem data={data?.kpiKeyData} />
                    }
              {/*   <Carousel vertical={true}  autoplay  style={{height: 120}} dots={false} >
                  {
                    data?.kpiKeyData?.map((item,index)=>{
                      return <div className="row" key={item.sn+index}> 
                               <Typography.Paragraph  ellipsis={{tooltip: item?.keyName}}>{item?.keyName}</Typography.Paragraph>  <Typography.Paragraph type="success">{item.keyValue}</Typography.Paragraph>
                            
                      </div>
                    })
 
                  }
                  </Carousel> */}
                  </div>
                  
                </div>
                <div className="sub text">
                    <div className="title">
                       <Typography.Text strong>{data?.kpiName}</Typography.Text>
                       <span>{data?.unit}</span>
                    </div>
                    <div className="num">
                      {data?.kpiValue}
                    </div>
                </div>
                <div className="sub">
                  <Ichart {...lineopt} /> 
                </div>
                <div className="sub chart">
                <div className='range'>
                     {/*  <Badge color='rgba(5, 192, 110, 1)' text={data?.ranges?.[0]+'-' +data?.ranges?.[1]}></Badge> */}
                      <Badge color='rgba(255, 177, 43, 1)' text={data?.ranges?.[1]} className='step1'></Badge>
                      <Badge color='rgba(255, 96, 33, 1)' text={data?.ranges?.[2]} className='step2'></Badge>
                   </div>
                   <Ichart custoption={goption} />
                </div>
              </div>
              <div className="line">
                <Typography.Link>Formulate:</Typography.Link>
                <div className='formulate'>
                <Typography.Paragraph ellipsis={{tooltip:data?.formulateDescription}}>{data?.formulateDescription}</Typography.Paragraph>
                </div>
              </div>
            </div>
          </Titlelayout>
  )
}
 /*  [data?.[1]/max, 'rgba(5, 192, 110, 1)'],
               [data?.[2]/max, 'rgba(255, 177, 43, 1)'],
               [max, 'rgba(255, 96, 33, 1)'] */