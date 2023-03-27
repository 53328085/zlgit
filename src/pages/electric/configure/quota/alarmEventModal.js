import React, { useEffect, useRef, useState } from "react";
import style from "./style.module.less";
import {
  Button,
  Modal,
  Form,
  Input,
  Divider,
  Select,
  Switch,
  Radio,
  Space,
  InputNumber,
} from "antd";

import { AlarmManagement } from "@api/api.js";
import { useSelector } from "react-redux";
import { selectProjectId } from "@redux/systemconfig.js";
export default function Index(props) {
  const { AddAlarmEventGive, giveFormType, giveChildForm } = props;
  const projectId = useSelector(selectProjectId);
  const [formInfo] = Form.useForm();
  const Item = Form.Item;
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
      value: 1,
    },
    {
      label: "区间外",
      value: 2,
    },
  ];
  const compareOptions = [
    {
      label: "小于等于",
      value: 2,
    },
    {
      label: "大于等于",
      value: 1,
    },
  ];
  const soeOptions = [
    {
      label: "告警标识+消警标识",
      value: 1,
    },
    {
      label: "告警标识",
      value: 2,
    },
    {
      label: "消警标识",
      value: 3,
    },
  ];
  const levelList = [
    {
      id: 1,
      name: "1级",
    },
    {
      id: 2,
      name: "2级",
    },
    {
      id: 3,
      name: "3级",
    },
  ];
  //  新增告警事件声明初始化
  // const [name, setName] = useState();
  // const [pointIdentifier, setPointIdentifier] = useState();
  // const [time, setTime] = useState();
  const AlarmRule = Form.useWatch("AlarmRule", formInfo);
  const [level, setLevel] = useState(levelList[0].id);
  const [push, setPush] = useState(true);
  const [enable, setEnable] = useState(true);
  //   新增告警事件-告警规则逻辑
  // const [AlarmRule, setDefaultAlarmType] = useState(alarmList[0].id);
  const [alarmCondition, setAlarmCondition] = useState(1);
  const [compareValue, setCompareValue] = useState(2);
  const [soeValue, setSoeValue] = useState(1);
  const alarmType = {
    Interval: 1,
    Overrun: 2,
    Deflection: 3,
    SOE: 4,
    Communication: 5,
  };
  useEffect(() => {
    console.log(giveChildForm);
    if (giveChildForm) {
      setTimeout(() => {
        if (giveFormType === false) {
          giveChildForm.AlarmRule = alarmType[giveChildForm.AlarmRule];
          console.log(giveChildForm.AlarmRule);
          formInfo.setFieldsValue(giveChildForm);
        } else {
          // formInfo.resetFields();
        }
      });
    }
  }, [AddAlarmEventGive]);

  const addAlarmOk = async () => {
    try {
      const values = await formInfo.validateFields();
      let data = {
        projectId: projectId,
        name: values.Name,
        pointIdentifier: values.PointIdentifier,
        level: values.Level,
        push: push,
        time: values.Time,
        enable: enable,
        alarmRule: AlarmRule,
      };
      if (AlarmRule === 2) {
        //区间告警
        let changeInfo = {
          alarmCondition: alarmCondition,
          minCriticalValue: values.MinCriticalValue,
          maxCriticalValue: values.MaxCriticalValue,
        };
        const params = { ...data, ...changeInfo };
        props.getValues(params);
      } else if (AlarmRule === 1) {
        //越限告警
        let changeInfo = {
          alarmCondition: compareValue,
          criticalValue: values.CriticalValue,
        };
        const params = { ...data, ...changeInfo };
        props.getValues(params);
      } else if (AlarmRule === 3) {
        //变位告警
        let changeInfo = {
          alarmCondition: 1,
          alarmValue: values.AlarmRule,
          recoverValue: values.RecoverValue,
        };
        const params = { ...data, ...changeInfo };
        props.getValues(params);
      } else if (AlarmRule === 4) {
        //SOE告警
        let changeInfo = {
          alarmCondition: soeValue,
          alarmLabel: values.AlarmLabel,
          recoverLabel: values.RecoverLabel,
        };
        const params = { ...data, ...changeInfo };
        props.getValues(params);
      } else if (AlarmRule === 5) {
        //离线告警
        const params = { ...data };
        props.getValues(params);
      }
    } catch (errorInfo) {}
  };
  const handleCancel = () => {
    props.callBack();
    formInfo.resetFields();
  };

  const changeAlarmType = (val) => {
    // setDefaultAlarmType(val);
  };
  ///区间告警-区间内外切换
  const conditionOnChange = ({ target: { value } }) => {
    setAlarmCondition(value);
  };
  const compareOnChange = ({ target: { value } }) => {
    setCompareValue(value);
  };
  const soeOnChange = ({ target: { value } }) => {
    setSoeValue(value);
  };
  const changeAlarmLevel = (value) => {
    setLevel(value);
  };
  // 是否连续推送变化时的回调函数
  const pushChange = (value) => {
    setPush(value);
  };
  // 是否启用变化时的回调函数
  const enableChange = (value) => {
    setEnable(value);
  };
  // useEffect(() => {
  //   if (giveFormType === true) {
  //     formInfo.resetFields(); //当新增时重置
  //   } else {
  //   }
  // }, [AddAlarmEventGive]);
  useEffect(() => {
    // setDefaultAlarmType(AlarmRule);
  }, [AlarmRule]);
  useEffect(() => {
    setAlarmCondition(alarmCondition);
  }, [alarmCondition]);
  useEffect(() => {
    setCompareValue(compareValue);
  }, [compareValue]);
  useEffect(() => {
    setSoeValue(soeValue);
  }, [soeValue]);
  useEffect(() => {
    setPush(push);
  }, [push]);
  useEffect(() => {
    setEnable(enable);
  }, [enable]);
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
        destroyOnClose //关闭时销毁子元素
      >
        <div className={style.addHeader}>新增告警事件</div>
        <div className={style.addBody}>
          <p className={style.titleModal}>基础配置</p>
          <Form
            labelCol={{ flex: "110px" }}
            labelAlign="left"
            wrapperCol={{ flex: 1 }}
            className={style.form}
            // size="small"
            form={formInfo}
            name="addform"
          >
            <Space style={{ alignItems: "baseline" }}>
              <Item
                name="Name"
                label="告警事件名称："
                rules={[{ required: true, message: "请输入告警事件名称" }]}
                style={{ width: 415 }}
              >
                <Input
                  style={{ width: 290 }}
                  placeholder="请输入告警事件名称"
                />
              </Item>
              <span style={{ marginLeft: 5, color: "#999" }}>(必填)</span>
            </Space>
            <Space style={{ alignItems: "baseline" }}>
              <Item
                label="数据标识："
                rules={[{ required: true, message: "请输入数据标识" }]}
                style={{ width: 415 }}
                name="PointIdentifier"
              >
                <Input style={{ width: 290 }} />
              </Item>
              <span style={{ marginLeft: 5, color: "#999" }}>(必填)</span>
            </Space>
            <div className={style.divBox}>
              <Item
                label="告警等级："
                labelCol={{ flex: "100px" }}
                style={{ width: 305, marginLeft: 10 }}
                name="Level"
                initialValue={levelList[0].id ? levelList[0].id : 0}
              >
                <Select
                  style={{ width: 110 }}
                  key={level}
                  // defaultValue={level}
                  onChange={changeAlarmLevel}
                >
                  {levelList.map((item) => {
                    return (
                      <Select.Option key={item.id} value={item.id}>
                        {item.name}
                      </Select.Option>
                    );
                  })}
                </Select>
              </Item>
              <Item
                label="是否连续推送："
                valuePropName="checked"
                style={{ width: 220 }}
                name="Push"
              >
                <Switch
                  checkedChildren="是"
                  unCheckedChildren="否"
                  defaultChecked
                  onChange={pushChange}
                />
              </Item>
            </div>
            <div className={style.divBox}>
              <Space style={{ alignItems: "baseline" }}>
                <Item
                  label="持续时间≥："
                  rules={[{ required: true, message: "请输入持续时间" }]}
                  labelCol={{ flex: "110px" }}
                  style={{ width: 220 }}
                  name="Time"
                >
                  {/* 使用precision，对输入的内容做保留0位小数处理 */}
                  <InputNumber min="0" style={{ width: 110 }} precision={0} />
                </Item>
                秒
                <span style={{ color: "#999", width: 42, display: "block" }}>
                  (必填)
                </span>
              </Space>
              <Item
                label="是否启用："
                valuePropName="checked"
                labelCol={{ flex: "103px" }}
                style={{ width: 220, marginLeft: 30 }}
                name="Enable"
              >
                <Switch
                  checkedChildren="是"
                  unCheckedChildren="否"
                  defaultChecked
                  onChange={enableChange}
                />
              </Item>
            </div>
            <Divider dashed style={{ margin: 0 }} />
            <p className={style.titleModal}>告警规则</p>
            <Item
              label="告警类型："
              labelCol={{ flex: "85px" }}
              style={{ width: 400 }}
              name="AlarmRule"
              initialValue={alarmList[0].id ? alarmList[0].id : 0}
            >
              <Select
                style={{ width: 210 }}
                // key={AlarmRule}
                // defaultValue={AlarmRule}
                onChange={changeAlarmType}
              >
                {/* <Select.Option value="1">区间告警</Select.Option>
                <Select.Option value="2">越限告警</Select.Option>
                <Select.Option value="3">变位告警</Select.Option>
                <Select.Option value="4">SOE告警</Select.Option>
                <Select.Option value="5">离线告警</Select.Option> */}
                {alarmList.map((item) => {
                  return (
                    <Select.Option key={item.id} value={item.id}>
                      {item.name}
                    </Select.Option>
                  );
                })}
              </Select>
            </Item>
            {/* 区间告警 */}

            {AlarmRule === 1 ? (
              <div className={style.intervalAlarm}>
                <Item label="告警条件：" labelCol={{ flex: "85px" }}>
                  <Radio.Group
                    options={conditionOptions}
                    onChange={conditionOnChange}
                    value={alarmCondition}
                    name="AlarmCondition"
                  />
                </Item>
                <div className={style.divBox}>
                  <Space style={{ alignItems: "baseline" }}>
                    <Item
                      label="低限："
                      labelCol={{ flex: "70px" }}
                      rules={[
                        { required: true, message: "请输入低限值(整数)" },
                      ]}
                      style={{ width: 200, marginLeft: 18 }}
                      name="MinCriticalValue"
                    >
                      <InputNumber
                        style={{ width: 125 }}
                        placeholder="请输入低限值"
                      />
                    </Item>
                    <span
                      style={{
                        color: "#999",
                        width: 50,
                        display: "block",
                      }}
                    >
                      (必填)
                    </span>
                  </Space>
                  <Space style={{ alignItems: "baseline" }}>
                    <Item
                      label="高限："
                      labelCol={{ flex: "70px" }}
                      rules={[
                        { required: true, message: "请输入高限值(整数)" },
                      ]}
                      style={{
                        width: 200,
                        height: 30,
                        width: 200,
                        marginLeft: 18,
                      }}
                      name="MaxCriticalValue"
                    >
                      <InputNumber
                        style={{ width: 125 }}
                        placeholder=" 且高值≥低值"
                        className={style.colorRed}
                      />
                    </Item>
                    <span
                      style={{
                        color: "#999",
                        width: 50,
                        display: "block",
                      }}
                    >
                      (必填)
                    </span>
                    {/* <p
                      style={{
                        color: "red",
                        fontSize: 8,
                        width: 150,
                        marginLeft:-140,
                        marginTop:40
                      }}
                    >
                     
                    </p> */}
                  </Space>
                </div>
                {/* -----区间内----- */}
                {alarmCondition === 1 ? (
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
            ) : AlarmRule === 2 ? (
              // {/* //越限告警 */}
              <div className={style.OverLimitAlarm}>
                <Item label="告警条件：" labelCol={{ flex: "85px" }}>
                  <Radio.Group
                    options={compareOptions}
                    onChange={compareOnChange}
                    value={compareValue}
                    name="AlarmCondition"
                  />
                </Item>
                <Space style={{ alignItems: "baseline" }}>
                  <Item
                    label="临界值："
                    labelCol={{ flex: "85px" }}
                    rules={[
                      { required: true, message: "请输入临界值(正整数)" },
                    ]}
                    style={{ width: 240, marginLeft: 5 }}
                    name="CriticalValue"
                  >
                    <InputNumber
                      style={{ width: 130 }}
                      placeholder="请输入临界值"
                    />
                  </Item>
                  <span style={{ color: "#999", marginLeft: -25 }}>(必填)</span>
                </Space>
                {/* -----小于等于----- */}
                {compareValue === 2 ? (
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
            ) : AlarmRule === 3 ? (
              <div>
                <Space style={{ alignItems: "baseline" }}>
                  <Item
                    label="告警值："
                    labelCol={{ flex: "80px" }}
                    rules={[
                      { required: true, message: "请输入告警值(正整数)" },
                    ]}
                    style={{ width: 300, marginLeft: 5 }}
                    name="AlarmValue"
                  >
                    <Input style={{ width: 110 }} placeholder="请输入告警值" />
                  </Item>
                  <span style={{ marginLeft: -90, color: "#999" }}>(必填)</span>
                </Space>

                <Space style={{ alignItems: "baseline" }}>
                  <Item
                    label="消警值："
                    labelCol={{ flex: "80px" }}
                    rules={[
                      { required: true, message: "请输入消警值(正整数)" },
                    ]}
                    style={{ width: 240, marginLeft: 5 }}
                    name="RecoverValue"
                  >
                    <Input style={{ width: 110 }} placeholder="请输入消警值" />
                  </Item>
                  <span style={{ marginLeft: -30, color: "#999" }}>(必填)</span>
                </Space>
                <Item
                  label="告警说明："
                  labelCol={{ flex: "85px" }}
                  rules={[{ required: true, message: "请输入告警说明" }]}
                  style={{ width: 300 }}
                >
                  <span style={{ color: "red" }}>告警值和消警值都必须填写</span>
                </Item>
              </div>
            ) : AlarmRule === 4 ? (
              <div>
                <Item label="告警条件：" labelCol={{ flex: "85px" }}>
                  <Radio.Group
                    options={soeOptions}
                    onChange={soeOnChange}
                    value={soeValue}
                    name="AlarmCondition"
                  />
                </Item>
                {soeValue === 1 ? (
                  <div>
                    <Item
                      label="告警标识："
                      labelCol={{ flex: "85px" }}
                      style={{ width: 300 }}
                      name="AlarmLabel"
                    >
                      <Input
                        style={{ width: 132 }}
                        placeholder="请输入告警标识"
                      />
                    </Item>
                    <Item
                      label="消警标识："
                      labelCol={{ flex: "85px" }}
                      style={{ width: 300 }}
                      name="RecoverLabel"
                    >
                      <Input
                        style={{ width: 130 }}
                        placeholder=" 请输入消警标识"
                      />
                    </Item>
                  </div>
                ) : soeValue === 2 ? (
                  <Item
                    label="告警标识："
                    labelCol={{ flex: "85px" }}
                    style={{ width: 300 }}
                    name="AlarmLabel"
                  >
                    <Input
                      style={{ width: 132 }}
                      placeholder="请输入告警标识"
                    />
                  </Item>
                ) : (
                  <Item
                    label="消警标识："
                    labelCol={{ flex: "85px" }}
                    style={{ width: 300 }}
                    name="RecoverLabel"
                  >
                    <Input
                      style={{ width: 130 }}
                      placeholder=" 请输入消警标识"
                    />
                  </Item>
                )}
                <Item label="告警说明：" labelCol={{ flex: "85px" }}>
                  <span style={{ color: "red", fontSize: 10 }}>
                    告警标识和消警标识二者至少要填写其中一个，且内容不能相同
                  </span>
                </Item>
              </div>
            ) : (
              <Item
                label="告警条件："
                labelCol={{ flex: "85px" }}
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
