export const summaryCards = [
  {
    title: "总能源消费量",
    value: "0.00",
    unit: "tce(吨标准煤)",
    compare: "较上月",
    rate: "-6.08%",
    trend: "down",
  },
  {
    title: "本月能源成本",
    value: "0.00",
    unit: "万元",
    compare: "较上月",
    rate: "+6.08%",
    trend: "up",
  },
  {
    title: "单位能耗成本",
    value: "0.00",
    unit: "元",
    compare: "较上月",
    rate: "-6.08%",
    trend: "down",
  },
];

export const consumeStructure = [
  { name: "电力", value: 44.17 },
  { name: "天然气", value: 28.35 },
  { name: "煤炭", value: 14.17 },
  { name: "柴油", value: 7.25 },
  { name: "其他", value: 6.06 },
];

export const costTrendSource = [
  ["product", "2025-11", "2025-12", "2026-01", "2026-02", "2026-03", "2026-04"],
  ["电力", 265, 245, 228, 154, 121, 116],
  ["天然气", 72, 70, 64, 46, 35, 34],
  ["煤炭", 58, 56, 49, 36, 28, 27],
  ["柴油", 31, 28, 26, 18, 13, 12],
  ["其他", 18, 17, 15, 10, 8, 7],
];

export const costColumns = [
  {
    title: "能源类型",
    dataIndex: "energyType",
    key: "energyType",
  },
  {
    title: "消费量(tce)",
    dataIndex: "consume",
    key: "consume",
    align: "right",
  },
  {
    title: "单价(元)",
    dataIndex: "price",
    key: "price",
    align: "right",
  },
  {
    title: "总成本(万元)",
    dataIndex: "cost",
    key: "cost",
    align: "right",
  },
  {
    title: "占比",
    dataIndex: "ratio",
    key: "ratio",
    align: "right",
  },
];

export const costData = [
  {
    id: 1,
    energyType: "电力",
    consume: "2,850",
    price: "1.12",
    cost: "12,850",
    ratio: "44.17%",
  },
  {
    id: 2,
    energyType: "天然气",
    consume: "2,850",
    price: "2.21",
    cost: "2,850",
    ratio: "28.35%",
  },
  {
    id: 3,
    energyType: "煤炭",
    consume: "1,436",
    price: "1.86",
    cost: "1,436",
    ratio: "14.17%",
  },
  {
    id: 4,
    energyType: "柴油",
    consume: "735",
    price: "4.56",
    cost: "735",
    ratio: "7.25%",
  },
  {
    id: 5,
    energyType: "其他",
    consume: "614",
    price: "1.35",
    cost: "614",
    ratio: "6.06%",
  },
];
