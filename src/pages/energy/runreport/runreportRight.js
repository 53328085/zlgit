import React from "react";
import ReactDOM from "react-dom"; //这个是react的虚拟dom
import style from "./style.module.less";
import { useState, useEffect, Fragment } from "react";
import {} from "antd";
import {useSelector} from 'react-redux'
import { systemConfigInfo} from '@redux/systemconfig.js'
import Linechartmonth from "./lineChartMonth";
import Linechartyear from "./lineChartYear";
import chintLogo from "@imgs/chintlog.png";
export default function Index(props) {
  const {chineseTitle} = useSelector(systemConfigInfo)
  const { getReportInfo, getElectricityDate, dataInfoAll } = props;
  console.log(dataInfoAll);
  return (
    <div className={style.contentRight} id="rightInfo">
      <div className={style.showInfo}>
        <img src={chintLogo} className={style.chintLogo}></img>
        <span className={style.chinName}>{chineseTitle}</span>
        <div className={style.info}>
          <p className={style.title}>能源管理分析报告</p>
          <div className={style.content}>
            <p className={style.name}>
              <span>项目名称:</span>
              {/* <span>{dataInfoAll.data.projectName}</span> */}
            </p>
            <p className={style.address}>
              <span>项目地址:</span>
              {/* <span>{dataInfoAll.data.pojectAddress}</span> */}
            </p>
            <p className={style.date}>
              <span>报告日期:</span>
              {/* <span>{dataInfoAll.data.reportDate}</span> */}
            </p>
          </div>
        </div>
        <div className={style.background}></div>
      </div>

      {getReportInfo ? (
        <div className={style.hideInfo}>
          <div className={style.hideInfoOne}>
            <div className={style.headInfo}>
              <p>正泰综合能源服务平台</p>
              <p>
                本期报告分析周期为：
                {/* <span>{dataInfoAll.data.reportDate}</span> */}
              </p>
            </div>
            <div className={style.general}>
              <p className={style.title}>1. 项目概况</p>
              <table className={style.tableInfo}>
                <tbody className={style.tbody}>
                  <tr>
                    <td>项目名称</td>
                    <td>正泰物联杭州园区</td>
                    {/* <td>{dataInfoAll.data.projectName}</td> */}
                  </tr>
                  <tr>
                    <td>站点地址</td>
                    <td>浙江省杭州市滨江区月明路560号</td>
                    {/* <td>{dataInfoAll.data.pojectAddress}</td> */}
                  </tr>
                  <tr>
                    <td>网关数量</td>
                    <td>125</td>
                    {/* <td>{dataInfoAll.data.gatewayCount}</td> */}
                  </tr>
                  <tr>
                    <td>测点数量</td>
                    <td>1025</td>
                    {/* <td>{dataInfoAll.data.deviceCount}</td> */}
                  </tr>
                </tbody>
              </table>
            </div>

            <div className={style.analyse}>
              <p className={style.title}>2. 用电量分析</p>
              <p className={style.smallTitle}>
                正泰物联杭州园区监测周期内总耗电量
                <span>
                  160194kW·h
                  {/* consumeTotal */}
                </span>
                ， 日平均耗电量
                {/* ConsumeAvg */}
                <span>5167.55kW·h</span>，单日最大耗电量
                <span>
                  7432.25kW·h
                  {/* ConsumeMax */}
                </span>
                ，日耗电情况详见下图：
              </p>
              <div className={style.lineChart}>
                {getElectricityDate ? (
                  <Linechartmonth></Linechartmonth>
                ) : (
                  <Linechartyear></Linechartyear>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
