import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import style from './style.module.less'
import { Typography, Progress } from 'antd'
const { Text } = Typography
import { useSelector } from "react-redux";
import backgroundImg from '../quota/icon/backgroundImg.png'
import showImg from '../quota/icon/showImg.gif'
import { EnergyOverView } from "@api/api.js";
import { useOutletContext } from 'react-router-dom'
import Titlelayout from '@com/titlelayout';
import { CustTransO } from "@com/useButton"
import {
  selectProjectId,
} from "@redux/systemconfig.js";
const Box = styled.div`
 && {
    position: absolute;
    bottom: 32px;
    display: flex;
    align-items: center;
    width: 98%;
    overflow-x: hidden;
 }
`
const Itemsty = styled.div`
 && {
      width: 160px;
      bottom: 30px;
      background-color: rgba(255, 255, 255, 0.698039215686274);
      box-sizing: border-box;
      border-radius: 5px;
      display: flex;
      flex-direction: column;
      padding:2px;
      margin-left: 32px;
      display: inline-block;
      white-space: nowrap;
      animation: scroll 8s linear infinite;
      
      .itemtitle {
        font-size: 14px;
        color:#fff;
        border-top-left-radius: 5px;
        border-top-right-radius: 5px;
        text-align:center;
        margin-bottom:10px;
      }
      .sub {
        font-size: 14px;
        color: #333333;
        margin-left:10px;
      }
  
       .ant-typography{
        font-size: 16px;
        color: #000000;
        margin-left:10px;
      }
      .progressColor{
        .ant-progress-text{
          color: rgba(255, 0, 0, 1);
        }
        
      }
 }
 
 @keyframes scroll {
  0% {
    transform: translateX(0);
  }
  50% {
    transform: translateX(-50%);
  }
  100% {
    transform: translateX(-100%); /* 加上一些额外的空白，以便滚动到最后一个元素时不会立即切换 */
  }

`


export default function ParkQuota() {
  const [energyValue, setEnergyValue] = useState({});
  const [areaVos, setAreaVos] = useState([]);
  const projectId = useSelector(selectProjectId);
  let { areaName } = useOutletContext();
  const quotarRankingData = [
    {
      name: '联合工房',
      num: '193,000',
      percent: 76.6
    }, {
      name: '办公楼',
      num: '1033,000',
      percent: 60.6
    }, {
      name: '综合楼',
      num: '9300',
      percent: 50.1
    }, {
      name: '附属楼',
      num: '7600',
      percent: 43.1
    }, {
      name: '员工食堂',
      num: '2600',
      percent: 16.8
    }]

  const Item = ({ data }) => {
    return (
      <Itemsty>
        <p className='itemtitle' style={{ backgroundColor: `${data.percent > 20 ? 'rgba(0, 204, 51, 1)' : 'rgba(255, 0, 0, 1)'}` }}>{data.areaName}</p>
        <p className='sub'>用能定额 (kWh)</p>
        <p className='num'><Text ellipsis={{ tooltip: data.todayElectricConsume }}>{data.todayElectricConsume}</Text></p>
        <p className='sub'>累计能耗 (kWh)</p>
        <p className='num'><Text ellipsis={{ tooltip: data.curMonthElectricConsume }}>{data.curMonthElectricConsume}</Text></p>
        <p className='sub'>剩余额度 (kWh)</p>
        <p className='num'><Text ellipsis={{ tooltip: data.curMonthElectricConsume }}>{data.curMonthElectricConsume}</Text></p>
        <p className='sub'>剩余额度</p>
        <Progress
          percent={data.percent}
          className={`${data.percent > 20 ? '' : 'progressColor'}`}
          trailColor='#ebeef5'
          strokeColor={`${data.percent > 20 ? 'rgba(0, 204, 51, 1)' : 'rgba(255, 0, 0, 1)'}`}
          style={{ marginLeft: 10, width: 95 }} />
      </Itemsty>

    )
  }
  const getData = async () => {
    const list = [
      {
        areaId: 9, areaName: "量测园区1", todayElectricConsume: "0.00", curMonthElectricConsume: "0.00",
        percent: 12.6
      }
      , {
        areaId: 11, areaName: "聚光大厦", todayElectricConsume: "0.00", curMonthElectricConsume: "0.00",
        percent: 76.6
      }
      , {
        areaId: 12, areaName: "聚光大厦", todayElectricConsume: "0.00", curMonthElectricConsume: "0.00",
        percent: 76.6
      }
      , {
        areaId: 13, areaName: "聚光大厦", todayElectricConsume: "0.00", curMonthElectricConsume: "0.00",
        percent: 76.6
      }
      , {
        areaId: 14, areaName: "量测园区2", todayElectricConsume: "0.00", curMonthElectricConsume: "0.00",
        percent: 3.6
      }
      , {
        areaId: 15, areaName: "聚光大厦", todayElectricConsume: "0.00", curMonthElectricConsume: "0.00",
        percent: 76.6
      }
      , {
        areaId: 17, areaName: "聚光大厦最后一个", todayElectricConsume: "0.00", curMonthElectricConsume: "0.00",
        percent: 33.6
      }]
    try {
      let { success, data } = await EnergyOverView.EnergyOverViewRuntime(projectId);
      success && setEnergyValue({ ...data })
      // success && setAreaVos(data.areaVos)
      success && setAreaVos(list)

      // console.log(energyValue, areaVos, innerContainer);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getData();
  }, [projectId]);
  return (
    <div className={style.parkQuotaContent}>
      <div className={style.contentLeft} style={{ position: "relative" }}>
        <img className={style.backgroundImg} src={backgroundImg} />
        <Box n={areaVos?.length} id="inner-container">
          {
            areaVos.map(d => <Item data={d} key={d.areaId} />)
          }
        </Box>
        <div className={style.imgData}>
          <span style={{ width: 200, paddingLeft: 16, borderRight: '1px solid #f5f1f1' }}>{areaName}</span>
          <span style={{ width: 80, paddingLeft: 16 }}><CustTransO text="Buildings" /> </span>
          <span style={{ width: 60, marginLeft: 16, borderRight: '1px solid #f5f1f1' }}>1 幢</span>
          <span style={{ width: 60, paddingLeft: 16 }}><CustTransO text="Rooms" /> </span>
          <span style={{ width: 60, marginLeft: 16}}>4 间</span>
        </div>
      </div>
      <div className={style.contentRight}>
        <Titlelayout title="园区年度总定额" className={style.totalquota}>
          <div className={style.totalNum}><span>1800,000</span> (kWh)</div>
          <div className={style.totalInfo}><span>正泰物联</span><span>800,000kWh</span> </div>
          <Progress style={{ width: '370px' }} percent={50}
            strokeColor='rgba(0, 204, 51, 1)' trailColor='#ebeef5' strokeWidth={15} className={style.totalProgress} />
        </Titlelayout>
        <Titlelayout title="定额剩余量排名" className={style.quotaRanking}>
          {
            quotarRankingData.map((item, index) => (
              <div className={style.residueInfo} key={index}>
                <div className={style.residueInfo}><span>{item.name}</span><span>{item.num}kWh</span> </div>
                <Progress style={{ width: '370px' }} percent={item.percent}
                  strokeColor={`${item.percent > 20 ? 'rgba(0, 204, 51, 1)' : 'rgba(255, 0, 0, 1)'}`} trailColor='#ebeef5' strokeWidth={15} className={style.residueProgress} />
              </div>
            ))}
          <img className={style.showImg} src={showImg} />
        </Titlelayout>
      </div>
    </div>
  )
}
