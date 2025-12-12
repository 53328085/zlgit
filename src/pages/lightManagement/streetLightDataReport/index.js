import React, {
  useState,
  useMemo,
  useRef,
  useCallback,
  useEffect,
} from "react";
import { Space } from "antd";
import { useAntdTable } from "ahooks";
import { useOutletContext } from "react-router-dom";
import Pagecount from "@com/pagecontent";
import UserTable from "@com/useTable";
import UserTree from "@com/useTree";
import {isObject} from "@com/usehandler"
import { ExportExcel, CustButton } from "@com/useButton";
import { Contentbox } from "./style";
import { useQueryConsumeTime } from "./api";
import { cols } from "./data";
import LinghtSearch from "../comm"
export default function Index() {
  
  const [line, setLine] = useState(0);
  const [treeId, setTreeId] = useState();
  const [total, setTotal] = useState(0);
  const [columns, setColumns] = useState(cols);
  const [params, setParams]= useState({})
  const [node, setNode] = useState()
  const {areaId, type, date, projectId} = params
  const tbref = useRef();
  const sheetName = useMemo(() => {
    let filename = "数据报表";

    //  console.log(dates)
    if (type && date && !Array.isArray(date)) {
      filename += date.format("YYYY-MM-DD");
    }
    return filename;
  }, [date, type]);
  const getTableData = async ({ current, pageSize }) => {
    try {
      let flag =
        [areaId, projectId, type].some((id) =>
          Number.isInteger(parseInt(id))
        ) &&
        date &&
        !Array.isArray(date) &&
        Array.isArray(treeId);
     
      if (!flag) return;
      const dateType = {
        1: "day",
        2: "month",
        3: "year",
      }[type];
      const format = "YYYY-MM-DD";
      

      let body = {
        projectId,
        queryType: line + 1,
        type: type,
        ids: treeId,
        startDate: date?.startOf(dateType)?.format(format),
        endDate: date?.endOf(dateType)?.format(format),
        pageNum: current,
        pageSize: pageSize,
      };
      let { success, data, total } = await useQueryConsumeTime({}, body);
      if (success && isObject(data)) {
        setTotal(total);
        let { detailHeaders,detailDatas } = data;
        let last = detailHeaders.length - 1;
        let column = detailHeaders.map((col) => ({
          title: col,
          dataIndex: col,
          key: col,
          width: "96px",
        }));
        column[last].fixed = "right";
        setColumns([...cols, ...column]);
        detailDatas.forEach((item) => {
         let { detailValues } = item;
          for (const [index, val] of detailHeaders?.entries()) {
            item[val] = detailValues[index];
          }
        });
       
        return {
          list: detailDatas,
          total,
        };
      } else {
        return {
          list: [],
          total: 0,
        };
      }
    } catch (error) {
      console.log(error);
    }
  };
  const { tableProps } = useAntdTable(getTableData, {
    refreshDeps: [projectId, areaId, type, date, treeId],
    defaultPageSize:20
  });
 
  const onExport = useCallback(() => {
    return getTableData({
      current: 1,
      pageSize: total,
      areaId,
      projectId,
      type,
      date, 
      treeId,
      line,
    });
  }, [total, type, date, areaId, treeId, , line, sheetName]);
 
  return (
    <Pagecount  pd="0" bgcolor="none">
      <Contentbox>
      <LinghtSearch setParams={setParams} tbref={tbref} allselect={false}  /> 
        <div className="mainwrap">
        <UserTree
          areaId={0}
          setTreeId={setTreeId}
          setLine={setLine}
          title="路灯设备列表"
          setNode={setNode}
          showline={true}
          allselect={line==0} 
          multiple={line==0}  
          datatype={line==0 ? 0 : 4}
          energytype={1} 
        />
        <div className="outwrap">
          <div className="inwrap">
            <UserTable
              ref={tbref}
              columns={columns}
              {...tableProps}
              key="sn"
              sheetName={sheetName}
              onExport={onExport}
              scroll={{
                scrollToFirstRowOnChange: true,
                x: 1400,
                y: 685
              }}
            ></UserTable>
          </div>
        </div>
        </div>
      </Contentbox>
    </Pagecount>
  );
}
