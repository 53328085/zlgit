import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { useSelector } from "react-redux";
import { BMSRuntime } from "@api/api";
import { selectProjectId } from "@redux/systemconfig.js";
import Pagecount from "@com/pagecontent";
import style from "./style.module.less";
import EnvDeviceDiagram from "./EnvDeviceDiagram";

function resolveDisplayText(input, fallback = "") {
  if (input === null || input === undefined) return fallback;
  if (typeof input === "string" || typeof input === "number") {
    const text = String(input).trim();
    return text || fallback;
  }
  if (typeof input === "object") {
    const candidate =
      input.label ??
      input.name ??
      input.displayName ??
      input.title ??
      input.text ??
      input.value;
    if (candidate === input) return fallback;
    return resolveDisplayText(candidate, fallback);
  }
  return fallback;
}

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

/**
 * 标准化接口容器数据，避免字段缺失导致拓扑渲染异常。
 *
 * @param containers 接口容器列表
 * @returns 标准化后的容器列表
 *
 * @author ybdpx
 */
function normalizeEnvContainers(containers) {
  if (!Array.isArray(containers) || containers.length === 0) {
    return [];
  }

  return containers.map((container, index) => {
    const rawName = resolveDisplayText(
      container?.displayName ?? container?.containerName ?? container?.name,
      ""
    );
    const fallbackName = `储能柜_${index + 1}`;
    const name = !rawName || rawName === "环境监控" ? fallbackName : rawName;
    return {
      ...container,
      id: container?.id ?? `env-container-${index + 1}`,
      name,
      types: Array.isArray(container?.types) ? container.types : [],
    };
  });
}

export default function EnvironmentMonitor() {
  const { exparams } = useOutletContext() || {};
  const reduxProjectId = useSelector(selectProjectId);

  const projectId = exparams?.projectId ?? reduxProjectId;
  const stationName = resolveDisplayText(exparams?.stationName, "储能站点");
  const rawSiteId = exparams?.siteId ?? exparams?.areaId;
  const siteId = rawSiteId?.value ?? rawSiteId;

  const [diagramLoading, setDiagramLoading] = useState(false);
  const [storageData, setStorageData] = useState(getMockContainers());

  const { queryENVStatusInfo } = BMSRuntime;

  useEffect(() => {
    let cancelled = false;

    const applyFallback = () => {
      if (!cancelled) setStorageData(getMockContainers());
    };

    if (!projectId || !siteId) {
      applyFallback();
      return () => {
        cancelled = true;
      };
    }

    setDiagramLoading(true);
    queryENVStatusInfo(projectId, siteId)
      .then((res) => {
        const list = res?.success ? normalizeEnvContainers(res?.data?.containers) : [];
        if (!cancelled) {
          setStorageData(list.length > 0 ? list : getMockContainers());
        }
      })
      .catch(() => applyFallback())
      .finally(() => {
        if (!cancelled) {
          setDiagramLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [projectId, queryENVStatusInfo, siteId]);

  return (
    <Pagecount pd="0">
      <div className={style.mainContent}>
        <EnvDeviceDiagram loading={diagramLoading} stationTitle={stationName} containers={storageData} />
      </div>
    </Pagecount>
  );
}
