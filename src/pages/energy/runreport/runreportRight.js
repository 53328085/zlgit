import React, {useEffect, useRef} from "react";
 
import style from "./style.module.less";
 
import moment from "moment";
import {useSelector} from 'react-redux'
import { systemConfigInfo} from '@redux/systemconfig.js'

import chintLogo from "@imgs/chintlog.png";
import { drawEcharts } from "@com/useEcharts";
export default function Index( { getReportInfo, getElectricityDate, dataInfoAll }) {
  const {chineseTitle, systemLogoImage} = useSelector(systemConfigInfo)
 
  let {reportDate} = dataInfoAll
  let cycle =''
  if (reportDate) {
    cycle = getElectricityDate ? moment(reportDate, 'yyyy-mm-dd').format('yyyy-mm')+'月' : moment(reportDate, 'yyyy-mm-dd').format('yyyy')+'年'
  }
    
  let { detailElectric = {} } = dataInfoAll || {}
  let {x=[], y=[]} = detailElectric
  let lineref = useRef()
  useEffect(() => {
     let yname = getElectricityDate ? '日用电量kWh：' : '月用电量kWh：'
    
     drawEcharts(lineref.current, 
      {
        dataset: {
          dimensions: [
          {
            name: "x",
            type: "time",
        
           }, {
            name: yname,
           
           
          }],
          source: [x, y],
          sourceHeader: false
          
        },
        series: [
          { type: "line", seriesLayoutBy: 'row' },
        
        ],
       
        legend: {
          bottom: "-2px",
          top: 'auto',
          icon: 'rect',
          itemWidth: 14,
          itemHeight: 1,

        }
     })
  }, [getElectricityDate, dataInfoAll])
  return (
    <div className={style.contentRight} id="rightInfo">
      <div className={style.showInfo}>
        <img src={chintLogo} className={style.chintLogo}></img>
        <span className={style.chinName}>{chineseTitle}</span>
        <div className={style.info}>
          <p className={style.title}>能源管理分析报告</p>
          <div className={style.content}>
            <p className={style.name}>
              <span>项目名称：</span>
             <span>{dataInfoAll?.projectName?.toString()}</span>  
            </p>
            <p className={style.address}>
              <span>项目地址：</span>
              <span>{dataInfoAll?.projectAddress?.toString()}</span>  
            </p>
            <p className={style.date}>
              <span>报告日期：</span>
              <span>{dataInfoAll?.reportDate?.toString()}</span>  
            </p>
          </div>
        </div>
        <div className={style.background}></div>
      </div>

      {getReportInfo ? (
        <div className={style.hideInfo}>
          <div className={style.hideInfoOne}>
            <div className={style.headInfo}>
              <p>{chineseTitle}</p>
              <p>
                本期报告分析周期为：
                <span>{cycle}</span>  
              </p>
            </div>
            <div className={style.general}>
              <p className={style.title}>1. 项目概况</p>
              <table className={style.tableInfo}>
                <tbody className={style.tbody}>
                  <tr>
                    <td>项目名称</td>
                    <td>{dataInfoAll?.projectName?.toString()}</td>
                    {/* <td>{dataInfoAll.data.projectName}</td> */}
                  </tr>
                  <tr>
                    <td>站点地址</td>
                    <td>{dataInfoAll?.projectAddress?.toString()}</td>
                    
                  </tr>
                  <tr>
                    <td>网关数量</td>
                    <td>{dataInfoAll?.gatewayCount}</td>
                    
                  </tr>
                  <tr>
                    <td>测点数量</td>
                     
                  <td>{dataInfoAll?.deviceCount}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className={style.analyse}>
              <p className={style.title}>2. 用电量分析</p>
              <p className={style.smallTitle}>
                 {dataInfoAll?.projectAddress?.toString()}监测周期内总耗电量
                <span>
                 
                  {dataInfoAll?.consumeTotal}
                </span>
                ， 日平均耗电量
               
                <span> {dataInfoAll?.consumeAvg}</span>，单日最大耗电量
                <span>
                 
                  {dataInfoAll?.consumeMax}
                </span>
                ，日耗电情况详见下图：
              </p>
              <div className={style.lineChart} ref={lineref}>
              {/*   {getElectricityDate ? (
                  <Linechartmonth></Linechartmonth>
                ) : (
                  <Linechartyear></Linechartyear>
                )} */}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
