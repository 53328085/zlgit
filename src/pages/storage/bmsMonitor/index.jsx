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
import { BMS_OVERVIEW_ICON_ENUM, getOverviewIcon } from "../overviewIconEnum";
import style from "./style.module.less";

// 主布局容器 - 参考PCS页面的rightlayout样式
const Mainbox = styled.div`
  && {
    display: flex;
    flex: 1;
    min-height: 0;
    column-gap: 16px;
    padding-bottom: 16px;

    .leftlayout {
      position: relative;
      display: flex;
      flex-direction: column;
      min-height: 0;
      border-radius: 8px;
      background: linear-gradient(rgb(10, 22, 40) 0%, rgb(13, 27, 46) 100%);
      padding: 20px;
      width: 640px;
      flex-shrink: 0;
      overflow: hidden;

      > *:last-child {
        flex: 1;
        min-height: 0;
      }

      .leftTitle {
        position: relative;
        border-left: none;
        padding-left: 11px;
        color: #fff;
        font-size: 14px;
        flex-shrink: 0;
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
      min-height: 0;
      display: grid;
      grid-template-columns: 1fr;
      grid-template-rows: auto 1fr;
      row-gap: 16px;
      overflow: hidden;

      > * {
        min-height: 0;
      }
    }
  }
`;

/**
 * 归一化 BMS 拓扑接口数据。
 *
 * @param list 接口原始数组
 * @returns 兼容拓扑组件的堆/簇结构；接口缺失时返回空数据
 *
 * @author ybdpx
 */
function normalizeBmsDiagramData(list) {
  if (!Array.isArray(list) || list.length === 0) {
    return { stack: null, clusters: [] };
  }
  const stack = list.find((item) => item?.pId === 0) || list[0] || null;
  const clusters = list.filter((item) => item?.pId !== 0);
  return { stack, clusters };
}

const DEFAULT_OVERVIEW_ITEMS = [
  { key: 'BatteryArrVoltage', name: '电池堆电压', unit: 'V', iconText: 'V' },
  { key: 'BatteryArrCurrent', name: '电池堆电流', unit: 'A', iconText: 'A' },
  { key: 'ArrBatteryVoltageMax', name: '堆最高电池电压', unit: 'V', iconText: 'V' },
  { key: 'ArrBatteryVoltageMin', name: '堆最低电池电压', unit: 'V', iconText: 'V' },
  { key: 'SystemTemperature', name: '系统最高温度', unit: '℃', iconText: '℃' },
  { key: 'BatteryTemperatureMin', name: '最低电池温度', unit: '℃', iconText: '℃' },
  { key: 'DischargePowerMax', name: '堆允许最大放电功率', unit: 'kW', iconText: 'P' },
  { key: 'ChargePowerMax', name: '堆允许最大充电功率', unit: 'kW', iconText: 'P' },
];

const OVERVIEW_INDEX_MAP = {
  0: { key: 'BatteryArrVoltage', defaultName: '电池堆电压', unit: 'V', iconText: 'V' },
  1: { key: 'BatteryArrCurrent', defaultName: '电池堆电流', unit: 'A', iconText: 'A' },
  2: { key: 'ArrBatteryVoltageMax', defaultName: '堆最高电池电压', unit: 'V', iconText: 'V' },
  3: { key: 'ArrBatteryVoltageMin', defaultName: '堆最低电池电压', unit: 'V', iconText: 'V' },
  4: { key: 'SystemTemperature', defaultName: '系统最高温度', unit: '℃', iconText: '℃' },
  5: { key: 'BatteryTemperatureMin', defaultName: '最低电池温度', unit: '℃', iconText: '℃' },
  6: { key: 'DischargePowerMax', defaultName: '堆允许最大放电功率', unit: 'kW', iconText: 'P' },
  7: { key: 'ChargePowerMax', defaultName: '堆允许最大充电功率', unit: 'kW', iconText: 'P' },
};

function getOverviewIconText(unit, fallback) {
  const text = String(unit ?? '').trim();
  if (text.includes('℃') || text.toLowerCase().includes('c')) return '℃';
  if (text.toLowerCase().includes('kw') || text.toLowerCase().includes('w')) return 'P';
  if (text.toLowerCase().includes('a')) return 'A';
  if (text.toLowerCase().includes('v')) return 'V';
  return fallback || text || 'P';
}

function normalizeBmsOverviewData(data) {
  const items = Array.isArray(data?.items) ? data.items : data;

  if (Array.isArray(items)) {
    return items
      .slice()
      .sort((a, b) => Number(a?.index ?? 0) - Number(b?.index ?? 0))
      .map((item, idx) => {
        const mappedByIndex = OVERVIEW_INDEX_MAP[item?.index];
        const fallback = mappedByIndex || DEFAULT_OVERVIEW_ITEMS[idx] || {};
        const overviewKey = item?.icon || mappedByIndex?.key || item?.key || item?.point || fallback.key || `item-${idx}`;
        return {
          key: overviewKey,
          index: Number.isFinite(Number(item?.index)) ? Number(item.index) : idx,
          name: item?.name || item?.title || fallback.defaultName || fallback.name || `参数${idx + 1}`,
          value: item?.value ?? '--',
          unit: item?.unit ?? fallback.unit ?? '',
          iconText: item?.iconText || fallback.iconText || getOverviewIconText(item?.unit, fallback.iconText),
          icon: getOverviewIcon(BMS_OVERVIEW_ICON_ENUM, overviewKey),
        };
      });
  }

  return DEFAULT_OVERVIEW_ITEMS.map((item) => ({
    ...item,
    value: '--',
    icon: getOverviewIcon(BMS_OVERVIEW_ICON_ENUM, item.key),
  }));
}

export default function BmsMonitor() {
  const projectId = useSelector(selectProjectId);
  let { exparams } = useOutletContext() || {};
  // 兼容 bmsId 可能是 { value, label } 对象或直接的值
  let { bmsId } = exparams || {};
  console.log(bmsId)
  let bms_id = bmsId?.value ?? null;

  // BMS设备拓扑图数据 - 从接口获取
  const [bmsDiagramData, setBmsDiagramData] = useState({ stack: null, clusters: [] });
  const [diagramLoading, setDiagramLoading] = useState(false);

  // 获取BMS设备拓扑图数据
  const getBmsDiagramData = () => {
    setDiagramLoading(true);
    StorageMonitorBMS.queryBMSStatusInfo(projectId, bms_id)
      .then((res) => {
        const topologyData = res?.success ? normalizeBmsDiagramData(res?.data) : { stack: null, clusters: [] };
        setBmsDiagramData(topologyData);
      })
      .catch(() => {
        setBmsDiagramData({ stack: null, clusters: [] });
      })
      .finally(() => {
        setDiagramLoading(false);
      });
  };

  // BMS设备数据总览 - 从接口获取
  const [bmsOverviewData, setBmsOverviewData] = useState(() => normalizeBmsOverviewData());

  // BMS电池组数据详情 - 从接口获取
  const [batteryData, setBatteryData] = useState([]);
  const [batteryTableLoading, setBatteryTableLoading] = useState(false);
  const [batteryTableHeads, setBatteryTableHeads] = useState([]);

  // 获取BMS数据总览
  const getBmsDataInfo = () => {
    StorageMonitorBMS.queryBMSDataInfo(projectId, bms_id)
      .then((res) => {
        const overviewItems = res?.success ? normalizeBmsOverviewData(res?.data) : normalizeBmsOverviewData();
        setBmsOverviewData(overviewItems);
      })
      .catch(() => {
        setBmsOverviewData(normalizeBmsOverviewData());
      });
  };

  // 获取BMS电池组数据详情
  const getBMSTableInfo = () => {
    setBatteryTableLoading(true)
    StorageMonitorBMS.queryBMSTableInfo(projectId, bms_id).then(res => {
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
      } else {
        setBatteryTableHeads([])
        setBatteryData([])
        setPagination((prev) => ({ ...prev, total: 0 }))
      }
    }).catch(() => {
      setBatteryTableHeads([])
      setBatteryData([])
      setPagination((prev) => ({ ...prev, total: 0 }))
    }).finally(() => {
      setBatteryTableLoading(false)
    })
  }

  useEffect(() => {
    // 必须同时有 projectId 和 bms_id 才请求数据，参数未就绪时保持空态
    if (projectId && bms_id) {
      getBmsDiagramData()
      getBmsDataInfo()
      getBMSTableInfo()
    } else {
      setBmsDiagramData({ stack: null, clusters: [] })
      setBatteryTableHeads([])
      setBatteryData([])
      setPagination((prev) => ({ ...prev, total: 0 }))
      setBmsOverviewData(normalizeBmsOverviewData())
    }
  }, [projectId, bms_id])

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
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
