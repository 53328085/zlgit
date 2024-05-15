import React, { useState, useRef, useEffect, } from "react";
import { nanoid } from "@reduxjs/toolkit";
import { Image, Space, Tabs, Typography} from "antd";
import styled from "styled-components";
import {useOutletContext} from 'react-router-dom' 
import { drawEcharts } from "@com/useEcharts";
import {EnergyComprehensive} from "@api/api.js"
import Titlelayout from "@com/titlelayout";
//import {useSelector} from 'react-redux'
//import {selectProjectId} from '@redux/systemconfig.js'
import {numberformat} from '@com/usehandler'
import Pagecount from "@com/pagecontent";
import imgurl from "./icon";
const {Text} = Typography
 

const Laybox = styled.div`
  display: grid;
  flex: 1;
  &.zonghe {
   grid-template-rows: 512px 272px;
   row-gap: 16px;
  .up {
    display: grid;
    grid-template-columns: 1256px 408px;
    column-gap: 16px; 
    overflow: hidden;
    .upleft {
      display: grid;
      grid-template-rows: 40px 472px ;
    }
  }
  .down { 
      display: grid;
    //  grid-template-columns: repeat(8, 196px);
     grid-auto-columns: 196px;
     grid-template-rows:266px ;
     grid-auto-flow: column;
     column-gap: 16px;
      overflow-x: auto;
  }
  }
  &&.classify {
    .up {
      flex:1;
      display: grid;
      grid-template-columns: 1264px 1fr;
      column-gap: 16px;
      .upleft {
       display: grid;
       grid-template-rows: 40px 1fr;
      }
    }
  
  }
 
`;
const Custspan = styled(Text)`
  font-size: 14px;
   width: 142px;
  color: #515151;
  display: flex;
// justify-content: ${(props) => (props.jc ? "flex-start" : "space-between")};
justify-content: space-between;
  span {
    color: #999;
    padding-left: 1em;
  }
`;

const Divbox = styled.div`
  display: grid;
  grid-template-columns: 40% 1fr;
  column-gap: 16px;
  margin: 8px 0 8px 0;
  align-items: center;
  .list {
    display: grid;
    grid-auto-rows: 30px;
    align-items: flex-end;
    .item {
      display: flex;
      justify-content: space-between;
      span:first-child {
        color: #999;
        font-size: 14px;
      }
      span:last-child {
        color: #515151;
        font-size: 16px;
      }
    }
  }
`;
const Engbox = styled.div`
  display: grid;
  grid-template-columns: 64px 1fr;
  column-gap: 32px;
  height: 100%;
  align-items: ${props => props.type == 2 ? 'center' : 'start'};
  padding-top:${props => props.type == 2 ? '0px' : '35px'}; ;
  .list {
    display: grid;
    grid-auto-rows: 30px;
    align-items: flex-end;
    .item {
      display: flex;
      justify-content: space-between;
      span:first-child {
        color: #999;
        font-size: 14px;
      }
      span:last-child {
        color: #515151;
        font-size: 16px;
      }
    }
  }
`;
const Tabsbox = styled(Tabs)`
 && {
  .ant-tabs-nav {
    margin-bottom: 0px;
   .ant-tabs-nav-list {
    .ant-tabs-tab {
        border-radius: 4px 4px 0 0;
        height: 41px;
        width: 114px;
        justify-content: center;
        font-size: 14px;
        background-color: #fff;  
        transition: none;
        &:hover {
            background-color: var(--ant-primary-color);
            color: #fff;
            transition: all 0.3s;
        }
        .ant-tabs-tab-btn{
            transition: none;
        }
        .ant-tabs-tab-btn:active {
            color:#fff
        }
    }
    .ant-tabs-tab + .ant-tabs-tab {
      margin: 0 0 0 16px;
    }
    .ant-tabs-tab.ant-tabs-tab-active {
        background-color: var(--ant-primary-color);
       
        .ant-tabs-tab-btn {
            color:#fff;
            transition: none;
        }
    }
   }  
   .ant-tabs-content-holder {
    display: none;
   }
  }
}
`
const UDbox = styled.div`
  display: grid;
  grid-template-rows: 64px 1fr;
  row-gap: 8px;
  margin-top: 8px;
  justify-items: center;
  .list {
    display: grid;
    grid-auto-rows: 30px;
    justify-self: stretch;
    align-content: flex-end;
    .item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      span:first-child {
        color: #999;
        font-size: 14px;
      }
      span:last-child {
        color: #515151;
        font-size: 16px;
      }
    }
  }
`;

const Echartbox = styled.div`
   height: 100%;
   width: 100%;
   background-color: #fff;
   padding: 16px;
   border: 1px solid #d7d7d7;
`
const ElectricRight = styled.div`
   display: grid;
   grid-template-rows: ${props => props.type == 2 ? '200px 440px 128px' : '656px 128px'} ;
   row-gap: 16px;
   
`
 
export default function Index() {   
  //const projectId = useSelector(selectProjectId);
  let {exparams} = useOutletContext()
  const [qverview, setOverview] = useState({}) 
  const [tabvalue, setTabvalue] = useState(1)  
  const {detail, total='', proportion, coalStandard, consume={}, analysisDes='', consumes=[], ...energyitem} = qverview;  
  let type = ['', '日', '月', '年'][exparams.type]
  let my = ['', '昨', '上', '去'][exparams.type]

 
  const Chartbox = ({data, op, type, my, tabvalue}) => {
    if(!op || !type || !my || data?.length < 1 ) return
    const ref = useRef()
    const charw = () => {
     try {
      let {x =[], y=[], y1=[]} = data || {}

      let cost = ['',
      ["time", `本${type}(万元)`, `${my}${type}(万元)`],
      ["time", `本${type}(元)`, `${my}${type}(元)`],
      ["time", `本${type}(元)`, `${my}${type}(元)`],
      ["time", `本${type}(元)`, `${my}${type}(元)`],
      ["time", `本${type}(元)`, `${my}${type}(元)`],
      ["time", `本${type}(元)`, `${my}${type}(元)`],
      ["time", `本${type}(元)`, `${my}${type}(元)`],
      ["time", `本${type}(元)`, `${my}${type}(元)`],
    ]
      let energy = ['',
      ["time", `本${type}能耗(吨标煤)`, `${my}${type}能耗(吨标煤)`],
      ["time", `本${type}(kWh)`, `${my}${type}(kWh)`],
      ["time", `今${type}(m³)`, `${my}${type}(m³)`],
      ["time", `今${type}(m³)`, `${my}${type}(m³)`],
      ["time", `今${type}(m³)`, `${my}${type}(m³)`],
      ["time", `今${type}(m³)`, `${my}${type}(m³)`],
      ["time", `今${type}(吨)`, `${my}${type}(吨)`],
      ["time", `今${type}(吨)`, `${my}${type}(吨)`],
    ]
      let dimensions = ['', energy, cost ][op][tabvalue]      
      let source = x.map((v, index) => ({time: v,[dimensions[1]]: y[index], [dimensions[2]]: y1[index]}))
      drawEcharts(ref.current, {
        dataset: {dimensions, source},
        series: [{ type: "bar", barGap: 0 }, { type: "bar", barGap: 0 }],
      })
     } catch (error) {
       console.log(error)
     }
   
  }
    useEffect(() => {
       charw()
    }, [])
    return (
      <Echartbox ref={ref}>
 
      </Echartbox>
    )
}

const EngItem = ({name, unit, periodValue, lastMonthPeriodValue, lastYearPeriodValue, mom, yoy
}) => {
  let icon = unit.indexOf("kWh")>-1 ? 'electric' : unit.indexOf("m")>-1  ? 'water' : '';
  return (
   <Titlelayout
   title={<Title title={name} subtitle={unit} />}
   key={nanoid()}
 >
   <UDbox>
     <Image
       src={imgurl[icon]}
       preview={false}
       width={64}
       height={64}
     />
     <div className="list">
       <div className="item">
         <span>本{type}</span>
         <span>{periodValue}</span>
       </div>
       <div className="item">
         <span>{my}{type}</span>
         <span>{lastMonthPeriodValue}</span>
       </div>
       <div className="item">
         <span>环比</span>

         
          {numberformat(mom)}
          
       </div>
       <div className="item">
         <span>同比</span>
          
          {numberformat(yoy)}
           
       </div>
     </div>
   </UDbox>
 </Titlelayout>
  )
  }
const Energyitem = () => {
   const getsub = (type) => {
     switch(type) {
       case 'electric':
       return '(kWh)'
       case 'waterCold':
       case 'waterHot':
       case 'steam':
       case 'gas':
       return '(m³)'
       case 'oil':
        return '(吨)'
       default:
        return '(/)'
     }


   }
   let items = []
   for(let [key, value] of Object.entries(energyitem)) {
      let obj = {
         icon: key,
         data: value,
         sub: getsub(key)
      }
      items.push(obj)
   }
   let extra = [{
    lastMonthPeriodValue: "0.00",
    lastYearPeriodValue: "0.00",
    mom: "100.00%",
    name: "公共服务用水",
    periodValue: "0.00",
    unit: "(m³)",
    yoy: "100.00%",
   },
   {
    lastMonthPeriodValue: "0.00",
    lastYearPeriodValue: "0.00",
    mom: "100.00%",
    name: "消费及其他特殊用水(m³)",
    periodValue: "0.00",
    unit: "(m³)",
    yoy: "100.00%",
   }
  ]

   return (
    <>
      {
       [...consumes,...extra].map(item => <EngItem  {...item} key={nanoid()}/>)
      }
    </>
  

   )
}
const Electric = ({data, des}) => {
  const pieref = useRef()
  useEffect(() => {
    drawEcharts(pieref.current, {
      pieData: { data: proportion, total: 100 },
      type: 3,
      legend: {
        bottom: 0,
        top: 'auto',
        itemGap: 5
      },
      grid: {
        bottom: 20
      }
    });
  }, [])
  return (
    <ElectricRight type={tabvalue}>
      <Titlelayout title={<Title title={data?.name} />} key="electr" >
      <Engbox type={tabvalue}>
        <Image
          src={imgurl.z08}
          preview={false}
          width={64}
          height={64}
        />
      <div className="list">
        <div className="item">
          <span>本{type}：</span>
          <span>{data.periodValue}</span>
          <span>同比</span>
          {numberformat(data.yoy)}
        </div>
        <div className="item">
          <span>{my}{type}：</span>
          <span>{data.lastMonthPeriodValue}</span>
          <span>环比</span>
          
        
            {numberformat(data.mom)}
          
        </div>
      </div>
     </Engbox>
    </Titlelayout>
    { tabvalue == 2 && <Titlelayout
      type="inner"
      title={<Title title={`本${type}能耗占比`} />}
      key="pie"
    >
      <div
        style={{ width: "368px", height: "356px" }}
        ref={pieref}
      ></div>
    </Titlelayout>
   }
      <Titlelayout title="能耗分析" key="analysis">
        <div style={{flex: 1, display:'flex', alignItems: 'center', height: '100%'}}>
         <Space size={8}><span style={{color: "#0c6", fontSize: '18px'}}>&#9673;</span><span style={{color: '#515151'}}>{des}</span></Space>
        </div>
      </Titlelayout>
    </ElectricRight>
  )


}
const CoalStandard =({data={}, op}) => {
  const pieref = useRef()
  useEffect(() => {
    drawEcharts(pieref.current, {
      pieData: { data: proportion, total: 100 },
      type: 3,
      legend: {
        bottom: 0,
        top: 'auto',
        itemGap: 5
      },
      grid: {
        bottom: 20
      }
    });
  }, [])
  return (
    <Titlelayout title={<Title title={data?.name} />}>
    <Divbox>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          alignItems: "center",
        }}
      >
        <Image
          src={imgurl['coalStandard']}
          preview={false}
          width={64}
          height={64}
        />
        <span style={{ color: "#999", marginTop: "10px" }}>
         {op ==1 ? <>（吨标煤）</> : <>（万）</>}
        </span>
      </div>

      <div className="list">
        <div className="item">
          <span>本{type}能耗：</span>
          <span>{data.periodValue}</span>
        </div>
        <div className="item">
          <span>{my}{type}能耗：</span>
          <span>{data.lastMonthPeriodValue}</span>
        </div>
        <div className="item">
          <span>同比</span>
          {numberformat(data.yoy)}
         
        </div>
        <div className="item">
          <span>环比</span>
          
            {numberformat(data.mom)}
        
          
        </div>
      </div>
    </Divbox>
    <Titlelayout
      type="inner"
      title={<Title title="能耗占比" />}
      style={{ padding: "0px", border: "none" }}
    >
      <div
        style={{ width: "368px", height: "284px" }}
        ref={pieref}
      ></div>
    </Titlelayout>
  </Titlelayout>
  )
}

  const tabs = [
    { label: "综合能耗", key: 1, },
    { label: "电", key: 2,  },
    { label: "用水", key: 3 },
   /*  { label: "热力", key: 4 },
    { label: "气体燃料", key: 5 },
    { label: "液体燃料", key: 6 },
    { label: "固态燃料", key: 7 },
    { label: "碳酸盐", key: 8 }, */
  ];


  const getData = async () => {    
    const {areaId, date, type, shiftNo, view, projectId} = exparams
    let time;
    if (type == 1)  {
      time = date.format('YYYY-MM-DD')
    } else if(type == 2) {
      time = date.format('YYYY-MM') + '-01'

    } else if(type == 3) {
       time = date.format('YYYY')+ '-01-01'
    }
    const querys = {
      type,
      shiftNo,
      projectId,
      date: time
   }
    const param = [areaId]
    let energy = ['', 'QueryOverview', 'QueryElectric', 'QueryWaterCold', 'QueryWaterHot', 'QuerySteam', 'QueryGas', 'QueryCoal', 'QueryOil']
    let cost = ['', 'QueryOverviewCost', 'QueryElectricCost', 'QueryWaterColdCost', 'QueryWaterHotCost', 'QuerySteamCost', 'QueryGasCost', 'QueryCoalCost', 'QueryOilCost']
    let handler = ['', energy, cost][view][tabvalue]
    try {
     let {success, data} =  await EnergyComprehensive[handler](querys, param)
   
     if(success) {
      setOverview({...qverview, ...data})
     }else {
       return {}
     }
    } catch (e) {
      console.log(e)
    }
  }
  const ontabChange = (e) => {   
    setTabvalue(e)
  }
  useEffect(() => {
    let values = Object.values(exparams)
    if(values.length >= 5)   getData()
  }, [tabvalue, exparams])

  const Title = ({ title, subtitle, jc }) => {
    return (
      <Custspan className="t" jc={jc} ellipsis={{tooltip: title}}>
        {title}
        <span>{subtitle}</span>
      </Custspan>
    );
  };
 
  return (
    <Pagecount bgcolor="transparent" pd="0">
      <div style={{display: 'flex',  flex: 1}}>   
      <Laybox   className={ tabvalue == 1 ? 'zonghe' : 'classify'}>
        <div className="up">
          <div className="upleft">
             <Tabsbox defaultActiveKey={1} items={tabs} onChange={ontabChange}>
             </Tabsbox>
             <Chartbox  data={detail} op={exparams.view} type={type} my={my} tabvalue={tabvalue} />
           </div>
           {tabvalue == 1 ? <CoalStandard  op={exparams.view}  data={coalStandard} key="CoalStandard"  /> : <Electric data={consume} des={analysisDes} key="Electric" /> }
         </div>  
        
       {tabvalue == 1 && <div className="down">
             <Energyitem key="12" /> 
        </div>
       }
     
      </Laybox>
      </div>
    </Pagecount>
  );
}
