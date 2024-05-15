import React, { useEffect, useState, useRef } from 'react'
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import Titlelayout from '@com/titlelayout'
import styled from 'styled-components'
import Pagecount from '@com/pagecontent'
import CustContext from '@com/content.js'
import { Form, Image, Progress, Timeline, Select, Divider, Space, DatePicker, message } from 'antd'
import { Liquid } from "@ant-design/charts"
import { drawEcharts } from "@com/useEcharts"
import { useSelector, useStore } from 'react-redux'
import first from '../imgs/first.png'
import second from '../imgs/second.png'
import third from '../imgs/third.png'
import { safeElectric } from '@api/api'
import {  selectOneLevelDefaultId } from '@redux/systemconfig.js'
import moment from 'moment'
const Mainbox = styled.div`
  display: grid;
  color: #515151;
  grid-template-columns: 1fr 432px 784px;
  grid-template-rows: 384px 400px;
  gap: 16px;
  justify-content: flex-end;
  .down {
    
      display: grid;
      grid-template-rows:20px 1fr;
      .chart {
        min-height: 330px;
      }
      .stack {
        // min-height: 312px;
        height:100%
      }
    }


  .pie {
      grid-area: 2 / 1 / 3 / 3;
      display: grid;
      grid-template-rows:20px 270px;
      .chart {
         display: grid;
         grid-template-columns: 400px 400px;
         grid-template-rows: minmax(312px, auto);
         justify-content: space-between;
      }
    }
    
    .content {
      display: grid;
      grid-template-columns: 1fr;
      height: 100%;    
      .cl {
        display: flex;
        align-items: center;
        color:#515151;
        font-size: 32px;
        font-weight: bold;
      }
    }
    .list {
      display: grid;
      grid-auto-rows: 26px;
      align-items: flex-start;
      align-content: flex-end;
      div {
        display: flex;
        justify-content: space-between;
        &:nth-of-type(1) span:first-child{
          color: #ff3333;
        }
        &:nth-of-type(2) span:first-child{
          color: #ff6600;
        }
        &:nth-of-type(3) span:first-child{
          color: #009900;
        }
  }

  }`
const Warnbox = styled.div`
position: relative;
display: grid;
height: 100%;
grid-template-columns: 148px 1fr;
grid-template-rows: 1fr 75px;
gap: 32px;
 align-items: center;
justify-items: center;
.info {
    grid-area: 2 / 1 / 3 /3;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    background-color: #f7f7f7;
    border: 1px solid #dedede;
    border-radius: 4px;
    height: 75px;
    width: 100%;
    div{ 
        font-size: 16px;
        color:#666;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-around;
        & span:last-child{
            color:#ff0000;
            font-size: 14px;
        }
    }
}
.alarm {
 display: grid;
 grid-template-rows: 24px 1px 24px 1px 24px;
 row-gap: 16px;
 div {
  padding-left: 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  //  &:first-of-type {
  //   border-left: 2px solid #f8857d;
  //  }
  //  &:last-of-type {
  //   border-left: 2px solid #5d9fff;
  //  }
 }
 
}`

export default function Index() {
  const Timelinebox = styled(Timeline)`
  height: 280px;
  overflow: hidden;
  margin-top: 28px;
  background-color: #fff;
  padding-left: 5px;
  padding-top: 15px;
  & .transformcss{
    animation:${props=>{if(props.children.props.children?.props?.children?.length>4){return 'transY'}}} ${props=>((props.children.props.children?.props?.children?.length)*1.2)}s 1s linear infinite
  }
  .transformcss:hover{
    animation-play-state: paused;
  }
 &::-webkit-scrollbar{
    width:0px
  }
 .ant-timeline-item {
   padding-bottom: 24px;
   padding-top:5px
 }
 .title {
   color:#1e1e1e;
   margin-top:-4px;
   display: flex;
   justify-content: space-between;
 }
 .content {
   font-size: 12px;
   color:#6b6b6b;
 }
 @keyframes transY{
   0%{
      transform:translateY(0)
   }
   100%{
    
    transform:translateY(-${props=>props.dmheight}px)
      /* transform:translateY(${props=>{ if(-(props.children.props.children?.length)*91.84){return -(props.children.props.children?.length)*91.84+280} }}px) */
   }
 }
`
  const [form] = Form.useForm()
  const bref = useRef(null)
  const pref = useRef(null)
  const opref = useRef(null)
  const lref = useRef(null)
  const warnref = useRef();
 
  const navigate = useNavigate()
  const projectId = useSelector(state => state.system.menus.projectId)

 
  const [warnData, setWarnData] = useState()
  const areaId = useSelector(selectOneLevelDefaultId);  
  const [datasetMonthl, setDatasetMonthl] = useState()
  const [warnlist, setWarnlist] = useState([])//最新告警
  
  const pageParmasRef = useRef()
  pageParmasRef.current = {
      pageSize:6,
      pageNum:1,
  }
  const pageTotalRef = useRef()
  pageTotalRef.current = 0
  const grid = {
    // 图表 grid
    left: "0px",
    right: "0",
    top: "30px",
    bottom: "0px",
    containLabel: true,
  }
  let params = {
    projectId,
    areaId
  }
  // const datasetMonthl = {
  //   dimensions: ["time", "本月", "上月"],
  //   source: [
  //     { time: "1", "本月": 5600, "上月": 9600 },
  //     { time: "2", "本月": 4600, "上月": 3644 },
  //     { time: "3", "本月": 3600, "上月": 4644 },
  //     { time: "4", "本月": 5611, "上月": 9655 },
  //     { time: "5", "本月": 5644, "上月": 3677 },
  //     { time: "6", "本月": 4677, "上月": 3633 },
  //     { time: "7", "本月": 3688, "上月": 4655 },
  //     { time: "8", "本月": 5088, "上月": 2644 },
  //     { time: "9", "本月": 6677, "上月": 2641 },
  //     { time: "10", "本月": 5866, "上月": 5641 },
  //     { time: "11", "本月": 4677, "上月": 7645 },
  //     { time: "12", "本月": 1877, "上月": 2645 },
  //   ],
  // };


  //查询今日告警
  const getQueryWarningDetails = async () => {  
    try {
      const res = await safeElectric.TodayWarningStatistics(params)
    if (res.success) {
      setWarnData({ ...res.data })
    } else {
      message.error(res.errMsg)
    }
    } catch (error) {
      
    }
    
  }
  //查询本月告警趋势
  const getQueryMonthWarningTrends = async () => {
    try {
      const res = await safeElectric.QueryMonthWarningTrends(params)
      if (res.success) {
        const length = Math.max(res.data.lastMonth.length, res.data.month.length)
        let arr = []
        for (let i = 0; i < length; i++) {
          arr.push({
            time: i + 1,
            "本月": res.data.month[i].value,
            "上月": res.data.lastMonth[i].value
          })
        }
        setDatasetMonthl(() => ({ dimensions: ["time", "本月", "上月"], source: arr }))
      } else {
        message.error(res.errMsg)
      }
    } catch (error) {
      
    }
   
  }
  drawEcharts(lref.current, {
    dataset: datasetMonthl,
    series: [{ type: "line" }, { type: "line" }],
    grid: {
      top: '30px',
      left: 0,
      right: 0,
      bottom: '30px',
      containLabel: true,
    },
    legend: {
      top: 'auto',
      bottom: 0,
      icon: 'rect',
      itemHeight: 2,
      itemWidth: 12,
      itemGap: 20,
    }
  })


  //查询最新告警(分页)
  const getWarningDetailsPage= async () => {
    let parma ={
      ...params,
      ...pageParmasRef.current
    }
    const res = await safeElectric.WarningDetailsPage(parma)
  
    if (res.success) {
      pageTotalRef.current = res.total
      if (res.data && Array.isArray(res.data)) {
        setWarnlist([...res.data])
      } else {
        setWarnlist([])
      }
    } else {
      message.error(res.errMsg)
    }
  }
  //查询最新告警（总数）
  const getWarningDetailsList= async () => {
    const res = await safeElectric.WarningDetailsList(params)
  
    if (res.success) {
      pageTotalRef.current = res.data.length*64
      console.log(pageTotalRef.current)
      if (res.data && Array.isArray(res.data)) {
        setWarnlist([...res.data])
      } else {
        setWarnlist([])
      }
    } else {
      message.error(res.errMsg)
    }
  }
  const tdrawEcharts = () => {
    return drawEcharts(warnref.current, {
      type: 4,
      liuqiu: {
        series: {
         data: [(warnData?.todayWarningCnt/100)],
       
        label: {
          normal: {
            formatter: function() {
                return `今日告警\n\n\n${warnData?.todayWarningCnt}次`;
            },
            textStyle: {
                fontSize: 16,
                color: '#333'
            },
            position: ['50%', '65%']
         }
        },
        
      },
      
    }
    })
  }
useEffect(() => {
    tdrawEcharts()
},[warnData])
  useEffect(() => {    
    getQueryWarningDetails()
    getQueryMonthWarningTrends()
    // getWarningDetailsPage()
    getWarningDetailsList()
  }, [areaId])
  const fs = {
    hv: '24px',
    fc: '#333'
  }
  const [domheight,setDomHeight] =useState(0)
  const [speed,setSpeed]=useState(0)
  const mapobj = new Map([[1,{color:'#ff7070',text:'一级告警'}],[2,{color:'#ffb726',text:'二级告警'}],[3,{color:'#b07ef9',text:'三级告警'}]])
  useEffect(()=>{
    if(document.getElementById('warn')&&warnlist.length>0){
      const warndom = document.getElementById('warn')
      console.log(warndom.getBoundingClientRect())
      setDomHeight(warndom.getBoundingClientRect().height-326)
      setSpeed(warndom.getBoundingClientRect().height/60)
    }
  },[warnlist.length])


  return (
    <CustContext.Provider value={{ form }}>
      <Pagecount bgcolor="transparent" pd="0px">       
        <Mainbox>
          <Titlelayout title={'今日告警'} {...fs}>
            <Warnbox>
              <div style={{ width: '148px', height: '148px' }} ref={warnref}>
            
                
              </div>
              <div className='alarm'>
                <div className='warning'>
                  <img src={first} style={{ width: 36, height: 36 }}></img>
                  <span style={{ padding: '0 40px 0 16px' }}>一级告警</span>
                  <span style={{ fontSize: 18 }}>{warnData?.levelOneCnt} </span>
                </div>
                <Divider style={{ margin: 0, borderColor: "#d7d7d7" }} dashed />
                <div className='warning'>
                  <img src={second} style={{ width: 36, height: 36 }}></img>
                  <span style={{ padding: '0 40px 0 16px' }}>二级告警</span>
                  <span style={{ fontSize: 18 }}>{warnData?.levelTwoCnt} </span>

                </div>
                <Divider style={{ margin: 0, borderColor: "#d7d7d7" }} dashed />
                <div className='warning'>
                  <img src={third} style={{ width: 36, height: 36 }}></img>
                  <span style={{ padding: '0 40px 0 16px' }}>三级告警</span>
                  <span style={{ fontSize: 18 }}>{warnData?.levelThreeCnt} </span>
                </div>

              </div>
              <div className='info'>
                <div>
                  <span style={{ fontSize: 14 }}>本周告警</span>
                  <span style={{ fontSize: 16 }}>{warnData?.weekWarningCnt}</span>
                </div>
                <div>
                  <span style={{ fontSize: 14 }}>本月告警</span>
                  <span style={{ fontSize: 16 }}>{warnData?.monthWarningCnt}</span>
                </div>
                <div>
                  <span style={{ fontSize: 14 }}>本年告警</span>
                  <span style={{ fontSize: 16 }}>{warnData?.yearWarningCnt}</span>
                </div>
              </div>
            </Warnbox>
          </Titlelayout>
       
          {/* <div onClick={()=>{navigate("/index/runtimeSafe/alarmDetail",{state: {title: '告警详情', nested: 'alarmDetail', primary: 'runtimeSafe'}})}}>查看详情</div> */}
          <Titlelayout title={'最新告警'} extra={<NavLink to={{ pathname: "/index/runtimeSafe/alarmDetail" }} state={{ title: '告警详情', nested: 'alarmDetail', primary: 'runtimeSafe' }}>查看详情</NavLink>} {...fs}>
            <Timelinebox dmheight={domheight} speed={speed}>
              <div className='transformcss' pageTotalRef={pageTotalRef} id='warn'>
               <Timeline>
              {
             warnlist&&warnlist.length>3?
              [...warnlist.map(
                it => {
                  return (
                    <Timeline.Item dot={<div 
                    style={{
                      borderRadius:'50%', width:16,height:16,border:'1px solid',
                      display:'flex',justifyContent: 'center',alignItems: 'center',
                      borderColor: it.level===1?'rgb(255,112,112)':it.level===2?'rgb(255 183 38)':'rgb(176,126,249)'}}>
                      <div style={{borderRadius:'50%',width:10,height:10,background: it.level===1?'rgb(255,112,112)':it.level===2?'rgb(255 183 38)':'rgb(176,126,249)'}}>
                      </div >
                      </div>}>
                      <div>
                        <p className='title'>
                          <span>{it.warningTime}</span>  
                          <span  style={{ color:mapobj.get(it.level).color,fontSize:12 }}>{mapobj.get(it.level).text}</span>
                        </p>
                        <p>{it.alarmEvent}</p>
                        <p className='content'>{it.name}  {it.address}    </p>
                      </div>
                    </Timeline.Item>
                  )
                }
              ),
                <div style={{height:326,overflow:'hidden'}}>
                {warnlist.map(
                it => {
                  return (
                    <Timeline.Item dot={<div 
                    style={{
                      borderRadius:'50%', width:16,height:16,border:'1px solid',
                      display:'flex',justifyContent: 'center',alignItems: 'center',
                      borderColor: it.level===1?'rgb(255,112,112)':it.level===2?'rgb(255 183 38)':'rgb(176,126,249)'}}>
                      <div style={{borderRadius:'50%',width:10,height:10,background: it.level===1?'rgb(255,112,112)':it.level===2?'rgb(255 183 38)':'rgb(176,126,249)'}}>
                      </div >
                      </div>}>
                      <div>
                        <p className='title'>
                        <span>{it.warningTime}</span>  
                        <span  style={{ color:mapobj.get(it.level).color,fontSize:12 }}>{mapobj.get(it.level).text}</span>
                        </p>
                        <p>{it.alarmEvent}</p>
                        <p className='content'>{it.name}  {it.address}    </p>
                      </div>
                    </Timeline.Item>
                  )
                }
              )}
              </div>
                  ]: [...warnlist.map(
                    it => {
                      return (
                        <Timeline.Item dot={<div 
                        style={{
                          borderRadius:'50%', width:16,height:16,border:'1px solid',
                          display:'flex',justifyContent: 'center',alignItems: 'center',
                          borderColor: it.level===1?'rgb(255,112,112)':it.level===2?'rgb(255 183 38)':'rgb(176,126,249)'}}>
                          <div style={{borderRadius:'50%',width:10,height:10,background: it.level===1?'rgb(255,112,112)':it.level===2?'rgb(255 183 38)':'rgb(176,126,249)'}}>
                          </div >
                          </div>}>
                          <div>
                            <p className='title'>
                              <span>{it.warningTime}</span>  
                              <span  style={{ color:mapobj.get(it.level).color,fontSize:12 }}>{mapobj.get(it.level).text}</span>
                            </p>
                            <p>{it.alarmEvent}</p>
                            <p className='content'>{it.name}  {it.address}    </p>
                          </div>
                        </Timeline.Item>
                      )
                    }
                  )
                      ]
             }
             </Timeline>
              </div>
           
            
            </Timelinebox>
          </Titlelayout>
          <Titlelayout className="down" title="本月告警趋势" {...fs}>
            <div className='chart' ref={lref}>

            </div>
          </Titlelayout>

          <Alarm pref={pref} opref={opref} areaId={areaId} />
          <AlarmRank bref={bref} areaId={areaId} />
        </Mainbox>
      </Pagecount>
    </CustContext.Provider>
  )
}

//告警分布组件
const Alarm = ({ pref, opref, areaId }) => {
  const projectId = useSelector(state => state.system.menus.projectId)
  const [pieData, setPieData] = useState()
  const [opieData, setOpieData] = useState()
  const [dateform] = Form.useForm()
  const arealist = useSelector(state => state.system.onelevel)
  const getQueryWarningDistributed = async (type = 1, date = moment().format('YYYY-MM-DD')) => {
    let params = {
      projectId,
      type,
      date,
      areaId,
    }
    const res = await safeElectric.QueryWarningDistributed(params)
    if (res.success) {
      if (res.data.deviceGroup && Array.isArray(res.data.deviceGroup)) {
        if(res.data.deviceGroup.length > 0) {
          setPieData([...res.data.deviceGroup])
        }else{
          setPieData(null)
        }
   
      } else {
        setPieData(null)
      }

      if (res.data.levelGroup && Array.isArray(res.data.levelGroup)) {
        if(res.data.levelGroup.length > 0) {
          const arr=[]
          for(let val of res.data.levelGroup) {
            if(val.name === '1级告警'){
              arr[0]=val
            }else if(val.name === '2级告警'){
              arr[1]=val
            }else{
              arr[2]=val
            }
            
          }
          setOpieData(arr)
        }else{
          setOpieData(null)
        }
       
      } else {
        setOpieData(null)
      }

    } else {
      message.error(res.errMsg)
    }
  }
  //获取日期格式
  const getdateformat = (dateType, date) => {
  
    if (dateType === 1) {
      date = moment(date).format('YYYY-MM-01')
    } else if (dateType === 2) {
      date = moment(date).format('YYYY-01-01')
    }
    return date
  }
  //修改日期类型
  const changedate = (v, callback) => {
    const datevalue = dateform.getFieldsValue().datevalue
    const date = getdateformat(v, datevalue)
    callback(v)
    getQueryWarningDistributed(v, date)
  }
  //修改日期
  const changPicker = (v, datecatrgory) => {
    const date = getdateformat(datecatrgory, v)
    getQueryWarningDistributed(datecatrgory, date)
  }

 
  useEffect(() => {
     console.log(areaId)
    if(arealist.length===0)return 
    const formvalue = dateform.getFieldsValue()
    const type = formvalue.datetype
    const date = getdateformat(type, formvalue.datevalue)
    getQueryWarningDistributed(type, date)
  }, [areaId])
  useEffect(()=>{
    drawEcharts(pref.current, {
      pieData: { data: pieData, radius: '65%' }, type: 3, legend: {
       
        top: 'auto',
        bottom: 0,
  
      },
    })
  },[pieData])
  useEffect(()=>{
     
  drawEcharts(opref.current, {
    pieData: { data: opieData, radius: ['45%', '65%'] }, type: 3, legend: {

      top: 'auto',
      bottom: 0,

    },
    color:['rgb(255,112,112)','rgb(255,183,38)','rgb(176,126,249)'],
  })
  },[opieData])
  return (
    <Titlelayout
      className="pie"
      title="告警分布"
      {...fs}
      extra={<DateComp ChangDate={changedate} changPicker={changPicker} dateform={dateform} />} >
      <div className='chart'>
        {pieData?<div ref={pref}></div>:null}
        {opieData?<div ref={opref}></div>:null}
        
      </div>
    </Titlelayout>
  )

}
// const datasetStack = {
//   dimensions: ["type", "一级报警", "二级报警", "三级报警"],
//   source: [
//     { type: "掉电", "一级报警": 5600, "二级报警": 9600, "三级报警": 9600, },
//     { type: "过温", "一级报警": 4600, "二级报警": 3644, "三级报警": 7600, },
//     { type: "过流", "一级报警": 3600, "二级报警": 4644, "三级报警": 8600, },
//     { type: "缺相报警", "一级报警": 5611, "二级报警": 9655, "三级报警": 6600, },
//     { type: "电流不平衡", "一级报警": 5644, "二级报警": 3677, "三级报警": 4600, },
//     { type: "电压不平衡", "一级报警": 4677, "二级报警": 3633, "三级报警": 9874, },
//     { type: "频率超限", "一级报警": 3688, "二级报警": 4655, "三级报警": 4789, },
//     { type: "欠压报警", "一级报警": 5088, "二级报警": 2644, "三级报警": 3698, },
//     { type: "过压报警", "一级报警": 6677, "二级报警": 2641, "三级报警": 7532, },
//     { type: "剩余电量过流", "一级报警": 5866, "二级报警": 5641, "三级报警": 9521, },

//   ],
// };



//告警类型排名
const AlarmRank = ({ bref, areaId }) => {
  const projectId = useSelector(state => state.system.menus.projectId)
  const arealist = useSelector(state => state.system.onelevel)
  const [dateform] = Form.useForm()
  let lengend = { dimensions: ["type", "一级报警", "二级报警", "三级报警"] }
  const [datasetStack, setDatasetStack] = useState()
  const getQueryWarningTypeRanking = async (type = 1, date = moment().format('YYYY-MM-DD')) => {
    let params = {
      projectId,
      type,
      date,
      areaId
    }
    const res = await safeElectric.QueryWarningTypeRanking(params)
    if (res.success) {
      if(Array.isArray(res.data)&&res.data.length > 0) {
      const data = res.data.map(it => {
        return {
          type: it.warningType,
          "一级报警": it.level1Cnt,
          "二级报警": it.level2Cnt,
          "三级报警": it.level3Cnt
        }
      })
      setDatasetStack({ ...lengend, source: data })
    }else{
      setDatasetStack(null)
    }
    } else {
      message.error(res.errMsg)
    }
  }
  //获取日期格式
  const getdateformat = (dateType, date) => {
    if (dateType === 1) {
      date = moment(date).format('YYYY-MM-01')
    } else if (dateType === 2) {
      date = moment(date).format('YYYY-01-01')
    }
    return date
  }
  //修改日期类型
  const changedate = (v, callback) => {
    const datevalue = dateform.getFieldsValue().datevalue
    const date = getdateformat(v, datevalue)
    callback(v)
    getQueryWarningTypeRanking(v, date)
  }
  //修改日期值
  const changPicker = (v, datecatrgory) => {
    const date = getdateformat(datecatrgory, v)
    getQueryWarningTypeRanking(datecatrgory, date)
  }

  useEffect(() => {
    if(arealist.length===0)return 
    const formvalue = dateform.getFieldsValue()
    const type = formvalue.datetype

    const date = getdateformat(type, formvalue.datevalue)
    getQueryWarningTypeRanking(type, date)
  }, [areaId])
  useEffect(()=>{
    drawEcharts(bref.current, {
      xAxis: {
        type: 'value'
      },
      yAxis: {
        type: 'category',
        axisLabel: {
          color: "#545454"
        },
        axisTick: {
          alignWithLabel: true,
          lineStyle: {
            color: "#4bcb82"
          }
        },
        axisLine: {
          lineStyle: {
            color: "#4bcb82"
          }
        }
      },
    //   dataZoom: [
    //     {
    //         id: 'dataZoomY',
    //         type: 'slider',
    //         zoomLock:true,
    //         yAxisIndex: [0],
    //         filterMode: 'empty',
    //         start: 100,
    //         end: 40,
    //         brushSelect:false
    //     }
    // ],
      dataset: datasetStack,
      series: [{ type: "bar", stack: 'total' }, { type: "bar", stack: 'total' }, { type: "bar", stack: 'total' }],
      grid: {
        top: '30px',
        bottom: "30px",
        right: '30px',
        left: '0px',
        containLabel: true,
      },
      legend: {
        top: 'auto',
        bottom: 0,
        icon: 'rect',
        itemHeight: 8,
        itemWidth: 8,
        itemGap: 20,
      },
      color:['rgb(255,112,112)','rgb(255,183,38)','rgb(176,126,249)']
    })
  },[datasetStack])
  return (
    <Titlelayout className="down" title="告警类型排名" {...fs} extra={<DateComp ChangDate={changedate} changPicker={changPicker} dateform={dateform} />} >
      {datasetStack?  <div className='stack' ref={bref}></div>:null}
    
    </Titlelayout>
  )

}
//日期选择组件
const DateComp = ({ ChangDate, changPicker, dateform }) => {
  const [datecatrgory, setDatecatrgory] = useState(1)
  const dateOptions = [
    { label: '月', value: 1 },
    { label: '年', value: 2 },
  ]
  return (
    <Form
      style={{ display: 'flex' }}
      form={dateform}
      initialValues={
        {
          datetype: datecatrgory,
          datevalue: moment(),
        }
      }
    >
      <Form.Item name="datetype" style={{ margin: 0, width: 80 }}>
        <Select options={dateOptions} onChange={(v) => { ChangDate(v, setDatecatrgory) }} ></Select>
      </Form.Item>
      <Form.Item name="datevalue" style={{ margin: 0, width: 160, marginLeft: 16 }}>
        <DatePicker picker={datecatrgory === 1 ? 'month' : 'year'} onChange={(v) => { changPicker(v, datecatrgory) }} />
      </Form.Item>
    </Form>
  )
}

