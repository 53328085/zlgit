import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useOutletContext } from "react-router-dom";
import { selectProjectId } from "@redux/systemconfig.js";
import Pagecount from "@com/pagecontent";
import Titlelayout from "@com/titlelayout";
import styled from "styled-components";
import BmsOverviewPanel from "./BmsOverviewPanel";
import BmsBatteryTable from "./BmsBatteryTable";
import style from "./style.module.less";

// 主布局容器 - 参考PCS页面的rightlayout样式
const Mainbox = styled.div`
  && {
    display: flex;
    flex: 1;
    column-gap: 16px;
    padding-bottom: 16px;

    .leftlayout {
      border-radius: 8px;
      background-color: ${(props) => props.theme.imgbgcolor || "rgb(0, 0, 51)"};
      padding: 20px;
      width: 544px;
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

  // 静态演示数据 - BMS设备数据总览（9个卡片）
  const bmsOverviewData = {
    stackVoltage: 702,
    stackCurrent: 36,
    stackPower: 356,
    soc: 9,
    soh: 45,
    maxCellVoltage: 3.17,
    minCellVoltage: 3.12,
    maxCellTemp: 27,
    minCellTemp: 25,
  };

  // 静态演示数据 - BMS电池组数据详情
  const [batteryData] = useState([
    {
      clusterNo: 1,
      soc: 85,
      soh: 98,
      voltage: 700,
      current: 508,
      maxVoltage: 3195,
      maxVoltageCellNo: 35,
      minVoltage: 3170,
      minVoltageCellNo: 35,
      maxTemp: 28,
      maxTempCellNo: 35,
    },
    {
      clusterNo: 2,
      soc: 82,
      soh: 97,
      voltage: 698,
      current: 505,
      maxVoltage: 3192,
      maxVoltageCellNo: 32,
      minVoltage: 3168,
      minVoltageCellNo: 32,
      maxTemp: 27,
      maxTempCellNo: 32,
    },
  ]);

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
        {/* 左侧区域 - 预留给BMS设备图示区域 */}
        <div className="leftlayout" key="left">
          <div className="leftTitle">
            <span>BMS监控</span>
            {bmsLabel && <span className={style.bmsName}>{bmsLabel}</span>}
          </div>
          <div className={style.placeholder}>
            {/* BMS设备图示区域 - 待后续实现 */}
            <div style={{ color: "#fff", textAlign: "center", paddingTop: 100 }}>
              BMS设备图示区域
            </div>
          </div>
        </div>

        {/* 右侧区域 - BMS数据展示 */}
        <div className="rightlayout" key="right">
          <Titlelayout title="BMS设备数据总览">
            <BmsOverviewPanel data={bmsOverviewData} />
          </Titlelayout>
          <Titlelayout title="BMS电池组数据详情">
            <BmsBatteryTable
              dataSource={batteryData}
              pagination={pagination}
              onChange={handleTableChange}
            />
          </Titlelayout>
        </div>
      </Mainbox>
    </Pagecount>
  );
}
