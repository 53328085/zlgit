import React, { useState, useEffect, useRef } from "react";
import { useRequest } from "ahooks";
import style from "./style.module.less";
import { message, Radio, Button } from "antd";
import styled from "styled-components";
import Searchtree from "@com/searchTree";
import Barchart from "./barChart";
import Ringchart from "./ringChart";
import Percent from "./percent";
import { useSelector } from "react-redux";
import { selectProjectId } from "@redux/systemconfig.js";
import { ExportExcel } from '@com/useButton'
import { useOutletContext } from 'react-router-dom'
import { EnergyPublicRuntime } from "@api/api.js";
import { getTime } from '@com/usehandler'
import Titlelayout from '@com/titlelayout'
import Pagecount from "@com/pagecontent";
import Ichart from '@com/useEcharts/Ichart'
import UserTree from "@com/useTree"
import UseTable from "@com/useTable"
// import { Button } from "antd/lib/radio";
const Mainbox = styled.div`
  display: grid;
  grid-template-columns: ${props => props.energy == `1` ? '288px 1fr 400px' : '288px 1fr'};
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
const Radiogroup = styled(Radio.Group)`
  && {
    .ant-radio-button-wrapper.ant-radio-button-wrapper-in-form-item {
      width: 96px;
      text-align: center;
      &:first-child {
        border-radius: 16px 0 0 16px;
      }
     &:last-child {
      border-radius: 0 16px 16px 0;
     }
    }
  }

`
export default function Index(props) {
  const {
    queryEnergyCategoryTree,
    queryElectricYear,
    queryElectricRangeDay,
    // queryElectricDay,
    queryElectricMonth,
    // queryWaterDay,
    queryWaterRange,
    queryWaterMonth,
    queryWaterYear,
    queryGasDay,
    queryGasMonth,
    queryGasYear,
    QueryAllRangeByType
  } = EnergyPublicRuntime;

  let { exparams } = useOutletContext()
  let { areaId, projectId, type, date, energytype, shiftNo } = exparams
  const chartTitle = ["用电量 (kWh)", "用电量 (kWh)", '用冷水量 (m³)', '用气量 (m³)', '', '', '', '用热水量 (m³)', '', '', '', '', '', '', '', '', '', '', '用蒸汽量 (m³)'][energytype] || "用电量 (kWh)"
  const isElectric = energytype === 1;
  const [treeIdList, setTreeIdList] = useState(null);
  //右下角 公共能耗同比  能耗数据展示
  const [energySub, setEnergySub] = useState([]);
  const [energyTotal, setEnergyTotal] = useState({});
  const [tableData, setTableData] = useState([])
  const [columns, setColumns] = useState([])
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
    pieData: { data: [], total: '100%', radius: ["55%", "70%"] },
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
    console.log(exparams)
    if (Object.values(exparams)?.length < 6 || !Array.isArray(treeIdList)) return;
    let energy = Number(energytype) - 1;
    let api = Number(type) - 1
    let hander = [
      [
        // queryElectricDay,
        queryElectricRangeDay,
        queryElectricMonth,
        queryElectricYear,
      ],
      [
        queryWaterRange,
        queryWaterMonth,
        queryWaterYear
      ],
      [
        queryGasDay,
        queryGasMonth,
        queryGasYear
      ],
      [], [], [],
      [
        queryWaterRange,
        queryWaterMonth,
        queryWaterYear
      ],
      [], [], [], [], [], [], [], [], [], [],
      [
        queryElectricRangeDay,
        queryElectricMonth,
        queryElectricYear
      ]
    ][energy][api]
    // const params = type == 1 ? {
    //   projectId,
    //   areaId,
    //   startDate: date?.[0]?.format("YYYY-MM-DD"),
    //   endDate: date?.[1]?.format("YYYY-MM-DD"),
    //   shiftNo,
    //   meterType: energytype
    // } : {
    //   projectId,
    //   areaId,
    //   date: date && type ? getTime(date, type) : "", //date().startOf(type==2 ? "month" : "year").format("YYYY-MM-DD"),
    //   shiftNo,
    //   meterType: energytype
    // }

    // return hander(params, treeIdList).then(res => {
    const params = type == 1 ? {
      projectId,
      areaId,
      startDate: date?.[0]?.format("YYYY-MM-DD"),
      endDate: date?.[1]?.format("YYYY-MM-DD"),
      shiftNo,
      meterType: energytype,
      type,
    } : {
      projectId,
      areaId,
      startDate: date && type ? getTime(date, type) : "", //date().startOf(type==2 ? "month" : "year").format("YYYY-MM-DD"),
      endDate: date && type ? getTime(date, type) : "",
      shiftNo,
      meterType: energytype,
      type,
    }

    return QueryAllRangeByType(params, treeIdList).then(res => {
      let { success, data, errMsg } = res;
      if (success) {
        let { detail = {}, energySub = [], energyTotal = [], proportion = [] } = Object.prototype.toString.call(data).slice(8, -1) == 'Object' ? data : {}
        let { x = [], y = [] } = detail
        setEnergySub(energySub);
        setEnergyTotal(energyTotal);

        const tableData = x.map((time, index) => ({
          time: time,
          value: y[index]
        }));
        const columns = [
          {
            title: '时间',
            dataIndex: 'time',
            key: 'time',
          },
          {
            title: chartTitle,
            dataIndex: 'value',
            key: 'value',
          },
        ];
        setColumns(columns)
        setTableData(tableData)
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
            data: proportion
          }
        })

      } else {
        setEnergySub([]);
        setEnergyTotal([]);

        message.error(errMsg || '数据出错');
      }

    })
  }
  useRequest(pageInfo, {
    refreshDeps: [treeIdList, exparams]
  });
  const [mode, setMode] = useState(1)

  const onChange = (e) => {
    setMode(e.target.value)
  }
  const exportData = () => {
    tbref.current.download()
  }

  return (
    <Pagecount pd="0" bgcolor="transparent" >
      <Mainbox energy={energytype}>

        <Titlelayout title="公共能耗分类" layout="flex" >
          <div className="chart" >
            <UserTree areaId={areaId} setTreeId={setTreeIdList} energytype={energytype} showline={false} datatype={2} sty={{ bordered: 'n', pv: '0' }} />
          </div>
          {/*  <Searchtree
        
          fieldNames={fieldNames}
          treeData={treeData}
          getValues={getSelcetedTree}
        ></Searchtree> */}
        </Titlelayout>

        <Titlelayout title={<div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>公共能耗</span> <div style={{ width: 260, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
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
            {/* <ExportExcel tb={tbref} /> */}
            <Button type="primary" onClick={exportData}>导出</Button>
          </div></div>} layout="flex">
          <div className="chart">
            {mode == 1 ? <Ichart {...options} /> : <UseTable ref={tbref} dataSource={tableData} columns={columns} key="table" scroll={{ y: 652 }} />}
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
