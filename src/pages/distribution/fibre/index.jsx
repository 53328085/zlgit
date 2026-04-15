import React, { useState, useMemo, useCallback, useEffect, useRef,useImperativeHandle,forwardRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { SearchOutlined ,CloseOutlined, CodeSandboxCircleFilled} from '@ant-design/icons';
import { Select, Button, DatePicker, Form, Divider, message, Input, Timeline, Typography ,Space} from 'antd'
import { DistributionRoomRuntime, distributionRoom } from '@api/api.js'

import UseTable from '@com/useTable'
import styled, {keyframes} from 'styled-components'
import BlueColumn from '@com/bluecolumn'
import time from './time.png'
import { drawEcharts } from "@com/useEcharts";
import { selectProjectId, selectcurlRommid,adaptation} from '@redux/systemconfig.js'
import { useReactive } from 'ahooks'
import UseModal from '@com/useModal' 
import  Ichart from '@com/useEcharts/Ichart' 
import dayjs from 'dayjs';
import Titlelayout from '@com/titlelayout'
import Pagecount from "@com/pagecontent";
const {Paragraph} = Typography
const activecss = keyframes`
   0%{
        background-color: #ff6666;
      }
      100%{
        background-color:#ff9494; 
      }
`
const Pt = styled(Paragraph)`
  && {
    margin-bottom: 0px;
  }
`
const WrapDiv = styled.div`
 flex: 1;
  display: grid;
  gap: 16px;
  grid-template-columns: 1fr 323px;
  grid-template-rows: minmax(352px,1fr) minmax(432px, 1fr);
  grid-template-areas:
  "a c"
  "b c";
 /*  @keyframes activecss {
      0%{
        background-color: #ff6666;
      }
      100%{
        background-color:#ff9494; 
      }
    } */
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
      padding-top: 16px;
      .fiberarea{
    //  display: grid;
    display: flex;
    flex-wrap: wrap;
       gap: 8px; 
       padding: 4px ; 
      .box{
        background-color: #ecf5ff;
        color: #333;
        border: 1px solid #ccc;
        border-radius: 2px;
        display: flex;
        align-items: center;
        justify-content: center;         
        padding: 4px;
        width: 136px;
        height: 64px;
        cursor: pointer;
      }
      .normal {
        background-color: #ecf5ff;
      }
      .active{  // 报警
        animation: ${activecss} .8s linear infinite;
        outline: 1px solid #cc0000;
        color:#fff;
      }
      .current {  // 选中
         outline:2px solid #090;
         color: #fff;
      }
      .offline {  // 失联
        background-color: #ccc;
        color: #333
      }
      .active.box.current {
        outline: none;
        color:#fff;
        .ant-typography {
          color:#fff;
        }
      }
    }
    }
    
   
  }
  .griditem2{
    grid-area: b;
    .headtime{
        display: flex;
        align-items: center;
        
      }
    .head{
      display: flex;
      justify-content: space-between;
    
      .time{
          width: 96px;
          justify-content: space-around;
        }
    }
    .content{
      padding-top: 16px;
      display: flex;
      .status{
      border: 1px solid #d7d7d7;
      border-radius: 4px;
      padding: 16px 12px;
      width: 250px;
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
            
              border-radius: 50%;
              margin-right: 16px;
            }
            .normal {
              background-color: #00cc33;
              border:1px solid #00a633;
            }
            .waring{
              animation: ${activecss} .8s linear infinite;
              border: 1px solid #cc0000;
             }
             .unknown {
              background-color: #ccc;
              border:1px solid #ccc;
             }
          }
      }
    }
    .chart{
       display: flex;
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
    height: 750px;
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
  const roomId = useSelector(selectcurlRommid)
  let {laptop} = useSelector(adaptation)
  const chartRef = useRef()
  const [activename,setActiveName]=useState('')
  const chooseBox = (i,it) => { 
    if(!it.sn)return  
    setActive(i)
    setActiveName('通道'+it.channel + " " +it.subfieldName)
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
  const QueryFibreTempilPartitions =async ()=>{
    try {
    const {success, data, errMsg} = await  DistributionRoomRuntime.QueryFibreTempilPartitions({
      projectId,
      roomId
    }) 
    if(success){
      setActive(0)
      if (Array.isArray(data) && data.length > 0) {
        setActiveName('通道'+ data[0]['channel'] + " "+data[0]['subfieldName'])
            let {sn} = data[0]
          if(sn)   QuerySinglePartitionsInfo(sn)
         
        setChannel(data)
      } else {
        setActiveName('')
        channelInfo.info = {}
        channelInfo.warnlist=[]
        channelInfo.typeopts=[]
        setChannel([])
       // initchart()
      }
    }else{
      message.error(errMsg)
    }
    } catch (error) {
      console.log(error)
    }
   
  } 
  //分区信息
  const QuerySinglePartitionsInfo=async(sn)=>{
    if(!sn){
      message.warning("请先绑定设备！")
      return
    }
    const res = await DistributionRoomRuntime.QuerySinglePartitionsInfo({
      projectId,
      sn,
   
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
  const lineoption ={
    dataset: {
      dimensions: [
        {
          name: 'x',
          displayName: '时间'
        },
        {
          name: 'y',
          displayName: '光纤测点温度'
        }
      ],
       source: Array.isArray(channelInfo.info?.tempData) ? channelInfo.info?.tempData : [],

     },
   
     xAxis: {
      axisLabel: {
         formatter: (value, index) => {
             return dayjs(value, "YYYY-MM-DD HH:mm:ss").format("HH:mm")
         }
      }
    },
     series: [{type: 'line', smooth:true, showSymbol: false,}]
  }
  const initchart =()=>{

    drawEcharts(chartRef.current, {
       dataset: {
        dimensions: [
          {
            name: 'x',
            displayName: '时间'
          },
          {
            name: 'y',
            displayName: '光纤测点温度'
          }
        ],
         source: Array.isArray(channelInfo.info.tempData) ? channelInfo.info.tempData : [],

       },
      dataZoom: {
        type: 'inside'
      },
      xAxis: {
        axisLabel: {
           formatter: (value, index) => {
               return dayjs(value, "YYYY-MM-DD hh:mm:ss").format("hh:mm")
           }
        }
      },
       series: [{type: 'line', smooth:true, showSymbol: false,}]
       
    })

 

    /* const chartdom = echarts.init(chartRef.current)
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
    chartdom.setOption(opt) */
  }
  //告警列表
  const QueryFibreTempilWarningInfo=async()=>{
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
  const QueryFibreTempilWarningRecords= async()=>{
  
    try {
      const formvalue = form.getFieldsValue()
      console.log(formvalue)
      const start =formvalue.time&&formvalue.time[0]?dayjs(formvalue.time[0]).format('YYYY-MM-DD 00:00:00'):dayjs().format('YYYY-MM-DD 00:00:00')
      const end =formvalue.time&&formvalue.time[1]?dayjs(formvalue.time[1]).format('YYYY-MM-DD 23:59:59'):dayjs().format('YYYY-MM-DD 23:59:59')
      const alarmType = formvalue.dangerType?formvalue.dangerType:(channelInfo.typeopts&&channelInfo.typeopts[0])?channelInfo.typeopts[0]:1
      
      const res = await DistributionRoomRuntime.QueryFibreTempilWarningRecords({
        projectId,
        roomId: roomId,
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
 
  const disabledDate = (current) => {
    
    return current && current > dayjs().endOf('day');
  };

  useEffect(() => {
    if(roomId && projectId) {
      QueryFibreTempilWarningInfo()
      QueryFibreTempilPartitions()
    }
    
  }, [roomId, projectId])
 
 
/*   useEffect(()=>{
    channelInfo.info.tempData && initchart()
  },[channelInfo.info.tempData]) */
  useEffect(()=>{
    QueryAlarmType()
    
  },[])
  return (
    <Pagecount bgcolor="transparent" pd="0">
    <div className='flexcol griditem1'>
     {/*  <UseHead 
      QueryFibreTempilPartitions={QueryFibreTempilPartitions} 
      active={active} 
      setActive={setActive} 
      setChannel={setChannel} 
      channelInfo={channelInfo}
      initchart={initchart}
      QueryFibreTempilWarningInfo={QueryFibreTempilWarningInfo}
      ref={headRef}
      /> */}
      <WrapDiv>
        <Titlelayout title="光纤测温分区" layout="flex" className="griditem1" >
          
          <div className='overy'>
            <div className='fiberarea'>
            {
             channel.length>0&&channel.map(
                (it, i) => (
                  <div className={ `${it.state == 2 ? 'normal' : it.state == 3 ?  'active' : "offline"} box ${active == i ? 'current' : ""}` } key={it.sn+i} onClick={() => { 
                    chooseBox(i,it) 
                    QuerySinglePartitionsInfo(it.sn)
                    }}>
                   
                    <Pt ellipsis={{
                      tooltip: it.subfieldName,
                      rows: 2,
                    }}>{it.subfieldName}</Pt>
                  </div>
                )
              )
            }
            </div>
          </div>
          
        </Titlelayout>
        <Titlelayout className='griditem2' title={<div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
            <span>{activename}</span>
             <div className='headtime'>
                <img src={time} alt="" /> 
                <span>&nbsp;更新时间： {channelInfo.info.updateTime}</span>
             </div>
          </div>}>          
          <div className='content'>
            <div className='status'>
              <h5>分区状态</h5>
              <div className='statusitem'>

              <div className='sitem' key="preW">
                      <div className={`circle ${channelInfo.info.preW==='1' ?'waring': channelInfo.info.preW==='0'?  'normal' : "unknown"}` }></div>
                      <span>预报警</span>
               </div>

               <div className='sitem' key="fireW">
                      <div className={`circle ${channelInfo.info.fireW==='1' ?'waring': channelInfo.info.fireW==='0' ?  'normal' : "unknown"}` }></div>
                      <span>火警</span>
               </div>

               <div className='sitem' key="tmpW">
                      <div className={`circle ${channelInfo.info.tmpW==='1' ?'waring': channelInfo.info.tmpW==='0' ?  'normal' : "unknown"}` }></div>
                      <span>升温报警</span>
               </div>

               {/*  {
                  channelInfo.info.states?.length > 0 
                  &&channelInfo.info.states.map(
                    item=>(
                      <div className='sitem' key={item}>
                      <div className={`circle ${item.stateFlag==1?'active':null}` }></div>
                      <span>{item.state}</span>
                    </div>
                    )
                  )
                } */}
              </div>
              <Divider dashed style={{ borderColor: "#999", margin: "16px 0" }}></Divider>
              <Form labelCol={{span: 11}} labelAlign='left' labelWrap={true} >
                <Item >分区报警阀值</Item>
                <Item label="预报警阈值" >
                  <Input size='small' value={channelInfo.info.preWV}></Input>
                </Item>
                <Item label="火警阀值" >
                  <Input size='small' value={channelInfo.info.fireWV}></Input>
                </Item>
                <Item label="温升报警阈值" >
                  <Input size='small' value={channelInfo.info.tmpWV}></Input>
                </Item>
              </Form>
            </div>
            <div className='chart' ref={chartRef}>
               <Ichart {...lineoption}/>
            </div>
          </div>
        </Titlelayout>
        <Titlelayout className='griditem3' layout="flex" title={<div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
          <span>报警信息</span>
           <Button type="link" onClick={SeeDetail}>查看详细</Button>
        </div>}>
           <div style={{flex: 1}}>
          <Timeline className='timeline'>
            {channelInfo.warnlist.length>0&&channelInfo.warnlist.map(it=>{
              return(
                <Timeline.Item key={it.warningTime} dot={<div
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
        </Titlelayout>
      </WrapDiv>
      <ModalDiv>
        <UseModal mold='cust' ref={modalRef} width={laptop ? 1000 : 1600} footer={null} getContainer={false} title="报警日志查看" closable>
          {/* <BlueColumn name="报警日志查看" styled={{ padding: '32px 0' }}>
            <CloseOutlined
              style={{ marginLeft: 'auto', fontSize: 16, cursor: 'pointer' }}
              onClick={close}
            ></CloseOutlined>
          </BlueColumn> */}
          <Form
            layout='inline'
            form={form}
            initialValues={{
              time: [dayjs().subtract(7, 'day'), dayjs()],
              dangerType: channelInfo.typeopts[0]?.x
            }}
          >
            <Space size={16}>
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
            
            <Item label="报警类型" name="dangerType">
              <Select 
              style={{ width: 160 }} 
              options={channelInfo.typeopts} 
              fieldNames={{ label: 'y', value: 'x' }}
              onChange={QueryFibreTempilWarningRecords}
              ></Select>
            </Item>
            </Space>
          </Form>
            <CusTable ref={tableRef} QueryFibreTempilWarningRecords={QueryFibreTempilWarningRecords}></CusTable>
          
        </UseModal>
      </ModalDiv>
    </div>
    </Pagecount>
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