import React, { useRef, useState } from "react";
import { Space, Form } from "antd";
import Pagecount from "@com/pagecontent";
import { useNavigate, useLocation } from "react-router-dom";
import { useAntdTable } from "ahooks";
import styled from "styled-components";
import UserTable from "@com/useTable";
import Titlelayout from "@com/titlelayout";
import { useOutletContext } from "react-router-dom";
import { CustButtonT, ExportExcel, ChartList } from "@com/useButton";
//import { columns } from "./data";
import CModal from "@com/useModal";
//import { useMonitor } from "./api.js";
import { getTime } from "@com/usehandler";
import Ichart from "@com/useEcharts/Ichart";
import { Mainwrap } from "./style";
const TitleBox = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export default function Index() {
  const [datatype, setDataType] = useState("chart");
  const navigate = useNavigate();
  const { pathname, state } = useLocation();

  const { exparams } = useOutletContext();
  const { areaId, projectId, type, date } = exparams || {};
  const getData = async ({ current, pageSize }) => {
    let fag =
      [areaId, projectId, type].some((v) => Number.isInteger(v)) && date;
    if (!fag) return;
    try {
      let {success, } = await useMonitor({
        areaId,
        projectId,
        type,
        date: getTime(date, type),
      });
    } catch (error) {}
  };

  const { tableProps } = useAntdTable(getData, {
    defaultPageSize: 14,
    refreshDeps: [areaId, projectId, type, date],
  });
 console.log(tableProps)
  const onChange = (v) => {
    const type = v.target.value;
    setDataType(type);
    navigate(pathname + "#" + type, { state: state, replace: true });
  };
  const title = (
    <TitleBox>
      <span>路灯列表</span>
      <Space>
        <CustButtonT text="control"></CustButtonT>
      </Space>
    </TitleBox>
  );
  return (
    <Pagecount pd="0" bgcolor="none">
      <Mainwrap>
        <div className="left"></div>
        <div className="right">
          <div className="up"></div>
          <Titlelayout layout="flex" title={title}>
        
           </Titlelayout>
        </div>
      </Mainwrap>
     
    </Pagecount>
  );
}
