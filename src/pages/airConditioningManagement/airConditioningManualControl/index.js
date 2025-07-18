import React, { useState, useRef, useEffect } from "react";
import Pagecount from '@com/pagecontent'
import UseTree from "@com/useTree";
import { Container, CardBox } from "./style";
import { Tabs, Tabs2 } from "./searchHead"
import { Form, message, Checkbox, Row, Col, Card } from "antd";
import BlueColumn from '@com/bluecolumn'
import { Cspin, Cdivider } from "@com/comstyled"
import CModal from "@com/useModal";
import multAir from './icon/multi-splitAir.png'
import splitAir from './icon/splitAir.png'
import centralAir from './icon/centralAirPanel.png'
export default function Index() {
  const [form] = Form.useForm();
  const controlRef = useRef();
  const [treeId, setTreeId] = useState();
  const roomData = [
    { id: '1', state: 1, modeType: 1, name: '101会议室', deviceId: 2850, temp: 24, mode: '制冷', fan: 1, type: 1 },
    { id: '2', state: 1, modeType: 2, name: '102会议室', deviceId: 2840, temp: 24, mode: '制冷', fan: 2, type: 1 },
    { id: '3', state: 1, modeType: 3, name: '103会议室', deviceId: 2850, temp: 26, mode: '制冷', fan: 3, type: 2 },
    { id: '4', state: 1, modeType: 4, name: '103会议室', deviceId: 2860, temp: 28, mode: '制热', fan: 4, type: 3 },
    { id: '5', state: 1, modeType: 1, name: '104会议室', deviceId: 2560, temp: 28, mode: '送风', fan: 1, type: 3 },
    { id: '6', state: 2, modeType: 2, name: '203会议室', deviceId: 2850, temp: 28, mode: '除湿', fan: 2, type: 3 },
    { id: '7', state: 2, modeType: 3, name: '283会议室', deviceId: 2560, temp: 28, mode: '制热', fan: 3, type: 3 },
    { id: '8', state: 2, modeType: 4, name: '303会议室', deviceId: 2560, temp: 28, mode: '制热', fan: 4, type: 3 },
    { id: '9', state: 2, modeType: 2, name: '203会议室', deviceId: 2850, temp: 28, mode: '除湿', fan: 2, type: 3 },
    { id: '10', state: 2, modeType: 3, name: '283会议室', deviceId: 2560, temp: 28, mode: '制热', fan: 3, type: 3 },
    { id: '11', state: 2, modeType: 4, name: '303会议室', deviceId: 2560, temp: 28, mode: '制热', fan: 4, type: 3 },
    { id: '12', state: 2, modeType: 2, name: '203会议室', deviceId: 2850, temp: 28, mode: '除湿', fan: 2, type: 3 },
    { id: '13', state: 2, modeType: 3, name: '283会议室', deviceId: 2560, temp: 28, mode: '制热', fan: 3, type: 3 },
    { id: '14', state: 2, modeType: 4, name: '303会议室', deviceId: 2560, temp: 28, mode: '制热', fan: 4, type: 3 },
    { id: '15', state: 1, modeType: 1, name: '101会议室', deviceId: 2850, temp: 24, mode: '制冷', fan: 1, type: 1 },
    { id: '16', state: 1, modeType: 2, name: '102会议室', deviceId: 2840, temp: 24, mode: '制冷', fan: 2, type: 1 },
    { id: '17', state: 1, modeType: 3, name: '103会议室', deviceId: 2850, temp: 26, mode: '制冷', fan: 3, type: 2 },
    { id: '18', state: 1, modeType: 4, name: '103会议室', deviceId: 2860, temp: 28, mode: '制热', fan: 4, type: 3 },
    { id: '19', state: 1, modeType: 1, name: '104会议室', deviceId: 2560, temp: 28, mode: '送风', fan: 1, type: 3 },
  ];
  const [selectedRooms, setSelectedRooms] = useState([]);

  const [indeterminate, setIndeterminate] = useState(false);
  const [checkAll, setCheckAll] = useState(false);
  const handleControlClick = () => {
    controlRef.current.onOpen()
  }
  const handleSearchAirData = () => {

  }
  const onValuesChange = () => {

  }
  // 处理单个会议室选择
  const handleSingleSelect = (roomId, checked) => {
    const newSelected = checked
      ? [...selectedRooms, roomId]
      : selectedRooms.filter(id => id !== roomId);

    setSelectedRooms(newSelected);
    updateMasterCheckboxState(newSelected);
  };

  // 处理全选/取消全选
  const handleSelectAll = e => {
    const checked = e.target.checked;
    const allIds = roomData.map(room => room.id);

    setSelectedRooms(checked ? allIds : []);
    setCheckAll(checked);
    setIndeterminate(false);
  };

  // 更新全选复选框状态
  const updateMasterCheckboxState = (currentSelected) => {
    const total = roomData.length;
    const selectedCount = currentSelected.length;

    setCheckAll(selectedCount === total);
    setIndeterminate(selectedCount > 0 && selectedCount < total);
  };
  const onOkControl = () => {
    controlRef.current.onCancel()

  }
  return (
    <Pagecount bgcolor="transparent" pd="0 0 0 0">
      <Container>
        <div className="tree-box">
          <UseTree
            areaId={0}
            setTreeId={setTreeId}
            setLine={() => { }}
            showline={false}
            datatype={3}
            energytype={1}
            multiple={false}
            allselect={false}
            treeName={'空调设备列表'}
          />
        </div>
        <div className="right-box">
          <Tabs
            onValuesChange={onValuesChange}
            form={form}
            onSearchAirData={handleSearchAirData}>
          </Tabs>
          <CardBox>
            <div style={{ display: 'flex', justifyContent: "space-between", alignItems: "center" }}>
              <BlueColumn bg={{ height: 13, width: 3 }}
                className="lightData" name='空调列表'></BlueColumn>

              <Tabs2
                onControlClick={handleControlClick} // 传递处理函数
                form={form}      // 确保其他需要的props
                onValuesChange={onValuesChange} // 确保其他需要的props 
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
                已选择 {selectedRooms.length} 台设备
              </span></div>
              <div>开启/关闭：20/4</div>
            </div>
            <Row gutter={[16, 16]} className="airBox">
              {roomData.map(room => (
                <Col key={room.id} xs={4} sm={4} md={4} lg={4}>
                  <Card
                    size="small"
                    className={
                      `${(room.modeType == 1 && room.state == 1) ? 'airCardCold' : (room.modeType == 2 && room.state == 1) ? 'airCardHot' : (room.modeType == 3 && room.state == 1) ? 'airCardWindy' : (room.modeType == 4 && room.state == 1) ? 'airCardDehumidification' : 'closeAir'}`}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: (room.modeType < 3 && room.state == 1) ? '#fff' : '' }} >
                      <div style={{ display: 'flex', alignItems: 'baseline' }}>
                        <Checkbox
                          checked={selectedRooms.includes(room.id)}
                          onChange={e => handleSingleSelect(room.id, e.target.checked)}
                        />
                        <div style={{ marginLeft: '16px' }}>
                          <div style={{ fontSize: 16, fontWeight: 500 }}>{room.name}</div>
                          <div style={{ fontSize: 12 }}> ({room.deviceId})</div>
                        </div>
                      </div>
                      <img className="airIcon" src={room.type == 1 ? multAir : room.type == 2 ? splitAir : centralAir} ></img>
                    </div>
                    <div className="content">
                      <div className="">
                        <div style={{ margin: '16px 0px', fontSize: '32px' }}>
                          {room.temp ? `${room.temp}℃` : room.status}
                        </div>
                        <div>模式：{room.mode || '-'}</div>
                        <div style={{ marginTop: '12px' }}>风速：{room.fan == 1 ? '自动' : room.fan == 1 ? '低速' : room.fan == 1 ? '中速' : '高速' || '-'}</div>
                      </div>

                    </div>

                    <div style={{ marginTop: 12, textAlign: 'right' }}>

                    </div>
                  </Card>
                </Col>
              ))}
            </Row>

          </CardBox>
        </div>
        <CModal title="远程控制" ref={controlRef} width={512} warnimg={true} mold="cust" type="question" onOk={onOkControl} >
          是否确认控制所选空调？
        </CModal>
      </Container>
    </Pagecount>
  )
}

