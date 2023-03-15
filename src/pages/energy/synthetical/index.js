import React, { useState, useRef, useEffect, useMemo } from "react";
import { nanoid } from "@reduxjs/toolkit";
import { Form, Radio, Button, Progress, Image, Space, DatePicker, Select, Tabs} from "antd";
import styled from "styled-components";
import UserSearch from "@com/useSerach";
import CustContext from "@com/content.js";
import { drawEcharts } from "@com/useEcharts";
import {EnergyComprehensive} from "@api/api.js"
import Titlelayout from "@com/titlelayout";
import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";
import {useSelector} from 'react-redux'
import {selectProjectId, selectOneLevelDefaultId} from '@redux/systemconfig.js'
import moment from 'moment';
import imgurl from "./icon";

const { Group, Button: Rbutton } = Radio;


const Laybox = styled.div`
  display: grid;
  flex: 1;
  &.zonghe {
   grid-template-rows: 40px 472px 272px;
  row-gap: 16px;
  .up {
    display: grid;
    grid-template-columns: 1256px 408px;
    column-gap: 16px; 
  }
  .down { 
      display: grid;
      grid-template-columns: repeat(8, 196px);
      column-gap: 16px;
      overflow: hidden;
  }
  }
  &.classify {
    .up {
      flex:1;
      display: grid;
      grid-template-columns: 1264px 400px;
      column-gap: 16px;

    }
  
  }
 
`;
const Custspan = styled.span`
  font-size: 14px;
  color: #515151;
  display: flex;
  justify-content: ${(props) => (props.jc ? "flex-start" : "space-between")};
  span {
    color: #999;
    padding-left: 1em;
  }
`;
const Ebutton = styled(Button)`
  &,
  &:hover {
    height: 32px;
    border: 1px solid #80cc80;
    background-color: #ccffb3;
    color: #339900;
    line-height: 32px;
    font-size: 14px;
    padding-top: 0;
    padding-bottom: 0;
    width: 96px;
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
const UDboxbord = styled(Divbox)`  
  border-top: 1px dotted #d7d7d7;
`
const Echartbox = styled.div`
   height: 477px;
   width: 1256px;
   background-color: #fff;
   padding: 16px;
   border: 1px solid #d7d7d7;
`
export default function Index() {
  const elref = useRef(null)
  const pieref = useRef();
  const projectId = useSelector(selectProjectId);
  
  const [form] = Form.useForm();
  const {Item} = Form
  const [value, setvalue] = useState("1");
  const [qverview, setOverview] = useState({})
  const [timetype, setTimetype] = useState(1) // 日、月、年 1， 2， 3
  const [tabvalue, setTabvalue] = useState('1')
  const picker= ['', 'date', 'month', 'year'][timetype];
  const {detail, total, proportion, coalStandard, ...energyitem} = qverview;
  console.log(coalStandard)
  let type = ['', '日', '月', '年'][timetype]
  const Chartbox = ({data}) => {
    const ref = useRef()
    const charw = () => {
     try {
      let {x, y, y1} = data
      let dimensions = ["time", `本${type}能耗(吨标煤)`, `昨${type}能耗(吨标煤)`]
      let source = x.map((v, index) => ({time: v, [`本${type}能耗(吨标煤)`]: y[index], [`昨${type}能耗(吨标煤)`]: y1[index]}))
      drawEcharts(ref.current, {
        dataset: {dimensions, source},
        series: [{ type: "bar" }, { type: "bar" }],
      })
     } catch (error) {
       console.log(error)
     }
   
  }
    useEffect(() => {
      charw()
    }, [timetype, tabvalue])
    return (
      <Echartbox ref={ref}>
 
      </Echartbox>
    )
}

const EngItem = ({icon, data, sub, ...otherprop}) => {
  return (
   <Titlelayout
   {...otherprop}
   title={<Title title={data.name} subtitle={sub} />}
   key={nanoid()}
 >
   <UDbox>
     <Image
       src={imgurl.z02}
       preview={false}
       width={64}
       height={64}
     />
     <div className="list">
       <div className="item">
         <span>`本{type}`</span>
         <span>{data.periodValue}</span>
       </div>
       <div className="item">
         <span>`上{type}`</span>
         <span>{data.lastMonthPeriodValue}</span>
       </div>
       <div className="item">
         <span>环比</span>
         <span>
           +{data.mom}{" "}
           <Arrow num={data.mom}/>
         </span>
       </div>
       <div className="item">
         <span>同比</span>
         <span>
           +{data.yoy}{" "}
           <Arrow num={data.yoy}/>
         </span>
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
       return '(㎡)'
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
  

   return (
    <>
      {
        items.map(item => <EngItem  {...item} key={item.type}/>)
      }
    </>
  

   )
}

const CoalStandard =({data={}}) => {
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
          src={imgurl.z08}
          preview={false}
          width={80}
          height={80}
        />
        <span style={{ color: "#999", marginTop: "10px" }}>
          (吨标煤)
        </span>
      </div>

      <div className="list">
        <div className="item">
          <span>本{type}能耗：</span>
          <span>{data.periodValue}</span>
        </div>
        <div className="item">
          <span>昨{type}能耗：</span>
          <span>{data.lastMonthPeriodValue}</span>
        </div>
        <div className="item">
          <span>同比</span>
          <span>
          {data.yoy}
            <ArrowDownOutlined style={{ color: "#f00" }} />
          </span>
        </div>
        <div className="item">
          <span>环比</span>
          <span>
            {data.mom}
            <ArrowUpOutlined style={{ color: "#f00" }} />
          </span>
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
    { label: "综合能耗", key: "1", },
    { label: "电", key: "2",  },
    { label: "冷水", key: "3" },
    { label: "热水", key: "4" },
    { label: "燃气", key: "5" },
    { label: "煤炭", key: "6" },
    { label: "燃油", key: "7" },
    { label: "其他", key: "8" },
  ];


  const getData = async () => {
    const {area, date, type} = form.getFieldsValue()
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
      projectId,
      date: time
   }
    const param = [area]
    try {
     let {success, data} =  await EnergyComprehensive.EnergyOverViewRuntime(querys, param)
     console.log(data)
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
    console.log(e)
    setTabvalue(e)
  }
  useEffect(() => {
   
    getData()
  }, [tabvalue])


  const Title = ({ title, subtitle, jc }) => {
    return (
      <Custspan className="t" jc={jc}>
        {title}
        <span>{subtitle}</span>
      </Custspan>
    );
  };
 
  const Arrow = ({num}) => {
    if (Number.isNaN(num)) return
    return num > 0  ? ( <ArrowUpOutlined style={{ color: "#f00" }} />) :  (<ArrowDownOutlined style={{ color: "#06f" }} />)
  }

  const timechange = (e) => {
     setTimetype(e);
     getData()
  }
  const CustView = () => {
   const viewstyle = {
      display: 'flex',
       justifyContent: "space-between",
       flex: 1
    }
    return (
      <div style={viewstyle}>
       <Item nostyle name="view">
        <Radio.Group
        options={[
          {
            label: '能耗',
            value: 'Apple',
          },
          {
            label: '费用',
            value: 'Pear',
          }]}
        optionType="button"
        buttonStyle="solid"
         />
        </Item>
      <Space size={16}>
        <Item label="日期选择" name="type" initialValue={1}>
           <Select style={{width: '80px'}}   options={[
            {value: 1, label: '日'},
            {value: 2, label: '月'},
            {value: 3, label: '年'},
           ]}
           onChange={timechange}
           ></Select>
        </Item>
        <Item nostyle name="date"  initialValue={moment(new Date(), 'YYYY-MM-DD')}>
          <DatePicker placeholder="请选择日期" picker={picker} onChange={getData} />
        </Item>
      </Space>
      </div>
    )
  }
  return (
    <CustContext.Provider
      value={{
        form,
        custview: <CustView />,
       // tabs,
        handler: getData,
        value,
        setvalue,
      }}
    >

      <div style={{display: 'grid', gridTemplateRows: '48px 1fr', rowGap: '16px', flex: 1}}>
      <UserSearch></UserSearch>
      <Laybox value={value} className={ tabvalue == '1' ? 'zonghe' : 'classify'}>
        <div className="up">
          
          <Tabsbox defaultActiveKey="1" items={tabs} onChange={ontabChange}>
          </Tabsbox>
          <Chartbox  data={detail} />
           <div>
          
            <CoalStandard data={coalStandard} />
           </div>
     
          
        </div>
       {tabvalue == '1' && <div className="down">
             <Energyitem />
        </div>
       }
     
      </Laybox>
      </div>
    </CustContext.Provider>
  );
}
