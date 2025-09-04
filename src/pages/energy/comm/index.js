import React, { useState,  useRef, useCallback, useMemo } from "react";
import { useAntdTable } from "ahooks";

import { message,  Space } from "antd";

import { ExportExcel } from '@com/useButton'
import { useOutletContext } from 'react-router-dom'

import { getTime } from '@com/usehandler'
import Titlelayout from '@com/titlelayout'
import Pagecount from "@com/pagecontent";
import Ichart from '@com/useEcharts/Ichart'
import UserTree from "@com/useTree"
import UseTable from "@com/useTable"
 
import {Pagelayout,Radiogroup} from "./style"
import {totalcolumns,dtlcolumns} from "./data"
import {useQueryPublicEnergyData} from "./api"
import { isObject } from "lodash";
 

export default function Index(props) {

  let { exparams = {} } = useOutletContext() || {}
  let {areaId, publictype, publicdate, projectId, energytype,publicrangedate } = exparams
  const [pagetotal, setPageTotal] = useState(0) 

 const chartTitle={
   1: "用电量 (kWh)",
   2: '用冷水量 (m³)',
   7: '用热水量 (m³)',
   18: '用气量 (m³)'
 }[energytype] || ""
  
  const sheetName = useMemo(()=> {
     let formmat = {
      1: "YYYY-MM-DD",
      2: "YYYY-MM",
      3: "YYYY"
     }[publictype]
     let time = publictype==4 ?  (publicrangedate?.[0]?.format?.("YYYY-MM-DD") + "--"+  publicrangedate?.[1]?.format?.("YYYY-MM-DD") ):   publicdate?.format(formmat)
     let type ={
      1: "用电",
      2: '用冷水',
      7: '用热水',
      18: '用气'
    }[energytype] + "公共能耗"
    return type +"_" +time
  }, [publictype, publicdate,  energytype,publicrangedate])

  const [treeIdList, setTreeIdList] = useState(null);
 
 
  const [energyTotal, setEnergyTotal] = useState([]);
 
  const [columns, setColumns] = useState(dtlcolumns)
  const tbref = useRef()
  const [options, setOptions] = useState({
    series: [{ type: "bar", seriesLayoutBy: 'row' }],
    grid: {
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
    pieData: { data: [], total: '100%', radius: ["55%", "80%"], label: {
      formatter: (params)=> {
        return params?.data?.value
      },
      width:100,
      fontSize:9
    }, },
    legend: {
      top: 'center',
      right: 20,
      orient: 'vertical',
    },
    grid: {
      containLabel: true,
      left: 0,
      right: 0,
    },
   
  })
  //自定义调用方法
  const getData =async ({current, pageSize}) => {
    try {
      //publictype, publicdate, projectId, energytype
  
    if(!(Array.isArray(treeIdList) &&treeIdList?.length >0&& Number.isInteger(parseInt(projectId)))) return
    if(![publictype,  projectId, energytype, areaId].some(d => Number.isInteger(d))) return
    if(!publicdate && publictype!=4) return;
    if(!Array.isArray(publicrangedate)&& publictype==4) return
    const body = {
      projectId,
      areaId,
      startDate: publictype==4 ? publicrangedate?.[0]?.format?.("YYYY-MM-DD") :  getTime(publicdate, publictype) ,
      endDate: publictype==4 ? publicrangedate?.[1]?.format?.("YYYY-MM-DD") : getTime(publicdate,publictype),
      shiftNo: 0,
      meterType:energytype,
      type:publictype,
      pageSize,
      pageNum:current,
      CategoryIds:treeIdList
    }  
     
   let {data, success, total}  =  await useQueryPublicEnergyData({}, body)
   if(isObject(data) && success) {
    if(Number.isInteger(parseInt(total))) {
      setPageTotal(total)
    } else {
      setPageTotal(0)
    }
    let { detail = {}, energySub = [], energyTotal = [], proportion = [] , deviceDetailTable} =data
    const pietotal = proportion.reduce((a, b)=>  a+parseFloat(b.value), 0)
    let { x = [], y = [] } = detail
    setOptions({
      ...options,
      dataset: {
        dimensions: [
          { name: 'x', type: 'time' },
          { name: 'y', displayName: chartTitle },

        ],
        source: [x, y],
        sourceHeader: false,
      },
    })
    setPoptions({
      ...poptions,
      pieData: {
        ...poptions.pieData,
        data: proportion,
        total:pietotal?.toFixed(2),
      }
    }) 

    const totalData = [energyTotal,...energySub].map(d => {
      let key = {
        1:"lastDayPeriodValue",
      
      2:"lastMonthPeriodValue",
      
      3:"lastYearPeriodValue",
      4:"lastMonthPeriodValue"
      }[publictype]
      return {...d, lastperiodValue:d[key]}
    })
   
    setEnergyTotal(totalData)
   
   
     if(Array.isArray(deviceDetailTable) && deviceDetailTable.length > 0) {
      let {detailHeaders} = deviceDetailTable[0]
          let last = detailHeaders.length - 1
          let col = detailHeaders.map(c => ({ title: c, dataIndex: c, key: c, width: "96px", ellipsis:true, }))
        //  col[last].fixed = "right"
          setColumns([ ...dtlcolumns,...col, {
            title: "总能耗",
            dataIndex: 'total',
            key: 'total',
            width: 100,
            fixed: "right",
            ellipsis:true,
          },])
          deviceDetailTable.forEach(item => {
            let { detailHeaders, detailValues } = item;
            for (const [index, val] of detailHeaders?.entries()) {
              item[val] = detailValues[index]
            }
          })
      return {
        list: deviceDetailTable,
        total,
      }
     }else {
       setColumns([...dtlcolumns, {
        title: "总能耗",
        dataIndex: 'total',
        key: 'total',
        width: 100,
        fixed: "right",
        ellipsis:true,
      }])
       setPageTotal(0)
       return {
         list :[],
         total:0
       }
     }
    
 
   }else {
    setEnergyTotal([]);
    setPageTotal(0)
    message.error(errMsg || '数据出错');
    return {
      list:[],
      total: 0
    }
   }
    } catch (error) {
       console.log(error)
    }
  }
const {tableProps, search, refresh} =  useAntdTable(getData, {
    defaultPageSize: 14,
    refreshDeps: [treeIdList, publictype, publicdate, projectId, energytype,publicrangedate, areaId]
  });

  const [mode, setMode] = useState(1)

  const onChange = (e) => {
    setMode(e.target.value)
  }
  const onExport = useCallback(()=> {
    return getData({current:1, pageSize:pagetotal})
  }, [areaId, publictype, publicdate, projectId, energytype,publicrangedate, pagetotal])
  

 
  return (
    <Pagecount pd="0" bgcolor="transparent" >
      <Pagelayout> 
        <Titlelayout title="公共能耗分类" layout="flex" pv="16px" >
          <div className="chart" >
            <UserTree areaId={0}    setTreeId={setTreeIdList}  energytype={energytype} showline={false} datatype={2} sty={{ bordered: 'n', pv: '0' }} />
          </div>
         
        </Titlelayout>
        <div className="content">
          <div className="uparea">
          <Titlelayout title="公共能耗占比" layout="flex"> 
                <Ichart {...poptions} /> 
            </Titlelayout>
            <Titlelayout title="公共能耗同比" layout="flex">
              <UseTable columns={totalcolumns} dataSource={energyTotal} scroll={{
                x:"max-content",
                y: 135
              }}></UseTable>
              
            </Titlelayout>
          </div>
          <div className="down">
        <Titlelayout title={<div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>公共能耗</span> <Space size={16}>
            <Radiogroup options={[
              {
                label: "图表模式",
                value: 1
              },
              {
                label: "列表模式",
                value: 2
              }
            ]}
              optionType="button"
              buttonStyle="solid"
              onChange={onChange}
              value={mode}
            ></Radiogroup>
           
            <ExportExcel disabled={mode==1} tb={tbref}  /> 
          </Space></div>} layout="flex">
          <div className="chart">
            {mode == 1 ? <Ichart {...options} /> : 
            <div className="tbwrap">
              <UseTable 
            ref={tbref} 
            {...tableProps}  
            columns={columns}
             key="table" 
             sheetName={sheetName}
             scroll={{x: 1332, y: 400 }}
             onExport={onExport}
              /></div>}
          </div>
        </Titlelayout> 
        </div>
        </div>
    
      </Pagelayout>
    </Pagecount>
  );
}
