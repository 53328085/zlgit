import { useState, useEffect, useRef, useMemo } from "react";
import { Radio } from "antd";
import Ichart from "@com/useEcharts/Ichart";
import Charttable from "./chartTable";
import {ExportExcel} from "@com/useButton"
import { Echartbox } from "../../style";

export default function ({ qverview={}, type,  tabvalue }) {
  const {detail={},legend=[]} =qverview
  const [model, setModel] = useState(1);
  const changeModel = (e) => {
    setModel(e.target.value);
  };

  let { x = [], y = [], y1 = [] } = detail || {};
  const ref = useRef()
  const baropt = useMemo(() => {
    return {
      series: [
        {
          type: "bar",
          seriesLayoutBy: "row",
        },
        {
          type: "bar",
          seriesLayoutBy: "row",
        },
      ],
      toolbox: {
        feature: {
          saveAsImage: {},
        },
      },
      grid: {
        left: "0px",
        right: "0",
        top: "40px",
        bottom: "0px",
        containLabel: true,
      },
      legend: {
        // show:true
      },
      xAxis: {
        axisLabel: {
          showMaxLabel: true,
          hideOverlap: true,
          interval: "auto",
        },
      },
      dataset: {
        dimensions: [
          { name: "时间", type: "time" },
          { name: legend?.[0] },
          { name: legend?.[1] },
        ],
        source: [x, y, y1],
        sourceHeader: false,
      },
    };
  }, [detail, legend]);

  let source = x.map((v, index) => ({
    time: v,
    [legend?.[0]]: y[index],
    [legend?.[1]]: y1[index],
  }));

  return (
    <Echartbox>
      <div className="model">
        <Radio.Group
          onChange={changeModel}
          defaultValue={model}
          buttonStyle="solid"
        >
          <Radio.Button
            style={{ width: "96px", marginLeft: 16, textAlign: "center" }}
            value={1}
          >
            图表模式
          </Radio.Button>
          <Radio.Button
            style={{ width: "96px", textAlign: "center" }}
            value={2}
          >
            列表模式
          </Radio.Button>
        </Radio.Group>
        <ExportExcel single={true} tb={ref} disabled={model==1} ></ExportExcel>
      </div>

      {model == 1 ? (
        <div className="chart">
          <Ichart {...baropt} />
        </div>
      ) : (
        <Charttable source={source} legend={legend} type={type} tabvalue={tabvalue} ref={ref} />
      )}
    </Echartbox>
  );
}
