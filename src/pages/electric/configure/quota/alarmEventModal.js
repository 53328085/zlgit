import React, { useEffect, useRef, useState } from "react";
import style from "./style.module.less";
import {
  Button,
  Space,
  Modal,
  Form,
  Input,
  Divider,
  Select,
  Switch,
  Radio,
} from "antd";

import { AlarmManagement } from "@api/api.js";
import { useSelector } from "react-redux";
import { selectProjectId } from "@redux/systemconfig.js";
export default function Index(props) {
  const { AddAlarmEventGive } = props;
  console.log(props);
  const projectId = useSelector(selectProjectId);
  const { AddAlarmEventInterval } = AlarmManagement;

  const [form] = Form.useForm();
  const Item = Form.Item;
  //   新增告警事件-告警规则逻辑
  const [defaultAlarmType, setDefaultAlarmType] = useState(1);
  //   const [showData, setShowData] = useState();
  //   const [alarmList, setalarmList] = useState();
  const [value, setValue] = useState("inner");
  const [compareValue, setCompareValue] = useState("lessThan");
  const alarmList = [
    {
      id: 1,
      name: "区间告警",
    },
    {
      id: 2,
      name: "越限告警",
    },
    {
      id: 3,
      name: "变位告警",
    },
    {
      id: 4,
      name: "SOE告警",
    },
    {
      id: 5,
      name: "离线告警",
    },
  ];
  const conditionOptions = [
    {
      label: "区间内",
      value: "inner",
    },
    {
      label: "区间外",
      value: "outer",
    },
  ];
  const compareOptions = [
    {
      label: "小于等于",
      value: "lessThan",
    },
    {
      label: "大于等于",
      value: "greaterhan",
    },
  ];
  const addAlarmOk = () => {
    props.callBack();
    console.log(defaultAlarmType);
  };
  const handleCancel = () => {
    props.callBack();
  };

  const changeAlarmType = (val) => {
    setDefaultAlarmType(val);
  };
  ///区间告警-区间内外切换
  const conditionOnChange = ({ target: { value } }) => {
    console.log(value);
    setValue(value);
  };
  const compareOnChange = ({ target: { value } }) => {
    console.log(value);
    setCompareValue(value);
  };
  useEffect(() => {
    setDefaultAlarmType(defaultAlarmType);
  }, [defaultAlarmType]);
  useEffect(() => {
    setValue(value);
  }, [value]);
  useEffect(() => {
    setCompareValue(compareValue);
  }, [compareValue]);
  useEffect(() => {
      form.resetFields();
  }, [AddAlarmEventGive]);
  return (
    <div>
      <Modal
        className={style.addModal}
        open={AddAlarmEventGive}
        onOk={addAlarmOk}
        onCancel={handleCancel}
        width={600}
        centered={true}
        closable={true}
        maskClosable={false}
        okText={"完成"}
        okType={"primary"}
        // okButtonProps={{ primary: true }}
      >
        <div className={style.addHeader}>新增告警事件</div>
        <div className={style.addBody}>
          <p className={style.titleModal}>基础配置</p>
          <Form
            labelCol={{ flex: "110px" }}
            labelAlign="left"
            labelWrap
            wrapperCol={{ flex: 1 }}
            className={style.form}
            size="small"
            form={form}
          >
            <Item
              label="告警事件名称："
              rules={[{ required: true }]}
              style={{ width: 500 }}
            >
              <Input style={{ width: 310 }} />
              <span style={{ marginLeft: 5, color: "#999" }}>(必填)</span>
            </Item>
            <Item
              label="数据标识："
              rules={[{ required: true }]}
              style={{ width: 500 }}
            >
              <Input style={{ width: 310 }} />
              <span style={{ marginLeft: 5, color: "#999" }}>(必填)</span>
            </Item>
            <div className={style.divBox}>
              <Item
                label="告警等级："
                style={{ width: 305 }}
                labelCol={{ flex: "110px" }}
              >
                <Select style={{ width: 110 }}>
                  <Select.Option value="demo1">1级</Select.Option>
                  <Select.Option value="demo2">2级</Select.Option>
                  <Select.Option value="demo3">3级</Select.Option>
                </Select>
              </Item>
              <Item
                label="是否连续推送："
                valuePropName="checked"
                style={{ width: 220 }}
              >
                <Switch checked />
              </Item>
            </div>
            <div className={style.divBox}>
              <Item
                label="持续时间≥："
                rules={[{ required: true }]}
                labelCol={{ flex: "110px" }}
                style={{ width: 300 }}
              >
                <Input style={{ width: 110 }} /> 秒
                <span style={{ marginLeft: 5, color: "#999" }}>(必填)</span>
              </Item>
              <Item
                label="是否启用："
                valuePropName="checked"
                labelCol={{ flex: "103px" }}
                style={{ width: 220, marginLeft: 5 }}
              >
                <Switch checked />
              </Item>
            </div>
            <Divider dashed style={{ margin: 0 }} />
            <p className={style.titleModal}>告警规则</p>
            <Item
              label="告警类型："
              labelCol={{ flex: "95px" }}
              style={{ width: 400 }}
            >
              <Select
                style={{ width: 210 }}
                key={defaultAlarmType}
                defaultValue={defaultAlarmType}
                onChange={changeAlarmType}
              >
                {/* <Select.Option value="1">区间告警</Select.Option>
                <Select.Option value="2">越限告警</Select.Option>
                <Select.Option value="3">变位告警</Select.Option>
                <Select.Option value="4">SOE告警</Select.Option>
                <Select.Option value="5">离线告警</Select.Option> */}
                {alarmList.map((item) => {
                  return (
                    <Select.Option key={item} value={item.id}>
                      {item.name}
                    </Select.Option>
                  );
                })}
              </Select>
            </Item>
            {/* 区间告警 */}

            {defaultAlarmType === 1 ? (
              <div className={style.intervalAlarm}>
                <Item label="告警条件：" labelCol={{ flex: "95px" }}>
                  {/* <Radio.Group value="a">
                  <Radio value="a">区间内</Radio>
                  <Radio value="b">区间外</Radio>
                </Radio.Group> */}
                  <Radio.Group
                    options={conditionOptions}
                    onChange={conditionOnChange}
                    value={value}
                  />
                </Item>
                <div className={style.divBox}>
                  <Item
                    label="低限："
                    labelCol={{ flex: "70px" }}
                    rules={[{ required: true }]}
                    style={{ width: 300, marginLeft: 27 }}
                  >
                    <Input style={{ width: 110 }} />
                    <span style={{ marginLeft: 5, color: "#999" }}>(必填)</span>
                  </Item>
                  <Item
                    label="高限："
                    labelCol={{ flex: "70px" }}
                    rules={[{ required: true }]}
                    style={{ width: 300, marginLeft: 15, height: 30 }}
                  >
                    <Input style={{ width: 110 }} />
                    <span style={{ marginLeft: 5, color: "#999" }}>(必填)</span>
                    <p style={{ color: "red", fontSize: 8 }}>且高值≥低值</p>
                  </Item>
                </div>
                {/* -----区间内----- */}
                {value === "inner" ? (
                  <Item>
                    <div className={style.qujianLi}>
                      <span className={style.title}>告警说明：</span>
                      <div className={style.content}>
                        <div className={style.outer}>
                          <span>区间外</span>
                        </div>
                        <div className={style.inner}>
                          <span>区间内告警</span>
                        </div>
                        <div className={style.outer}>
                          <span> 区间外</span>
                        </div>
                        <span className={style.low}>低限</span>
                        <span className={style.high}>高限</span>
                      </div>
                    </div>
                  </Item>
                ) : (
                  //    {/* -----区间外----- */}
                  <Item>
                    <div className={style.qujianwai}>
                      <span className={style.title}>告警说明：</span>
                      <div className={style.content}>
                        <div className={style.innerWaiLeft}>
                          <span>区间外告警</span>
                        </div>
                        <div className={style.outer}>
                          <span>区间内</span>
                        </div>
                        <div className={style.innerWaiRight}>
                          <span> 区间外告警</span>
                        </div>
                        <span className={style.low}>低限</span>
                        <span className={style.high}>高限</span>
                      </div>
                    </div>
                  </Item>
                )}
              </div>
            ) : defaultAlarmType === 2 ? (
              // {/* //越限告警 */}
              <div className={style.OverLimitAlarm}>
                <Item label="告警条件：" labelCol={{ flex: "95px" }}>
                  <Radio.Group
                    options={compareOptions}
                    onChange={compareOnChange}
                    value={compareValue}
                  />
                </Item>
                <Item
                  label="临界值："
                  labelCol={{ flex: "85px" }}
                  rules={[{ required: true }]}
                  style={{ width: 300, marginLeft: 15 }}
                >
                  <Input style={{ width: 110 }} />
                  <span style={{ marginLeft: 5, color: "#999" }}>(必填)</span>
                </Item>

                {/* -----小于等于----- */}
                {compareValue === "lessThan" ? (
                  <Item labelCol={{ flex: "95px" }}>
                    <div className={style.lessThan}>
                      <span className={style.title}>告警说明：</span>
                      <div className={style.content}>
                        <div className={style.lt}>
                          <span>小于等于(告警)</span>
                        </div>
                        <div className={style.gt}>
                          <span>大于等于</span>
                        </div>
                        <span className={style.critical}> 临界值 </span>
                      </div>
                    </div>
                  </Item>
                ) : (
                  //   {/* -----大于等于----- */}
                  <Item labelCol={{ flex: "95px" }}>
                    <div className={style.greaterThan}>
                      <span className={style.title}>告警说明：</span>
                      <div className={style.content}>
                        <div className={style.gt}>
                          <span>小于等于</span>
                        </div>
                        <div className={style.ltAlarm}>
                          <span>大于等于(告警)</span>
                        </div>
                        <span className={style.critical}> 临界值 </span>
                      </div>
                    </div>
                  </Item>
                )}
              </div>
            ) : defaultAlarmType === 3 ? (
              <div>
                <Item
                  label="告警值："
                  labelCol={{ flex: "95px" }}
                  rules={[{ required: true }]}
                  style={{ width: 300 }}
                >
                  <Input style={{ width: 110 }} />
                  <span style={{ marginLeft: 5, color: "#999" }}>(必填)</span>
                </Item>
                <Item
                  label="消警值："
                  labelCol={{ flex: "95px" }}
                  rules={[{ required: true }]}
                  style={{ width: 300 }}
                >
                  <Input style={{ width: 110 }} />
                  <span style={{ marginLeft: 5, color: "#999" }}>(必填)</span>
                </Item>
                <Item
                  label="告警说明："
                  labelCol={{ flex: "95px" }}
                  rules={[{ required: true }]}
                  style={{ width: 300 }}
                >
                  <span style={{ color: "red" }}>告警值和消警值都必须填写</span>
                </Item>
              </div>
            ) : defaultAlarmType === 4 ? (
              <div>
                <Item
                  label="告警标识："
                  labelCol={{ flex: "95px" }}
                  style={{ width: 300 }}
                >
                  <Input style={{ width: 110 }} />
                </Item>
                <Item
                  label="消警标识："
                  labelCol={{ flex: "95px" }}
                  style={{ width: 300 }}
                >
                  <Input style={{ width: 110 }} />
                </Item>
                <Item
                  label="告警说明："
                  labelCol={{ flex: "95px" }}
                  rules={[{ required: true }]}
                >
                  <span style={{ color: "red", fontSize: 10 }}>
                    告警标识和消警标识二者至少要填写其中一个，且内容不能相同
                  </span>
                </Item>
              </div>
            ) : (
              <Item
                label="告警条件："
                labelCol={{ flex: "95px" }}
                rules={[{ required: true }]}
                style={{ width: 300 }}
              >
                <span style={{ color: "#999" }}>设备离线</span>
              </Item>
            )}
          </Form>
        </div>
      </Modal>
    </div>
  );
}
