import { useEffect, useState } from "react";

import { useQueryStorageType } from "./api";

export function useStorageType(projectId) {
  const [data, setData] = useState([]);
  useEffect(() => {
    if (Number.isInteger(parseInt(projectId))) {
      useQueryStorageType({ projectId })
        .then((res) => {
          if (res.success && Array.isArray(res.data) && res.data.length) {
            setData(res.data);
          } else {
            setData([]);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [projectId]);

  return data;
}
export const columns = [
  {
    title: "告警时间",
    dataIndex: "warningTime",
    key: "warningTime",
    align: "center",
  },
  {
    title: "告警描述",
    dataIndex: "alarmEvent",
    key: "alarmEvent",
    align: "center",
  },
  {
    title: "告警等级",
    dataIndex: "level",
    key: "level",
    align: "center",
  },
  {
    title: "设备名称",
    dataIndex: "name",
    key: "name",
    align: "center",
  },
  {
    title: "安装地址",
    dataIndex: "address",
    key: "address",
    align: "center",
  },
  {
    title: "设备编号",
    dataIndex: "sn",
    key: "sn",
    align: "center",
  },

  {
    title: "设备型号",
    dataIndex: "category",
    key: "category",
    align: "center",
  },
];
const options = [
  { label: "全部", value: 0 },
  { label: "PCS", value: 1 },
  { label: "电堆", value: 2 },
  { label: "电池簇", value: 3 },
  { label: "电池组", value: 4 },
  { label: "储能柜空调", value: 5 },
  { label: "环境温度传感器", value: 6 },
  { label: "水浸传感器", value: 7 },
];
