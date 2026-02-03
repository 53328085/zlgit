import React from 'react'
import {List, Typography, Badge } from "antd";

import Ichart from '@com/useEcharts/Ichart'
 
import {useGauge, useLine,Custitem}from "../common"
export default function Index(data) { 
    const lineopt=useLine(data?.detail)
    const goption = useGauge({data:data?.ranges,startAngle:180, endAngle:0 });
  return (
 
    <div className="innerlayout">
      <div className="sublayout">
      <div className="sub rows" >
                  <div className='scrollbox' style={{height: 200}}>
                     {
                                            Array.isArray(data?.kpiKeyData) &&  <Custitem data={data?.kpiKeyData} h={200} len={6} />
                                        }
              {/*   <Carousel vertical={true}  autoplay style={{height: 200}} dots={false} >
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
        <div className="sub chart">
        <div className='range'> 
                      <Badge color='rgba(255, 177, 43, 1)' text={data?.ranges?.[1]} className='step1'></Badge>
                      <Badge color='rgba(255, 96, 33, 1)' text={data?.ranges?.[2]} className='step2'></Badge>
                   </div>
           <Ichart custoption={goption} />
        </div>
        <div className="sub">
          <Ichart {...lineopt} /> 
        </div>
       
      </div>
      <div className="line">
        <Typography.Link>Formulate:</Typography.Link>
       <div className='formulate'>
                       <Typography.Paragraph ellipsis={{tooltip:data?.formulateDescription}}>{data?.formulateDescription}</Typography.Paragraph>
                       </div>
      </div>
    </div> 
  )
}
