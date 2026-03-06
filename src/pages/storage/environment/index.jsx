import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { useSelector } from "react-redux";
import { BMSRuntime } from "@api/api";
import { selectProjectId } from "@redux/systemconfig.js";
import Pagecount from "@com/pagecontent";
import {
  ENV_MONITOR_DEV_MOCK_FLAG,
  ENV_MONITOR_TEXT,
} from "./constants";
import style from "./style.module.less";
import EnvDeviceDiagram from "./EnvDeviceDiagram";
import { normalizeEnvContainers, resolveDisplayText } from "./utils";

/**
 * 联调前占位，联调后删除：环境监控拓扑 mock 数据。
 *
 * @returns 容器列表
 *
 * @author ybdpx
 */
function getMockContainers() {
  return [
    {
      id: 101,
      name: "储能柜_1",
      types: [
        {
          name: "液冷系统",
          items: [
            { name: "工作模式", value: "制冷", unit: "" },
            { name: "环境温度", value: "23.5", unit: "℃" },
          ],
        },
        {
          name: "除湿机",
          items: [
            { name: "当前湿度", value: "12", unit: "%" },
            { name: "当前温度", value: "23.5", unit: "℃" },
            { name: "工作状态", value: "运行", unit: "" },
          ],
        },
        {
          name: "消防系统",
          items: [
            { name: "烟感探测器异常", value: "异常", time: "2026/02/09 18:00" },
            { name: "烟感探测器异常", value: "异常", time: "2026/02/09 17:20" },
            { name: "烟感探测器异常", value: "异常", time: "2026/02/09 16:40" },
          ],
        },
      ],
    },
    {
      id: 102,
      name: "储能柜_2",
      types: [
        {
          name: "液冷系统",
          items: [
            { name: "工作模式", value: "制冷", unit: "" },
            { name: "环境温度", value: "23.5", unit: "℃" },
          ],
        },
        {
          name: "除湿机",
          items: [
            { name: "当前湿度", value: "12", unit: "%" },
            { name: "当前温度", value: "23.5", unit: "℃" },
            { name: "工作状态", value: "运行", unit: "" },
          ],
        },
        {
          name: "消防系统",
          mode: "status",
          items: [{ name: "系统状态", value: "暂无告警", unit: "" }],
        },
      ],
    },
    {
      id: 103,
      name: "储能柜_3",
      types: [
        {
          name: "液冷系统",
          items: [
            { name: "工作模式", value: "制冷", unit: "" },
            { name: "环境温度", value: "23.5", unit: "℃" },
          ],
        },
        {
          name: "除湿机",
          items: [
            { name: "当前湿度", value: "12", unit: "%" },
            { name: "当前温度", value: "23.5", unit: "℃" },
            { name: "工作状态", value: "运行", unit: "" },
          ],
        },
        {
          name: "消防系统",
          mode: "empty",
          items: [],
        },
      ],
    },
  ];
}

const ENABLE_ENV_MONITOR_DEV_MOCK =
  process.env.NODE_ENV !== "production" &&
  process.env[ENV_MONITOR_DEV_MOCK_FLAG] === "true";

export default function EnvironmentMonitor() {
  const { exparams } = useOutletContext() || {};
  const reduxProjectId = useSelector(selectProjectId);

  const projectId = exparams?.projectId ?? reduxProjectId;
  const stationName = resolveDisplayText(
    exparams?.stationName,
    ENV_MONITOR_TEXT.DEFAULT_STATION_NAME
  );
  const rawSiteId =
    exparams?.siteId ??
    exparams?.stationId ??
    exparams?.stationName?.value ??
    exparams?.stationName?.id ??
    exparams?.site?.value ??
    exparams?.site?.id;
  const siteId = rawSiteId?.value ?? rawSiteId;

  const [diagramLoading, setDiagramLoading] = useState(false);
  const [storageData, setStorageData] = useState([]);
  const [requestError, setRequestError] = useState("");
  const [retrySeed, setRetrySeed] = useState(0);

  const { queryENVStatusInfo } = BMSRuntime;

  useEffect(() => {
    let cancelled = false;
    const applyMockFallback = () => {
      if (!ENABLE_ENV_MONITOR_DEV_MOCK || cancelled) return false;
      setStorageData(getMockContainers());
      setRequestError("");
      return true;
    };

    const hasProjectId = Number.isInteger(parseInt(projectId, 10));
    const hasSiteId = Number.isInteger(parseInt(siteId, 10));

    if (!hasProjectId || !hasSiteId) {
      setStorageData([]);
      setRequestError("");
      setDiagramLoading(false);
      return () => {
        cancelled = true;
      };
    }

    setDiagramLoading(true);
    setRequestError("");
    queryENVStatusInfo(projectId, siteId)
      .then((res) => {
        const list = res?.success ? normalizeEnvContainers(res?.data?.containers) : [];
        if (!cancelled) {
          if (list.length > 0) {
            setStorageData(list);
            return;
          }
          if (!applyMockFallback()) {
            setStorageData([]);
          }
        }
      })
      .catch(() => {
        if (applyMockFallback()) return;
        if (!cancelled) {
          setStorageData([]);
          setRequestError(ENV_MONITOR_TEXT.FETCH_ERROR);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setDiagramLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [projectId, queryENVStatusInfo, retrySeed, siteId]);

  return (
    <Pagecount pd="0">
      <div className={style.mainContent}>
        <EnvDeviceDiagram
          loading={diagramLoading}
          stationTitle={stationName}
          containers={storageData}
          errorText={requestError}
          onRetry={() => setRetrySeed((seed) => seed + 1)}
        />
      </div>
    </Pagecount>
  );
}
