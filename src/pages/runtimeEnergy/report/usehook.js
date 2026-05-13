import { useMemo, useCallback,useState } from "react";
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
  console.log(source)
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
      sourceHeader: false,
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
export function useCols(cols,  titles, type) { 
  return useMemo(() => {
    try {
         if (isObject(cols) && Object.values(cols) && isObject(titles)&& Object.values(titles).length > 0) {
      for(let [key, value] of Object.entries(titles)) {
         cols[key].title = value;
      }
      let columns = Array.from(cols)
      if (type != 1) { 
        columns.splice(8, 1)
      }
      return columns 
    } else {
      return [];
    }
    } catch (error) {
      console.log(error)
      return [];
    }
 
  }, [cols, titles, type]);
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
export function useCsCol(props) {
  console.log("useCsCol", props);
  const {   index, title="", frontRows = 0, spans, header,energytype,filters,filteredValue } = props;
  return useMemo(() => {
    try {
      let flag
      if (energytype == 1) {
         flag = [index, frontRows, spans,  energytype].every(i => Number.isInteger(parseInt(i))) &&
        title && Array.isArray(filters)  
        && filters.length > 0 && Array.isArray(filteredValue) &&Array.isArray(header) && header.length > 0 ;
      }else {
        flag = title && Array.isArray(header)  && header.length > 0;
      }
     
    if (!flag) return [];
     let cols = energytype == 1 ? Cscol : CscolW;
    if (isObject(cols) && Object.values(cols)) {
      if(Number.isInteger(parseInt(index)) &&title) {
        let col = cols[index];
              if (col && title) {
                col.title = title;
              }
        if(energytype == 1 && col && Array.isArray(filters) && filters.length > 0){

          col= {
            ...col,
            filtered:true,
            filters: filters.map(v =>({text: v, value: v})),
            onFilter: (value, record) => record?.power?.indexOf?.(value) ==0,
            filteredValue:filteredValue,
           }
        }
      //  console.log("col",col)
        cols[index]=col
      }
      
      for (let i = 0; i < frontRows; i++) {
        cols[i].onCell = (_, index) => spans>1 ?   ({ rowSpan:     index % spans === 0 ? spans : 0  }) : null;
      }
      //console.log("cols",cols)
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
  }, [ index, title,header,frontRows,energytype,spans,filters,filteredValue,header]);
}

export function usexlCol({cols, type, date, spans}) {
  return useMemo(() => {
    if (isObject(cols) && Object.values(cols) && type && date) {
      let newcol =[]
      if(type==3) {
      newcol =  Array.from({length:12}, (_, i) =>({
        title:  i+1 + "月",
        dataIndex:  i+1,
        key: i+1,
        width: 100,
        ellipsis: true,
        children:[
          { 
            title: "最大需量值",
            dataIndex:  `value${i+1}` ,
            key:  `value${i+1}`,
            width: 100,
            ellipsis: true, 
          },
          { 
            title: "发生时间",
            dataIndex: `dateTime${i+1}`,
            key:  `dateTime${i+1}`,
            width: 100,
            ellipsis: true, 
          }

        ]

       }) )
      }else {
        let m = dayjs(date).format("M")
         newcol = [
          {
        title:  dayjs(date).format("MM") + "月",
        dataIndex:  m+1,
        key: m+1,
        width: 100,
        ellipsis: true,
        fixed:'left', 
        children:[
          { 
            title: "最大需量值",
            dataIndex:  `value${m}` ,
            key:  `value${m}`,
            width: 100,
            ellipsis: true, 
          },
          { 
            title: "发生时间",
            dataIndex:  `dateTime${m}` ,
            key:  `dateTime${m}`,
            width: 100,
            ellipsis: true, 
          }

        ]

       }
         ]
      }
      cols[0].onCell=(_,index)=> spans > 1 ? ({rowSpan:  index % 2 === 0 ? spans : 0 }): null
      cols[1].onCell=(_,index)=> spans > 1 ? ({rowSpan: index % 2 === 0 ? spans : 0 }) :null
      return [...Array.from(cols),...newcol];
    } else {
      return [];
    }
  }, [cols, type, date,spans])
}