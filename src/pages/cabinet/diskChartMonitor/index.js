import React, { useEffect, useState, useRef, useMemo } from 'react'
import moment from 'moment'
import { useSelector } from 'react-redux'
import { Form, Image, message, Progress, Select,Space,Input,   DatePicker, Typography, Drawer, Descriptions,Timeline } from 'antd'
import Pagecount from '@com/pagecontent'
import {CloseOutlined} from "@ant-design/icons"
import {isObject} from "@com/usehandler"
import {CustLink, i18t, i18warning, CustButton, CustButtonT} from "@com/useButton"
import styled , {css} from 'styled-components'
 
import { Radiogroup, Cdivider } from "@com/comstyled"
import {enterprise,selectProjectId,adaptation} from "@redux/systemconfig"
import Titlelayout from '@com/titlelayout';
import imgsrc from "./imgs"
import Ichart from '@com/useEcharts/Ichart'
 
import Usetable from '@com/useTable'
import GouIcon from '@imgs/gou.png'
import temp from './imgs/temp.png'
import Info from './info'
import Electric from './electric'
 
const {Link, Text, Title} = Typography
const {Item} = Descriptions
const {RangePicker} = DatePicker
const {TextArea } = Input
const titlesty = css`
    padding-left: 16px;
    border-left: 4px solid  ${props=> props.theme.primaryColor}; 
    font-size: ${props => props.theme.laptop ? "14px" : "16px"}; 
`
const CDrawer = styled(Drawer)`
&& {
  .ant-drawer-content-wrapper {
    min-width: 928px;
    width: calc(100% - 400px) !important;
    top: 0;
    height: 100%;
  }
  .ant-drawer-body {
    display: flex;
    flex-direction: column;
  }
  .ant-drawer-header{
    .ant-drawer-title {
      ${titlesty}
  }
  .ant-drawer-extra {
    flex: 2;
    display: flex;
  }
  }

 
}`
const Dot = styled.div`
&&{
  width: 16px;
          height: 16px;
          border-radius: 50%;
          border: 1px solid ${props => props.state==1 ? props.theme.primaryColor : props.theme.successColor }; // 1 告警确认
          background-color:  ${props => props.state == 3 ? "transparent" : props.state==2? props.theme.primaryColor : props.theme.successColor} ;
         background-image: url(${props => props.state== 1 ? GouIcon : null});
         background-position: center;
         background-size: 8px;
         background-repeat: no-repeat;
          
}
         
           
`
const DDrawer = styled(Drawer)`
&& {
  .ant-drawer-content-wrapper {
  //  min-width: 1036px;
    width:  ${props => props.wh || "100%"} !important;
    top: 0;
    height: 100%;
    transform: translateX(0px) !important;
    .ant-drawer-content{
      background-color: transparent;
    }
  }
  .ant-drawer-body {
    display: flex;
    column-gap: 8px;
    .left {
      flex:1;
      position: relative;
      display: flex;
      .leftmain  {
         display: flex;
         flex:1;
         flex-direction: column;
         row-gap: 16px;
       .alarm{
        padding-left: 16px;
        display: flex;
        row-gap: 32px;
        flex-direction: column;
        
       }
     
      }
    }
    .mainbox {
      display: flex;
      flex-basis:1036px;
      flex-direction: column;
      row-gap: 16px;
      background-color: #fff;
      padding: 0 16px;
      .ctitle {
        display: flex;
        justify-content: space-between;
        background-color: #f2f2f2;
        padding: 16px;
        margin: 0 -16px;
        .text {
          ${titlesty}
        }
        .close {
          color:#d6d6d6;
          font-size: 22px;
          transition: all 0.3s;
          &:hover {
            color:#333;
          }
  }
      }
      .htitle {
        height: 32px;
        padding: 0 16px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        background-color: rgb(215,215,215);
      }
    
    }
   
  }
  .ant-drawer-header{
    .ant-drawer-title {
    padding-left: 16px;
    border-left: 4px solid  ${props=> props.theme.primaryColor}; 
    font-size: ${props => props.theme.laptop ? "14px" : "16px"}; 
  }
  
  }

 
}`
const Mainbox =styled.div`
  flex:1;
  display: flex;
  column-gap: 32px;
   
  .part {
    position: relative;
    flex: 0 0 360px;
    height: 866px;
    background-repeat: no-repeat;
  //  padding-top: 26px;
  //  background-image:  url(${imgsrc['bg']});
  //  background-size: 320px 866px;
    padding: 26px 1px 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow: hidden;
    
   &:nth-of-type(1){
        background-image: url(${imgsrc['P1']});
        .h3d {
          position: absolute;
         
          width: 142px;
          height: 220px;
          left: 109px;
          bottom: 218px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          .text {
             height: 18px;
             display: flex;
             align-items: center;
             justify-content: center;
          }
          .detail{
            height: 160px;
            cursor: pointer;
             .state {
            display: flex;
            justify-content: center;
            img+img {
              padding-left: 8px;
            }
           }
          }
          
        }
    }
    &:nth-of-type(2){
        background-image: url(${imgsrc['P2']});
        
    }
    &:nth-of-type(3){
        flex: 0 0 320px;
        background-image: url(${imgsrc['P3']});
        
    }
    &:nth-of-type(4){
        flex: 0 0 320px;
        background-image: url(${imgsrc['P4']});
        
    }  
     
    .title {
        height: 22px;
        background-color: ${props=> props.theme.primaryColor};
        color: #fff;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 1px 16px;
        width: 100%;
        .ant-typography{
            color: #fff;
            display: inline-flex;
            align-items: center;
            img {
                padding-right: 0.5em;
            }
        }
    }
  }
`  
const Extrea = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex:1;
  .close {
     color:#d6d6d6;
     font-size: 22px;
     transition: all 0.3s;
     &:hover {
      color:#333;
     }
  }
`
const options = [
  {
    label: i18t("comm","month"),
    value: 1,
  },
  {
    label: i18t("comm","year"),
    value: 2,
  },
];




/* 月，年。没有日 */
export default function Index() {
const {laptop} = useSelector(adaptation)
 const [open, setOpen] = useState(false)
 const [copen, setCopen] = useState(false)
 const [iopen, setIopen] = useState(false)
 const [title, setTitle] = useState("变压器柜温度趋势") 
 const [ctitle, setCtitle] = useState("有源滤波回路") 
 const [ititle, setititle] = useState("告警详情") 
 const  onOpen = () => {
   setOpen(true)
 }
 const  onCopen = () => {
  setCopen(true)
}
 
const vdata= [
  Array.from({length: 24}, (_, index) => index > 9 ? `${index}:00` : `0${index}:00`),
  Array.from({length:24}, (_,index) => (Math.random()*100)?.toFixed(2)),
  Array.from({length:24}, (_,index) => (Math.random()*100)?.toFixed(2))
]
const vstate =[
  {title: "断路器状态", state: "合闸"},
  {title: "故障脱口次数", state: 0},
  {title: "开关操作次数", state: 4}

]
const vedata=[
  {title: "A相电压", num: "400.00V"},
  {title: "B相电压", num: "400.00V"},
  {title: "C相电压", num: "400.00V"},
  {title: "AB线电压", num: "400.00V"},
  {title: "BC线电压", num: "400.00V"},
  {title: "CA线电压", num: "400.00V"},
  {title: "A相电流", num: "400.00A"},
  {title: "B相电流", num: "400.00A"},
  {title: "C相电流", num: "400.00A"},
  {title: "零线电流", num: "400.00A"},
  {title: "剩余电流", num: "400.00A"},
  {title: "电网频率", num: "50.00Hz"},
]

const columns = [
  {
    title: "等级",
    dataIndex: "level",
    key: "level",
    render: (text) => {
      return text==1 ? <Text type="danger">高危</Text> : null
    }

  },
  {
    title: "发生时间",
    dataIndex: "startTime",
    key: "startTime"
  },
  {
    title: "报警类型",
    dataIndex: "alarmType",
    key: "alarmType"
  },
  {
    title: "状态",
    dataIndex: "state",
    key:"state",
    render: (text) => {
         return text==1  ? <Link type="danger" onClick={() => setIopen(true)}>未确认</Link> : <Text type="success">已确认</Text>

         
    }
  }
]
const dataSource = [
  {
  level: 1,
  startTime: moment().subtract(7,"days").format("yyyy-MM-DD HH:mm:ss"),
  alarmType: "温度超限",
  state:1,
},
{
  level: 1,
  startTime: moment().subtract(27,"days").format("yyyy-MM-DD HH:mm:ss"),
  alarmType: "设备离线",
  state:2,
}
]
let moption ={
 // color: ["#ff7345","#6a6e88"],
  series: [{type: "line",   seriesLayoutBy: 'row', yAxisIndex: 0, name: "温度"},{type: "line",   seriesLayoutBy: 'row', yAxisIndex: 1, name: "湿度"}],
  grid: {
      right: "32px",
      left: 0,
      top: "32px",
      bottom: 0,
       containLabel: true,
   },
   legend: {
     top: "0px",
     left: "32px"
  },
  yAxis: [
    {
      
      axisLabel: {
        formatter: '{value}°C'
      }
    },
    {
      name: "环境湿度",
      nameLocation: "center",
      nameGap:64,
      position: "right",
      axisLabel: {
        formatter: '{value}%HR'
      }
    }
  ],
  dataset: { 
    dimensions: [{name: "时间", type: "time"}, {name:"温度" }, {name:"湿度" }],
    source: vdata,
    sourceHeader: false,
  }
}

// 自定义告警详情描述类别样式
 const descsty = {
  backgroundColor: "#e1f3e7",
  padding: "8px 16px"
 }

 const Extra =({ist,title, fn}) =>{ 
  return (<Extrea>
 {ist && <RangePicker /> }
<CloseOutlined onClick={fn} className='close' />
 </Extrea>)
 }
 
  return (
    <Pagecount  >
      <Mainbox>
        <div className='part'>
            <div className="title">
               <Link onClick={onOpen}>
                  <img src={temp} alt="" /> 
                   温度：28.1
                </Link>
                <Link onClick={onOpen}>
                  <img src={imgsrc["smoke"]} alt="" /> 
                   烟感：无烟
                </Link>
                <CustLink text="details" underline={false} onClick={onOpen}></CustLink>
            </div>         
            <div className='h3d' onClick={null}>
               <div className="text">进线柜</div>
               <div className='detail' onClick={onCopen}>
               <div className='state'>
                  <img src={imgsrc["red"]}></img>
                  <img src={imgsrc['close']}></img>
               </div>
                 

               </div>
            </div>
           
        </div>
        <div className='part'>
        <div className="title">
               <Link onClick={onOpen}>
                  <img src={temp} alt="" /> 
                   温度：28.1
                </Link>
                <Link onClick={onOpen}>
                  <img src={imgsrc["smoke"]} alt="" /> 
                   烟感：无烟
                </Link>
                <CustLink text="details" underline={false} ></CustLink>
            </div>
        </div>
        <div className='part'>
        <div className="title">
               <Link onClick={onOpen}>
                  <img src={temp} alt="" /> 
                   温度：28.1
                </Link>
                <Link onClick={onOpen}>
                  <img src={imgsrc["smoke"]} alt="" /> 
                   烟感：无烟
                </Link>
                <CustLink text="details" underline={false} ></CustLink>
            </div>
        </div>
        <div className='part'>
        <div className="title">
               <Link onClick={onOpen}>
                  <img src={temp} alt="" /> 
                   温度：28.1
                </Link>
                <Link onClick={onOpen}>
                  <img src={imgsrc["smoke"]} alt="" /> 
                   烟感：无烟
                </Link>
                <CustLink text="details" underline={false} ></CustLink>
            </div>
        </div>
      </Mainbox>
      <CDrawer
            title={title}
            
            open={open}
            bodyStyle={{
              backgroundColor: '#fff',
            }}
            headerStyle={{
              backgroundColor: '#f2f2f2',
              padding: '16px 32px',
              borderBottom: 'none',
              display: "flex", 
            }}
            
            closable={false}
            extra={<Extra ist={true} fn={() => setOpen(false)} /> }
          >
            
            <div style={{ flex: 1, backgroundColor: "#fff" }}>
              <Ichart {...moption} />
             
            </div>
          </CDrawer>
          <DDrawer
           // title={ctitle}
          //  ref={refdd}
           
            open={copen}
            bodyStyle={{ 
              padding: "0px",
            }}
            headerStyle={{
              backgroundColor: '#f2f2f2',
              padding: '16px',
              borderBottom: 'none',
              display: "flex", 
            }}
            
            closable={false}
        //    extra={<Extra  fn={() => setCopen(false)} />}
          >
             <div className='left'>
            <DDrawer
            title="告警详情" 
            wh="524px"
            open={iopen}
            bodyStyle={{
              backgroundColor: '#fff',
              padding: '16px 24px 16px 16px',
            }}
            headerStyle={{
              backgroundColor: '#fff',
              padding: '16px 24px 16px 16px',
              borderBottom: 'none',
              display: "flex", 
            }}
            placement="right"
            mask={false}
            closable={false}
            getContainer={false}
            style={{
              position: 'absolute',
            }}
            extra= {<Extra  fn={() => setIopen(false)} />}
            footerStyle={{display: "flex", backgroundColor: "#fff",justifyContent: "flex-end"}}
            footer={<Space><CustButtonT text="cancel" ghost onClick={() => setIopen(false)}></CustButtonT><CustButtonT text="ok"></CustButtonT></Space>}
          >
              <div className='leftmain'>
                <Descriptions column={1} colon={null} bordered contentStyle={descsty} labelStyle={descsty}>
                  <Item label="报警类别">温度超限报警</Item>
                  <Item label="变电站">1#变电站</Item>
                  <Item label="柜体">p2</Item>
                  <Item label="回路名称">/</Item>
                  <Item label="报警设备">B相温度传感器</Item>
                  <Item label="通信地址" contentStyle={{backgroundColor: "#fff"}} labelStyle={{backgroundColor: "#fff"}}>215084530</Item>
                </Descriptions>
                <div>
                  <Title level={4}>告警等级</Title>
                  <CustButton danger>高风险</CustButton>
                </div>
                <div  className='alarm'>
                    <div><Text>告警状态</Text></div> 
                    <Timeline>
                    <Timeline.Item dot={<Dot state={1} /> }>
                      <Space size={laptop ? 16 : 32}><Text type="danger">告警发生</Text> <Text>{moment().subtract(7,"hours").format("yyyy-MM-DD HH:mm:ss")}</Text></Space>
                    </Timeline.Item>
                    <Timeline.Item dot={<Dot state={2} /> }>
                      <Space size={laptop ? 16 : 32}><Link >告警确认</Link> <Link>{moment().subtract(1,"hours").format("yyyy-MM-DD HH:mm:ss")}</Link></Space>
                    </Timeline.Item>
                    <Timeline.Item dot={<Dot state={3} /> }>
                      <Space size={laptop ? 16 : 32}><Text type="success">报警解除</Text> <Text>{moment().format("yyyy-MM-DD HH:mm:ss")}</Text></Space>
                    </Timeline.Item>
                    </Timeline>
                </div>
                <div>
                <Title level={4}>告警记录</Title>
                <TextArea row={6} autoSize={false}></TextArea>
                </div>
              </div>

            </DDrawer>
            </div>
            <div className="mainbox">
             <div className='ctitle'>
              <div className='text'>框架断路器</div>
              <CloseOutlined onClick={() => setCopen(false)} className='close' /> 
              </div> 
              <div className="htitle">
                <span>设备快照</span>
                <span>
                    {
                      moment().format("yyyy-MM-DD HH:mm:ss")
                    }
                </span>
              </div>
               <Info vstate={vstate} />
              <div className="htitle">
                <span>报警信息</span>
              </div>
              <div>
              <Usetable  
              hbg="#0066cc"
              columns={columns}
              dataSource={dataSource}  
         />
              </div>
              
          <div className="htitle">
                <span>遥测</span>
                <span>
                    {
                      moment().format("yyyy-MM-DD HH:mm:ss")
                    }
                </span>
              </div>
              <Electric datas={vedata} />
            </div>
           
          </DDrawer>
    </Pagecount>

  )
}
