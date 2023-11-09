import React, { useState, useMemo, useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { SearchOutlined } from '@ant-design/icons';
import { Select, Button, DatePicker, Form, Divider, message, Input, Timeline } from 'antd'
import { DistributionRoomRuntime, distributionRoom } from '@api/api.js'
import UseHead from '../usehead'
import styled from 'styled-components'
import BlueColumn from '@com/bluecolumn'
import time from './time.png'
import * as echarts from "echarts";
import { selectProjectId, selectOneLevel, selectOneLevelDefaultId, levelDefaultLabel } from '@redux/systemconfig.js'
import { useReactive } from 'ahooks'
import UseModal from '@com/useModal' 
const WrapDiv = styled.div`
  display: grid;
  gap: 16px;
  grid-template-columns: 1336px 323px;
  grid-template-rows: 352px 432px;
  grid-template-areas:
  "a c"
  "b c";
  @keyframes activecss {
      0%{
        background-color: #ff6666;
      }
      100%{
        background-color:#ff9494; 
      }
    }
  .griditem{
    background-color: #fff;
    border: 1px solid RGB(215,215,215);
    border-radius: 4px;
    padding: 12px;

  }
  .griditem1{
    grid-area: a;
    .overy{
      height: 290px;
      overflow-y: auto;
      .fiberarea{
      display: grid;
      gap: 16px;
      grid-template-columns: repeat(10,116px);
      grid-template-rows: repeat(auto-fit,56px) ;
      margin:16px 0;
     
      .box{
        background-color: #00cc33;
        color: #fff;
        border: 1px solid #009900;
        border-radius: 2px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-direction: column;
        padding: 4px 0;
        cursor: pointer;
      }
      .active{
        animation: activecss .8s linear infinite;
        border: 1px solid #cc0000;
      }
    }
    }
    
   
  }
  .griditem2{
    grid-area: b;
    .head{
      display: flex;
      justify-content: space-between;
      .headtime{
        display: flex;
        align-items: center;
        
      }
      .time{
          width: 96px;
          justify-content: space-around;
        }
    }
    .content{
      margin: 16px 0;
      display: flex;
      .status{
      border: 1px solid #d7d7d7;
      border-radius: 4px;
      padding: 16px 12px;
      width: 192px;
      height: 352px;
      .ant-form-item{
        margin-bottom: 8px;
      }
      .statusitem{
          .sitem{
            display: flex;
            margin-top: 16px;
            .circle{
              width: 20px;
              height: 20px;
              background-color: #00cc33;
              border:1px solid #00a633;
              border-radius: 50%;
              margin-right: 16px;
            }
            .active{
              animation: activecss .8s linear infinite;
              border: 1px solid #cc0000;
      }
          }
      }
    }
    .chart{
       flex: 1;
       padding-left: 12px;
    }
    } 
  }
  .griditem3{
    grid-area: c;
    .warn{
      display: flex;
      justify-content: space-between;
      .warntext{
        color: #237ae4;
        cursor: pointer;
      }
    }
    .timeline{
      margin-top: 32px;
      .title {
          color:#1e1e1e;
          margin-top:-4px;
          display: flex;
          justify-content: space-between;
        }
        p{
          line-height: 30px;
        }
    }
    
  }
  
`
const opt={
  color:['#6395f9', '#62daab', '#657798'],
  tooltip:{
      trigger: "axis",
      axisPointer: {
          type: "line",
      },
  },
  legend:{
      show: true,
      top: 10,
      icon:'roundRect',
      itemHeight:2,
      itemWidth:16,
  },
  grid:{
      left:10,
      top:50,
      right: 20,
      bottom: 15,
      containLabel: true
  },
  xAxis: {
  type: 'category',
  boundaryGap: false,
  },
  yAxis: {
  type: 'value',
 
  },
  series: [
    {
      name: '温度',
      type: 'line',
      stack: 'Total',
      lineStyle:{
        width:1
      },
      symbol:'circle',
      symbolSize: 6,
  }
]
}
export default function Index() {
  const [active, setActive] = useState(0)
  const projectId = useSelector(selectProjectId)
  const chartRef = useRef()
  const { Item } = Form
  const [activename,setActiveName]=useState('')
  const chooseBox = (i,it) => {
    setActive(i)
    setActiveName(it.name)
  }
  const [level, setLevel] = useState(1)
  const [channel,setChannel] = useState([])
  const channelInfo = useReactive({
    info:{},
    warnlist:[]
  })
  const modalRef=useRef()
  const maparr=(patharr,data,port)=>{
    if(!patharr ){
      return []
    }
    let arr = []
    if (patharr) {
      patharr.forEach((it,index) => {
        it[`pathName`] = data
        it[`port`] =port
        it[`partition`] = index
      })
      arr = [...arr, ...patharr]
    }
    return arr
  }
  const QueryFibreTempilPartitions =async (roomId)=>{
    try {
    const res = await  DistributionRoomRuntime.QueryFibreTempilPartitions({
      projectId,
      roomId
    }) 
    if(res.success){
      if (res.data) {
        const arr1 = maparr(res.data.path1Group,res.data.path1Name,1)
        const arr2 = maparr(res.data.path2Group,res.data.path2Name,2)
        const arr3 = maparr(res.data.path3Group,res.data.path3Name,3)
        const arr4 = maparr(res.data.path4Group,res.data.path4Name,4)
        const arrlist = [...arr1,...arr2,...arr3,...arr4]
        if(arrlist.length>0){
            setActiveName(arrlist[active]['name'])
            QuerySinglePartitionsInfo(arrlist[active],res.data.sn)
        }
        setChannel(arrlist)
      } else {
        setChannel([])
      }
    }else{
      message.error(res.error)
    }
    } catch (error) {
      console.log(error)
    }
   
  } 
  const QuerySinglePartitionsInfo=async(pathGroup,sn)=>{
    const res = await DistributionRoomRuntime.QuerySinglePartitionsInfo({
      projectId,
      sn,
      port :pathGroup.port,
      partition:pathGroup.partition
    })
    if(res.success){
      if(res.data){
        channelInfo.info={...res.data}
      }else{
        channelInfo.info = {}
      }
    }else{
      message.error(res.errMsg)
    }
  }
  const initchart =()=>{
    const chartdom = echarts.init(chartRef.current)
    if(channelInfo.info.tempData){
      const x =channelInfo.info.tempData.map(it=>it.x)
      const y =channelInfo.info.tempData.map(it=>it.y)
      opt.xAxis.data = x
      opt.series=[{
        ...opt.series[0],
        name: '光纤测点温度',
        data:[...y] ,
    }]
    }else{
      opt.xAxis.data=[]
      opt.series=[{
        ...opt.series[0],
        name: '光纤测点温度',
        data:[] ,
    }]
    }
    chartdom.setOption(opt)
  }
  const QueryFibreTempilWarningInfo=async(roomId)=>{
    const res = await DistributionRoomRuntime.QueryFibreTempilWarningInfo({projectId,roomId})
    if(res.success){
     channelInfo.warnlist = res.data
     console.log(channelInfo)
    }else{
      message.error(res.errMsg)
    }
  }
  const SeeDetail=()=>{
    modalRef.current.onOpen()
  }
  useEffect(()=>{
    channelInfo.info.tempData && initchart()
  },[channelInfo.info.tempData])
  return (
    <div>
      <UseHead 
      QueryFibreTempilPartitions={QueryFibreTempilPartitions} 
      active={active} 
      setActive={setActive} 
      setChannel={setChannel} 
      channelInfo={channelInfo}
      initchart={initchart}
      QueryFibreTempilWarningInfo={QueryFibreTempilWarningInfo}
      />
      <WrapDiv>
        <div className='griditem griditem1'>
          <BlueColumn name="光纤测温分区" />
          <div className='overy'>
            <div className='fiberarea'>
            {
             channel.length>0&&channel.map(
                (it, i) => (
                  <div className={active === i ? 'active box' : 'box'} key={i} onClick={() => { chooseBox(i,it) }}>
                    <div>{it.pathName}</div>
                    <div>{it.name}</div>
                  </div>
                )
              )
            }
            </div>
          </div>
          
        </div>
        <div className='griditem griditem2'>
          <div className='head'>
            <BlueColumn name={activename} />
            <div className='headtime'>
              <span className='headtime time'><img src={time} alt="" /> 更新时间： </span>
              <span>{channelInfo.info.updateTime}</span>
            </div>
          </div>
          <div className='content'>
            <div className='status'>
              <h5>分区状态</h5>
              <div className='statusitem'>
                {
                  channelInfo.info.states?.length > 0 
                  &&channelInfo.info.states.map(
                    item=>(
                      <div className='sitem'>
                      <div className={`circle ${item.stateFlag==1?'active':null}` }></div>
                      <span>{item.state}</span>
                    </div>
                    )
                  )
                }
               
                {/* <div className='sitem'>
                  <div className='circle'></div>
                  <span>{channelInfo.states[1].state}</span>
                </div>
                <div className='sitem'>
                  <div className='circle'></div>
                  <span>{channelInfo.states[2].state}</span>
                </div> */}
              </div>
              <Divider dashed style={{ borderColor: "#999", margin: "16px 0" }}></Divider>
              <Form>
                <Item >分区报警阀值</Item>
                <Item label="上线温度" >
                  <Input size='small' value={channelInfo.info.temperatureRange}></Input>
                </Item>
                <Item label="温差范围" >
                  <Input size='small' value={channelInfo.info.topLimitTemp}></Input>
                </Item>
                <Item label="上升速率" >
                  <Input size='small' value={channelInfo.info.risingRate}></Input>
                </Item>
              </Form>
            </div>
            <div className='chart' ref={chartRef}></div>
          </div>
        </div>
        <div className='griditem griditem3'>
          <div className='warn'>
            <BlueColumn name="报警信息" />
            <div className='warntext' onClick={SeeDetail}>
              查看详细
            </div>
          </div>
          <Timeline className='timeline'>
            {channelInfo.warnlist.length>0&&channelInfo.warnlist.map(it=>{
              return(
                <Timeline.Item dot={<div
                  style={{
                    borderRadius: '50%', width: 16, height: 16, border: '1px solid',
                    display: 'flex', justifyContent: 'center', alignItems: 'center',
                    borderColor: level === 1 ? 'rgb(255,112,112)' : level === 2 ? 'rgb(255 183 38)' : 'rgb(176,126,249)'
                  }}>
                  <div style={{ borderRadius: '50%', width: 10, height: 10, background: level === 1 ? 'rgb(255,112,112)' : level === 2 ? 'rgb(255 183 38)' : 'rgb(176,126,249)' }}>
                  </div >
                </div>}>
                  <div>
                    <p className='title'>
                      <span>{it.warningTime}</span>
                      <span>{it.warningType}</span>
                    </p>
                    <p>{it.reason}</p>
                    <p className='content'>{it.location}</p>
                  </div>
                </Timeline.Item>
              )
              
            })}
          </Timeline>
        </div>
      </WrapDiv>
      <UseModal mold ='cust' ref={modalRef} width={1600}>
        <BlueColumn name="报警日志查看" styled={{padding:'32px 0'}}/>
        <Form
        layout='inline'
        >
            <Item></Item>
            <Item>
            <Button
            type="primary"
            icon={<SearchOutlined  />}
            >
              查询
              </Button>
            </Item>
            <Item></Item>
        </Form>
      </UseModal>
    </div>
  )
}
