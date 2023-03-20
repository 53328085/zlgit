import React from "react";
import {
  FileSearchOutlined,
  PrinterOutlined,
  ExportOutlined,
} from "@ant-design/icons";
import style from "./style.module.less";
import { useState, useEffect } from "react";
import { Select, Radio, Button, DatePicker, Space } from "antd";
import dashLine from "@imgs/line.png";
import { useRequest } from "ahooks";
import { AreaSetting } from "@api/api.js";
import { useSelector } from "react-redux";
import { selectProjectId } from "@redux/systemconfig.js";
import { message } from "antd";
//dayjs bug
import dayjs from "dayjs";
import weekday from "dayjs/plugin/weekday";
import localeData from "dayjs/plugin/localeData";
dayjs.extend(weekday);
dayjs.extend(localeData);
export default function Index(props) {
  console.log(props);
  const { QueryAllArea } = AreaSetting;
  const [showMonth, setShowMonth] = useState(true);
  const [messageApi] = message.useMessage();
  const messageContent = (type, content) => {
    messageApi.open({
      type,
      content,
    });
  };
  //园区下拉获取
  const projectId = useSelector(selectProjectId);
  const [areaList, setAreaList] = useState([]);
  const [defaultArea, setDefaultArea] = useState();
  const [areaId, setAreaId] = useState(0);
  const [getRightInfo, setGetRightInfo] = useState(false);
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
  //日期选择:默认月度报告
  const [type, setType] = useState("2");
  let time = new Date();
  let year = time.getFullYear();
  let month = time.getMonth() + 1;
  month = month > 9 ? month : "0" + month;
  const [date, setDate] = useState(year.toString() + "-01-01");
  const onChangeReportType = ({ target: { value } }) => {
    setType(value);
    console.log(value.props);
    value == 2 ? setShowMonth(true) : setShowMonth(false);
    value == 2
      ? props.electricityDateGive(true)
      : props.electricityDateGive(false);
    if (value == "3") setDate(year.toString() + "-01-01");
    if (value == "2") setDate(year + "-" + month + "-01");
  };
  const onChangeMonth = (date, dateString) => {
    console.log(date, dateString);
    if (type == "2") setDate(dateString + "-01");
  };
  const onChangeYear = (date, dateString) => {
    console.log(date, dateString);
    if (type == "3") setDate(dateString + "-01-01");
  };
  const handleCreat = () => {
    if (areaId == 0) {
      return;
    } else {
      let rightInfo = true;
      let params = {
        type,
        areaId,
        date,
        rightInfo,
      };
      console.log(params);
      if (params) {
        props.reportInfoGive(params);
      } else {
      }
    }
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
          defaultValue="2"
          buttonStyle="solid"
        >
          <Radio.Button className={style.moonReport} value="2">
            月度报告
          </Radio.Button>
          <Radio.Button className={style.yearReport} value="3">
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
            allowClear={false}
            value={dayjs(date, "YYYY-MM")}
            format={"YYYY-MM"}
          />
        ) : (
          <DatePicker
            onChange={onChangeYear}
            picker="year"
            className={style.datePickerYear}
            allowClear={false}
            value={dayjs(date, "YYYY")}
            format={"YYYY"}
          />
        )}
        {/* <PickerWithType
          style={{ width: "160px", marginRight: "16px" }}
          type={type}
          onChange={changeDate}
        ></PickerWithType> */}
      </Space>
      <img src={dashLine} className={style.radioLine}></img>
      <div className={style.btnGroup}>
        <Button
          type="primary"
          className={style.btn}
          onClick={() => handleCreat()}
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
          onClick={() => props.reportExportGive()}
          className={style.btn}
        >
          <ExportOutlined />
          导出报告
        </Button>
      </div>
    </div>
  );
}
