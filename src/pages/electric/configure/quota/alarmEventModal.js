import React, { useEffect, useRef, useState } from "react";
import styled, {css} from "styled-components";
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
  TimePicker,
  Typography
} from "antd";
import {useTranslation} from 'react-i18next'
import CModal from '@com/useModal'
import { useSelector } from "react-redux";
import { selectProjectId } from "@redux/systemconfig.js";
const {Text} = Typography
const sty = css`
  P {
    margin: 5PX 0;
    line-height: 1;
  }
  .titleModal{
    font-size: 14px;
  }
 
`
const Mainbox=styled.div`
&&{
 
transform: translateY(-16px);
p {
  margin: 10px 0px;
}

 

.titleModal {
  font-family: "微软雅黑 Bold", "微软雅黑 Regular", "微软雅黑";
  font-weight: 700;
  font-style: normal;
  font-size: 16px;
}

.addSourceTypeTable {
  .editText {
    color: ${props=> props.theme.primaryColor};
    font-size: 14px;
    text-decoration: underline;
    cursor: pointer;
  }

  .deleteText {
    color: #f33;
    font-size: 14px;
    text-decoration: underline;
    cursor: pointer;
  }
}

.form {
  .divBox {
    display: flex;
    align-items: center; 
  }

  .ant-form-item {
    margin-bottom: ${props=> props.theme.laptop ? "12px" : "24px"} ;
  }

  .qujianLi,
  .lessThan,
  .qujianwai,
  .greaterThan {
    display: flex;
    justify-content: flex-start;
    position: relative;
    align-items: flex-end;
    .title {
     // padding: 40px 20px 0 5px;
      text-align: left;
      font-size: 14px;
      display: inline-block;
    }

    .content {
   //   margin-top: 20px;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      position: relative;

      .outer {
        width: 100px;
        height: 50px;
        border-bottom: 2px dashed #00cc00;
        color: #00cc00;
        text-align: center;

        span {
          display: inline-block;
          padding-top: 10px;
        }
      }

      .inner {
        width: 130px;
        height: 50px;
        border: 2px solid ${props=> props.theme.errorColor};
        color: ${props=> props.theme.errorColor};
        text-align: center;
        background-color: #ffe6e6;

        span {
          display: inline-block;
          padding-top: 10px;
        }
      }

      .innerWaiLeft {
        width: 120px;
        height: 50px;
        border-bottom: 2px solid ${props=> props.theme.errorColor};
        border-right: 2px solid ${props=> props.theme.errorColor};
        border-top: 2px solid ${props=> props.theme.errorColor};
        color: #${props=> props.theme.errorColor};
        text-align: center;
        background-color: #ffe6e6;

        span {
          display: inline-block;
          padding-top: 10px;
        }
      }

      .innerWaiRight {
        width: 120px;
        height: 50px;
        border-bottom: 2px solid ${props=> props.theme.errorColor};
        border-left: 2px solid ${props=> props.theme.errorColor};
        border-top: 2px solid ${props=> props.theme.errorColor};
        color: ${props=> props.theme.errorColor};
        text-align: center;
        background-color: #ffe6e6;

        span {
          display: inline-block;
          padding-top: 10px;
        }
      }

      .low {
        position: absolute;
        top: 50px;
        left: 90px;
        color: #ff0000;
      }

      .high {
        position: absolute;
        top: 50px;
        left: 220px;
        color: #ff0000;
      }

      .lt {
        border: none;
        border-bottom: 2px solid ${props=> props.theme.errorColor};
        border-right: 2px solid ${props=> props.theme.errorColor};
        width: 170px;
        height: 50px;
        color: ${props=> props.theme.errorColor};
        text-align: center;
        background-color: #ffe6e6;

        span {
          display: inline-block;
          padding-top: 10px;
        }
      }

      .ltAlarm {
        border: none;
        border-bottom: 2px solid ${props=> props.theme.errorColor};
        border-left: 2px solid ${props=> props.theme.errorColor};
        width: 170px;
        height: 50px;
        color: ${props=> props.theme.errorColor};
        text-align: center;
        background-color: #ffe6e6;

        span {
          display: inline-block;
          padding-top: 10px;
        }
      }

      .gt {
        width: 170px;
        height: 50px;
        border-bottom: 2px dashed #00cc00;
        color: #00cc00;
        text-align: center;

        span {
          display: inline-block;
          padding-top: 10px;
        }
      }

      .critical {
        left: 179px;
        position: absolute;
        top: 50px;
        left: 150px;
        color: ${props=> props.theme.errorColor};
      }
    }
  }
}
 ${props=>props.theme.laptop ? sty : null}
}
   
`
export default function Index(props) {
  const {t} = useTranslation(["button"])
  const { AddAlarmEventGive, giveFormType, giveChildForm, giveModalTitle } =    props;

  console.log('giveChildForm',giveChildForm)
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
      console.log(values)
      let data = {
        projectId: projectId,
        name: values.Name,
        pointIdentifier: values.PointIdentifier,
        level: values.Level,
        push: push,
        time: values.Time,
        enable: enable,
        alarmRule: AlarmRule,
        HourEnable: values.HourEnable,
        HourStart:values.HourEnable ? parseInt(values.HourRange[0].format('HH')) : 0,
        HourEnd: values.HourEnable ? parseInt(values.HourRange[1].format('HH')) : 0,
      

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
    } catch (errorInfo) {
      console.log(errorInfo)
    }
  };
  const handleCancel = () => {
    props.callBack();
  };
  const [disabled, setDisabled] = useState(false)

  const changeAlarmType = (val) => {
     setDisabled(val==5)
    // let name =  alarmList.find((a) => a.id==val)?.name || ''
   //  formInfo.setFieldValue('Name', name)
     if(val==5) {
      formInfo.setFieldValue('PointIdentifier', 'Discon')
    }else {
      formInfo.setFieldValue('PointIdentifier', '')
    }
    if(giveModalTitle === "新增告警事件") {
      let name = alarmList.find(a => a.id == val)?.name ?? ''
      let named = formInfo.getFieldValue('Name')?.trim()
      if(!named) formInfo.setFieldValue('Name', name)
    }
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
  const [enabled, setEnabled] = useState(giveChildForm.HourEnable)
  const onCheck =(v) => {
    setEnabled(v)
  }

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
           // giveChildForm.AlarmRule = alarmType[giveChildForm.AlarmRule];
          } else if (
            giveChildForm.AlarmCondition === "Greater" ||
            giveChildForm.AlarmCondition === "Less"
          ) {
            //越限事件
            giveChildForm.AlarmCondition =
              alarmOverrunType[giveChildForm.AlarmCondition];
            setCompareValue(giveChildForm.AlarmCondition);
           // giveChildForm.AlarmRule = alarmType[giveChildForm.AlarmRule];
          } else if (
            giveChildForm.AlarmCondition === "Both" ||
            giveChildForm.AlarmCondition === "Alarm" ||
            giveChildForm.AlarmCondition === "Recover"
          ) {
            //SOE事件
            giveChildForm.AlarmCondition =
              alarmSoeType[giveChildForm.AlarmCondition];
            setSoeValue(giveChildForm.AlarmCondition);
           // giveChildForm.AlarmRule = alarmType[giveChildForm.AlarmRule];
          } else if (giveChildForm.AlarmCondition === "Empty") {
            giveChildForm.AlarmCondition =
              CommunicationType[giveChildForm.AlarmCondition];
           // giveChildForm.AlarmRule = alarmType[giveChildForm.AlarmRule];
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
            setEnable(true);
            setAlarmCondition(1);
            setCompareValue(2);
            setSoeValue(1);
          } else {
          }
        }
      });
    }
  }, [giveFormType, giveChildForm, AddAlarmEventGive]);

  return (
    <div>
      <CModal
        title={giveModalTitle}
        className={style.addModal}
        open={AddAlarmEventGive}
        onOk={addAlarmOk}
        onCancel={handleCancel}
        width={600}        
        okText={t("button:finish")}
        okType={"primary"}
        closable
        mold="cust"
      >        
        <Mainbox >
         
          <Form
            labelCol={{ flex: "110px" }}
            labelAlign="left"
            wrapperCol={{ flex: 1 }}
            className="form"
            // size="small"
            form={formInfo}
            layout="horizontal"
            name="addform"
            preserve={false}
          >
              <p className="titleModal">告警全局设置</p>
              <Space>
              <Item
                label="是否启用："
                valuePropName="checked"
                labelCol={{ flex: "103px" }}
                style={{ width: 220 }}
                name="Enable"
              >
                <Switch
                  checkedChildren="是"
                  unCheckedChildren="否"
                  defaultChecked
                  onChange={enableChange}
                />
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
              </Space>
              <p className="titleModal">告警生效时段</p>
              <Space>
              <Item
                label="生效时段开关："
                valuePropName="checked"
                style={{ width: 220}}
                initialValue={enabled}
                name="HourEnable"

              >
                <Switch
                  checkedChildren="开启"
                  unCheckedChildren="关闭"
                  onChange={onCheck}
                />
              </Item>
               <Text type="danger">{enabled ? '选择时段生效' : '全天生效' }</Text>
              </Space>
             
                <Item label="时段范围" name="HourRange" shouldUpdate={(pre, cur) => pre.HourEnable!==cur.HourEnable }>
                  <TimePicker.RangePicker format="HH" disabled={!enabled} />
                </Item>
              <p className="titleModal">基础配置</p>
            {giveModalTitle === "新增告警事件" ? (
              <Space style={{ alignItems: "baseline" }}>
                <Item
                  name="Name"
                  label="告警事件名称："
                  rules={[{ required: true, message: "请输入告警事件名称" }]}
                  style={{ width: 415,  }}
                  initialValue={alarmList[0].name}
                >
                  <Input
                    style={{ }}
                    placeholder="请输入告警事件名称"
                  />
                </Item>
                <span style={{ marginLeft: 5, color: "#999" }}>(必填)</span>
              </Space>
            ) : (
              <Item name="Name" label="告警事件名称：" style={{ width: 415,  }}>
                <Input
                  style={{ border: "none" }}
                  disabled
                  placeholder="请输入告警事件名称"
                />
              </Item>
            )}
            {giveModalTitle === "新增告警事件" ? (
              <div  style={{ alignItems: "baseline", display: 'flex' }}>
                <Item
                  label="数据标识："
                  rules={[{ required: true, message: "请输入数据标识" }]}
                  style={{ width: 415,  }}
                  name="PointIdentifier"
                  disabled={disabled}
                >
                  <Input
                    style={{}}
                    placeholder="若存在多个标识，请用'|'隔开"
                  />
                </Item>
                <span style={{ marginLeft: 5, color: "#999" }}>(必填)</span>
              </div>
            ) : (
              <Item
                label="数据标识："
                rules={[{ required: true, message: "请输入数据标识" }]}
                style={{ width: 415 }}
                name="PointIdentifier"
              >
                <Input style={{ border: "none" }} disabled />
              </Item>
            )}
              <div style={{display: 'grid', gridTemplateColumns: "220px 1fr", columnGap: '16px'}}>
              <Item
                label="告警等级："           
                name="Level" 
                
                initialValue={levelList[0].id ? levelList[0].id : 0}
              ><Select
                  key={level}
                  onChange={changeAlarmLevel}
                  style={{width: '100px'}}
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
               <div style={{display: 'flex', columnGap: 5, alignItems: 'center', height: '32px'}}>
                <Item
                  label="持续时间(秒)≥："
                  rules={[{ required: true, message: "请输入持续时间" }]}                              
                  name="Time"
                  initialValue={300}
                >
                  <InputNumber min="0" precision={0} />
                </Item>
                <span style={{ color: "#999",  }}>(必填)</span>
                </div>
              </div>           
            <Divider dashed style={{ margin: 0 }} />
            <p className="titleModal">告警规则</p>
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
              <div className="intervalAlarm">
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
                <div className="divBox">
                  <Space style={{ alignItems: "baseline" }}>
                    <Item
                      label="低限："
                      labelCol={{ flex: "70px" }}
                      rules={[{ required: true, message: "请输入低限值" }]}
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
                      rules={[{ required: true, message: "请输入高限值" }]}
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
                        placeholder="高值≥低值"
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
                    <div className="qujianLi">
                      <span className="title">告警说明：</span>
                      <div className="content">
                        <div className="outer">
                          <span>区间外</span>
                        </div>
                        <div className="inner">
                          <span>区间内告警</span>
                        </div>
                        <div className="outer">
                          <span> 区间外</span>
                        </div>
                        <span className="low">低限</span>
                        <span className="high">高限</span>
                      </div>
                    </div>
                  </Item>
                ) : (
                  //    {/* -----区间外----- */}
                  <Item>
                    <div className="qujianwai">
                      <span className="title">告警说明：</span>
                      <div className="content">
                        <div className="innerWaiLeft">
                          <span>区间外告警</span>
                        </div>
                        <div className="outer">
                          <span>区间内</span>
                        </div>
                        <div className="innerWaiRight">
                          <span> 区间外告警</span>
                        </div>
                        <span className="low">低限</span>
                        <span className="high">高限</span>
                      </div>
                    </div>
                  </Item>
                )}
              </div>
            ) : AlarmRule === 1 ? (
              // {/* //越限告警 */}
              <div className="OverLimitAlarm">
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
                    rules={[{ required: true, message: "请输入临界值" }]}
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
                    <div className="lessThan">
                      <span className="title">告警说明：</span>
                      <div className="content">
                        <div className="lt">
                          <span>小于等于(告警)</span>
                        </div>
                        <div className="gt">
                          <span>大于等于</span>
                        </div>
                        <span className="critical"> 临界值 </span>
                      </div>
                    </div>
                  </Item>
                ) : (
                  //   {/* -----大于等于----- */}
                  <Item labelCol={{ flex: "95px" }}>
                    <div className="greaterThan">
                      <span className="title">告警说明：</span>
                      <div className="content">
                        <div className="gt">
                          <span>小于等于</span>
                        </div>
                        <div className="ltAlarm">
                          <span>大于等于(告警)</span>
                        </div>
                        <span className="critical"> 临界值 </span>
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
                    rules={[{ required: true, message: "请输入告警值" }]}
                    style={{ width: 300, marginLeft: 5 }}
                    name="AlarmValue"
                  >
                    <InputNumber
                      style={{ width: 130 }}
                      placeholder="请输入告警值"
                    />
                  </Item>
                  <span style={{ marginLeft: -90, color: "#999" }}>(必填)</span>
                </Space>

                <Space style={{ alignItems: "baseline" }}>
                  <Item
                    label="消警值："
                    labelCol={{ flex: "80px" }}
                    rules={[{ required: true, message: "请输入消警值" }]}
                    style={{ width: 240, marginLeft: 5 }}
                    name="RecoverValue"
                  >
                    <InputNumber
                      style={{ width: 130 }}
                      placeholder="请输入消警值"
                    />
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
                  <span style={{ color: "red", fontSize: 12 }}>
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
        </Mainbox>
      </CModal>
    </div>
  );
}
