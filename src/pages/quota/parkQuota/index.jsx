import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
 
import { Typography, Progress } from 'antd'
import Pagecount from '@com/pagecontent'
 
 
 
import { EnergyOverView, energyQuota,UpdateEnergyImage } from "@api/api.js";
import { useOutletContext } from 'react-router-dom'
import Titlelayout from '@com/titlelayout';
import { useTranslation } from "react-i18next"
import {isObject} from '@com/usehandler'
import Areaimg from './areaimg'
import Rank from './rank'
const { Text } = Typography
const Mainbox = styled.div`
  && {
    flex: 1;
    display: grid;
    grid-template-columns: 1368px minmax(464px, 1fr);
    
    overflow-x: auto;
    .right{
      display: flex;
      padding: 16px;
    }
  }
`

 
 


export default function ParkQuota() {
  const [energyValue, setEnergyValue] = useState({});
  const [areaVos, setAreaVos] = useState([]);
 
  let { areaName, exparams} = useOutletContext();
  const {projectId, areaId} = exparams
  const { t } = useTranslation("quota")
  const [quotaWarning, setQuotaWarning] = useState(20);
 
    
   
  const [imgdata, setImgdata] = useState({})
  const [quota, setQuota] = useState({})
  const {parkAnnualQuota, areaAnnualQuota, quotaRemainRanking, parkNum, structureNum,roomNum} = isObject(quota) ? quota : {}
  


 const propsdata = {
    projectId,
    areaVos,
    parkNum, 
    structureNum,
    roomNum
 }
 const rankprops = {
   parkAnnualQuota,
   areaAnnualQuota, 
   quotaRemainRanking: [
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
 }
 const getParklist = async(params) => {
   try {
    await energyQuota.QueryParkList(params)
   } catch (error) {
    
   }
 }
 const queryParkQuota = async(params) => {
  try {
    let {success, data} = await energyQuota.QueryParkQuota({projectId: 1, parkAreaId:0})
    if(success && isObject(data)) {
       setQuota(data)
    }else {
      setQuota({})
    }

  } catch (error) {
    
  }
 }
 useEffect(() => {
    if([projectId, areaId].every(n => Number.isInteger(parseInt(n)))) {
      getParklist({projectId, parkAreaId:areaId})
      queryParkQuota({projectId, parkAreaId:areaId})
      
    }
 }, [projectId, areaId])
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
      setAreaVos(list)
    try {
      let { success, data } = await EnergyOverView.EnergyOverViewRuntime(projectId);
      if(success && isObject(data)) {
        let {areaVos} = data;
        if(Array.isArray(areaVos)) {
          // setAreaVos(areaVos)
        }else {
          setAreaVos([])
        }

      }else {
        setAreaVos([])
      } 
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if(Number.isInteger(projectId)) getData();
  }, [projectId]);
  return (
    <Pagecount pd="0">
      <Mainbox>
        <Areaimg {...propsdata}  />
       <div className='right'>
          <Rank  {...rankprops} />
       </div>
      {/* <div className={style.contentRight}>
        <Titlelayout title={t("TotalAnnualQuota")} className={style.totalquota}>
          <div className={style.totalNum}><span>1800,000</span> (kWh)</div>
          <div className={style.totalInfo}><span>正泰物联</span><span>800,000 kWh</span> </div>
          <Progress style={{ width: '370px' }} percent={50}
            strokeColor='rgba(0, 204, 51, 1)' trailColor='#ebeef5' strokeWidth={15} className={style.totalProgress} />
        </Titlelayout>
        <Titlelayout title={t("QuotaSurplusRanking")} className={style.quotaRanking}>
          {
            quotarRankingData.map((item, index) => (
              <div className={style.residueInfo} key={index}>
                <div className={style.residueInfo}><span>{item.name}</span><span>{item.num} kWh</span> </div>
                <Progress style={{ width: '370px' }} percent={item.percent}
                  strokeColor={`${item.percent > quotaWarning ? 'rgba(0, 204, 51, 1)' : 'rgba(255, 0, 0, 1)'}`} trailColor='#ebeef5' strokeWidth={15} className={style.residueProgress} />
              </div>
            ))}
          <img className={style.showImg} src={showImg} />
        </Titlelayout>
      </div> */}
      </Mainbox>
    </Pagecount>
  )
}
