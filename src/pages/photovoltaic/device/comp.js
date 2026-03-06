import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
} from "react";
import { DatePicker, Table, Radio, Select, Space, message, Form } from "antd";
import UserTable from "@com/useTable";
import { useReactive } from "ahooks";
import moment from "moment";
import Ichart from "@com/useEcharts/Ichart";
import { options } from "./data";
import { useQueryInverterPointTrend } from "./api";
import { ExportExcel, CustButton, ExportButton } from "@com/useButton";
import { HistoricalModal } from "./style";

import { getTime, isObject } from "@com/usehandler";

const HistoricalDataModal = (props) => {

  const { modalType, sn, projectId } = props;
  const [form] = Form.useForm();
  const [modal, setModal] = useState("1");
  const tableRef = useRef();
  const ectype = Form.useWatch("point", form);
  const dateType = Form.useWatch("type", form);
  const [picker, setPicker] = useState("date");
  // const [tableData, setTableData]=useState([])
  const [datas, setDatas] = useState({});

  const [tableData, columns, lineopt] = useMemo(() => {

    const format = dateType == 1 ? "HH:mm" : "DD:HH:mm";
    const { data = [] } = datas // mock.filter((d) => d.group == ectype)?.[0] || {}; //
    const points = {
      "Pt": "总有功功率（kW）",
      "Ia": "A相电流（A）",
      "Ib": "B相电流（A）",
      "Ic": "C相电流（A）",
      "Ua": "A相电压（V）",
      "Ub": "B相电压（V）",
      "Uc": "C相电压（V）",
      "Freq": "频率（Hz）"
    }
    const cols = [
      {
        title: "时间",
        dataIndex: `time`,
        align: "center",
        width: 120,
        sorter: (a, b) =>
          moment(a.time, format).diff(
            moment(b.time, format)
          ) > 0,
      },
      ...data.map(item => ({
        title: points[item.point],
        dataIndex: item.point,

      }))
    ];
    let tbdata = []
    data.forEach((item, index) => {
      let { point, data } = item;
      if (index == 0) {
        tbdata = data.map((t) => ({ time: moment(t.time, "YYYY-MM-DD HH:mm:ss").format(format), [point]: t.value }))
      } else if (index > 0) {
        tbdata = data.map((t, i) => ({ ...tbdata[i], [point]: t.value }))
      }

    })

    let dimensions = ["time"];
    let source = [];
    let series = Array(data.length).fill({
      type: "line",
      seriesLayoutBy: "row",
      areaStyle: null,
      stack: null,
    });


    data.forEach((d, index) => {
      dimensions.push(d.point);
      if (index == 0) {
        source.push(d?.data?.map((t) => t.time));
        source.push(d?.data?.map((t) => t.value));
      } else {
        source.push(d?.data?.map((t) => t.value));

      }




      // if (index == 0) {
      //   source.push(data.map((t) => t.time));
      //   source.push(data.map((t) => t.value));
      // } else {
      //   source.push(data.map((t) => t.value));
      // }
    });
    const lineopt = {
      series,
      grid: {
        left: "0px",
        right: "0",
        top: "40px",
        bottom: "16px",
        containLabel: true,
      },

      legend: {
        top: "5px",
      },
      xAxis: {
        axisLabel: {
          formatter: (value, index) => {
            return moment(value, "YYYY-MM-DD HH:mm:ss").format(format);
          },
          interval: "auto",
        },
      },
      yAxis: {
        min: function (value) {
          return (value.min - 10).toFixed(3);
        },
        max: function (value) {
          return (value.max + 10).toFixed(3);
        },
      },
      dataZoom: {
        type: "inside",
      },
      dataset: {
        dimensions,
        source,
        sourceHeader: false,
      },
    };

    return [tbdata, cols, lineopt];
  }, [datas]);



  const getTrend = async () => {
    try {
      const { point, type, date, mode } = await form.getFieldsValue();
      setModal(mode);
      let body = {
        point,
        type,
        date: getTime(date, type),
        sn,
        projectId,
      };
      const { success, data } = await useQueryInverterPointTrend({}, body);
      if (success && Array.isArray(data) && data.length && isObject(data[0])) {
        setDatas(data[0]);
      } else {
        setDatas({});
      }
    } catch (error) { }
  };

  useEffect(() => {
    if (Number.isInteger(parseInt(projectId)) && typeof sn == "string" && sn) {
      getTrend();
    }
  }, [projectId, sn]);

  const disabledDate = (current) => {
    return current > moment().endOf("day");
  };
  const onexprot = () => {
    tableRef.current.download();
  };

  const onValuesChange = () => {
    getTrend();
  }
  const onChange = (v) => {
    setPicker(v == 1 ? "date" : "month");
  };
  return (
    <HistoricalModal>
      <div className="searchBox">
        <Form form={form} layout="inline" onValuesChange={onValuesChange}>
          <Space size={16}>
            <Form.Item name="point" initialValue="EP">
              <Select
                style={{ width: 196 }}
                options={[
                  { value: "EP", label: "电压" },
                  { value: "EC", label: "电流" },
                  { value: "PPT", label: "总有功功率" },
                  { value: "“Freq”", label: "频率" },
                ]}
              />
            </Form.Item>
            <Form.Item name="type" initialValue={1}>
              <Select
                style={{ width: 96 }}
                onChange={onChange}
                options={[
                  { value: 1, label: "日" },
                  { value: 2, label: "月" },
                ]}
              />
            </Form.Item>
            {/* <Form.Item shouldUpdate={(cur, pre) => cur.type != pre.type} noStyle>
              {
                ({ getFieldValue, setFieldValue }) => {
                  let type = getFieldValue('type')
                  setPicker(type == 1 ? "date" : "month");
                  console.log("type")
                  setFieldValue('date', moment())
                  return null
                }

              }
            </Form.Item> */}
            <Form.Item name="date" initialValue={moment()}>
              <DatePicker
                picker={picker}
                style={{ width: 240 }}
                allowClear={false}
                disabledDate={disabledDate}
              />
            </Form.Item>
            <Form.Item name="mode" initialValue="1">
              <Radio.Group
                block
                options={options}
                optionType="button"
                buttonStyle="solid"
              />
            </Form.Item>
            <ExportButton onClick={onexprot} disabled={modal == "1"} />
          </Space>
        </Form>
      </div>
      {modal == "1" ? (
        <div className="echarts">
          <Ichart {...lineopt} />
        </div>
      ) : (
        <div className="table">
          <UserTable
            scroll={{ y: 280 }}
            columns={columns}
            dataSource={tableData}
            ref={tableRef}
          ></UserTable>
        </div>
      )}
    </HistoricalModal>
  );
};
export default HistoricalDataModal;
