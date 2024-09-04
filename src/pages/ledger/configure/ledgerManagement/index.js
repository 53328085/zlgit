import React, { useState, useEffect } from 'react'
import Pagecont from "@com/pagecontent"
import styled from "styled-components";
import { Space, Select, Divider, message, Button, Image, Input, Upload, DatePicker } from "antd";
import { useSelector, useDispatch } from 'react-redux'
import { selectProjectId, selectOneLevel } from '@redux/systemconfig.js'
import { SpareParts, distributionRoom } from '@api/api.js'
import Usetable from '@com/useTable'
import CModal from '@com/useModal'
import { PlusOutlined } from '@ant-design/icons';
import moment from 'moment';
const { TextArea } = Input;

const Title = styled.div`
    &&{
     border: 1px solid #d7d7d7;
     padding: 10px 16px;
     border-radius: 4px;
     background-color: #fff;
     height: 48px;
     margin-bottom: 16px;
     .text {
      display: inline-block;
      border-left: 4px solid ${props => props.theme.primaryColor};
      color: #515151;
      padding-left: 16px;
     }
    
      }
   
`
const Content = styled.div` 
  && {
    width: 100%;
    height: 100%;
    padding: 16px;
    border: 1px solid #d7d7d7;
    border-radius: 4px;
    background-color: #fff;
 }
`
const Box = styled.div` 
  && {
    .modalBox{
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: row;
      .left{
        width: 240px;
        height: 704px;
        p{
          line-height: 32px;
          height: 32px;
        }
      }
      .right{
        width: 1115px;
        height: 704px;
        overflow-y:scroll;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        padding-right:16px;
        .deviceBox{
          width:100%;
          height:auto;
          display:grid;
          grid-template-rows:32px;
          grid-template-columns:1fr 1fr;
          grid-gap:16px;
          .deviceItem{
            width:100%;
            height:100%;
            display:flex;
            flex-direction: row;
            justify-content: flex-start;
            align-items:center;
            .deviceValue{
              width:241px;
              height:32px;
              border:1px solid #d1d1d1;
              border-radius:4px;
              display:flex;
              justify-content: space-between;
              align-items:center;
              padding:0 10px;
              margin-right:16px;
            }
          }
          
        }
        .deviceItemdetail{
            width:100%;
            display:flex;
            flex-direction: row;
            justify-content: flex-start;
            align-items:center;
            margin-top:16px;
        }
        .uploadBox{
          .ant-upload{
            width: 231px;
            height: 22px;
            background: #fff;
            border:none;
            margin-top:10px;
          }
        }
        .uploadBoxNew{
          .ant-upload{
          width: 100%;
          height: 100%;
          background: #fff;
          border:none;
          }
        }
      }
    }
 }
`
const getBase64 = (file) =>
  new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
  });
export default function Index() {
  const projectId = useSelector(selectProjectId)
  const levelone = useSelector(selectOneLevel)
  const allOption = { name: '全部', id: 0 };
  // 合并“全部”选项到原始选项列表
  const allOptions = allOption ? [allOption, ...levelone] : levelone;
  // const [roomList, setroomList] = useState([])
  const [areaId, setareaId] = useState(0)
  const [areaIdIn, setareaIdIn] = useState(levelone[0].id)
  const [defalutType, setdefalutType] = useState(1)
  const [defalutTypeOut, setdefalutTypeOut] = useState(0)
  // const [defalutroom, setdefalutroom] = useState()
  const [typeName, setTypeName] = useState('变压器')
  const [deviceList, setdeviceList] = useState([])
  const [deviceValue, setdeviceValue] = useState()
  const [deviceInfo, setDeviceInfo] = useState([])
  const SelectDevice = () => {
    SpareParts.SelectDevice({ projectId, areaId: areaIdIn, deviceType: defalutType }).then(res => {
      if (res.success && res.data) {
        setdeviceList(res.data)
      } else {
        message.error(res.errMsg)
      }
    })
  }//新增页面设备列表
  useEffect(() => {
    SelectDevice()
  }, [areaIdIn, defalutType])
  const onChangeDevice = (value) => {
    setdeviceValue(value)
    SpareParts.GetDeviceInfo({ projectId, deviceId: value }).then(res => {
      if (res.success) {
        setDeviceInfo(res.data)
      }
    })
  }
  const onChange = (value) => {
    setareaId(value)
  }//外部筛选的园区
  const onChangeIn = (value) => {
    setareaIdIn(value)
  }//新增设备中园区
  // const onChangeRoom = (value) => {
  //   setdefalutroom(value)
  // }
  const [deviceInfoList, setdeviceInfoList] = useState({
    label: '变压器', data: [
      { label: '标准代号', data: '', unit: '' },
      { label: '产品代号', data: '', unit: '' },
      { label: '容量', data: '', unit: '' },
      { label: '出厂序号', data: '', unit: '' },
      { label: '额度频率', data: '', unit: 'Hz' },
      { label: '制造商', data: '', unit: '' },
      { label: '总重', data: '', unit: 'Kg' },
      { label: '出厂时间', data: '', unit: '' },
      { label: '低压侧', data: '', unit: 'kV' },
      { label: '高压侧', data: '', unit: 'kV' },
      { label: '连接组标号', data: '', unit: '' },
      { label: '冷却方式', data: '', unit: '' },
      { label: '绝缘水平', data: '', unit: '' },
      { label: '阻抗电压', data: '', unit: 'V' },
    ]
  })//固定的设备信息
  const [deviceOtherInfo1, setDeviceOtherInfo1] = useState(
    {
      label: '温度控制器',
      data: [
        { label: '厂家', data: '', unit: '' },
        { label: '规格型号', data: '', unit: '' },
        { label: '数量', data: '', unit: '' },
      ],
      unit: ''
    },
  )
  const [deviceOtherInfo2, setDeviceOtherInfo2] = useState(
    {
      label: '冷却风机',
      data: [
        { label: '厂家', data: '', unit: '' },
        { label: '规格型号', data: '', unit: '' },
        { label: '数量', data: '', unit: '' },
        { label: '额度电压', data: '', unit: '' },
        { label: '额度电流', data: '', unit: '' },
      ],
      unit: ''
    },
  )
  const [repairInfo, setrepairInfo] = useState({
    label: '维护信息', data: [
      { label: '维护周期', data: '', unit: '' },
      { label: '维护人员', data: '', unit: '' },
      { label: '最后一次维护时间', data: moment(), unit: '' },
      { label: '维护详情', data: '', unit: '' },
    ]
  })
  const onChangeTypeOut=(value)=>{
    setdefalutTypeOut(value)
  }
  const onChangeType = (value) => {//设备类型
    setdefalutType(value)
    setDeviceInfo({})
    setdeviceValue()
    if (editModal == false)
      return false
    setTypeName(() => {
      if (value == 1)
        return '变压器'
      else if (value == 2)
        return '中置柜'
      else if (value == 3)
        return '开关柜'
      else if (value == 4)
        return '直流系统'
      else if (value == 5)
        return '低压有源滤波装置'
      else if (value == 6)
        return '静止无功发生装置'
      else if (value == 7)
        return '电能质量分析仪'
      else if (value == 8)
        return '微机综合保护装置'
    })
    setdeviceInfoList(() => {
      if (value == 1)
        return {
          label: '变压器', data: [
            { label: '标准代号', data: '', unit: '' },
            { label: '产品代号', data: '', unit: '' },
            { label: '容量', data: '', unit: '' },
            { label: '出厂序号', data: '', unit: '' },
            { label: '额度频率', data: '', unit: 'Hz' },
            { label: '制造商', data: '', unit: '' },
            { label: '总重', data: '', unit: 'Kg' },
            { label: '出厂时间', data: '', unit: '' },
            { label: '低压侧', data: '', unit: 'kV' },
            { label: '高压侧', data: '', unit: 'kV' },
            { label: '连接组标号', data: '', unit: '' },
            { label: '冷却方式', data: '', unit: '' },
            { label: '绝缘水平', data: '', unit: '' },
            { label: '阻抗电压', data: '', unit: 'V' },
          ]
        }
      else if (value == 2)
        return {
          label: '中置柜', data: [
            { label: '额度电压', data: '', unit: 'kV' },
            { label: '额定电流', data: '', unit: 'A' },
            { label: '额定电源频率', data: '', unit: 'Hz' },
            { label: '额定短路开断电流', data: '', unit: 'kA' },
            { label: '额定短路关合电流', data: '', unit: 'kA' },
            { label: '额定短时耐受电流', data: '', unit: 'kA' },
            { label: '额定短路持续时间', data: '', unit: 'S' },
            { label: '绝缘水平 (工频)', data: '', unit: 'kV' },
            { label: '绝缘水平 (冲击)', data: '', unit: 'kV' },
          ]
        }
      else if (value == 3)
        return {
          label: '开关柜', data: [
            { label: '额定绝缘电压', data: '', unit: 'V' },
            { label: '额定脉冲耐受电压', data: '', unit: 'V' },
            { label: '额定工作电压', data: '', unit: 'V' },
            { label: '额定电流Ie', data: '', unit: 'V' },
            { label: '额定峰值耐受电流', data: '', unit: 'kA' },
            { label: '额定短时耐受电流（1S）', data: '', unit: 'V' },
            { label: '额定频率', data: '', unit: 'Hz' },
            { label: '外壳防护等级', data: '', unit: 'kV' },
            { label: '操作电压', data: '', unit: 'V' },
          ]
        }
      else if (value == 4)
        return {
          label: '直流系统', data: [
            { label: '额定输出电压', data: '', unit: 'V' },
            { label: '蓄电池型式', data: '', unit: 'V' },
            { label: '单体蓄电池容量', data: '', unit: 'V' },
            { label: '蓄电池组容量', data: '', unit: 'V' },
            { label: '输入电压', data: '', unit: 'V' },
            { label: '冷却方式', data: '', unit: '' },
            { label: '防护等级', data: '', unit: '' },
          ]
        }
      else if (value == 5)
        return {
          label: '低压有源滤波装置', data: [
            { label: '额定电压', data: '', unit: 'V' },
            { label: '相电压波动范围', data: '', unit: 'V' },
            { label: '单体蓄电池容量', data: '', unit: 'V' },
            { label: '蓄电池组容量', data: '', unit: 'V' },
            { label: '输入电压', data: '', unit: 'V' },
            { label: '冷却方式', data: '', unit: '' },
            { label: '防护等级', data: '', unit: '' },
          ]
        }
      else if (value == 6)
        return {
          label: '静止无功发生装置', data: [
            { label: '额定电压', data: '', unit: 'V' },
            { label: '相电压波动范围', data: '', unit: 'V' },
            { label: '额定频率', data: '', unit: 'Hz' },
            { label: '最大补偿容量', data: '', unit: 'kVar' },
          ]
        }
      else if (value == 7)
        return {
          label: '电能质量分析仪', data: [
            { label: '电压有效值', data: '', unit: '%' },
            { label: '电流有效值', data: '', unit: '%' },
            { label: '功率精度', data: '', unit: '%' },
            { label: '电能', data: '', unit: '' },
            { label: '电压偏差', data: '', unit: '%' },
            { label: '频率偏差', data: '', unit: '%' },
            { label: '电压不平衡度', data: '', unit: '%' },
            { label: '电流部平衡度', data: '', unit: '%' },
          ]
        }
      else if (value == 8)
        return { label: '微机综合保护装置', data: [] }
    })
    setDeviceOtherInfo2(() => {
      if (value == 1)
        return{
          label: '冷却风机', data: [
            { label: '厂家', data: '', unit: '' },
            { label: '规格型号', data: '', unit: '' },
            { label: '数量', data: '', unit: '' },
            { label: '额度电压', data: '', unit: '' },
            { label: '额度电流', data: '', unit: '' },], unit: ''
        }
      else return {}
    })
    setDeviceOtherInfo1(() => {
      if (value == 1)
        return{
          label: '温度控制器', data: [
            { label: '厂家', data: '', unit: '' },
            { label: '规格型号', data: '', unit: '' },
            { label: '数量', data: '', unit: '' },], unit: ''
        }
      else return {}
    })
  }
  // const getRoomList = () => {
  //   distributionRoom.RoomList(projectId, areaId).then(res => {
  //     if (res.success && res.data) {
  //       setroomList(res.data)
  //       setdefalutroom(res.data[0].id)
  //     } else {
  //       message.error(res.errMsg)
  //     }
  //   })
  // }
  const [typeList, settypeList] = useState([
    { id: 1, name: '变压器' },
    { id: 2, name: '中置柜' },
    { id: 3, name: '开关柜' },
    { id: 4, name: '直流系统' },
    { id: 5, name: '低压有源滤波装置' },
    { id: 6, name: '静止无功发生装置' },
    { id: 7, name: '电能质量分析仪' },
  ])
  const [typeList1, settypeList1] = useState([
    { id: 0, name: '全部类型' },
    { id: 1, name: '变压器' },
    { id: 2, name: '中置柜' },
    { id: 3, name: '开关柜' },
    { id: 4, name: '直流系统' },
    { id: 5, name: '低压有源滤波装置' },
    { id: 6, name: '静止无功发生装置' },
    { id: 7, name: '电能质量分析仪' },
  ])
  const columns = [
    {
      title: '所属园区',
      dataIndex: 'areaName',
      key: 'areaName',
      align: 'center'
    },
    {
      title: ' 设备类型',
      dataIndex: 'typeName',
      key: 'typeName',
      align: 'center'
    },
    {
      title: '设备型号',
      dataIndex: 'category',
      key: 'category',
      align: 'center'
    }, {
      title: '设备名称',
      dataIndex: 'deviceName',
      key: 'deviceName',
      align: 'center'
    },
    {
      title: '操作',
      key: 'action',
      align: 'center',
      render: (_, record) => (
        <Space size="middle">
          <span style={{ color: '#237Ae4', textDecoration: 'underline' }} onClick={() => setEdit(record)}>编辑</span>
          <span style={{ color: '#ff0000', textDecoration: 'underline' }} onClick={() => setDelete(record)}>删除</span>
        </Space>
      ),
    },
  ]
  const [operaDeviceInfo, setOperaDeviceInfo] = useState()
  const setDelete = (it) => {
    setOperaDeviceInfo(it)
    setDeleteModal(true)
  }
  const setEdit = (it) => {
    setOperaDeviceInfo(it)
    setEditModal(true)
    setCtitle('编辑设备台账')
    setdefalutType(it.deviceType)
    setdeviceValue(it.deviceId)
    SpareParts.QueryLedgerById({ projectId, ledgerId: it.id }).then(res => {
      if (res.success) {
        deviceInfo.name = res.data.deviceName
        deviceInfo.sn = res.data.sn
        deviceInfo.category = res.data.category
        setDeviceInfo({ ...deviceInfo })
        setImageUrl(res.data.image)
        const dataMap = {};
        res.data.data.forEach(item => {
          switch (item.label) {
            case '变压器':
              dataMap.transformer = item;
              break;
            case '温度控制器':
              dataMap.temperatureController = item;
              break;
            case '冷却风机':
              dataMap.coolingFan = item;
              break;
            case '维护信息':
              dataMap.repairInfo = item;
              break;
            default:
              break;
          }
        });
        setdeviceInfoList(dataMap.transformer);
        setDeviceOtherInfo1(dataMap.temperatureController);
        setDeviceOtherInfo2(dataMap.coolingFan);
      const updatedInfo = {
        ...dataMap.repairInfo,
        data: [
          ...dataMap.repairInfo.data.slice(0, 2),
          { label: dataMap.repairInfo.data[2].label, 
            data: moment(dataMap.repairInfo.data[2].data).clone(),
            unit: dataMap.repairInfo.data[2].unit },
          dataMap.repairInfo.data[3],
        ],
      };
      setrepairInfo(updatedInfo);
      } else {
        message.error(res.errMsg)
      }
    })
  }
  const [pageInfo, setpageInfo] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  })
  const [tabledata, setTabledata] = useState([1, 2])
  const changePage = (page, pageSize) => {
    setpageInfo(page)
  }
  const [deleteModal, setDeleteModal] = useState(false)
  const [editModal, setEditModal] = useState(false)
  const [Ctitle, setCtitle] = useState('新增设备台账')
  const deleteOk = () => {
    SpareParts.DeleteLedger(projectId, operaDeviceInfo.id).then(res => {
      if (res.success) {
        message.success('删除成功')
        setDeleteModal(false)
        getData()
      } else {
        message.error(res.errMsg)
      }
    })
  }
  const handleDelete = () => {
    setDeleteModal(false)
  }
  const editOk = () => {
    if (deviceInfo.name == undefined)
      return message.error('请输入设备名称！')
    if (deviceInfo.sn == undefined)
      return message.error('请输入设备编号！')
    if (deviceInfo.category == undefined)
      return message.error('请输入设备型号！')
    if (imageUrl == '')
      return message.error('请上传设备图片！')
    let ledgerDto = []
    ledgerDto.push(deviceInfoList)
    ledgerDto.push(deviceOtherInfo1)
    ledgerDto.push(deviceOtherInfo2)
    ledgerDto.push(repairInfo)
    let params = {
      areaId: areaIdIn,
      name: deviceInfo.name,
      sn: deviceInfo.sn,
      deviceType: defalutType,
      category: deviceInfo.category,
      image: imageUrl,
      ledgerDto: ledgerDto
    }
    console.log(params)
    if(Ctitle=='新增设备台账'){
      SpareParts.AddLedger(projectId, params).then(res => {
        if (res.success) {
          message.success('新增成功')
          handleEdit()
          getData()
        } else {
          message.error(res.errMsg)
        }
      })
    }else{
      SpareParts.UpdateLedger(projectId, params,operaDeviceInfo.id).then(res => {
        if (res.success) {
          message.success('编辑成功')
          handleEdit()
          getData()
        } else {
          message.error(res.errMsg)
        }
      })
    }
    
  }
  const handleEdit = () => {
    setEditModal(false)
    onChangeType(1)
  }
  const openNewC = () => {
    setEditModal(true)
    setdeviceValue()
    setCtitle('新增设备台账')
    //setdefalutType(1)
  }
  const onChangeInput1 = (index, e) => {
    console.log(index, e.target.value)
    deviceOtherInfo1.data[index].data = e.target.value
    setDeviceOtherInfo1({ ...deviceOtherInfo1 })
  }
  const onChangeInput2 = (index, e) => {
    console.log(index, e.target.value)
    deviceOtherInfo2.data[index].data = e.target.value
    setDeviceOtherInfo2({ ...deviceOtherInfo2 })
  }

  const onChangeInputRepair = (val, e) => {
    console.log(val, e.target.value)
    repairInfo.data[val].data = e.target.value
    setrepairInfo({ ...repairInfo })
  }//维修信息
  const onChangeDate = (date) => {
     console.log(date);
    if (date) {
      const updatedInfo = {
        ...repairInfo,
        data: [
          ...repairInfo.data.slice(0, 2),
          { label: repairInfo.data[2].label, data: moment(date).clone, unit: repairInfo.data[2].unit },
          repairInfo.data[3],
        ],
      };
      setrepairInfo(updatedInfo);
    }
  };//维修日期
  // 禁止选择今天的日期之前的日期
  const disabledDate = (current) => {
    // Can not select days before today and today
    return current && current > moment().endOf('day');
  };
  const [imageUrl, setImageUrl] = useState(''); // 初始图片路径
  // 初始图片路径

  const beforeUpload = async (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.warning('图片格式不正确');
    }

    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.warning('图片大小不能超过2M');
    }

    if (isJpgOrPng && isLt2M) {
      const result = await getBase64(file);
      console.log(result)
      setImageUrl(result);
      return false; // 不进行实际的文件上传
    }

    return false; // 不进行实际的文件上传
  };
  const inputDeviceInfo = (info, e) => {
    deviceInfoList.data.forEach(item => {
      if (info.label == item.label) {
        item.data = e.target.value
      }
    })
    setdeviceInfoList({ ...deviceInfoList })
  }
  const inputBasicInfo = (val, e) => {
    console.log(val, e.target.value)
    if (val == 1) {
      deviceInfo.name = e.target.value
    } else if (val = 2) {
      deviceInfo.sn = e.target.value
    } else {
      deviceInfo.category = e.target.value
    }
    setDeviceInfo({ ...deviceInfo })
  }
  // useEffect(() => {
  //   getRoomList()
  // }, [projectId, areaId])
  const getData = () => {
    let params = {
      projectId, areaId, deviceType: defalutTypeOut, pageNum: pageInfo.current, pageSize: pageInfo.pageSize
    }
    SpareParts.QueryLedgerList(params).then(res => {
      if (res.success) {
        setTabledata(res.data)
      } else {
        message.error(res.errMsg)
      }
    })
  }
  useEffect(() => {
    getData()
  }, [areaId, defalutTypeOut, pageInfo.current])
  return (
    <Pagecont bgcolor="transparent" pd="0" >
      <Title>
        <span className="text">设置台账管理</span>
      </Title>
      <Content>
        <div style={{ marginBottom: '16px' }}>
          <Select style={{ width: '264px' }} options={allOptions} value={areaId} onChange={onChange}
            fieldNames={{ label: 'name', value: 'id', options: 'options' }}>
          </Select>
          {/* <Divider style={{ margin: '0px 32px', height: '32px' }} type="vertical" />
          <Select style={{ width: '264px' }} options={roomList} value={defalutroom} onChange={onChangeRoom}
            fieldNames={{ label: 'name', value: 'id', options: 'options' }}>
          </Select> */}
          <Divider style={{ margin: '0px 32px', height: '32px' }} type="vertical" />
          <Select style={{ width: '264px' }} options={typeList1} value={defalutTypeOut} onChange={onChangeTypeOut}
            fieldNames={{ label: 'name', value: 'id', options: 'options' }}>
          </Select>
          <Button type='primary' style={{ position: 'absolute', right: '16px' }} onClick={openNewC}>新增台账</Button>
        </div>
        <Usetable
          hbg="#f0f9ff"
          hbc="#515151"
          columns={columns}
          dataSource={tabledata}
          pagination={pageInfo}
          onChange={changePage}
        />
        <CModal title="删除" open={deleteModal} onOk={deleteOk} onCancel={handleDelete} width={512} mold="cust" type="warn" closable={false}>
          是否确认删除该台账？
        </CModal>
        <CModal title={Ctitle} open={editModal} onOk={editOk} onCancel={handleEdit} width={1484} mold="cust" type="edit" closable={false}>
          <Box>
            <div className='modalBox'>
              <div className='left'>
                <p>设备所属园区</p>
                <Select style={{ width: '240px', marginBottom: '16px' }} options={levelone} value={areaIdIn} onChange={onChangeIn}
                  fieldNames={{ label: 'name', value: 'id', options: 'options' }} disabled={Ctitle == '编辑设备台账'}>
                </Select>
                {/* <p>所属配电房</p>
                <Select style={{ width: '240px', marginBottom: '16px' }} options={roomList} value={defalutroom} onChange={onChangeRoom}
                  fieldNames={{ label: 'name', value: 'id', options: 'options' }}>
                </Select> */}
                <p>设备类型</p>
                <Select style={{ width: '240px', marginBottom: '16px' }} options={typeList} value={defalutType} onChange={onChangeType}
                  fieldNames={{ label: 'name', value: 'id', options: 'options' }} disabled={Ctitle == '编辑设备台账'}>
                </Select>
                {(deviceList.length > 0) ? <div>
                  <p>请选择{typeName}</p>
                  <Select style={{ width: '240px', marginBottom: '16px' }} options={deviceList} value={deviceValue} onChange={onChangeDevice}
                    fieldNames={{ label: 'name', value: 'id', options: 'options' }} disabled={Ctitle == '编辑设备台账'}>
                  </Select>
                </div> : <div></div>}
              </div>
              <Divider style={{ margin: '0px 32px', height: '704px' }} type="vertical" />
              <div className='right'>
                <div style={{ width: '231px', height: '704px', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ width: '231px', height: '240px', border: '1px solid #d2d2d2', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '16px' }}>
                    {imageUrl ? <Image src={imageUrl} style={{maxHeight:240,maxWidth:230}} /> :
                      <Upload className='uploadBoxNew'
                        listType="picture-card"
                        beforeUpload={beforeUpload}
                        showUploadList={false}
                      >
                        <PlusOutlined style={{ fontSize: '32px', color: '#999' }} />
                      </Upload>}
                  </div>
                  {Ctitle == '编辑设备台账' ? <Upload className='uploadBox'
                    listType="picture-card"
                    beforeUpload={beforeUpload}
                    showUploadList={false}
                  >
                    <p
                      style={{
                        width: '231px',
                        textDecoration: 'underline',
                        textAlign: 'center',
                        color: '#237ae4',
                        cursor: 'pointer'
                      }}
                    >
                      更换
                    </p>
                  </Upload> : null}
                </div>
                <div className='chartRight'>
                  <div>
                    {/* 第一part基本信息四个 */}
                    <Divider dashed style={{ width: '100%' }}>{typeName || ''}</Divider>
                    <div className='deviceBox'>
                      <div className='deviceItem'>
                        <span style={{ width: '160px' }}>设备名称</span>
                        <Input style={{ width: '241px' }} disabled={deviceList?.length > 0 || Ctitle == '编辑设备台账'} value={deviceInfo?.name} onChange={(e) => inputBasicInfo(1, e)} />
                      </div>
                      <div className='deviceItem'>
                        <span style={{ width: '160px' }}>设备编号</span>
                        <Input style={{ width: '241px' }} disabled={deviceList?.length > 0 || Ctitle == '编辑设备台账'} value={deviceInfo?.sn} onChange={(e) => inputBasicInfo(2, e)} />
                      </div>
                      <div className='deviceItem'>
                        <span style={{ width: '160px' }}>规格型号</span>
                        <Input style={{ width: '241px' }} disabled={deviceList?.length > 0 || Ctitle == '编辑设备台账'} value={deviceInfo?.category} onChange={(e) => inputBasicInfo(3, e)} />
                      </div>
                      <div className='deviceItem'>
                        <span style={{ width: '160px' }}>设备类型</span>
                        <Input style={{ width: '241px' }} disabled value={typeName} />
                      </div>
                      {/* 设备除四个基本信息外的信息（第一part） */}
                      {deviceInfoList && deviceInfoList.data?.length>0 ? deviceInfoList.data.map(it => {
                        return <div className='deviceItem'>
                          <span style={{ width: '160px' }}>{it.label}</span>
                          <Input suffix={it.unit} style={{ width: '241px' }} value={it.data} onChange={(e) => inputDeviceInfo(it, e)} />
                        </div>
                      }) : <></>}

                    </div>
                    {/* 变压器的温度控制器和冷吹风机 */}
                    {deviceOtherInfo1 && deviceOtherInfo1.data?.length > 0 ?
                      <div>
                        <Divider dashed style={{ width: '100%' }}>{deviceOtherInfo1.label}</Divider>
                        <div className='deviceBox'>{deviceOtherInfo1.data.map((it, index) => {
                          return <div className='deviceItem'>
                            <span style={{ width: '160px' }}>{it.label}</span>
                            <Input suffix={it.unit} style={{ width: '241px' }} value={it.data} onChange={(e) => onChangeInput1(index, e)} />
                          </div>
                        })}</div>
                      </div> :  <></>
                    }
                    {deviceOtherInfo2 && deviceOtherInfo2.data?.length > 0 ?
                      <div>
                        <Divider dashed style={{ width: '100%' }}>{deviceOtherInfo2.label}</Divider>
                        <div className='deviceBox'>{deviceOtherInfo2.data.map((it, index) => {
                          return <div className='deviceItem'>
                            <span style={{ width: '160px' }}>{it.label}</span>
                            <Input suffix={it.unit} style={{ width: '241px' }} value={it.data} onChange={(e) => onChangeInput2(index, e)} />
                          </div>
                        })}</div>
                      </div> :  <></>
                    }
                    {/* 维护信息 */}
                    <Divider dashed style={{ width: '100%' }}>维护信息</Divider>
                    <div className='deviceBox'>
                      <div className='deviceItem'>
                        <span style={{ width: '160px' }}>维护周期</span>
                        <Input style={{ width: '241px' }} value={repairInfo?.data[0]?.data} onChange={(e) => onChangeInputRepair(0, e)} />
                      </div>
                      <div className='deviceItem'>
                        <span style={{ width: '160px' }}>维护人员</span>
                        <Input style={{ width: '241px' }} value={repairInfo?.data[1]?.data} onChange={(e) => onChangeInputRepair(1, e)} />
                      </div>
                      <div className='deviceItem'>
                        <span style={{ width: '160px' }}>最后一次维护时间</span>
                        <DatePicker style={{ width: '241px' }} format='YYYY-MM-DD' value={repairInfo?.data[2]?.data} onChange={onChangeDate} disabledDate={disabledDate}/>
                      </div>
                    </div>
                    <div className='deviceItemdetail'>
                      <span style={{ width: '160px' }}>维护详情</span>
                      <TextArea style={{ width: '675px' }} value={repairInfo?.data[3]?.data} rows={4} onChange={(e) => onChangeInputRepair(3, e)} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Box>
        </CModal>
      </Content>

    </Pagecont>
  )
}
