import React, {useState, useEffect, useRef} from 'react'
import UseHeader from '@com/useHeader'
import styled from 'styled-components'
import style from './style.module.less'
import { Button, DatePicker } from 'antd'
import moment from 'moment'
import { CaretLeftOutlined, CaretRightOutlined, SearchOutlined  } from '@ant-design/icons'
import CustModal from '@com/useModal'
import * as echarts from 'echarts'
import bgImg from './imgs/background.png'


export default function Index() {
  const TempRef = useRef()
  const lineRef = useRef()
  const today = new Date().toLocaleDateString().replace(/\//g, '-')
  const CustomCss = styled.div`
    width: 234px;
    height: 680px;
    margin-right: 148px;
    background-image: url('${bgImg}');
    background-size: 100% 100%;
    position:relative;
    .name{
      position: absolute;
      padding: 0 4px;
      top: 30px;
      left: 126px;
      height: 20px;
      line-height: 20px;
      color: #fff;
      background-color: #237ae4;
    }
    .itemTitle{
      position: absolute;
      left: 0;
      bottom: 456px;
      width: 234px;
      height: 24px;
      text-align: center;
      font-size: 14px;
      color: #fff;
      line-height: 24px;
    }
    .itemData{
      position: absolute;
      left: 0;
      bottom: 0;
      width: 234px;
      height: 456px;
      padding: 16px;
      .item{
        margin-bottom: 16px;
        width: 200px;
        background-color: #fff;
        .monitorTitle{
          width: 100%;
          height: 24px;
          line-height: 24px;
          text-align: center;
          font-size:12px;
          color: #fff;
        }
        .temData{
          padding-top: 6px;
          display: flex;
          align-items: center;
          .tem{
            width: 50%;
            font-size: 12px;
            color: #515151;
            padding-left: 24px;
          }
        }
        .tempTime{
          font-size: 12px;
          height: 24px;
          line-height: 24px;
          color: #999;
          text-align: center;
        }
        .monitorData{
          height: 40px;
          padding: 0 16px;
          font-size: 14px;
          color: #000;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
      }
    }
  `
  const LeftButton = styled(CaretLeftOutlined)`
    font-size: 64px;
    position: absolute;
    left: -12px;
    top: 76px;
    color: #3c3c62;
    cursor: pointer;
      &:hover{
        color: #f2f2f2;
      }
  `
  const RightButton = styled(CaretRightOutlined)`
    font-size: 64px;
    position: absolute;
    right: -12px;
    top: 76px;
    color: #3c3c62;
    cursor: pointer;
      &:hover{
        color: #f2f2f2;
      }
  `
  const [count, setCount] = useState(0)
  let length = 5;
  const transLeft = () => {
    if((count)<= 0) return;
    setCount(count - 1)
  }
  const transRight = () => {
    if((count + 4)>= length) return;
    setCount(count + 1)
  }
  const CustomData = props => {
    return <CustomCss>
      <div className='name'>电池簇_1</div>
      <div className='itemTitle'>环境监控</div>
      <div className='itemData'>
        <div className='item' style={{cursor:'pointer'}} onClick={()=>showChart()}>
          <div className='monitorTitle' style={{backgroundColor:'#237ae4', border: '1px solid #237ae4'}}>空调监控</div>
          <div className='temData'>
            <div className='tem'>
              <span>温度</span>
              <div>
                <span style={{fontSize:20}}>{ 23.5 }</span>
                <span style={{fontSize:14, marginLeft: 8}}>℃</span>
              </div>
            </div>
            <div className='tem'>
              <span>湿度</span>
              <div>
                <span style={{fontSize:20}}>{ 54.2 }</span>
                <span style={{fontSize:14, marginLeft: 8}}>%</span>
              </div>
            </div>
          </div>
          <div className='tempTime'> 2023-03-10 18:00</div>
        </div>
        <div className='item'>
          <div className='monitorTitle' style={{backgroundColor:'#093', border: '1px solid #093'}}>烟感监控</div>
          <div className='monitorData'>
            <span>2023/03/10 18:00</span>
            <span>无告警</span>
          </div>
        </div>
        <div className='item'>
          <div className='monitorTitle' style={{backgroundColor:'#093', border: '1px solid #093'}}>水浸监控</div>
          <div className='monitorData'>
            <span>2023/03/10 18:00</span>
            <span>无告警</span>
          </div>
        </div>
        <div className='item'>
          <div className='monitorTitle' style={{backgroundColor:'#093', border: '1px solid #093'}}>灭火器监控</div>
          <div className='monitorData'>
            <span>2023/03/10 18:00</span>
            <span>无告警</span>
          </div>
        </div>
        <div className='item'>
          <div className='monitorTitle' style={{backgroundColor:'#f33', border: '1px solid #f33'}}>门禁监控</div>
          <div className='monitorData' style={{color:'#f33'}}>
            <span>2023/03/10 18:00</span>
            <span>打开</span>
          </div>
        </div>
      </div>
    </CustomCss>
  }

  const getFromChild = val => {}
  const showChart = () => {
    TempRef.current.onOpen()
    const data = {
      x:['00:00', '02:00', '04:00', '06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00'],
      y:['26.3', '26.4', '26.2', '27.1', '28.4', '29.1', '29.4', '29.3', '30.3', '27.5', '26.4', '25.4'],
      z:['56.3', '51.3', '56.6', '57.4', '56.4', '58.6', '59.4', '56.3', '54.3', '54.2', '53.2', '56.7'],
    }
    setTimeout(()=>{
      drawLine(data)
    })
  }
  const onOk = () => {
    TempRef.current.onCancel()
  }
  const drawLine = (lineData)=> {
    let lineChart = echarts.init(lineRef.current);
    lineChart.setOption({
      color:['#237ae4', '#093'],
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      legend: {
        top: '0',
        left: 'center'
      },
      grid: {
        left: '32px',
        right: '20px',
        bottom: '48px',
        top: '32px',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: true,
        axisTick:{
          alignWithLabel:true
        },
        data: lineData.x
      },
      yAxis: {
        type: 'value',
        // min: 24
        scale: true, //自适应
      },
      dataZoom:{
        type:'slider',
        height: 24
      },
      series: [
        {
          name: '温度(℃)',
          data: lineData.y,
          type: 'line',
          symbol:'circle', 
        },
        {
          name: '湿度(%)',
          data: lineData.z,
          type: 'line',
          symbol:'circle', 
        }
      ]
    })
  }
  return (
    <div>
      <UseHeader getValues={getFromChild}></UseHeader>
      <div className={style.mainContent}>
        <div className={style.title}>储能站点</div>
        <div className={style.yaxis}></div>
        <div className={style.xaxis}></div>
        <div className={style.dataList}>
          <div className={style.transLate} style={{ width: (parseInt(length / 4) + 1) * 100 + '%', left: (-(count * 382) + 65)}}>
            <CustomData></CustomData>
            <CustomData></CustomData>
            <CustomData></CustomData>
            <CustomData></CustomData>
            <CustomData></CustomData>
          </div>
          <LeftButton onClick={()=>transLeft()}></LeftButton>
          <RightButton onClick={()=>transRight()}></RightButton>
        </div>
      </div>
      <CustModal title='温湿度趋势' ref={TempRef}  mold="cust" width={1680}  onOk={()=>onOk()}>
        <div style={{ position:'absolute', right: 32, top:32}}>
          <span>日期</span>
          <DatePicker style={{width: 182, margin: '0 16px' }} defaultValue={moment(today,'YYYY-MM-DD')}></DatePicker>
          <Button type='primary' icon={<SearchOutlined />} style={{width: 96}}>查询</Button>
        </div>
        <div className={style.lineChart} ref={lineRef}></div>
      </CustModal>
    </div>
  )
}
