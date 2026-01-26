import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useOutletContext } from "react-router-dom";
import { selectProjectId } from "@redux/systemconfig.js";
import { StorageMonitorRuntime } from "@api/api.js";
import Pagecount from "@com/pagecontent";
import Titlelayout from "@com/titlelayout";
import styled from "styled-components";
import BmsOverviewPanel from "./BmsOverviewPanel";
import BmsBatteryTable from "./BmsBatteryTable";
import BmsDeviceDiagram from "./BmsDeviceDiagram";
import style from "./style.module.less";

// 主布局容器 - 参考PCS页面的rightlayout样式
const Mainbox = styled.div`
  && {
    display: flex;
    flex: 1;
    column-gap: 16px;
    padding-bottom: 16px;

    .leftlayout {
      position: relative;
      border-radius: 8px;
      background: linear-gradient(rgb(10, 22, 40) 0%, rgb(13, 27, 46) 100%);
      padding: 20px;
      width: 504px;
      flex-shrink: 0;

      .leftTitle {
        position: relative;
        border-left: none;
        padding-left: 11px;
        color: #fff;
        font-size: 14px;
        &::before {
          position: absolute;
          left: 0px;
          content: "";
          width: 3px;
          height: 13px;
          background-color: ${({ theme }) => theme.primaryColor};
        }
      }
    }

    .rightlayout {
      flex: 1;
      display: grid;
      grid-template-columns: 1fr;
      grid-template-rows: auto 1fr;
      row-gap: 16px;
    }
  }
`;

export default function BmsMonitor() {
  const projectId = useSelector(selectProjectId);
  let { exparams } = useOutletContext() || {};
  let { areaId, bmsId } = exparams || {};
  let { value: bms_id, label: bmsLabel } = bmsId || {};

  // 静态演示数据 - BMS设备拓扑图数据
  const bmsDiagramData = {
    stack: {
      id: 1,
      name: "电池堆1（DCD001）",
      items: [
        { name: "堆当前状态", value: "充电", color: "blue", style: "Value" },
        { name: "堆 SOC", value: "85.0", unit: "%", color: "green", style: "NameValueOne" },
        { name: "堆 SOH", value: "99.60", unit: "", color: "green", style: "NameValueOne" },
      ],
    },
    clusters: [
      {
        id: 2,
        name: "1_1 电池簇",
        pId: 1,
        items: [
          { name: "工作状态", value: "充电", unit: "", color: "blue", style: "NameValueTwo" },
          { name: "SOC", value: "25.0", unit: "%", color: "orange", style: "NameValueTwo" },
          { name: "电压高值", value: "3.195", unit: "V", color: "green", style: "NameValueTwo" },
          { name: "电压低值", value: "3.170", unit: "V", color: "green", style: "NameValueTwo" },
          { name: "温度高值", value: "28", unit: "°C", color: "green", style: "NameValueTwo" },
          { name: "温度低值", value: "26", unit: "°C", color: "green", style: "NameValueTwo" },
        ],
      },
      {
        id: 3,
        name: "1_2 电池簇",
        pId: 1,
        items: [
          { name: "工作状态", value: "就绪", unit: "", color: "blue", style: "NameValueTwo" },
          { name: "SOC", value: "100.0", unit: "%", color: "green", style: "NameValueTwo" },
          { name: "电压高值", value: "3.192", unit: "V", color: "green", style: "NameValueTwo" },
          { name: "电压低值", value: "3.168", unit: "V", color: "green", style: "NameValueTwo" },
          { name: "温度高值", value: "27", unit: "°C", color: "green", style: "NameValueTwo" },
          { name: "温度低值", value: "25", unit: "°C", color: "green", style: "NameValueTwo" },
        ],
      },
      {
        id: 4,
        name: "1_3 电池簇",
        pId: 1,
        items: [
          { name: "工作状态", value: "放电", unit: "", color: "blue", style: "NameValueTwo" },
          { name: "SOC", value: "60.0", unit: "%", color: "green", style: "NameValueTwo" },
          { name: "电压高值", value: "3.200", unit: "V", color: "green", style: "NameValueTwo" },
          { name: "电压低值", value: "3.180", unit: "V", color: "green", style: "NameValueTwo" },
          { name: "温度高值", value: "29", unit: "°C", color: "orange", style: "NameValueTwo" },
          { name: "温度低值", value: "26", unit: "°C", color: "green", style: "NameValueTwo" },
        ],
      },
    ],
  };

  // BMS设备数据总览 - 从接口获取
  const [bmsOverviewData, setBmsOverviewData] = useState({
    stackVoltage: 0,
    stackCurrent: 0,
    maxCellVoltage: 0,
    minCellVoltage: 0,
    maxCellTemp: 0,
    minCellTemp: 0,
    maxDischargePower: 0,
    maxChargePower: 0,
  });

  // BMS电池组数据详情 - 从接口获取
  const [batteryData, setBatteryData] = useState([]);
  const [batteryTableLoading, setBatteryTableLoading] = useState(false);
  const [batteryTableHeads, setBatteryTableHeads] = useState([]);

  // 获取BMS数据总览
  const getBmsDataInfo = () => {
    const bmsIdValue = bms_id || -1 // 先写死
    console.log('Calling QueryBMSDataInfo API with:', { projectId, bmsId: bmsIdValue })
    StorageMonitorRuntime.queryBMSDataInfo(projectId, bmsIdValue).then(res => {
      console.log('QueryBMSDataInfo response:', res)
      if (res.success && res.data && Array.isArray(res.data)) {
        // 将数组格式转换为对象格式
        const dataMap = {}
        res.data.forEach(item => {
          dataMap[item.index] = item.value
        })
        setBmsOverviewData({
          stackVoltage: Number(dataMap[1]) || 0,           // 电池堆电压
          stackCurrent: Number(dataMap[2]) || 0,           // 电池堆电流
          maxCellVoltage: Number(dataMap[3]) || 0,         // 堆最高电池电压
          minCellVoltage: Number(dataMap[4]) || 0,         // 堆最低电池电压
          maxCellTemp: Number(dataMap[5]) || 0,            // 系统最高温度
          minCellTemp: Number(dataMap[6]) || 0,            // 最低电池温度
          maxDischargePower: Number(dataMap[7]) || 0,      // 堆允许最大放电功率
          maxChargePower: Number(dataMap[8]) || 0,         // 堆允许最大充电功率
        })
      }
    })
  }

  // 获取BMS电池组数据详情
  const getBMSTableInfo = () => {
    const bmsIdValue = bms_id || -1
    setBatteryTableLoading(true)
    StorageMonitorRuntime.queryBMSTableInfo(projectId, bmsIdValue).then(res => {
      if (res.success && res.data) {
        const { heads, datas } = res.data
        // 根据 heads 动态生成 columns 配置
        const columns = heads.map((title, index) => ({
          title,
          dataIndex: `col_${index}`,
          key: `col_${index}`,
          align: 'center',
          width: 100,
        }))
        // 转换 datas 为 dataSource 格式
        const dataSource = datas.map((row, rowIndex) => {
          const item = { key: rowIndex }
          row.forEach((val, colIndex) => {
            item[`col_${colIndex}`] = val
          })
          return item
        })
        setBatteryTableHeads(columns)
        setBatteryData(dataSource)
        setPagination((prev) => ({ ...prev, total: datas.length }))
      }
    }).finally(() => {
      setBatteryTableLoading(false)
    })
  }

  useEffect(() => {
    if (projectId) {
      getBmsDataInfo()
      getBMSTableInfo()
    }
  }, [projectId, bms_id])

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 2,
    showSizeChanger: true,
    showQuickJumper: true,
    showTotal: (total) => `共 ${total} 条`,
  });

  const handleTableChange = (pag) => {
    setPagination(pag);
  };

  return (
    <Pagecount bgcolor="transparent" pd="0">
      <Mainbox className={style.bmsContent}>
        {/* 左侧区域 - BMS设备拓扑图 */}
        <div className="leftlayout" key="left">
          <div className="leftTitle">
            <span>设备拓扑图</span>
            {bmsLabel && <span className={style.bmsName}>{bmsLabel}</span>}
          </div>
          <BmsDeviceDiagram
            stackData={bmsDiagramData.stack}
            clusterData={bmsDiagramData.clusters}
          />
        </div>

        {/* 右侧区域 - BMS数据展示 */}
        <div className="rightlayout" key="right">
          <Titlelayout title="BMS设备数据总览">
            <BmsOverviewPanel data={bmsOverviewData} />
          </Titlelayout>
          <Titlelayout title="BMS电池组数据详情">
            <BmsBatteryTable
              dataSource={batteryData}
              columns={batteryTableHeads}
              loading={batteryTableLoading}
              pagination={pagination}
              onChange={handleTableChange}
            />
          </Titlelayout>
        </div>
      </Mainbox>
    </Pagecount>
  );
}
