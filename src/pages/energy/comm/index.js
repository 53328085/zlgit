import React, { useState, useEffect, useRef } from "react";
import { useRequest } from "ahooks";
import style from "./style.module.less";
import { message } from "antd";
import styled from "styled-components";
import Searchtree from "@com/searchTree";
import Barchart from "./barChart";
import Ringchart from "./ringChart";
import Percent from "./percent";
import { useSelector } from "react-redux";
import { selectProjectId } from "@redux/systemconfig.js";
import {useOutletContext} from 'react-router-dom' 
import { EnergyPublicRuntime } from "@api/api.js";
import {getTime} from '@com/usehandler'
import Titlelayout from '@com/titlelayout' 
import Pagecount from "@com/pagecontent";
import  Ichart from '@com/useEcharts/Ichart'
import UserTree from "@com/useTree"
const Mainbox = styled.div`
  display: grid;
  grid-template-columns: ${props => props.energy==`1` ?  '288px 1fr 400px' : '288px 1fr'};
  column-gap: 16px;
  flex: 1;
  .chart {
    display: flex;
    flex: 1;
  }
  .energy {
    flex: 1;
    display: grid;
    grid-template-rows: 400px 1fr;
    row-gap: 16px;
  }
`
export default function Index(props) { 
  const {
    queryEnergyCategoryTree,
    queryElectricYear,
    queryElectricDay,
    queryElectricMonth,
    queryWaterDay,
    queryWaterMonth,
    queryWaterYear,
    queryGasDay,
    queryGasMonth,
    queryGasYear,
  } = EnergyPublicRuntime; 
   
  let {exparams} = useOutletContext()
  let {areaId, projectId, type, date, energytype, shiftNo} = exparams
  const chartTitle = ["用电量 (kWh)", "用电量 (kWh)",'用水量 (m³)','用气量 (m³)'][energytype] || "用电量 (kWh)"
  const isElectric = energytype===1;
  const [treeIdList, setTreeIdList] = useState([]);
  //右下角 公共能耗同比  能耗数据展示
  const [energySub, setEnergySub] = useState([]);
  const [energyTotal, setEnergyTotal] = useState({});
 
 

  const [options, setOptions] = useState({
    series: [{ type: "bar",  seriesLayoutBy: 'row' }],  
    grid:{
      left: "0px",
      right: "0",
      top: "40px",
      bottom: "0px",
      containLabel: true,
    },
    legend: {
      top: "0px",
      itemHeight: 4,
      itemWidth: 16,
    },   
  })

  const [poptions, setPoptions] = useState({
    type: 3,
    pieData: { data: [], total: '100%', radius: ["55%",  "70%"] },
    legend: {
      top: 'auto',
      bottom: "0px",
    },
    grid: {
      containLabel: true,
      left: 0,
      right: 0,
    }    
  })
  //自定义调用方法
  const pageInfo = () => {
    if(Object.values(exparams)?.length < 6) return;
    let energy =  Number(energytype) - 1;
    let api = Number(type) - 1
    let hander = [ 
      [
        queryElectricDay,
        queryElectricMonth,
        queryElectricYear,
      ],
      [
        queryWaterDay,
        queryWaterMonth,
       queryWaterYear
    ],
      [
        queryGasDay,
        queryGasMonth,
        queryGasYear
    ]][energy][api]
    return hander(projectId,areaId,getTime(date, type),shiftNo,treeIdList).then(res => {
       let {success, data, errMsg} = res;
       if(success) {
         let {detail={}, energySub=[], energyTotal=[], proportion=[]} = Object.prototype.toString.call(data).slice(8, -1) == 'Object' ? data : {}
         let {x=[], y=[]} = detail
         setEnergySub(energySub);
         setEnergyTotal(energyTotal);
        
         setOptions({
          ...options,
          dataset: {
            dimensions: [
              {name: 'x', type: 'time'},
              {name: 'y', displayName: chartTitle},
              
            ],
            source: [x, y],
            sourceHeader: false,
          },
         }) 
         setPoptions({
          ...poptions,
          pieData: {
            ...poptions.pieData,
            data: proportion
          }
         })

        }else {
          setEnergySub([]);
          setEnergyTotal([]);
         
          message.error(errMsg || '数据出错');
        }

    })
  }
 useRequest(pageInfo, {
    refreshDeps: [treeIdList, exparams]
  });
 
 
  return (
    <Pagecount pd="0" bgcolor="transparent" >
     <Mainbox energy={energytype}>
  
      <Titlelayout title="公共能耗分类" layout="flex" >
         <div className="chart" style={{paddingTop: '16px'}}>
         <UserTree areaId={areaId}   setTreeId={setTreeIdList} energytype={energytype} showline={false}    datatype={2} sty={{bordered: 'n', pv: '0'}} /> 
         </div>
       {/*  <Searchtree
        
          fieldNames={fieldNames}
          treeData={treeData}
          getValues={getSelcetedTree}
        ></Searchtree> */}
       </Titlelayout>
       
          <Titlelayout title="公共能耗" layout="flex">
             <div className="chart">
                 <Ichart {...options}/>
             </div>
          </Titlelayout>
        
        {isElectric == 1 ? (
          <div className="energy">
            <Titlelayout title="公共能耗占比" layout="flex"> 
                <div className="chart">
                   <Ichart {...poptions} />
                </div>
            </Titlelayout> 
            <Titlelayout title="公共能耗同比" layout="flex">
               <div className="chart rightBottom">
               <Percent
                  energySubGive={energySub}
                  energyTotalGive={energyTotal}
                ></Percent>
               </div>
            </Titlelayout> 
          </div>
        ) : null}
    
      </Mainbox>
    </Pagecount>
  );
}
