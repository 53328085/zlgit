import React, { useState, useRef, useEffect } from "react";
import Pagecount from "@com/pagecontent";
import UseTree from "@com/useTree";
import { Container, CardBox } from "./style";
import { Tabs, Tabs2 } from "./searchHead";
import { Form, message, Checkbox } from "antd";
import { ExportExcel, CustButton, CustButtonT } from '@com/useButton'
import BlueColumn from "@com/bluecolumn";
import Cempty from "@com/useEmpty";
import CModal from "@com/useModal";
import { useSelector } from "react-redux";
import { selectProjectId } from "@redux/systemconfig";
import multAir from "./icon/multi-splitAir.png";
import splitAir from "./icon/splitAir.png";
import centralAir from "./icon/centralAirPanel.png";
import { useList, useSetControl } from "./api.js";
export default function Index() {
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
  const handleSearchClick = async () => {
    try {

      let { alike, cSn, type, ioState } = await formSearch.validateFields();
      let params = {
        projectId,
        // alike: alike + cSn ? alike + cSn : "",
        alike: alike,
        type,
        ioState,
        ids: treeId,
      };
      let { data, success, errMsg } = await useList({}, params);
      if (success) {
        setAirData(Array.isArray(data.details) ? data.details : []);
        setOpenNum(data.openNum);
        setCloseNum(data.closeNum);
      } else {
        message.error(errMsg);
        setAirData([]);
        setOpenNum(0);
        setCloseNum(0);
      }
    } catch { }
  };
  const handleControlClick = async () => {
    let { temperature } = await formControl.validateFields();
    console.log(temperature, formControl.validateFields());
    if (temperature == null) return message.warning("请输入空调温度");
    if (selectedAirs.length == 0)
      return message.warning("请选择要控制的空调设备");
    controlRef.current.onOpen();
    console.log(formControl.validateFields())
  };
  // 处理单个选择
  const handleSingleSelect = (airId, checked) => {
    const newSelected = checked
      ? [...selectedAirs, airId]
      : selectedAirs.filter(id => id !== airId);

    setSelectedAirs(newSelected);
    updateMasterCheckboxState(newSelected);
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
    // const allIds = airData.map(airItem => airItem.id);
    // console.log(checked, onlineIds)
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
    // const total = airData.length;
    // const selectedCount = currentSelected.length;
    // setCheckAll(selectedCount === total);
    // setIndeterminate(selectedCount > 0 && selectedCount < total);
  };
  const onOkControl = async () => {
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
        if (ioState == 1) {
          message.success("所选空调控制成功");
        } else {
          tipRef.current.onOpen();
        }
        handleSearchClick();
      } else {
        message.error(errMsg);
      }
    } catch { }
    controlRef.current.onCancel();
  };
  const onConfirmTip = async () => {
    tipRef.current.onCancel();
  }
  useEffect(() => {
    if (Number.isInteger(projectId) && Array.isArray(treeId)) {
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
                onControlClick={handleControlClick} // 传递处理函数
                form={formControl} // 确保其他需要的props
              />
            </div>
            <div className="watchNum">
              {" "}
              <div>
                <Checkbox
                  indeterminate={indeterminate}
                  onChange={handleSelectAll}
                  checked={checkAll}
                >
                  全选
                </Checkbox>
                <span style={{ marginLeft: 10 }}>
                  已选择 {selectedAirs.length} 台设备
                </span>
              </div>
              <div>
                开启/关闭：{openNum}/{closeNum}
              </div>
            </div>
            {airData?.length != 0 ? (
              <div className="airBox">
                {airData?.map?.((airItem) => (
                  <>
                    {/* state =2 空调在线，state =1 /=0空调离线，state =3空调告警 */}
                    {airItem.state == 2 ? (
                      <>
                        {/* ioState=2空调关闭，ioState=1空调打开 */}
                        {airItem.ioState == 2 ?
                          <div
                            key={airItem.id}
                            size="small"
                            className=
                            'cardCommon closeAir'>
                            <div style={{
                              display: 'flex', justifyContent: 'space-between'
                            }} >
                              <div className="top">
                                <Checkbox
                                  checked={selectedAirs.includes(airItem.id)}
                                  onChange={e => handleSingleSelect(airItem.id, e.target.checked)}
                                />
                                <div className="topInfo">
                                  <div className="name" title={airItem.name}>{airItem.name}</div>
                                  <div className="value"> ({airItem.cSn})</div>
                                </div>
                              </div>
                              <img className="airIcon" src={airItem.type == 1 ? splitAir : (airItem.type == 2 || airItem.type == 3) ? multAir : airItem.type == 4 ? centralAir : null} ></img>
                            </div>
                            <div className="content">
                              <span className="temperature" >-</span>℃
                            </div>
                            {airItem?.fields?.map((fields) => (
                              <div>
                                {fields.name}：-
                              </div>
                            ))}
                          </div>
                          :
                          <div
                            key={airItem.id}
                            size="small"
                            className={`${airItem?.fields[0]?.value == "制冷"
                              ? "airCardCold"
                              : airItem?.fields[0]?.value == "制热"
                                ? "airCardHot"
                                : airItem?.fields[0]?.value == "送风"
                                  ? "airCardWindy"
                                  : airItem?.fields[0]?.value == "除湿"
                                    ? "airCardDehumidification"
                                    : "closeAir"
                              } cardCommon`}
                          >
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <div className="top">
                                <Checkbox
                                  checked={selectedAirs.includes(airItem.id)}
                                  onChange={e => handleSingleSelect(airItem.id, e.target.checked)}
                                />
                                <div className="topInfo">
                                  <div className="name" title={airItem.name}>{airItem.name}</div>
                                  <div className="value"> ({airItem.cSn})</div>
                                </div>
                              </div>
                              <img
                                className="airIcon"
                                src={
                                  airItem.type == 1
                                    ? splitAir
                                    : airItem.type == 2 || airItem.type == 3
                                      ? multAir
                                      : airItem.type == 4
                                        ? centralAir
                                        : null
                                }
                              ></img>
                            </div>
                            <div className="content">
                              <span className="temperature">
                                {airItem.temperature
                                  ? `${airItem.temperature}`
                                  : ""}
                              </span>
                              ℃
                            </div>
                            {airItem?.fields?.map((fields) => (
                              <div>
                                {fields.name}：{fields.value || "-"}
                              </div>
                            ))}
                          </div>
                        }
                      </>
                    ) : (airItem.state == 1 || airItem.state == 0) ? (
                      <div
                        key={airItem.id}
                        size="small"
                        className="cardCommon airOffline"
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <div className="top">
                            {/* <Checkbox
                              checked={selectedAirs.includes(airItem.cSn)}
                              onChange={e => handleSingleSelect(airItem.cSn, e.target.checked)}
                            /> */}
                            <div className="topInfo">
                              <div className="name" title={airItem.name}>{airItem.name}</div>
                              <div className="value">  ({airItem.cSn})</div>
                            </div>
                          </div>
                          <img className="airIcon" src={airItem.type == 1 ? splitAir : (airItem.type == 2 || airItem.type == 3) ? multAir : airItem.type == 4 ? centralAir : null} ></img>
                        </div>
                        <div className="content">
                          <span className="temperature" >-</span>℃
                        </div>
                        <div>空调离线</div>
                      </div>)
                      :
                      <div
                        key={airItem.id}
                        size="small"
                        className=
                        'cardCommon airAlarm'>
                        <div style={{
                          display: 'flex', justifyContent: 'space-between'
                        }} >
                          <div className="top">
                            <Checkbox
                              checked={selectedAirs.includes(airItem.id)}
                              onChange={e => handleSingleSelect(airItem.id, e.target.checked)}
                            />
                            <div className="topInfo">
                              <div className="name" title={airItem.name}>{airItem.name}</div>
                              <div className="value"> ({airItem.cSn})</div>
                            </div>
                          </div>
                          <img className="airIcon" src={airItem.type == 1 ? splitAir : (airItem.type == 2 || airItem.type == 3) ? multAir : airItem.type == 4 ? centralAir : null} ></img>
                        </div>
                        <div className="content">
                          <span className="temperature" >-</span>℃
                        </div>
                        <div>空调告警</div>
                      </div>
                    }
                  </>
                ))}
              </div >)
              :
              <div style={{ height: '670px', display: 'flex' }}><Cempty tip='暂无数据' /></div>}



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
          footer={<div ><CustButton style={{ marginLeft: "auto" }} onClick={onConfirmTip}>确认</CustButton></div>}
        >
          <div>所选空调控制成功！</div>
          <div style={{ marginTop: '5px' }}>空调关闭状态会在5分钟后更新！</div>
        </CModal>
      </Container>
    </Pagecount>
  );
}
