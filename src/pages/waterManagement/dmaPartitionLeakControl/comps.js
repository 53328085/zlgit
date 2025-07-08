import { useEffect, useState, useRef, useContext } from "react";
import { Header, Card, StyledRadioGroup, AlarmWrapper } from "./style";
import i18 from '../../../i18n'
import { SearchOutlined ,DownloadOutlined} from "@ant-design/icons";
import CustContext from "@com/content";
import {
  Form,
  Select,
  DatePicker,
  Radio,
  Divider,
  Button,
  ConfigProvider,
  Space,
} from "antd";
import * as echarts from "echarts";
import {
  Radio_Options,
  Date_Value,
  Init_Value,
  Guage_Data,
  Type_Options,
  Double_Option,
  TbHeader,
  PartitionAlarmTableColumns,
  PartitionAlarmTableData,
  AlarmLevel,
  AlarmHeader,
} from "./data";
import BlueColumn from "@com/bluecolumn";
import UseTable from "@com/useTable";
import { drawEcharts } from "@com/useEcharts";
import {AllExportButton} from "@com/useButton"

//头部标签
export const Tabs = ({ onValuesChange, setTabId, form }) => {
  const { Item } = Form;
  const [type, setType] = useState("date");

  return (
    <Header>
      <div>
        <Radio.Group
          block
          options={Radio_Options}
          defaultValue="1"
          optionType="button"
          buttonStyle="solid"
          size="large"
          onChange={(e) => {
            setTabId(e.target.value);
          }}
        />
      </div>
      <div className="form">
        <Form
          form={form}
          layout="inline"
          onValuesChange={onValuesChange}
          initialValues={Init_Value}
        >
          <Item name="dtype">
            <Select
              size="default"
              options={Date_Value}
              style={{ width: 80, marginRight: 16 }}
              onChange={(e) => {
                if (e == "1") {
                  setType("date");
                } else if (e == "2") {
                  setType("month");
                } else {
                  setType("year");
                }
              }}
            ></Select>
          </Item>
          <Item name="date">
            <DatePicker
              size="default"
              style={{ width: 160 }}
              picker={type}
            ></DatePicker>
          </Item>
        </Form>
      </div>
    </Header>
  );
};

//漏损分析
export const Leakage = ({ analysisData }) => {
  console.log("analysisData", analysisData);
  const dviderCss = {
    height: "174px", // 控制高度
    margin: "0 16px", // 控制左右间距
    backgroundColor: "#d7d7d7",
    flex: "0 0 auto",
  };
  const guageRef = useRef();
  const text1 = [
    {
      label: "管网漏损率(%)",
      value: analysisData.leakageRate ?? 0,
      color: "#ff0303",
    },
    {
      label: "管网漏损量(m³)",
      value: analysisData.leakageValue ?? 0,
      color: "#ff0303",
    },
    { label: "分区供水量（m³）", value: analysisData.supplyValue ?? 0 },
    { label: "分区用水量（m³）", value: analysisData.useValue ?? 0 },
  ];
  const text2 = [
    { label: "管理总表（只）", value: analysisData.manageMainMeterCount ?? 0 },
    { label: "管理分表（只）", value: analysisData.manageSubMeterCount ?? 0 },
    { label: "用水表（只）", value: analysisData.waterMeterCount ?? 0 },
    { label: "抄见率（%)", value: analysisData.readingRate ?? 0 },
  ];

  useEffect(() => {
    Guage_Data.series[0].data[0]["value"] = analysisData.leakageRateTarget ?? 0;
    drawEcharts(guageRef.current, {
      ...Guage_Data,
      type: 2,
      xAxis: { show: false },
    });
  }, []);
  return (
    <Card>
      <BlueColumn
        bg={{ height: 13, width: 3 }}
        fontWeight="bold"
        name="漏损分析"
        styled={{ color: "#515151" }}
      ></BlueColumn>
      <div className="leakage">
        <div className="leakage-item1" ref={guageRef}></div>
        <Divider type="vertical" style={dviderCss}></Divider>
        <div className="leakage-item2 leakage-item">
          <LeakageContent
            title="漏损概览"
            type="warn"
            textList={text1}
          ></LeakageContent>
        </div>
        <Divider type="vertical" style={dviderCss}></Divider>
        <div className="leakage-item3 leakage-item">
          <LeakageContent
            title="用水设备"
            type="primary"
            textList={text2}
          ></LeakageContent>
        </div>
      </div>
    </Card>
  );
};

//漏损分析部分的组件
const LeakageContent = ({ title, type = "warn", textList = [] }) => {
  // const analysisData = useContext(CustContext)

  return (
    <div className="leakage-content">
      <div className="leakage-title">
        <div
          className={`leakage-title-icon ${
            type == "warn" ? "leakage-title-red" : "leakage-title-blue"
          }`}
        ></div>
        <span>{title}</span>
      </div>
      <div
        className="leakage-text"
        style={{ backgroundColor: type == "warn" ? "#f5dfdc" : "#dce6f5" }}
      >
        {textList.map((item) => (
          <div className="item">
            <p>{item.label}</p>
            <p style={{ color: item?.color ?? "#3785E6" }}>{item.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

//漏损趋势
export const LeakageTrend = ({ trendData ,getLeakageChart}) => {
  const [type, setType] = useState("1");
  console.log("trendData", trendData);
  const lineChartRef = useRef();
  const tableRef=useRef();
  const changeType = (e) => {
    setType(e.target.value);
  };
  useEffect(() => {
    let myChart = null;
    let xAxis = [];
    let topData1 = [];
    let topData2 = [];
    let bottomData1 = [];
    let bottomData2 = [];
    if (type == "1") {
      if (trendData.data && Array.isArray(trendData.data)) {
        xAxis = trendData.data.map((it) => it.partitionTime);
        topData1 = trendData.data.map((it) => it.leakageValue);
        topData2 = trendData.data.map((it) => it.leakageRate);
        bottomData1 = trendData.data.map((it) => it.supplyValue);
        bottomData2 = trendData.data.map((it) => it.useValue);
      }
      if (lineChartRef.current) {
        Double_Option.xAxis[0].data = Double_Option.xAxis[1].data = xAxis;
        Double_Option.series[0].data = topData1;
        Double_Option.series[1].data = topData2;
        Double_Option.series[2].data = bottomData1;
        Double_Option.series[3].data = bottomData2;
        myChart = echarts.init(lineChartRef.current);
        myChart.setOption(Double_Option);
      }
    }
  }, [type]);
  return (
    <Card>
      <BlueColumn
        bg={{ height: 13, width: 3 }}
        fontWeight="bold"
        name="漏损趋势"
        styled={{ color: "#515151" }}
      > 
      <div  style={{ marginLeft: "auto",display: "flex",alignItems: "center" }}>
      <Button  icon={<DownloadOutlined />} style={{borderRadius: "2px",width: "96px",display:type==1?"none":"block"}} onClick={()=>{tableRef.current.downloadAll()}} >
      {i18.t('export', {ns: "button"})}</Button>
        <StyledRadioGroup
          block
          options={Type_Options}
          defaultValue="1"
          optionType="button"
          buttonStyle="solid"
          size="large"
          style={{marginLeft: "24px"}}
          onChange={changeType}
          
        />
      </div>
        
      </BlueColumn>
      <div className="context">
        <div
          ref={lineChartRef}
          className="chart"
          style={{ display: type == "1" ? "block" : "none" }}
        ></div>
        <div
          style={{ display: type == "2" ? "flex" : "none" }}
          className="table"
        >
          <UseTable
            columns={TbHeader}
            dataSource={trendData}
            pagination={{ defaultPageSize: 10, defaultCurrent: 1 }}
            onExport={getLeakageChart}
            ref={tableRef}
          ></UseTable>
        </div>
      </div>
    </Card>
  );
};

//分区报警
export const PartAlarm = ({ pageInfo, onChangeTbValues, alarmData }) => {
  const { RangePicker } = DatePicker;
  const warnList = ["一级 (特别严重)", "二级 (严重)", "三级 (较重)", "四级 (一般)"];
  const warnRules=["持续多天未生成漏损","分区漏损率连续超限","分区漏损量连续超限"]
  const Warn = ({ warnState }) => {
    return (<div className="warn"><div className="warnState">{warnList[warnState-1]}</div></div>);
  };

  PartitionAlarmTableColumns[1]["render"] = (text, record) => {
   return(<Warn warnState={text}></Warn>) ;
  };


  const WarnRules=({children})=>{
    return <span>{warnRules[children]}</span>
  }
  PartitionAlarmTableColumns[0]["render"] = (text, record) => {
    return <WarnRules>{text-1}</WarnRules>
  };
  return (
    <AlarmWrapper>
      <Form
        layout="inline"
        onValuesChange={onChangeTbValues}
        initialValues={AlarmHeader}
      >
        {/* inline 布局自动水平排列子元素 */}
        {/* <Form.Item name="dateRange">
          <RangePicker style={{ width: 376 }} />
        </Form.Item>
        <Form.Item style={{ marginLeft: 16 }}>
          <Button
            type="primary"
            htmlType="submit"
            icon={<SearchOutlined />}
            style={{
              width: 96,
              backgroundColor: "#199ed8",
              borderColor: "#199ed8",
            }}
          >
            查询
          </Button>
        </Form.Item> */}
        {/* <Divider
          type="vertical"
          style={{ borderColor: "#e4e4e4", height: 32, margin: "0 24px" }}
        ></Divider> */}
        <Form.Item label="报警等级" name="type">
          <Select
            placeholder="请选择类型"
            style={{ width: 150 }}
            options={AlarmLevel}
          ></Select>
        </Form.Item>
      </Form>
      <div className="tableWrapper">
        <UseTable
          columns={PartitionAlarmTableColumns}
          dataSource={alarmData}
          pagination={pageInfo}
        ></UseTable>
      </div>
    </AlarmWrapper>
  );
};
