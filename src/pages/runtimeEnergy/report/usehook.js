import { useMemo, useCallback } from "react";
import dayjs from "dayjs";
import { isObject } from "@com/usehandler";
import {Cscol, CscolW} from "./reportdata";
export function useBaript({
  selectedRowKeys,
  tableData,
  checkvalue,
  detailHeaders,
  type,
}) {
  const toformat = {
    1: "HH:mm",
    2: "DD",
    3: "MM",
    4: "HH:mm",
  }[type];
  const timeformt = {
    1: "YYYY-MM-DD HH:mm",
    2: "YYYY-MM-DD",
    3: "YYYY-MM",
    4: "YYYY-MM-DD HH:mm",
  }[type];
  const [source, dimensions, chartlen, unit] = useMemo(() => {
    let datas = tableData.filter((d) =>
      selectedRowKeys.some((s) => s.includes(d.sn) && s.includes(d.nodeName)),
    );

    let { unit } = datas?.[0] || {};
    let dimensions = datas?.map?.((d) => d.name) || [];
    let source =
      checkvalue?.length > 0 ? datas?.map?.((d) => d.detailValues) || [] : [];
    return [
      [detailHeaders, ...source],
      ["time", ...dimensions],
      dimensions.length,
      unit,
    ];
  }, [selectedRowKeys, tableData, checkvalue, detailHeaders]);

  const baroption = {
    series: new Array(chartlen).fill({ type: "bar", seriesLayoutBy: "row" }), // [{ type: "bar",seriesLayoutBy: 'row' }],
    grid: {
      left: "0px",
      right: "0",
      top: "40px",
      bottom: "35px",
      containLabel: true,
    },
    legend: {
      top: "5px",
    },
    xAxis: {
      type: "category",
      axisLabel: {
        formatter: (value) => dayjs(value, timeformt).format(toformat),
      },
    },
    yAxis: {
      type: "value",
      axisLabel: {
        formatter: (value) => value + unit,
      },
    },
    dataset: {
      dimensions,
      source,
      sourceHeadr: true,
    },
    toolbox: {
      show: true,
      feature: {
        magicType: {
          type: ["line", "bar"],
        },
        saveAsImage: {},
      },
      top: "5px",
      right: "10px",
    },
  };
  return baroption;
}

export function useCol(cols, index, title, rowspan) {
  return useMemo(() => {
    if (isObject(cols) && Object.values(cols) && index && title) {
      console.log("cols", cols);
      let col = cols[index];
      if (col) {
        col.title = title;
      }

      return Array.from(cols);
    } else {
      return [];
    }
  }, [cols, index, title]);
}
export function useCsCol({   index, title, frontRows = 0, spans, header,energytype }) {
  return useMemo(() => {
    try {
      
   
     let cols = energytype == 1 ? Cscol : CscolW;
    if (isObject(cols) && Object.values(cols)) {
      if(Number.isInteger(parseInt(index)) &&title) {
        let col = cols[index];
              if (col && title) {
                col.title = title;
              }
      }
      console.log("frontRows",frontRows)
      for (let i = 0; i < frontRows; i++) {
        cols[i].onCell = (_, index) => {
          return { rowSpan: index % spans === 0 ? spans : 0 };
        };
      }

      let newCols = header?.map?.((d, idx) => {
        return {
          title: d,
          dataIndex: d,
          key: d,
          fixed: idx == header.length - 1 ? "right" : "none",
          hideInSetting: true,
          width: 100,
          ellipsis: true,
        };
      });
        let usedcols = Array.from(cols) ;
      if (Array.isArray(newCols)) {
      
        return [...usedcols, ...newCols];
      } else {
        return usedcols;
      }
    } else {
      return [];
    }
     } catch (error) {
      console.log(error);
      return [];
    }
  }, [ index, title]);
}
