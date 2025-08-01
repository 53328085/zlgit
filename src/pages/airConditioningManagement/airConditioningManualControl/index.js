import React, { useState, useRef, useEffect } from "react";
import Pagecount from '@com/pagecontent'
import UseTree from "@com/useTree";
import { Container, CardBox } from "./style";
import { Tabs, Tabs2 } from "./searchHead"
import { Form, message, Checkbox } from "antd";
import BlueColumn from '@com/bluecolumn'
import { Cspin, Cdivider } from "@com/comstyled"
import Cempty from '@com/useEmpty'
import CModal from "@com/useModal";
import { useSelector } from "react-redux"
import { selectProjectId } from "@redux/systemconfig"
import multAir from './icon/multi-splitAir.png'
import splitAir from './icon/splitAir.png'
import centralAir from './icon/centralAirPanel.png'
import { useList, useSetControl } from "./api.js";
export default function Index() {
  const projectId = useSelector(selectProjectId)
  const [formSearch, formControl] = Form.useForm();
  const controlRef = useRef();
  const [treeId, setTreeId] = useState([]);
  const [airData, setAirData] = useState([]);
  const [openNum, setOpenNum] = useState();
  const [closeNum, setCloseNum] = useState();
  const [selectedAirs, setSelectedAirs] = useState([]);

  const [indeterminate, setIndeterminate] = useState(false);
  const [checkAll, setCheckAll] = useState(false);
  const [searchParams, setSearchParams] = useState({})
  const [controlParams, setControlParams] = useState({})
  const onValuesChangeSearch = (values, allValues) => {
    setSearchParams(allValues)
  }
  const onValuesChangeControl = (values, allValues) => {
    setControlParams(allValues)
  }
  const handleSearchClick = () => {
    let params = {
      projectId,
      alike: searchParams.alike + searchParams.cSn ? searchParams.alike + searchParams.cSn : '',
      type: searchParams.type ? searchParams.type : 0,
      ioState: ioState ? searchParams.ioState : 0,
      areaIds: treeId
    }
    getAirSearch(params)
  }
  const handleControlClick = () => {
    if (selectedAirs.length == 0) return message.warning('请选择要控制的空调设备');
    controlRef.current.onOpen()
  }
  // 处理单个会议室选择
  const handleSingleSelect = (airId, checked) => {
    const newSelected = checked
      ? [...selectedAirs, airId]
      : selectedAirs.filter(cSn => cSn !== airId);

    setSelectedAirs(newSelected);
    updateMasterCheckboxState(newSelected);
  };

  // 处理全选/取消全选
  const handleSelectAll = e => {
    const checked = e.target.checked;
    const allIds = airData.map(airItem => airItem.cSn);

    setSelectedAirs(checked ? allIds : []);
    setCheckAll(checked);
    setIndeterminate(false);
  };

  // 更新全选复选框状态
  const updateMasterCheckboxState = (currentSelected) => {
    const total = airData.length;
    const selectedCount = currentSelected.length;

    setCheckAll(selectedCount === total);
    setIndeterminate(selectedCount > 0 && selectedCount < total);
  };
  const onOkControl = async () => {
    try {
      let params = {
        projectId,
        ioState: controlParams.ioState ? controlParams.ioState : 1,
        workMode: controlParams.workMode ? controlParams.workMode : 1,
        windSpeed: controlParams.windSpeed ? controlParams.windSpeed : 0,
        temperature: controlParams.temperature ? controlParams.temperature : 24,
        csn: selectedAirs
      }
      let { data, success, errMsg } = await useSetControl({}, params)
      if (success) {
        message.success('所选空调控制成功')
        handleSearchClick()
      } else {
        message.error(errMsg);
      }
    } catch {


    }
    controlRef.current.onCancel()
  }
  const getAirSearch = async (params) => {
    try {
      let { data, success, errMsg } = await useList({}, params)
      if (success) {
        setAirData(Array.isArray(data.details) ? data.details : [])
        setOpenNum(data.closeNum)
        setCloseNum(data.openNum)
      } else {
        message.error(errMsg);
        setAirData([])
        setOpenNum(0)
        setCloseNum(0)
      }
    } catch {

    }
  }
  useEffect(() => {
    let params = {
      projectId,
      alike: '',
      type: 0,
      ioState: 1,
      areaIds: treeId
    }
    getAirSearch(params)
  }, [projectId, treeId])
  return (
    <Pagecount pd="0 0 16px 0" bgcolor="none">
      <Container>
        <div className="tree-box">
          <UseTree
            areaId={0}
            setTreeId={setTreeId}
            setLine={() => { }}
            showline={false}
            datatype={NaN}
            energytype={1}
            treeName={'空调设备列表'}
          />
        </div>
        <div className="right-box">
          <Tabs
            onValuesChangeSearch={onValuesChangeSearch}
            form={formSearch}
            onSearchClick={handleSearchClick}>
          </Tabs>
          <CardBox>
            <div style={{ display: 'flex', justifyContent: "space-between", alignItems: "center" }}>
              <BlueColumn bg={{ height: 13, width: 3 }}
                className="lightData" name='空调列表'></BlueColumn>

              <Tabs2
                onControlClick={handleControlClick} // 传递处理函数
                form={formControl}      // 确保其他需要的props
                onValuesChangeControl={onValuesChangeControl} // 确保其他需要的props 
              /></div>
            <Cdivider type="h" margin="10px 0px" />
            <div className="watchNum"> <div>
              <Checkbox
                indeterminate={indeterminate}
                onChange={handleSelectAll}
                checked={checkAll}
              >
                全选
              </Checkbox><span style={{ marginLeft: 10 }}>
                已选择 {selectedAirs.length} 台设备
              </span></div>
              <div>开启/关闭：{openNum}/{closeNum}</div>
            </div>
            {airData?.length != 0 ?
              <div className="airBox">
                {airData?.map?.(airItem =>
                  <div
                    key={airItem.id}
                    size="small"
                    className={
                      `${(airItem.fields[0].value == '制冷' && airItem.ioState == 1)
                        ? 'airCardCold' : (airItem.fields[0].value == '制热' && airItem.ioState == 1)
                          ? 'airCardHot' : (airItem.fields[0].value == '送风' && airItem.ioState == 1)
                            ? 'airCardWindy' : (airItem.fields[0].value == '除湿' && airItem.ioState == 1)
                              ? 'airCardDehumidification' : 'closeAir'} cardCommon`}>
                    <div style={{
                      display: 'flex', justifyContent: 'space-between', color: ((airItem.fields[0].value == '制冷'
                        || airItem.fields[0].value == '制热') && airItem.state == 1) ? '#fff' : ''
                    }} >
                      <div className="top">
                        <Checkbox
                          checked={selectedAirs.includes(airItem.cSn)}
                          onChange={e => handleSingleSelect(airItem.cSn, e.target.checked)}
                        />
                        <div className="topInfo">
                          <div className="address">{airItem.name}</div>
                          <div className="sn"> ({airItem.cSn})</div>
                        </div>
                      </div>
                      <img className="airIcon" src={airItem.type == 1 ? multAir : (airItem.type == 2 || airItem.type == 3) ? splitAir : airItem.type == 4 ? centralAir : null} ></img>
                    </div>
                    <div className="content">
                      <span className="temperature" >{airItem.temperature ? `${airItem.temperature}` : ''}</span>℃
                    </div>
                    {airItem?.fields?.map(fields =>
                      <div>{fields.name}：{fields.value || '-'}</div>
                    )}
                  </div>
                )} </div>
              : <div style={{ height: '670px', display: 'flex' }}><Cempty tip='暂无数据' /></div>}



          </CardBox>
        </div>
        <CModal title="远程控制" ref={controlRef} width={512} warnimg={true} mold="cust" type="question" onOk={onOkControl} >
          是否确认控制所选空调？
        </CModal>
      </Container>
    </Pagecount>
  )
}

