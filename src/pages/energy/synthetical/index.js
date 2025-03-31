import React, { useState, useRef, useEffect,useCallback } from "react";
import { nanoid } from "@reduxjs/toolkit";
import { Image, Space, Tabs, Typography, Radio} from "antd";
import styled, {css} from "styled-components";
import {useOutletContext} from 'react-router-dom' 
import { drawEcharts } from "@com/useEcharts";
import {EnergyComprehensive} from "@api/api.js"
import Titlelayout from "@com/titlelayout";
 import {useSelector} from 'react-redux'
 import {selectOneLevel,adaptation} from '@redux/systemconfig.js'
import {numberformat, getTime} from '@com/usehandler'
import Pagecount from "@com/pagecontent";
import imgurl from "./icon";
import Charttable from './chartTable'
 
const {Text} = Typography
 const sty = css`
  grid-template-columns: 1fr max-content;
 `

const Laybox = styled.div`
  display: grid;
  flex: 1;
  &.zonghe {
   grid-template-rows: minmax(512px, 1fr) 272px;
   row-gap: 16px;
  .up {
    display: grid;
    grid-template-columns: 1256px 1fr;
    column-gap: 16px; 
    overflow: hidden;
    ${props=> props.laptop ? sty : null}
    .upleft {
      display: grid;
      grid-template-rows: 40px minmax(472px, 1fr);
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
      ${props=> props.laptop ? sty : null}
      column-gap: 16px;
      .upleft {
       display: grid;
       grid-template-rows: 40px 1fr;
      }
    }
  
  }
 
`;
const Custspan = styled(Text)`
&& {
  font-size: 14px;
   width: 142px;
  color: #515151;
  display: flex;
  justify-content: ${(props) => (props.jc==1 ? "flex-start" : "space-between")};
 
  span {
    color: #999;
    padding-left: 1em;
  }
}

`;
const divboxsty = css`
.imgbox {
  width: 48px;
  height: 48px;
}
`
const Divbox = styled.div`
  display: grid;
  grid-template-columns: 40% 1fr;
  column-gap: 16px;
  margin: 8px 0 8px 0;
  align-items: center;
  .imgbox {
     width: 64px;
     height: 64px;
     img {
      max-width: 100%;
     }
  }
  .list {
    display: grid;
    grid-auto-rows: 30px;
    align-items: flex-end;
    .item {
      display: flex;
      justify-content: space-around;
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
  ${props=> props.theme.laptop ? divboxsty : null}
`;
const engboxsty=css`
column-gap: 8px;
grid-template-columns: 32px 1fr;
.imgbox{
  width: 32px;
  height: 32px;

}
`
const Engbox = styled.div`
  display: grid;
  grid-template-columns: 64px 1fr;
  column-gap: 32px;
//  height: 100%;
  align-items:   ${props => props.type == 2 ? 'center' : 'start'};
  padding-top:${props => props.type == 2 ? '0px' : '35px'}; 
  .imgbox {
    width: 64px;
    height: 64px;
    img {
      max-width: 100%;
    }
  }
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
  ${props=>props.theme.laptop ? engboxsty : null}
`;
const Tabsbox = styled(Tabs)`
 && {
  .ant-tabs-nav {
    margin-bottom: 0px;
   .ant-tabs-nav-list {
    .ant-tabs-tab {
        border-radius: 6px 6px 0 0;
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
  display: flex;
  flex-direction: column;
  .model {
    display: flex;
    justify-content: flex-end;
  }
  .chart {
    flex: 1;
  }
`
const ElectricRight = styled.div`
   display: grid;
   grid-template-rows: ${props => props.type == 2 ? '200px minmax(440px, 1fr) 128px' : 'minmax(656px, 1fr)  128px'} ;
   row-gap: 16px;
   
`
 
export default function Index() {   
  //const projectId = useSelector(selectProjectId);
  const areaIds = useSelector(selectOneLevel);
  let {laptop} = useSelector(adaptation)
  let {exparams} = useOutletContext() 
  const {areaId, date, type:dateType, shiftNo, view, projectId} = exparams  
  const [qverview, setOverview] = useState({}) 
  const [tabvalue, setTabvalue] = useState(1)  
  const {detail, total='', proportion, coalStandard, consume={}, analysisDes='', consumes=[], ...energyitem} = qverview;  
  let type = ['', '日', '月', '年'][exparams.type]
  let my = ['', '昨', '上', '去'][exparams.type]

  const [model, setModel] = useState(1)
  const Chartbox = ({data, op, type, my, tabvalue, datetype}) => {   
    if(!op || !type || !my || data?.length < 1 ) return
     
    const ref = useRef()
    
    const changeModel=(e)=>{
       setModel(e.target.value)
    }
    
   
      let {x =[], y=[], y1=[]} = data || {}

      let cost = ['',
      ["time", `本${type}(元)`, `${my}${type}(元)`],
      ["time", `本${type}(元)`, `${my}${type}(元)`],
      ["time", `本${type}(元)`, `${my}${type}(元)`],
      ["time", `本${type}(元)`, `${my}${type}(元)`],
      ["time", `本${type}(元)`, `${my}${type}(元)`],
      ["time", `本${type}(元)`, `${my}${type}(元)`],
      ["time", `本${type}(元)`, `${my}${type}(元)`],
      ["time", `本${type}(元)`, `${my}${type}(元)`],
    ]
      let energy = ['',
      ["time",   datetype==1 ?  `本${type}能耗(千克标煤)` : `本${type}能耗(吨标煤)`, datetype==1 ?  `${my}${type}能耗(千克标煤)` : `${my}${type}能耗(吨标煤)`],
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
    const charw = () => {
      try {
      drawEcharts(ref.current, {
        dataset: {dimensions, source},
        series: [{ type: "bar", barGap: "0%" }, { type: "bar", barGap: "0%" }],
      })
     } catch (error) {
       console.log(error)
     }
   
  }
    useEffect(() => {
       charw()
    }, [model])
    return (
      <Echartbox>
            <div className="model">
               <Radio.Group
                onChange={changeModel}
                defaultValue={model}
                buttonStyle="solid"
              >
                <Radio.Button
                  style={{ width: "96px", marginLeft: 16, textAlign: "center" }}
                  value={1}
                >
                  图表模式
                </Radio.Button>
                <Radio.Button
                  style={{ width: "96px", textAlign: "center" }}
                  value={2}
                >
                  表格模式
                </Radio.Button>
              </Radio.Group></div>
            
           {model == 1 ? <div className="chart" ref={ref}></div>
           :  <Charttable source={source} type={exparams.type} tabvalue={tabvalue} /> }
      </Echartbox>
    )
}

const EngItem = ({name, unit, periodValue, lastDayPeriodValue, lastMonthPeriodValue, lastYearPeriodValue, mom, yoy, datetype}) => {
  let type = ['', '日', '月', '年'][datetype]
  let my = ['', '昨', '上', '去'][datetype] 
  let lasttime = ['', lastDayPeriodValue, lastMonthPeriodValue, lastYearPeriodValue][datetype]
  let icon = name.indexOf("电")>-1 ? 'electric' : name.indexOf("水")>-1  ? 'water' : '';
  
  return (
   <Titlelayout
   title={<Title title={name} subtitle={unit} jc={exparams.view} />}
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
         <span>{lasttime}</span>
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
const Energyitem = ({op}) => {
  
 
   let extra = [{
    lastMonthPeriodValue: "0.00",
    lastYearPeriodValue: "0.00",
    mom: "100.00%",
    name: "公共服务用水",
    periodValue: "0.00",
    unit: op==1 ? "(m³)" : '元',
    yoy: "100.00%",
   },
   {
    lastMonthPeriodValue: "0.00",
    lastYearPeriodValue: "0.00",
    mom: "100.00%",
    name: "消费及其他特殊用水(m³)",
    periodValue: "0.00",
    unit: op==1 ? "(m³)" : '元',
    yoy: "100.00%",
   }
  ]

   return (
    <>
      {
       [...consumes,...extra].map(item => <EngItem  {...item} key={nanoid()} datetype={exparams.type} op={op} />)
      }
    </>
  

   )
}
const Electric = ({data, des, datetype, laptop}) => {
  
  let {lastDayPeriodValue,lastMonthPeriodValue,lastYearPeriodValue  } = data
  let timetype = ['', lastDayPeriodValue,lastMonthPeriodValue,lastYearPeriodValue][datetype]
  let icon = tabvalue == 2 ? 'electric' : 'water';
  const pieref = useRef()
  useEffect(() => {
    drawEcharts(pieref.current, {
      pieData: { data: proportion, total: '100%',  radius:["50%", "70%"] },
      type: 3,
      legend: {
        bottom: 0,
        top: 'auto',
        itemGap: 5
      },
      grid: {
        bottom: 20
      },
     
      
    });
  }, [])
  return (
    <ElectricRight type={tabvalue}>
      <Titlelayout title={<Title title={data?.name} />} key="electr" >
      <div style={{height:"100%", display: 'flex', justifyContent:"center"}}>
        
      <Engbox type={tabvalue}>

<div className="imgbox" style={{marginTop: tabvalue==3 ? "16px" : 0}}>
<img
  src={imgurl[icon]} 
/>
</div>
<div className="list">
<div className="item">
  <span>本{type}：</span>
  <Text ellipsis={{tooltip:data.periodValue}}>{data.periodValue}</Text>
  <span>同比</span>
  {numberformat(data.yoy)}
</div>
<div className="item">
  <span>{my}{type}：</span>
  <Text ellipsis={{tooltip:timetype}}>{timetype}</Text>
  <span>环比</span>
  

    {numberformat(data.mom)}
  
</div>
</div>
</Engbox>
 
      </div>
     
    </Titlelayout>
    { tabvalue == 2 && <Titlelayout
      type="inner"
      title={<Title title={`本${type}能耗占比`} />}
      key="pie"
    >
      <div
        style={{ width: laptop ? "300px" : "368px", height: "356px" }}
        ref={pieref}
      ></div>
    </Titlelayout>
   }
      <Titlelayout title="能耗分析" key="analysis" layout="flex">
        <div style={{flex: 1, display:'flex'   }}>
         <div> <span style={{color: "#0c6", fontSize: '18px'}}>&#9673;</span><span style={{color: '#515151'}}>{des}</span></div>
        </div>
      </Titlelayout>
    </ElectricRight>
  )


}
const CoalStandard =({data={}, op, datetype, laptop}) => {
  
  let {lastDayPeriodValue,lastMonthPeriodValue,lastYearPeriodValue  } = data
  let timetype = ['', lastDayPeriodValue,lastMonthPeriodValue,lastYearPeriodValue][datetype]
  const pieref = useRef()
  useEffect(() => {
    drawEcharts(pieref.current, {
      pieData: { data: proportion, total: '100%' },
      type: 3,
      legend: {
        bottom: 0,
        top: 'auto',
        itemGap: 5
      },
      grid: {
        bottom: 20
      },
      radius: ["50%", "70%"]
    });
  }, [])
  return (
    <Titlelayout title={<Title title={data?.name} layout="flex" />}>
    <Divbox>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          alignItems: "center",
          flex: 1,
        }}
      >
        <div className="imgbox">
        <img
          src={imgurl['coalStandard']}
          alt=""
        />
        </div>
       
        <span style={{ color: "#999", marginTop: "10px" }}>
         {op ==1 ? <> （吨标煤）</> : <>（元）</>}
        </span>
      </div>

      <div className="list">
        <div className="item">
          <span>本{type}能耗：</span>
          <span>{data.periodValue}</span>
        </div>
        <div className="item">
          <span>{my}{type}能耗：</span>
          <span>{timetype}</span>
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
      title={<Title title={op==1 ? "能耗占比" :  "能耗费用占比"} />}
      style={{ padding: "0px", border: "none" }}
      layout="flex"
    >
      <div
        style={{ flex:1,width: "368px", height: "284px" }}
        ref={pieref}
      ></div>
    </Titlelayout>
  </Titlelayout>
  )
}

  const tabs = [
    { label: "综合能耗", key: 1, },
    { label: "电", key: 2,  },
    { label: "冷水", key: 3 },
   /*  { label: "热力", key: 4 },
    { label: "气体燃料", key: 5 },
    { label: "液体燃料", key: 6 },
    { label: "固态燃料", key: 7 },
    { label: "碳酸盐", key: 8 }, */
  ];


  const getData = async ({areaId, date,  dateType, shiftNo, view, projectId}) => {    
   
    let id = areaId == 0 ? areaIds?.filter(a => a.id!=0)?.map(a => a.id) : [areaId];
    let time = getTime(date, dateType);
  
    const querys = {
      type: dateType,
      shiftNo,
      projectId,
      date: time
   }
    
    let energy = ['', 'QueryOverview', 'QueryElectric', 'QueryWaterCold', 'QueryWaterHot', 'QuerySteam', 'QueryGas', 'QueryCoal', 'QueryOil']
    let cost = ['', 'QueryOverviewCost', 'QueryElectricCost', 'QueryWaterColdCost', 'QueryWaterHotCost', 'QuerySteamCost', 'QueryGasCost', 'QueryCoalCost', 'QueryOilCost']
    let handler = ['', energy, cost][view][tabvalue]
    try {
     let {success, data} =  await EnergyComprehensive[handler](querys, id)
   
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
    setOverview([])
  }
  useEffect(() => {
     let f = [tabvalue, areaId,  dateType, shiftNo, view, projectId].every(v => Number.isInteger(v)) && date
     if(f) {
      getData({areaId, date, dateType, shiftNo, view, projectId})
     } 
  }, [tabvalue, areaId, date, dateType, shiftNo, view, projectId])

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
      <Laybox   className={ tabvalue == 1 ? 'zonghe' : 'classify'} laptop={laptop}>
        <div className="up">
          <div className="upleft">
             <Tabsbox defaultActiveKey={1} items={tabs} onChange={ontabChange}>
             </Tabsbox>
             <Chartbox  data={detail} op={exparams.view} type={type} my={my}  datetype={exparams.type} tabvalue={tabvalue} />
           </div>
           {tabvalue == 1 ? <CoalStandard  op={exparams.view}  data={coalStandard}  datetype={exparams.type} key="CoalStandard" laptop={laptop}  /> : <Electric data={consume} des={analysisDes}  datetype={exparams.type} laptop={laptop}   key="Electric" /> }
         </div>  
        
       {tabvalue == 1 && <div className="down">
             <Energyitem key="12" op={exparams.view} /> 
        </div>
       }
     
      </Laybox>
      </div>
    </Pagecount>
  );
}
