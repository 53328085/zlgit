import React, { useState, useRef, useEffect } from "react";
import Pagecount from "@com/pagecontent";
import UseTree from "@com/useTree";
import { Container, CardBox } from "./style";
import { Tabs, Tabs2 } from "./searchHead";
import { Form, message, Checkbox as AntCheckbox } from "antd";
import { ExportExcel, CustButton, CustButtonT } from '@com/useButton'
import BlueColumn from "@com/bluecolumn";
import Cempty from "@com/useEmpty";
import CModal from "@com/useModal";
import { useSelector } from "react-redux";
import { selectProjectId } from "@redux/systemconfig";
import multAir from "./icon/vrvIcon.svg";
import splitAir from "./icon/spacIcon.svg";
import centralAir from "./icon/caIcon.svg";
import coolBackground from "./icon/coolBackground.svg";
import { useList, useSetControl } from "./api.js";
import { Cspin } from "@com/comstyled"

export default function Index() {
  const [spinning, setSpinning] = useState(false)
  const projectId = useSelector(selectProjectId);
  const [formSearch] = Form.useForm();
  const [formControl] = Form.useForm();
  const controlRef = useRef();
  const tipRef = useRef();
  const [treeId, setTreeId] = useState([]);
  const [airData, setAirData] = useState([]);
  const [openNum, setOpenNum] = useState();
  const [closeNum, setCloseNum] = useState();
  const [selectedAirs, setSelectedAirs] = useState([]);

  const [indeterminate, setIndeterminate] = useState(false);
  const [checkAll, setCheckAll] = useState(false);
  // 设备状态常量
  const DEVICE_STATE = {
    OFFLINE: 1, // 离线
    ONLINE: 2, // 在线
    ALARM: 3, // 告警
  };

  // 处理卡片点击（Checkbox 选中状态切换）
  const handleCardCheck = (airId, checked) => {
    const newSelected = checked
      ? [...selectedAirs, airId]
      : selectedAirs.filter(id => id !== airId);
    setSelectedAirs(newSelected);
    updateMasterCheckboxState(newSelected);
  };

  const handleSearchClick = async () => {
    try {
      setSpinning(true)
      let { alike, cSn, type, ioState } = await formSearch.validateFields();
      let params = {
        projectId,
        alike,
        type,
        ioState,
        ids: treeId,
      };
      let { data, success, errMsg } = await useList({}, params);
      if (success) {
        setSpinning(false)
        setAirData(Array.isArray(data.details) ? data.details : []);
        setOpenNum(data.openNum);
        setCloseNum(data.closeNum);
      } else {
        setSpinning(false)
        message.error(errMsg);
        setAirData([]);
        setOpenNum(0);
        setCloseNum(0);
      }
    } catch {
      setSpinning(false)
    }
  };

  const handleControlClick = async () => {
    let { temperature } = await formControl.validateFields();
    if (temperature == null) return message.warning("请输入空调温度");
    if (selectedAirs.length == 0)
      return message.warning("请选择要控制的空调设备");
    controlRef.current.onOpen();
  };

  // 获取所有在线设备ID
  const getOnlineDeviceIds = () => {
    return airData
      .filter(
        (device) =>
          device.state === DEVICE_STATE.ONLINE ||
          device.state === DEVICE_STATE.ALARM
      )
      .map((device) => device.id);
  };

  // 处理全选/取消全选
  const handleSelectAll = (e) => {
    const checked = e.target.checked;
    const onlineIds = getOnlineDeviceIds();
    setSelectedAirs(checked ? onlineIds : []);
    setCheckAll(checked);
    setIndeterminate(false);
  };

  // 更新全选复选框状态
  const updateMasterCheckboxState = (currentSelected) => {
    const onlineIds = getOnlineDeviceIds();
    const onlineCount = onlineIds.length;
    const selectedCount = currentSelected.length;
    setCheckAll(onlineCount > 0 && selectedCount === onlineCount);
    setIndeterminate(selectedCount > 0 && selectedCount < onlineCount);
  };

  const onOkControl = async () => {
    controlRef.current.onCancel();
    setSpinning(true)
    try {
      let { ioState, workMode, windSpeed, temperature } =
        await formControl.validateFields();
      let params = {
        projectId,
        ioState,
        workMode,
        windSpeed,
        temperature,
        conditionerIds: selectedAirs
      }
      let { data, success, errMsg } = await useSetControl({}, params)
      if (success) {
        message.success("所选空调控制成功");
        // setTimeout(() => {
        handleSearchClick();
        // }, 10000)

      } else {
        message.error(errMsg);
      }
    } catch { }
  };

  const onConfirmTip = async () => {
    tipRef.current.onCancel();
  }

  useEffect(() => {
    if (Number.isInteger(projectId) && Array.isArray(treeId) && treeId.length > 0) {
      handleSearchClick();
    }
  }, [projectId, treeId]);

  return (
    <Pagecount pd="0 0 16px 0" bgcolor="none">
      <Container>
        <div className="tree-box">
          <UseTree
            areaId={0}
            setTreeId={setTreeId}
            setLine={() => { }}
            showline={false}
            datatype={5}
            energytype={1}
            allselect={true}
            showSearch={true}
            title="空调设备列表"
          />
        </div>
        <div className="right-box">
          <Tabs form={formSearch} onSearchClick={handleSearchClick}></Tabs>
          <CardBox>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <BlueColumn
                bg={{ height: 13, width: 3 }}
                className="lightData"
                name="空调列表"
              ></BlueColumn>
              <Tabs2
                onControlClick={handleControlClick}
                form={formControl}
              />
            </div>
            <div className="watchNum">
              <div>
                <AntCheckbox
                  indeterminate={indeterminate}
                  onChange={handleSelectAll}
                  checked={checkAll}
                >
                  全选
                </AntCheckbox>
                <span style={{ marginLeft: 10 }}>
                  已选择 {selectedAirs.length} 台设备
                </span>
              </div>
              <div>
                开启/关闭：{openNum}/{closeNum}
              </div>
            </div>
            {/* state =2 空调在线，state =1/=0空调离线，state =3空调告警 */}
            {/* ioState =2 空调关闭，ioState=1空调打开 */}
            <Cspin spinning={spinning} >
              <div className="airContainer">
                {airData?.length !== 0 ? (
                  <div className="airBox">
                    {airData?.map?.((airItem) => (
                      airItem.state === 2 ? (
                        <>
                          {airItem.ioState === 2 ? (
                            <div className="cardCommon closeAir">
                              <AntCheckbox
                                key={airItem.id}
                                checked={selectedAirs.includes(airItem.id)}
                                onChange={(e) => handleCardCheck(airItem.id, e.target.checked)}
                                style={{ cursor: 'pointer', color: '#303133', height: ' 100%' }}
                              >
                                <div className="airInfo">
                                  <div style={{ display: 'flex' }}>
                                    <div className="top">
                                      <div className="topInfo">
                                        <div className="name" title={airItem.name}>{airItem.name}</div>
                                        <div className="value"> ({airItem.cSn})</div>
                                      </div>
                                    </div>
                                    <img
                                      className="airIcon"
                                      src={airItem.type === 1 ? splitAir : (airItem.type === 2 || airItem.type === 3) ? multAir : airItem.type === 4 ? centralAir : null}
                                    ></img>
                                  </div>
                                  <div className="content">
                                    <span className="temperature">-</span>℃
                                  </div>
                                  {airItem?.fields?.map((fields) => (
                                    <div key={fields.name} className="fields">
                                      <div className="name">{fields.name}</div>
                                      <div className={`${(fields.name === '开关' && fields.value === '开') ? 'open' :
                                        (fields.name === '开关' && fields.value === '关') ? 'close' : ''} value`}
                                      >
                                        {/* {fields.name === '开关' ? fields.value : '-'} */}
                                        {fields.value || "-"}
                                      </div>

                                    </div>
                                  ))}
                                </div>
                              </AntCheckbox>
                            </div>
                          ) : (
                            <div className={`${airItem?.fields[1]?.value === "制冷"
                              ? "airCardCold"
                              : airItem?.fields[1]?.value === "制热"
                                ? "airCardHot"
                                : airItem?.fields[1]?.value === "送风"
                                  ? "airCardWindy"
                                  : airItem?.fields[1]?.value === "除湿"
                                    ? "airCardDehumidification"
                                    : "closeAir"
                              } cardCommon`}>
                              <AntCheckbox
                                key={airItem.id}
                                checked={selectedAirs.includes(airItem.id)}
                                onChange={(e) => handleCardCheck(airItem.id, e.target.checked)}
                                style={{ cursor: 'pointer', color: '#303133', height: ' 100%' }}
                              >
                                <div className="airInfo" >
                                  <div style={{ display: "flex" }}>
                                    <div className="top">
                                      <div className="topInfo">
                                        <div className="name" title={airItem.name}>{airItem.name}</div>
                                        <div className="value"> ({airItem.cSn})</div>
                                      </div>
                                    </div>
                                    <img
                                      className="airIcon"
                                      src={
                                        airItem.type === 1
                                          ? splitAir
                                          : airItem.type === 2 || airItem.type === 3
                                            ? multAir
                                            : airItem.type === 4
                                              ? centralAir
                                              : null
                                      }
                                    ></img>
                                  </div>
                                  <div className="content">
                                    <span className="temperature">
                                      {airItem.temperature ? `${airItem.temperature}` : ""}
                                    </span>
                                    ℃
                                  </div>
                                  {airItem?.fields?.map((fields) => (
                                    <div key={fields.name} className="fields">
                                      <div className="name">{fields.name}</div>
                                      <div className={`${(fields.name === '开关' && fields.value === '开') ? 'open' :
                                        (fields.name === '开关' && fields.value === '关') ? 'close' : ''} value`}
                                      >{fields.value || "-"}</div>
                                    </div>
                                  ))}
                                </div>
                              </AntCheckbox>
                            </div>
                          )}
                        </>
                      ) : (airItem.state === 1 || airItem.state === 0) ? (
                        <div className="cardCommon airOffline">
                          {/* <AntCheckbox
                          key={airItem.id}
                          checked={selectedAirs.includes(airItem.id)}
                          onChange={(e) => handleCardCheck(airItem.id, e.target.checked)}
                          style={{ cursor: 'pointer', color: '#5D5D5D', height: ' 100%' }}
                        > */}
                          <div style={{ color: '#303133' }}>
                            <div style={{ display: "flex", justifyContent: 'space-between' }}>
                              <div className="top">
                                <div className="topInfo">
                                  <div className="name" title={airItem.name}>{airItem.name}</div>
                                  <div className="value">  ({airItem.cSn})</div>
                                </div>
                              </div>
                              <img
                                className="airIcon"
                                src={airItem.type === 1 ? splitAir : (airItem.type === 2 || airItem.type === 3) ? multAir : airItem.type === 4 ? centralAir : null}
                              ></img>
                            </div>
                            <div className="content">
                              <span className="temperature">-</span>℃
                            </div>
                            <div className="air-Offline">离线</div>
                          </div>
                          {/* </AntCheckbox> */}
                        </div>
                      ) : (
                        <div className="cardCommon airAlarm">
                          <AntCheckbox
                            key={airItem.id}
                            checked={selectedAirs.includes(airItem.id)}
                            onChange={(e) => handleCardCheck(airItem.id, e.target.checked)}
                            style={{ cursor: 'pointer', color: '#303133', height: ' 100%' }}
                          >
                            <div className="airInfo">
                              <div style={{ display: 'flex' }}>
                                <div className="top">
                                  <div className="topInfo">
                                    <div className="name" title={airItem.name}>{airItem.name}</div>
                                    <div className="value"> ({airItem.cSn})</div>
                                  </div>
                                </div>
                                <img
                                  className="airIcon"
                                  src={airItem.type === 1 ? splitAir : (airItem.type === 2 || airItem.type === 3) ? multAir : airItem.type === 4 ? centralAir : null}
                                ></img>
                              </div>
                              <div className="content">
                                <span className="temperature">-</span>℃
                              </div>
                              <div className="air-Alarm">告警</div>
                            </div>
                          </AntCheckbox>
                        </div>
                      )
                    ))}
                  </div>
                ) : (
                  <div>{spinning ? null : (<div style={{ height: '670px', display: 'flex' }}><Cempty tip='暂无数据' /></div>)}</div>
                )}
              </div>
            </Cspin>
          </CardBox>
        </div>
        <CModal
          title="远程控制"
          ref={controlRef}
          width={512}
          warnimg={true}
          mold="cust"
          type="question"
          onOk={onOkControl}
        >
          是否确认控制所选空调？
        </CModal>

        <CModal
          title="提示"
          ref={tipRef}
          width={312}
          mold="cust"
          closable={false}
          footer={<div><CustButton style={{ marginLeft: "auto" }} onClick={onConfirmTip}>确认</CustButton></div>}
        >
          <div>所选空调控制成功！</div>
          <div style={{ marginTop: '5px' }}>空调关闭状态会在5分钟后更新！</div>
        </CModal>
      </Container>
    </Pagecount>
  );
}