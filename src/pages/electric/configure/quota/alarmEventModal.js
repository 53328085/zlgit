import React, { useEffect, useRef, useState } from "react";
import style from "./style.module.less";
import {
  Modal,
  Form,
  Input,
  Divider,
  Select,
  Switch,
  Radio,
  Space,
  InputNumber,
  message,
} from "antd";

import { useSelector } from "react-redux";
import { selectProjectId } from "@redux/systemconfig.js";
export default function Index(props) {
  const { AddAlarmEventGive, giveFormType, giveChildForm, giveModalTitle } =
    props;
  const projectId = useSelector(selectProjectId);
  const [formInfo] = Form.useForm();
  const Item = Form.Item;
  const alarmList = [
    {
      id: 1,
      name: "越限告警",
    },
    {
      id: 2,
      name: "区间告警",
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
      label: "大于等于",
      value: 1,
    },{
      label: "小于等于",
      value: 2,
    },
  ];
  const soeOptions = [
    {
      label: "告警+消警",
      value: 1,
    },
    {
      label: "告警",
      value: 2,
    },
    {
      label: "消警",
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
  const AlarmRule = Form.useWatch("AlarmRule", formInfo);
  const [level, setLevel] = useState(levelList[0].id);
  const [push, setPush] = useState(true);
  const [enable, setEnable] = useState(true);
  //   新增告警事件-告警规则逻辑
  const [alarmCondition, setAlarmCondition] = useState(1);
  const [compareValue, setCompareValue] = useState(2);
  const [soeValue, setSoeValue] = useState(1);
  //告警类型
  const alarmType = {
    Empty: 0,
    Overrun: 1,
    Interval: 2,
    Deflection: 3,
    SOE: 4,
    Communication: 5,
  };
  //区间事件，触发告警的条件
  const alarmIntervalType = {
    Empty: 0,
    Inside: 1,
    Outside: 2,
  };
  //越限事件，触发告警的条件
  const alarmOverrunType = {
    Empty: 0,
    Greater: 1,
    Less: 2,
  };
  //变位事件，触发告警的条件
  // const alarmDeflectionType = {
  //   Empty: 0,
  //   Both: 1,
  //   Alarm: 2,
  //   Recover: 3,
  // };
  //SOE事件，触发告警的条件
  const alarmSoeType = {
    Empty: 0,
    Both: 1,
    Alarm: 2,
    Recover: 3,
  };
  const CommunicationType = {
    Empty: 0,
  };

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
        if (values.MaxCriticalValue >= values.MinCriticalValue) {
          let changeInfo = {
            alarmCondition: alarmCondition,
            minCriticalValue: values.MinCriticalValue,
            maxCriticalValue: values.MaxCriticalValue,
          };
          const params = { ...data, ...changeInfo };
          props.getValues(params);
        } else {
          message.warning("提示：高限值必须大于或等于低限值！");
        }
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
          alarmValue: values.AlarmValue,
          recoverValue: values.RecoverValue,
        };
        const params = { ...data, ...changeInfo };
        props.getValues(params);
      } else if (AlarmRule === 4) {
        //SOE告警
        if (soeValue === 1) {
          if (values.AlarmLabel === values.RecoverLabel) {
            message.warning("提示：告警标识和消警标识内容不能相同！");
          } else {
            let changeInfo = {
              alarmCondition: soeValue,
              alarmLabel: values.AlarmLabel,
              recoverLabel: values.RecoverLabel,
            };
            const params = { ...data, ...changeInfo };
            props.getValues(params);
          }
        } else {
          let changeInfo = {
            alarmCondition: soeValue,
            alarmLabel: values.AlarmLabel ? values.AlarmLabel : "",
            recoverLabel: values.RecoverLabel ? values.RecoverLabel : "",
          };
          const params = { ...data, ...changeInfo };
          props.getValues(params);
        }
      } else if (AlarmRule === 5) {
        //离线告警
        const params = { ...data };
        props.getValues(params);
      }
    } catch (errorInfo) {}
  };
  const handleCancel = () => {
    props.callBack();
  };

  const changeAlarmType = (val) => {};
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
  //   if (giveFormType === false) {
  //     formInfo.resetFields(); //当新增时重置
  //   }
  // }, [AddAlarmEventGive]);

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
  useEffect(() => {
    if (giveChildForm) {
      setTimeout(() => {
        //编辑
        if (giveFormType === false) {
          //区间事件
          if (
            giveChildForm.AlarmCondition === "Inside" ||
            giveChildForm.AlarmCondition === "Outside"
          ) {
            giveChildForm.AlarmCondition =
              alarmIntervalType[giveChildForm.AlarmCondition];
            setAlarmCondition(giveChildForm.AlarmCondition);
            giveChildForm.AlarmRule = alarmType[giveChildForm.AlarmRule];
          } else if (
            giveChildForm.AlarmCondition === "Greater" ||
            giveChildForm.AlarmCondition === "Less"
          ) {
            //越限事件
            giveChildForm.AlarmCondition =
              alarmOverrunType[giveChildForm.AlarmCondition];
            setCompareValue(giveChildForm.AlarmCondition);
            giveChildForm.AlarmRule = alarmType[giveChildForm.AlarmRule];
          } else if (
            giveChildForm.AlarmCondition === "Both" ||
            giveChildForm.AlarmCondition === "Alarm" ||
            giveChildForm.AlarmCondition === "Recover"
          ) {
            //SOE事件
            giveChildForm.AlarmCondition =
              alarmSoeType[giveChildForm.AlarmCondition];
            setSoeValue(giveChildForm.AlarmCondition);
            giveChildForm.AlarmRule = alarmType[giveChildForm.AlarmRule];
          } else if (giveChildForm.AlarmCondition === "Empty") {
            giveChildForm.AlarmCondition =
              CommunicationType[giveChildForm.AlarmCondition];
            giveChildForm.AlarmRule = alarmType[giveChildForm.AlarmRule];
          }
          formInfo.setFieldsValue(giveChildForm);
          //变位事件
          // giveChildForm.AlarmCondition =
          // alarmDeflectionType[giveChildForm.AlarmCondition];
        } else {
          //新增时重置
          if (AddAlarmEventGive === true) {
          formInfo.resetFields();
          setPush(true);
          setEnablee(true);
          setAlarmCondition(1);
          setCompareValue(2);
          setSoeValue(1);
          }
        }
      });
    }
  }, [giveFormType, giveChildForm, AddAlarmEventGive]);
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
        <div className={style.addHeader}>{giveModalTitle}</div>
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
            preserve={false}
          >
            {giveModalTitle === "新增告警事件" ? (
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
            ) : (
              <Item name="Name" label="告警事件名称：" style={{ width: 415 }}>
                <Input
                  style={{ width: 290, border: "none" }}
                  disabled
                  placeholder="请输入告警事件名称"
                />
              </Item>
            )}
            {giveModalTitle === "新增告警事件" ? (
              <Space style={{ alignItems: "baseline" }}>
                <Item
                  label="数据标识："
                  rules={[{ required: true, message: "请输入数据标识" }]}
                  style={{ width: 415 }}
                  name="PointIdentifier"
                >
                  <Input
                    style={{ width: 290 }}
                    placeholder="若存在多个标识，请用'|'隔开"
                  />
                </Item>
                <span style={{ marginLeft: 5, color: "#999" }}>(必填)</span>
              </Space>
            ) : (
              <Item
                label="数据标识："
                rules={[{ required: true, message: "请输入数据标识" }]}
                style={{ width: 415 }}
                name="PointIdentifier"
              >
                <Input style={{ width: 290, border: "none" }} disabled />
              </Item>
            )}
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
            {giveModalTitle === "新增告警事件" ? (
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
                  {alarmList.map((item) => {
                    return (
                      <Select.Option key={item.id} value={item.id}>
                        {item.name}
                      </Select.Option>
                    );
                  })}
                </Select>
              </Item>
            ) : (
              <Item
                label="告警类型："
                labelCol={{ flex: "85px" }}
                style={{ width: 400 }}
                name="AlarmRule"
                initialValue={alarmList[0].id ? alarmList[0].id : 0}
              >
                <Select style={{ width: 210 }} disabled>
                  {alarmList.map((item) => {
                    return (
                      <Select.Option key={item.id} value={item.id}>
                        {item.name}
                      </Select.Option>
                    );
                  })}
                </Select>
              </Item>
            )}
            {/* 区间告警 */}

            {AlarmRule === 2 ? (
              <div className={style.intervalAlarm}>
                {giveModalTitle === "新增告警事件" ? (
                  <Item label="告警条件：" labelCol={{ flex: "85px" }}>
                    <Radio.Group
                      options={conditionOptions}
                      onChange={conditionOnChange}
                      value={alarmCondition}
                      // name="AlarmCondition"
                    />
                  </Item>
                ) : (
                  <Item label="告警条件：" labelCol={{ flex: "85px" }}>
                    {alarmCondition === 1 ? (
                      <span>区间内</span>
                    ) : alarmCondition === 2 ? (
                      <span>区间外</span>
                    ) : null}
                  </Item>
                )}
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
                        placeholder="且高值≥低值"
                        className={style.colorRed}
                        // prefix="且高值≥低值"
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
            ) : AlarmRule === 1 ? (
              // {/* //越限告警 */}
              <div className={style.OverLimitAlarm}>
                {giveModalTitle === "新增告警事件" ? (
                  <Item label="告警条件：" labelCol={{ flex: "85px" }}>
                    <Radio.Group
                      options={compareOptions}
                      onChange={compareOnChange}
                      value={compareValue}
                      // name="AlarmCondition"
                    />
                  </Item>
                ) : (
                  <Item label="告警条件：" labelCol={{ flex: "85px" }}>
                    {compareValue === 1 ? (
                      <span>大于等于</span>
                    ) : compareValue === 2 ? (
                      <span>小于等于</span>
                    ) : null}
                  </Item>
                )}
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
                {giveModalTitle === "新增告警事件" ? (
                  <Item label="告警条件：" labelCol={{ flex: "85px" }}>
                    <Radio.Group
                      options={soeOptions}
                      onChange={soeOnChange}
                      value={soeValue}
                      // name="AlarmCondition"
                    />
                  </Item>
                ) : (
                  <Item label="告警条件：" labelCol={{ flex: "85px" }}>
                    {soeValue === 1 ? (
                      <span>告警+消警</span>
                    ) : soeValue === 2 ? (
                      <span>告警</span>
                    ) : soeValue === 3 ? (
                      <span>消警</span>
                    ) : null}
                  </Item>
                )}

                {soeValue === 1 ? (
                  <div>
                    <Item
                      label="告警标识："
                      labelCol={{ flex: "85px" }}
                      style={{ width: 300 }}
                      name="AlarmLabel"
                      rules={[
                        { required: true, message: "请输入告警标识" },
                        { pattern: /^(?!\s)/, message: "禁止首字符输入空格" },
                      ]}
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
                      rules={[
                        { required: true, message: "请输入消警标识" },
                        { pattern: /^(?!\s)/, message: "禁止首字符输入空格" },
                      ]}
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
                    rules={[
                      { required: true, message: "请输入告警标识" },
                      { pattern: /^(?!\s)/, message: "禁止首字符输入空格" },
                    ]}
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
                    rules={[
                      { required: true, message: "请输入消警标识" },
                      { pattern: /^(?!\s)/, message: "禁止首字符输入空格" },
                    ]}
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
