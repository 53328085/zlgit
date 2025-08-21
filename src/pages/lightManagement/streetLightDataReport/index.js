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
import { ExportExcel, CustButton } from "@com/useButton";
import { Contentbox } from "./style";
import { useQueryConsumeTime } from "./api";
import { cols } from "./data";
 
export default function Index() {
  const [value, setvalue] = useState("0");
  const [line, setLine] = useState(0);
  const [treeId, setTreeId] = useState();
  const [total, setTotal] = useState(0);
  const [columns, setColumns] = useState(cols);

  console.log("columns", columns)
  let { exparams, setCustview } = useOutletContext();
  let { areaId, projectId, type, date } = exparams;
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
      console.log(flag);
      if (!flag) return;
      const dateType = {
        1: "day",
        2: "month",
        3: "year",
      }[type];
      const format = "YYYY-MM-DD";
      console.log(date);

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
      if (success && Array.isArray(data) && data.length) {
        setTotal(total);
        let { detailHeaders } = data[0];
        let last = detailHeaders.length - 1;
        let column = detailHeaders.map((col) => ({
          title: col,
          dataIndex: col,
          key: col,
          width: "96px",
        }));
        column[last].fixed = "right";
        setColumns([...cols, ...column]);
        data.forEach((item) => {
          let { detailHeaders, detailValues } = item;
          for (const [index, val] of detailHeaders?.entries()) {
            item[val] = detailValues[index];
          }
        });
       
        return {
          list: data,
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
  });
  const CustView = useMemo(() => {
    return (
      <Space size={16}>
        <ExportExcel tb={tbref} />
      </Space>
    );
  }, [value]);
  const onExport = useCallback(() => {
    return getTableData({
      current: 1,
      pageSize: total,
      areaId,
      projectId,
      type,
      date,
      energytype,
      treeId,
      line,
    });
  }, [total, type, date, areaId, treeId, , line, sheetName]);
  useEffect(() => {
    setCustview(CustView);
    return () => {
      setCustview(undefined);
    };
  }, [value]);
  return (
    <Pagecount showSearch={false} custserach={true}>
      <Contentbox>
        <UserTree
          areaId={areaId}
          setTreeId={setTreeId}
          setLine={setLine}
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
      </Contentbox>
    </Pagecount>
  );
}
