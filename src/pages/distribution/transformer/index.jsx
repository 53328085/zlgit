import React, { useState, useRef ,useMemo, useEffect } from 'react'
import { Select ,Form,Divider,DatePicker,Radio, Button, message } from 'antd'
import styled from 'styled-components'
import {useSelector,  } from 'react-redux'
import { selectcurlRommid } from "@redux/systemconfig";
import style from './style.module.less'
import TranCard from './transcard'
import UseTable from '@com/useTable'
import { columns } from './columns'
import Pagecount from '@com/pagecontent'
import CustContext from '@com/content.js'
import BlueColumn from '@com/bluecolumn'
import { drawEcharts } from "@com/useEcharts"
import {DistributionRoomRuntime,distributionRoom} from '@api/api.js'
import  imgurl from '@imgs'
import moment from 'moment'
import {utils, writeFile} from 'xlsx'
 

const MainDiv =styled.div`
background-color: #fff;
flex: 1;
padding: 16px;
display: flex;
flex-direction: column;
.trancss{
  display: flex;
  .ant-table-thead .ant-table-cell{
    padding: 3px;
  }
  .ant-table-tbody .ant-table-placeholder .ant-table-cell{
    padding: 3px
  }
  .ant-empty-normal{
    margin: 0;
  }
  .ant-empty{
    .ant-empty-image{
      height: 20px;
    }
    .ant-empty-description{
      font-size: 10px;
    }
    
  }
}
.datastyle{
  flex: 1;
  display: flex;
  flex-direction: column;
  .filters{
    display: flex;
    justify-content: space-between;
    background-color: #f9f9f9;
    height: 63px;
    padding:0 12px;
    .title{
      display: flex;
      align-items: center;
    }
  }
  .filterdate{
    display: flex;
    align-items: center;
    width: 650px;
    justify-content: space-between;
  }
}
`
const chartOpt= {
  title: {
    // text: 'Stacked Line'
  },
  tooltip: {
    trigger: 'axis'
  },
  legend: {
    top:'2%',
    icon:'roundRect',
    itemHeight:2,
    itemWidth:16,
    data: ['Email', 'Union Ads', 'Video Ads', 'Direct', 'Search Engine']
  },
  grid: {
    left: '1%',
    right: '1%',
    bottom: '3%',
    top:'8%',
    containLabel: true
  },
  //保存图片
  toolbox: {
    // feature: {
    //   saveAsImage: {}
    // }
  },
  xAxis: {
    axisLine:{
      lineStyle:{
        color:"#D8D8D8",
      }
    },
    axisLabel:{
      color:"#333"
    },
  },

  dataZoom:{
    type: 'inside',
    start:'50',
    end:'100',
  },
  yAxis: {
    type: 'value'
  },
  series: [
   
  ]
};
export default function Index() {
  const projectId = useSelector(state => state.system.menus.projectId)  
  const chartRef =useRef()
  const roomId = useSelector(selectcurlRommid)
  const [pattern,setPattern]=useState(1)
  const [tabs,setTabs] =useState([])
 
  const [value, setvalue] =useState(0)
  const [tabledata,setTableData]=useState([])
  const [type,setType] =useState(1)
  const [timeRanger,setTimeRanger] = useState([moment().subtract(6,'day'), moment()])
  const [header,setHeader] = useState([])
  const [tabletrend,setTabletrend] = useState([])
  const [disableDate,setDisableDate] = useState([])
  const chartsRef =useRef()
  const tableRef=useRef()
  const initchartRef =useRef()
  const transInfo =useRef({
    capacity:null
  })
  const dataprop={
    tabs,
  //  setTabs,
    value,
    setvalue,
    initialval: '0'
  }
  const opts = [
    {
      value:1,
      label:'电压(V)'},
    {
      value:2,
      label:'电流(A)'},
    {
      value:3,
      label:'总负荷(kW)'},
    {
      value:4,
      label:'总有功功率(kW)'},
    {
      value:5,
      label:'总无功功率(kVar)'},
    {
      value:6,
      label:'总视在功率(kVa)'},
    {
      value:7,
      label:'总功率因素'},
  ]

  const changeRadio=(e)=>{
    setPattern(e.target.value)
  }
  const changeTime=(time)=>{
    console.log('onChange',time)
    setTimeRanger(time)
  }
  let copytime =useRef()
  const onOpenChange=(open)=>{
    
   
    if(open){
      setTimeRanger([null,null])
      setDisableDate([null,null])
      copytime.current =[...timeRanger]
      console.log(copytime)
    }else{
      if(!timeRanger[0] || !timeRanger[1]){
        console.log(copytime=== timeRanger)
        setTimeRanger(copytime.current)
      }
     
      setDisableDate(null)
    }
  }
  const disabledDate = (current)=>{
    if(!disableDate){
      return false
    }
    const tooLate = disableDate[0]&& current.diff(disableDate[0],'days')>6
    const tooEarly = disableDate[1] && disableDate[1].diff(current,'days')>6
    return tooLate || tooEarly ||(current && current > moment().endOf('day'))
    
  }
 
  //单个变压器信息
  const TransformerOne=async()=>{
    try {
     const {success,errMsg,data} = await DistributionRoomRuntime.RoomOne(projectId,roomId)
     if(success){
      transInfo.current =  data
     }else{
      message.error(errMsg)
     }
    } catch (error) {
      console.log(error)
    }
  }

  //变压器 表格数据
  const RuntimePoints =async(sn)=>{
    if(!sn) return;
    const res = await DistributionRoomRuntime.RuntimePoints(projectId,sn)

    if(res.success){
      if(res.data.data){
        const dataes = structuredClone(res.data)
        dataes.data?.forEach((it, i) => {
          if(it.name){
            dataes[it.name] = it.value
          }
          if(it.name==='Load' && transInfo.current.capacity){
            dataes['LoadPer'] =(parseFloat(it.value)/transInfo.current.capacity).toFixed(2)
          }
           })
      
        setTableData([dataes])
      }else{
        setTableData([])
      }
    }else{
      message.error(res.errMsg)
    }
  }
  //变压器列表
  const getTransformer =async ()=>{
   const res = await DistributionRoomRuntime.TransformerList(projectId,roomId)
   if(res.success){
    if(Array.isArray(res.data)&&res.data.length>0){
      const data = res.data.map((it,i)=>{
        return {
          key:i,
          label:it.name,
          ...it,
        }
      })
      console.log(data)
      setTabs(data)
    }else{
      setTabs([])
    }
   
   }else{
    message.error(res.errMsg)
   }
  }
  //数据趋势（echarts）
  const HistoryTrends =async (sn)=>{
    if(!sn) return
    try{
      let startTime ,endTime;
      if(Array.isArray(timeRanger)&&timeRanger.length>0){
        startTime =  moment(timeRanger[0]).format('YYYY-MM-DD 00:00:00')
        endTime=moment(timeRanger[1]).format('YYYY-MM-DD 23:59:59')
      }else{
        message.error('请选择日期！')
      }
     
      console.log(startTime)
   
   
    let params = {
      projectId,
      sn,
      type,
      start:startTime,
      end:endTime
    }
    const res = await DistributionRoomRuntime.HistoryTrends(params)
    if(res.success){
      if(res.data&&res.data.length>0){
        chartsRef.current = res.data[0]
        if(res.data[0]['data']){
          const xAxis = res.data[0]['data'][0]['data'].map(it=>it.time)
          const sdata = res.data[0]['data'].map(it=>{
            const data = it.data.map(item=>item.value)
            return {
                name: it.point,
                type: 'line',
              //  stack: 'Total',
                lineStyle:{
                  width:1
                },
                symbol:'circle',
                symbolSize: 6,
                data,
                areaStyle: null,
            }
          })
          chartOpt.xAxis.data =xAxis
          chartOpt.series=sdata
          initchartRef.current = drawEcharts(chartRef.current,{...chartOpt,type:2})
        }else{
          chartOpt.xAxis.data =[]
          chartOpt.series=[]
          initchartRef.current = drawEcharts(chartRef.current,{...chartOpt,type:2})
        }
       
      }else{
          chartOpt.xAxis.data =[]
          chartOpt.series=[]
          initchartRef.current= drawEcharts(chartRef.current,{...chartOpt,type:2})
      }
    }else{
      message.error(res.errMsg)
    }
    }catch(e){console.log(e)}
    
  }
  //数据趋势（table）
  const HistoryTable = async (sn) => {
    if(!sn) return
    try {
      let startTime, endTime;
      startTime = moment(timeRanger[0]).format('YYYY-MM-DD 00:00:00')
      endTime = moment(timeRanger[1]).format('YYYY-MM-DD 23:59:59')
      console.log(startTime)
      let params = {
        projectId,
        sn,
        // type,
        start: startTime,
        end: endTime
      }
      const res = await DistributionRoomRuntime.HistoryTable(params)
      if(res.success){
        const header = res.data.header.map(item=>{
          return {
            title:item.display,
            dataIndex:item.name,
            algin:'center'
          }
        })
        setHeader(header)
        setTabletrend(res.data.data)
      }else{
        message.error(res.errMsg)
      }
    } catch (error) {
      console.log(error)
    }
  }
  //数据导出函数
 function exportExcelFile(array, sheetName = 'sheet1', fileName = 'example.xlsx') {
  const jsonWorkSheet = utils.json_to_sheet(array);
  const workBook = {
    SheetNames: [sheetName],
    Sheets: {
      [sheetName]: jsonWorkSheet,
    }
  };
  return writeFile(workBook, fileName);
}
  //导出echarts
   //导出图片
  const Export = () => {

    let myChart = initchartRef.current.getDataURL({
      type: "png",
      pixelRatio: 1, //放大2倍
      backgroundColor: "#fff"
    })
    console.log()
    var img = new Image();
    img.src = myChart

    img.onload = function () {
      var canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      var ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
      var dataURL = canvas.toDataURL("image/png");

      var a = document.createElement("a");
      // 创建一个单击事件
      var event = new MouseEvent("click");
      // 将a的download属性设置为我们想要下载的图片名称，若name不存在则使用‘下载图片名称’作为默认名称
      a.download = "图片.png" || "下载图片名称";
      // 将生成的URL设置为a.href属性
      a.href = dataURL;
      // 触发a的单击事件
      a.dispatchEvent(event);
    };
  }

  //数据导出
  const exportData=()=>{
    pattern ===1 &&Export()
    pattern ===2 &&tableRef.current.download()
   
    
  
    // let arr=[]
    // chartsRef.current.data.forEach(item=>{
    //   if(item.data.length>0){
    //     item.data.forEach(it=>{
    //       arr.push({
    //         point:item.point,
    //         time:it.time,
    //         value:it.value
    //       })
    //     })
    //   }
    // })
    // console.log(arr)
    // exportExcelFile(arr)
  }
  const search=()=>{
    HistoryTrends(tabs[value]['sn'])
  }
  useEffect(()=>{
    if(roomId) {
     
      getTransformer();
      TransformerOne()
    }
  },[roomId])
  useEffect(()=>{
    chartRef.current&& drawEcharts(chartRef.current,{...chartOpt,type:2})
  },[tabs,pattern])
  useEffect(()=>{
    
    if(tabs&&tabs.length>0){
      RuntimePoints(tabs[value]?.sn)
    }  
  },[tabs,value])
  useEffect(()=>{
    if(tabs&&tabs.length>0){
      pattern===1&& HistoryTrends(tabs[value]?.sn)
      pattern===2&& HistoryTable(tabs[value]?.sn)
    }
  },[tabs,value,type,pattern])
  return (
    <>
 
        {
          tabs.length>0?(
            <CustContext.Provider value={dataprop}>
            <Pagecount bgcolor="#eeeff3" pd="0px" custserach={true} > 
            <MainDiv>
             <div className='trancss'>
             <TranCard  device={tabs[value]}/>
             <UseTable columns={columns} bordered className={style.transformerTable} dataSource={tabledata}></UseTable>
             </div>
             <Divider dashed style={{borderColor:"#e4e4e4"}}></Divider>
             <div className="datastyle">
               <div className="filters">
                 <div className='title'>
                 <BlueColumn  name="数据趋势" styled={{fontSize: '16px'}}></BlueColumn>
                 {
                     pattern===1?<Select 
                     style={{width:180,marginLeft:32}} 
                     options={opts} 
                     value={type} 
                     onChange={setType}></Select>:null
                 }
                 </div>
                 <div className='filterdate'>
                   <DatePicker.RangePicker
                   value={timeRanger} 
                   format="YYYY-MM-DD" 
                   onChange={changeTime}
                   onCalendarChange={(time)=>{setDisableDate(time)}}
                   onOpenChange={onOpenChange}
                   disabledDate={disabledDate}
                   ></DatePicker.RangePicker>
                   <Button onClick={search}>查询</Button> 
                   <Button onClick={exportData}>导出</Button>
                       <Radio.Group defaultValue={pattern}   buttonStyle="solid" onChange={changeRadio}>
                         <Radio.Button value={1}>趋势模式</Radio.Button>
                         <Radio.Button value={2}>列表模式</Radio.Button>
                       </Radio.Group>
                 </div>
               </div>
               {
                 pattern===1?(<div ref={chartRef} style={{flex: 1}}></div>):
                 ( <UseTable 
                  columns={header} 
                  bordered  
                  dataSource={tabletrend}
                  scroll={{
                    y: 500,
                  }}
                  ref={tableRef}
                  ></UseTable>)
               }
             </div>
            </MainDiv>
         </Pagecount>
         </CustContext.Provider>
          ):(
            <div style={{flex:1,display: 'flex',justifyContent:'center',alignItems:'center',flexDirection:'column'}}>
              <img src={imgurl.empty} alt="" style={{width:200}}/>
              <p style={{color:'#999',marginTop:16,fontSize:16}}>暂无数据</p>
            </div>
          )
        }
   
    </>
    
  )
}