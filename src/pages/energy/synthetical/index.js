import React, { useState, useRef, useEffect, useCallback } from "react";
import { nanoid } from "@reduxjs/toolkit";
import { Image, Space, Tabs, Typography, Radio } from "antd";
import styled, { css } from "styled-components";
import { useOutletContext } from 'react-router-dom'
import { drawEcharts } from "@com/useEcharts";
 
import Titlelayout from "@com/titlelayout";
import { useSelector } from 'react-redux'
import { selectOneLevel, adaptation } from '@redux/systemconfig.js'
import { numberformat, getTime } from '@com/usehandler'
import Pagecount from "@com/pagecontent";
import imgurl from "./icon";
 
import {Mainbox,Tabsbox} from "./style"
import {useQueryOverview,useQueryEnergyType} from "./api"
import Chart from './component/chart/index'
import Detail from './component/Detail'
const { Text } = Typography
 
 
 
const Custspan = styled(Text)`
&& {
  font-size: 14px;
   width: 142px;
  color: #515151;
  display: flex;
  justify-content: ${(props) => (props.jc == 1 ? "flex-start" : "space-between")};
 
  span {
    color: #999;
    padding-left: 1em;
  }
}

`;
 
 
 
 
 

export default function Index() {
 
  const areaIds = useSelector(selectOneLevel);
  let { laptop } = useSelector(adaptation)
  let { exparams } = useOutletContext()
  console.log(exparams)
  const { areaId, publicdate:date,publicrangedate, publictype: dateType, shiftNo, view, projectId } = exparams
  const [qverview, setOverview] = useState({})
  const [tabvalue, setTabvalue] = useState(0)
 
 

     let type = ['', '本日', '本月', '本年','本周期'][dateType]
     let my = ['', '昨日', '上月', '去年','上周期'][dateType]

 
 
 
  const [tabs, setTabs] = useState([{ label: "综合能耗", key: 0, }])


  const getTabs = async () => {
    try {
      if (!Number.isInteger(parseInt(projectId))) return
      let { success, data } = await useQueryEnergyType({projectId})
      if (success && Array.isArray(data) && data?.length) {
        let types = data.map((d, index) => ({ label: d.name, key: d.type }))
        setTabs([{ label: "综合能耗", key: 0 }, ...types])
      } else {
        setTabs([{ label: "综合能耗", key: 0 }])
      }
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    getTabs()
  }, [projectId])
  const getData = async ({ areaId, date, dateType, shiftNo,publicrangedate, view, projectId }) => { // 费用接口暂时没有

    let id = areaId == 0 ? areaIds?.filter(a => a.id != 0)?.map(a => a.id) : [areaId];
    let [startDate, endDate] =dateType < 4  ?  [getTime(date, dateType), getTime(date, dateType)] : [getTime(publicrangedate[0], 1), getTime(publicrangedate[1], 1)];
 
    const body = {
      dayMonthYear: dateType==4 ? 0 : dateType,
      shiftNo,
      projectId,
      startDate,
      endDate,
      meterType: tabvalue,
      areaIds:id,
      group:view
    }
 
  
    try {
      let { success, data } = await useQueryOverview({}, body)

      if (success) {
        setOverview({ ...qverview, ...data })
      } else {
        return {}
      }
    } catch (e) {
      console.log(e)
    }
  }
  const ontabChange = (e) => {
    setTabvalue(e)
    setOverview([])
  }
  useEffect(() => {
   
    let f = [tabvalue, areaId, dateType, shiftNo, view, projectId].every(v => Number.isInteger(v)) 
    let fag = dateType>3 ? (Array.isArray(publicrangedate) && publicrangedate?.length==2) : date
    console.log("f",f,fag)
    if (f && fag) {
      console.log("调接口")
      getData({ areaId, date, dateType, shiftNo,publicrangedate, view, projectId })
    }
  }, [tabvalue, areaId, date, dateType, shiftNo, view, projectId,publicrangedate])

 

  return (
    <Pagecount bgcolor="transparent" pd="0"> 
        <Mainbox   laptop={laptop}> 
            <div className="left">
              <Tabsbox defaultActiveKey={0} items={tabs} onChange={ontabChange}>
              </Tabsbox>
              <Chart   qverview={qverview}      type={exparams.type} tabvalue={tabvalue}  />
            </div>
            {/* {tabvalue == 0 ? <CoalStandard op={exparams.view} data={coalStandard} datetype={exparams.type} key="CoalStandard" laptop={laptop} /> : <Electric data={consume} des={analysisDes} datetype={exparams.type} laptop={laptop} key="Electric" />} */}
        
            <Detail qverview={qverview} tabvalue={tabvalue}   my={my} type={type}   op={exparams.view}   datetype={exparams.type} key="Detail" laptop={laptop} />
       

        </Mainbox>
    </Pagecount>
  );
}
