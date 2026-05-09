import React, { useMemo, useRef, useState } from "react";
import { ThunderboltFilled, CaretDownOutlined, CaretUpOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { useOutletContext } from "react-router-dom";

import Pagecount from "@com/pagecontent";
import UserTree from "@com/useTree";
import Ichart from "@com/useEcharts/Ichart";
import UseProTable from "@com/useTable/proTable";
import { ProExportExcel } from "@com/useButton";

import { Contentbox, Panel, SummaryCard } from "./style";
import {
  summaryCards,
  consumeStructure,
  costTrendSource,
  costColumns,
  costData,
} from "./data";

const getDateText = ({ publictype, publicdate, publicrangedate }) => {
  if (publictype == 4 && Array.isArray(publicrangedate)) {
    const start = publicrangedate?.[0]?.format?.("YYYY-MM-DD");
    const end = publicrangedate?.[1]?.format?.("YYYY-MM-DD");
    return start && end ? `${start} 至 ${end}` : "";
  }

  const date = publicdate || dayjs();
  const format = {
    1: "YYYY-MM-DD",
    2: "YYYY-MM",
    3: "YYYY",
  }[publictype] || "YYYY-MM-DD";

  return date?.format?.(format) || "";
};

export default function Index() {
  const { exparams = {} } = useOutletContext() || {};
  const { areaId, projectId, publictype, publicdate, publicrangedate } = exparams;
  const [treeId, setTreeId] = useState();
  const [line, setLine] = useState(0);
  const tbref = useRef();

  const dateText = useMemo(
    () => getDateText({ publictype, publicdate, publicrangedate }),
    [publictype, publicdate, publicrangedate],
  );

  const pieOption = useMemo(
    () => ({
      type: 5,
      custoption: {
        color: ["#5983FE", "#46C7FF", "#FFAA54", "#5ED9A7", "#6859EA"],
        tooltip: {
          trigger: "item",
          formatter: "{b}: {d}%",
        },
        legend: {
          orient: "vertical",
          right: 12,
          top: "center",
          itemHeight: 8,
          itemWidth: 8,
          itemGap: 20,
          type: "scroll",
        },
        graphic: [
          {
            type: "group",
            left: "44%",
            top: "52%",
            bounding: "raw",
            silent: true,
            children: [
              {
                type: "text",
                x: 0,
                y: 0,
                style: {
                  text: ["总计", "", "100"].join("\n"),
                  textAlign: "center",
                  textVerticalAlign: "middle",
                  fill: "#303133",
                },
              },
            ],
          },
        ],
        series: [
          {
            type: "pie",
            stillShowZeroSum: true,
            data: consumeStructure,
            radius: ["36%", "52%"],
            center: ["44%", "52%"],
            avoidLabelOverlap: true,
            minShowLabelAngle: 8,
            label: {
              show: true,
              position: "outside",
              formatter: "{d}%",
              fontSize: 11,
            },
            labelLine: {
              show: true,
              length: 6,
              length2: 4,
            },
            labelLayout: {
              hideOverlap: true,
            },
          },
        ],
      },
    }),
    [],
  );

  const trendOption = useMemo(
    () => ({
      type: 1,
      dataset: {
        source: costTrendSource,
      },
      grid: {
        left: 36,
        right: 18,
        top: 48,
        bottom: 26,
      },
      legend: {
        top: 8,
        right: 16,
      },
      yAxis: {
        name: "万元",
      },
      series: consumeStructure.map(() => ({
        type: "bar",
        seriesLayoutBy: "row",
        stack: "cost",
        barWidth: 28,
      })),
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
      },
    }),
    [],
  );

  const toolbar = [
    <ProExportExcel tb={tbref} className="consumeAnalysis" single={true} />,
  ];

  const consumeParams = useMemo(
    () => ({
      areaId,
      projectId,
      publictype,
      dateText,
      treeId,
      line,
    }),
    [areaId, projectId, publictype, dateText, treeId, line],
  );

  return (
    <Pagecount showSearch={false} custserach={true} pd="0" bgcolor="none">
      <Contentbox
        data-area-id={consumeParams.areaId ?? ""}
        data-project-id={consumeParams.projectId ?? ""}
      >
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
            {summaryCards.map((card) => {
              const TrendIcon = card.trend === "up" ? CaretUpOutlined : CaretDownOutlined;
              return (
                <SummaryCard key={card.title}>
                  <div className="icon">
                    <ThunderboltFilled />
                  </div>
                  <div>
                    <div className="title">{card.title} <span>{card.unit}</span></div>
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
          <div className="charts">
            <Panel>
              <div className="panelTitle">能源消费结构</div>
              <div className="chart">
                <Ichart {...pieOption} />
              </div>
            </Panel>
            <Panel>
              <div className="panelTitle">能源成本趋势</div>
              <div className="chart">
                <Ichart {...trendOption} />
              </div>
            </Panel>
          </div>
          <div className="tablewrap">
            <UseProTable
              headerTitle={`能源成本明细${dateText ? `（${dateText}）` : ""}`}
              tableClassName="consumeAnalysis"
              rowKey="id"
              columns={costColumns}
              dataSource={costData}
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
                pageSize: 10,
                total: costData.length,
                showTotal: (total) => `共 ${total} 条`,
              }}
              sheetName="能源成本明细"
            />
          </div>
        </div>
      </Contentbox>
    </Pagecount>
  );
}
