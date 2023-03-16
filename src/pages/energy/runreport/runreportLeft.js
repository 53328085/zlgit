import React from "react";
import {
  FileSearchOutlined,
  PrinterOutlined,
  ExportOutlined,
} from "@ant-design/icons";
import style from "./style.module.less";
import { useState, useEffect, Fragment } from "react";
import { Select, Radio, Button, DatePicker, Space } from "antd";
import dashLine from "@imgs/line.png";
import { useRequest } from "ahooks";
import { AreaSetting } from "@api/api.js";
import { useSelector } from "react-redux";
import { selectProjectId } from "@redux/systemconfig.js";
export default function Index(props) {
  const { QueryAllArea } = AreaSetting;
  const [showMonth, setShowMonth] = useState(true);
  
  //园区下拉获取
  const projectId = useSelector(selectProjectId);
  const [areaList, setAreaList] = useState([]);
  const [defaultArea, setDefaultArea] = useState();
  const [areaId,setAreaId] = useState(0)
  const getAreaData = () => {
    return QueryAllArea(projectId, 1).then((res) => {
      let { success, data } = res;
      if (success && data) {
        setAreaList(data);
        setDefaultArea(data[0].id);
        setAreaId(data[0].id);
      } else {
        messageContent("error", res.errMsg);
      }
    });
  };
  const { data: AreaData } = useRequest(getAreaData, {
    onSuccess: (result, params) => {},
  });

  const changeArea = (value) => {
    setAreaId(value);
  };
  const onChangeReportType = ({ target: { value } }) => {
    console.log(value.props);
    value == 1 ? setShowMonth(true) : setShowMonth(false);
    value == 1
      ? props.electricityDateGive(true)
      : props.electricityDateGive(false);
  };
  const onChangeMonth = (date, dateString) => {
    console.log(date, dateString);
  };
  const onChangeYear = (date, dateString) => {
    console.log(date, dateString);
  };
 
  return (
    <div className={style.contentLeft}>
      <div className={style.parkSelect}>
        <span className={style.title}>园区选择</span>
        <Select
          placeholder="请选择园区"
          size="middle"
          key={defaultArea}
          defaultValue={defaultArea}
          onChange={changeArea}
          style={{ width: "320px", marginTop: "32px" }}
        >
          {areaList.map((item) => {
            return (
              <Select.Option key={item.id} value={item.id}>
                {item.name}
              </Select.Option>
            );
          })}
        </Select>
      </div>
      <img src={dashLine} className={style.radioLine}></img>
      <span className={style.title}>运行报告</span>
      <div className={style.reportType}>
        <Radio.Group
          onChange={onChangeReportType}
          defaultValue="1"
          buttonStyle="solid"
        >
          <Radio.Button className={style.moonReport} style={{}} value="1">
            月度报告
          </Radio.Button>
          <Radio.Button className={style.yearReport} value="2">
            年度报告
          </Radio.Button>
        </Radio.Group>
      </div>
      <Space direction="vertical" className={style.datePicker}>
        {showMonth ? (
          <DatePicker
            onChange={onChangeMonth}
            picker="month"
            className={style.datePickerMonth}
          />
        ) : (
          <DatePicker
            onChange={onChangeYear}
            picker="year"
            className={style.datePickerYear}
          />
        )}
      </Space>
      <img src={dashLine} className={style.radioLine}></img>
      <div className={style.btnGroup}>
        <Button
          type="primary"
          className={style.btn}
          onClick={() => props.reportInfoGive(true)}
        >
          <FileSearchOutlined />
          生成报告
        </Button>
        <Button
          type="primary"
          onClick={() => enterLoading(1)}
          className={style.btn}
        >
          <PrinterOutlined />
          打印报告
        </Button>
        <Button
          type="primary"
          onClick={() =>  props.reportExportGive()}
          className={style.btn}
        >
          <ExportOutlined />
          导出报告
        </Button>
      </div>
    </div>
  );
}
