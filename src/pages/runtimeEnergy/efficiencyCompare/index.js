import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import {
  AlertFilled,
  CaretDownOutlined,
  CaretUpOutlined,
  CheckCircleFilled,
  ThunderboltFilled,
  WarningFilled,
} from "@ant-design/icons";
import { DatePicker } from "antd";
import dayjs from "dayjs";
import { useOutletContext } from "react-router-dom";

import Pagecount from "@com/pagecontent";
import UserTree from "@com/useTree";
import Ichart from "@com/useEcharts/Ichart";
import UseProTable from "@com/useTable/proTable";
import { ProExportExcel } from "@com/useButton";

import { getEfficiencyBenchmarkMock } from "./data";
import {
  ChartPanel,
  Contentbox,
  DeviationText,
  Panel,
  RankBoard,
  RankList,
  RankListItem,
  StatusCell,
  StatusTag,
  SummaryCard,
} from "./style";

const PAGE_SIZE = 10;

const summaryIconMap = {
  rate: ThunderboltFilled,
  better: CheckCircleFilled,
  pending: WarningFilled,
};

const getChartOption = (trendSource) => ({
  type: 1,
  dataset: {
    source: trendSource,
  },
  grid: {
    left: 40,
    right: 18,
    top: 44,
    bottom: 28,
  },
  legend: {
    top: 8,
    right: 16,
    itemWidth: 14,
    itemHeight: 10,
  },
  yAxis: {
    name: "tce/万元",
    nameTextStyle: {
      color: "#909399",
    },
    min: 0,
    max: 400,
    interval: 100,
  },
  tooltip: {
    trigger: "axis",
    axisPointer: {
      type: "shadow",
    },
  },
  series: [
    {
      type: "bar",
      seriesLayoutBy: "row",
      barWidth: 18,
      itemStyle: {
        borderRadius: [4, 4, 0, 0],
        color: "#95D6A4",
      },
    },
    {
      type: "bar",
      seriesLayoutBy: "row",
      barWidth: 18,
      itemStyle: {
        borderRadius: [4, 4, 0, 0],
        color: "#7AA8FF",
      },
    },
  ],
});

export default function Index() {
  const { exparams = {} } = useOutletContext() || {};
  const { areaId, projectId, publictype, publicdate, publicrangedate } = exparams;
  const [treeId, setTreeId] = useState();
  const [line, setLine] = useState(0);
  const [pageCurrent, setPageCurrent] = useState(1);
  const [exportYear, setExportYear] = useState(publicdate || dayjs());
  const [rankBoardHeight, setRankBoardHeight] = useState();
  const tbref = useRef();
  const rankBoardRef = useRef(null);

  useEffect(() => {
    setExportYear(publicdate || dayjs());
  }, [publicdate]);

  const mockData = useMemo(
    () =>
      getEfficiencyBenchmarkMock({
        areaId,
        projectId,
        publictype,
        publicdate,
        publicrangedate,
        treeId,
        line,
      }),
    [areaId, projectId, publictype, publicdate, publicrangedate, treeId, line],
  );

  useLayoutEffect(() => {
    if (!rankBoardRef.current) {
      return undefined;
    }

    const updateHeight = () => {
      setRankBoardHeight(rankBoardRef.current?.offsetHeight || undefined);
    };

    updateHeight();

    if (typeof ResizeObserver === "undefined") {
      return undefined;
    }

    const observer = new ResizeObserver(updateHeight);
    observer.observe(rankBoardRef.current);

    return () => observer.disconnect();
  }, [mockData.rankingItems]);

  useEffect(() => {
    setPageCurrent(1);
  }, [mockData.scopeKey]);

  const chartOption = useMemo(() => getChartOption(mockData.trendSource), [mockData.trendSource]);

  const columns = useMemo(
    () => [
      {
        title: "用能单元",
        dataIndex: "energyUnit",
        key: "energyUnit",
      },
      {
        title: "行业基杆值(tce)",
        dataIndex: "industryBenchmark",
        key: "industryBenchmark",
        align: "right",
      },
      {
        title: "实际能耗(tce)",
        dataIndex: "actualBenchmark",
        key: "actualBenchmark",
        align: "right",
      },
      {
        title: "预算偏差",
        dataIndex: "deviation",
        key: "deviation",
        align: "right",
        render: (_, record) => (
          <DeviationText positive={String(record.deviation).startsWith("+")}>
            {record.deviation}
          </DeviationText>
        ),
      },
      {
        title: "状态",
        dataIndex: "status",
        key: "status",
        render: (_, record) => (
          <StatusCell>
            {record.status?.icon ? (
              <img src={record.status.icon} alt={record.status?.key || "status"} />
            ) : null}
            <StatusTag tone={record.status?.tone}>{record.status?.text}</StatusTag>
          </StatusCell>
        ),
      },
    ],
    [],
  );

  const currentRows = useMemo(() => {
    const startIndex = (pageCurrent - 1) * PAGE_SIZE;
    return mockData.tableRows.slice(startIndex, startIndex + PAGE_SIZE);
  }, [mockData.tableRows, pageCurrent]);

  const toolbar = useMemo(
    () => [
      <div className="toolbarYearPicker" key="export-year">
        <DatePicker
          picker="year"
          allowClear={false}
          format="YYYY"
          value={exportYear}
          onChange={(value) => setExportYear(value || dayjs())}
        />
      </div>,
      <ProExportExcel tb={tbref} className="efficiencyCompare" single={true} key="export" />,
    ],
    [exportYear],
  );

  return (
    <Pagecount showSearch={false} custserach={true} pd="0" bgcolor="none">
      <Contentbox data-area-id={areaId ?? ""} data-project-id={projectId ?? ""}>
        <div className="leftwrap">
          <div className="leftTitle">区域列表</div>
          <UserTree
            areaId={areaId}
            setTreeId={setTreeId}
            setLine={setLine}
            showline={false}
            showSearch={true}
            datatype={NaN}
            allselect={false}
          />
        </div>
        <div className="rightwrap">
          <div className="cards">
            {mockData.summaryCards.map((card) => {
              const TrendIcon = card.trend === "up" ? CaretUpOutlined : CaretDownOutlined;
              const IconComponent = summaryIconMap[card.key] || ThunderboltFilled;

              return (
                <SummaryCard key={card.key} tone={card.tone}>
                  <div className="icon">
                    <IconComponent />
                  </div>
                  <div>
                    <div className="title">
                      {card.title}
                      {card.unit ? <span>{card.unit}</span> : null}
                    </div>
                    <div className="value">
                      <span className="num">{card.value}</span>
                    </div>
                    <div className="compare">
                      <span>{card.compare}</span>
                      <span className={card.trend}>
                        <TrendIcon /> {card.rate}
                      </span>
                    </div>
                  </div>
                </SummaryCard>
              );
            })}
          </div>

          <div className="centerwrap">
            <RankBoard ref={rankBoardRef}>
              <div className="panelTitle">
                <span>单位能效排名</span>
              </div>
              <RankList>
                {mockData.rankingItems.map((item, index) => (
                  <RankListItem key={item.id} rank={index + 1}>
                    {item.icon ? (
                      <img className="rankIcon" src={item.icon} alt={`${item.name}-rank`} />
                    ) : (
                      <div className="rankIndex">{index + 1}</div>
                    )}
                    <div className="rankMain">
                      <strong>{item.name}</strong>
                      <span>{item.benchmarkUnit}</span>
                    </div>
                    <div className="rankMeta">
                      <strong className="rankValue">{item.benchmarkValue}</strong>
                      <div className="rankPercent">{item.percent}</div>
                      <StatusTag tone={item.status?.tone}>{item.status?.text}</StatusTag>
                    </div>
                  </RankListItem>
                ))}
              </RankList>
            </RankBoard>

            <ChartPanel style={rankBoardHeight ? { height: `${rankBoardHeight}px` } : undefined}>
              <div className="panelTitle">
                <span>月度目标完成情况</span>
              </div>
              <div className="chart">
                <Ichart {...chartOption} />
              </div>
            </ChartPanel>
          </div>

          <div className="tablewrap">
            <UseProTable
              headerTitle="能效对标明细"
              tableClassName="efficiencyCompare"
              rowKey="id"
              columns={columns}
              dataSource={currentRows}
              search={false}
              ref={tbref}
              toolBarRender={() => toolbar}
              options={{
                fullScreen: false,
                reload: false,
                density: false,
                setting: false,
              }}
              scroll={{ x: "max-content" }}
              pagination={{
                current: pageCurrent,
                pageSize: PAGE_SIZE,
                total: mockData.tableRows.length,
                showTotal: (total) => `共 ${total} 条`,
                onChange: (page) => setPageCurrent(page),
              }}
              sheetName={`能效对标明细-${exportYear?.format?.("YYYY") || dayjs().format("YYYY")}`}
            />
          </div>
        </div>
      </Contentbox>
    </Pagecount>
  );
}
