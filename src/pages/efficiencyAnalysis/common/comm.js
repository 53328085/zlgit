import React,{useEffect,useState} from 'react'
import { List, Typography,Carousel } from "antd";
import {  TitleBox } from "./style";
import {useGauge, useLine } from './index'
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
          >
            <div className="innerlayout">
              <div className="sublayout">
                <div className="sub rows" >
                  <div className='scrollbox' style={{height: 120}}>
                <Carousel vertical={true}  autoplay style={{height: 120}} dots={false} >
                  {
                    data?.kpiKeyData?.map((item,index)=>{
                      return <div className="row" key={item.sn+index}> 
                               <Typography.Paragraph  ellipsis={{tooltip: item?.keyName}}>{item?.keyName}</Typography.Paragraph>  <Typography.Paragraph type="success">{item.keyValue}</Typography.Paragraph>
                            
                      </div>
                    })
 
                  }
                  </Carousel>
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
