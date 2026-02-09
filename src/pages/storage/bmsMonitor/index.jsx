import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useOutletContext } from "react-router-dom";
import { selectProjectId } from "@redux/systemconfig.js";
import { StorageMonitorBMS } from "@api/api.js";
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
      width: 640px;
      flex-shrink: 0;
      overflow: hidden;

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

// 联调前占位，联调后删除：用于演示拓扑布局与滚动效果。
const MOCK_BMS_DIAGRAM_DATA = {
  stack: {
    id: "mock-stack-1",
    pId: 0,
    sn: "DCD001",
    name: "电池堆1",
    items: [
      { index: 1, name: "工作状态", value: "充电", style: "Value" },
      { index: 2, name: "SOC", value: "253", unit: "‰", style: "NameValueOne" },
      { index: 3, name: "SOH", value: "972", unit: "‰", style: "NameValueOne" },
    ],
  },
  clusters: Array.from({ length: 2 }).map((_, idx) => {
    const order = idx + 1;
    return {
      id: `mock-cluster-${order}`,
      pId: 1,
      sn: `DC${String(order).padStart(3, "0")}`,
      name: `${order}_${order} 电池簇`,
      items: [
        { index: 1, name: "工作状态", value: order % 3 === 0 ? "静置" : "充电", style: "Value" },
        { index: 2, name: "SOC", value: `${230 + order * 8}`, unit: "‰", style: "NameValueOne" },
        { index: 3, name: "电压高值", value: `${(52.2 + order * 0.08).toFixed(1)}`, unit: "V", style: "NameValueTwo" },
        { index: 4, name: "电压低值", value: `${(51.6 + order * 0.06).toFixed(1)}`, unit: "V", style: "NameValueTwo" },
        { index: 5, name: "温度高值", value: `${(27 + order * 0.4).toFixed(1)}`, unit: "℃", style: "NameValueTwo" },
        { index: 6, name: "温度低值", value: `${(24 + order * 0.3).toFixed(1)}`, unit: "℃", style: "NameValueTwo" },
      ],
    };
  }),
};

/**
 * 归一化 BMS 拓扑接口数据。
 *
 * @param list 接口原始数组
 * @returns 兼容拓扑组件的堆/簇结构；接口缺失时返回 mock 占位
 *
 * @author ybdpx
 */
function normalizeBmsDiagramData(list) {
  if (!Array.isArray(list) || list.length === 0) {
    return MOCK_BMS_DIAGRAM_DATA;
  }
  const stack = list.find((item) => item?.pId === 0) || null;
  const clusters = list.filter((item) => item?.pId !== 0);

  // 这里要求堆+簇同时存在，否则不利于观察拓扑整体效果。
  if (!stack || clusters.length === 0) {
    return MOCK_BMS_DIAGRAM_DATA;
  }
  return { stack, clusters };
}

export default function BmsMonitor() {
  const projectId = useSelector(selectProjectId);
  let { exparams } = useOutletContext() || {};
  // 兼容 bmsId 可能是 { value, label } 对象或直接的值
  let { areaId, bmsId } = exparams || {};
  let bms_id = bmsId?.value ?? bmsId ?? undefined;

  // BMS设备拓扑图数据 - 从接口获取
  const [bmsDiagramData, setBmsDiagramData] = useState(MOCK_BMS_DIAGRAM_DATA);
  const [diagramLoading, setDiagramLoading] = useState(false);

  // 获取BMS设备拓扑图数据
  const getBmsDiagramData = () => {
    setDiagramLoading(true);
    StorageMonitorBMS.queryBMSStatusInfo(projectId, bms_id)
      .then((res) => {
        const topologyData = res?.success
          ? normalizeBmsDiagramData(res?.data)
          : MOCK_BMS_DIAGRAM_DATA;
        setBmsDiagramData(topologyData);
      })
      .catch(() => {
        setBmsDiagramData(MOCK_BMS_DIAGRAM_DATA);
      })
      .finally(() => {
        setDiagramLoading(false);
      });
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
    StorageMonitorBMS.queryBMSDataInfo(projectId, bmsIdValue).then(res => {
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
    StorageMonitorBMS.queryBMSTableInfo(projectId, bmsIdValue).then(res => {
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
    // 必须同时有 projectId 和 bms_id 才请求数据，避免初始时 bms_id 为 undefined 传入 -1 导致返回默认数据
    if (projectId && bms_id) {
      getBmsDiagramData()
      getBmsDataInfo()
      getBMSTableInfo()
    } else {
      setBmsDiagramData(MOCK_BMS_DIAGRAM_DATA)
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
            <span>电池堆状态</span>
          </div>
          <BmsDeviceDiagram
            loading={diagramLoading}
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
