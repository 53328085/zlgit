import React, { useState, useMemo, useEffect, useRef,useImperativeHandle,forwardRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { SearchOutlined ,CloseOutlined} from '@ant-design/icons';
import { Select, Button, DatePicker, Form, Divider, message, Input, Timeline } from 'antd'
import { DistributionRoomRuntime, distributionRoom } from '@api/api.js'
import UseHead from '../usehead'
import UseTable from '@com/useTable'
import styled from 'styled-components'
import BlueColumn from '@com/bluecolumn'
import time from './time.png'
import * as echarts from "echarts";
import { selectProjectId, selectOneLevel, selectOneLevelDefaultId, levelDefaultLabel } from '@redux/systemconfig.js'
import { useReactive } from 'ahooks'
import UseModal from '@com/useModal' 

import moment from 'moment';

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
    display: flex;
    flex-direction: column;
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
      flex: 1;
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
const ModalDiv = styled.div`
  .ant-modal-body{
    height: 850px;
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

const { Item } = Form
const { RangePicker  } = DatePicker

export default function Index() {
  const [active, setActive] = useState(0)
  const projectId = useSelector(selectProjectId)
  const chartRef = useRef()
  const [activename,setActiveName]=useState('')
  const chooseBox = (i,it) => {
    setActive(i)
    setActiveName(it.name)
  }
  const [level, setLevel] = useState(1)
  const [channel,setChannel] = useState([])
  const channelInfo = useReactive({
    info:{},
    warnlist:[],
    typeopts:[],
   
  })
  const modalRef=useRef()
  const [form]=Form.useForm()
  const headRef =useRef()
  const tableRef=useRef()
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
  //获取分区
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
        }else{
          channelInfo.info = {}
          initchart()
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
  //分区信息
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
  //告警列表
  const QueryFibreTempilWarningInfo=async(roomId)=>{
    const res = await DistributionRoomRuntime.QueryFibreTempilWarningInfo({projectId,roomId})
    if(res.success){
      if(res.data &&  Array.isArray(res.data)){
        channelInfo.warnlist = res.data
      }else{
        channelInfo.warnlist = []
      }
    }else{
      message.error(res.errMsg)
      channelInfo.warnlist = []
    }
  }
  //告警类型
  const QueryAlarmType=async ()=>{
    try{
     const res = await DistributionRoomRuntime.QueryAlarmType()
     if(res.success){
      console.log(form.getFieldsValue())
      if(res.data &&Array.isArray(res.data)){
        channelInfo.typeopts=res.data
      }else{
        channelInfo.typeopts=[]
      }
      
     }
    }catch(e){
      console.log(e)
    }
  }
  //报警日志
  const QueryFibreTempilWarningRecords=async()=>{
    try {
      const formvalue = form.getFieldsValue()
      const start =formvalue.time&&formvalue.time[0]?moment(formvalue.time[0]).format('YYYY-MM-DD 00:00:00'):moment().format('YYYY-MM-DD 00:00:00')
      const end =formvalue.time&&formvalue.time[1]?moment(formvalue.time[1]).format('YYYY-MM-DD 23:59:59'):moment().format('YYYY-MM-DD 23:59:59')
      const alarmType = formvalue.dangerType?formvalue.dangerType:(channelInfo.typeopts&&channelInfo.typeopts[0])?channelInfo.typeopts[0]:1
      const res = await DistributionRoomRuntime.QueryFibreTempilWarningRecords({
        projectId,
        roomId:headRef.current.roomId,
        start,
        end,
        alarmType,
      })
      if(res.success){
        if(res.data){
          tableRef.current?.setTabledata(res.data)
        }else{
         
          tableRef.current?.setTabledata([])
        }
      }else{
        message.error(res.errMsg)
      }
    } catch (error) {
      console.log(error)
    }
    
  }
  const SeeDetail=()=>{
    modalRef.current.onOpen()
  }
  const close=()=>{
    modalRef.current.onCancel()
  }
  const disabledDate = (current) => {
    
    return current && current > moment().endOf('day');
  };
  useEffect(()=>{
    channelInfo.info.tempData && initchart()
  },[channelInfo.info.tempData])
  useEffect(()=>{
    QueryAlarmType()
    
  },[])
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
      ref={headRef}
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
                      <div className='sitem' key={item}>
                      <div className={`circle ${item.stateFlag==1?'active':null}` }></div>
                      <span>{item.state}</span>
                    </div>
                    )
                  )
                }
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
                <Timeline.Item key={it} dot={<div
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
      <ModalDiv>
        <UseModal mold='cust' ref={modalRef} width={1600} footer={null} getContainer={false}>
          <BlueColumn name="报警日志查看" styled={{ padding: '32px 0' }}>
            <CloseOutlined
              style={{ marginLeft: 'auto', fontSize: 16, cursor: 'pointer' }}
              onClick={close}
            ></CloseOutlined>
          </BlueColumn>
          <Form
            layout='inline'
            form={form}
            initialValues={{
              time: [moment(), moment()],
              dangerType: channelInfo.typeopts[0]?.x
            }}
          >
            <Item name="time">
              <RangePicker format='YYYY-MM-DD' disabledDate={disabledDate}></RangePicker>
            </Item>
            <Item >
              <Button
                type="primary"
                icon={<SearchOutlined />}
                onClick={QueryFibreTempilWarningRecords}
              >
                查询
              </Button>
            </Item>
            <Item >
              <Divider dashed type='vertical' style={{ borderColor: "#999", height: 26 }}></Divider>
            </Item>
            <Item label="报警类型" name="dangerType">
              <Select 
              style={{ width: 160 }} 
              options={channelInfo.typeopts} 
              fieldNames={{ label: 'y', value: 'x' }}
              onChange={QueryFibreTempilWarningRecords}
              ></Select>
            </Item>
          </Form>
            <CusTable ref={tableRef} QueryFibreTempilWarningRecords={QueryFibreTempilWarningRecords}></CusTable>
          
        </UseModal>
      </ModalDiv>
    </div>
  )
}
const CusTable=forwardRef(({QueryFibreTempilWarningRecords},ref)=>{
  const columns=[{
    title:'时间',
    dataIndex:'createTime'
  },{
    title:'类型',
    dataIndex:'alarmType'
  },{
    title:'名称',
    dataIndex:'content'
  },{
    title:'地点',
    dataIndex:'address'
  },{
    title:'指标量',
    dataIndex:'originalIndicator'
  },{
    title:'备注',
    dataIndex:'remark'
  }]
const [tabledata,setTabledata]=useState()
useEffect(()=>{
  QueryFibreTempilWarningRecords(setTabledata)
},[])
useImperativeHandle(ref,()=>{
  return {
    setTabledata
  }
})
  return (
    <UseTable columns={columns} style={{ marginTop: 24 }} dataSource={tabledata} ></UseTable>
  )
}
)