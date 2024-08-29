import React, { useState, useEffect } from 'react'
import Pagecont from "@com/pagecontent"
import styled from "styled-components";
import { Space, Select, Divider, message, Button, Image, Input, Upload } from "antd";
import { useSelector, useDispatch } from 'react-redux'
import { selectProjectId, selectOneLevel } from '@redux/systemconfig.js'
import { distributionRoom } from '@api/api.js'
import Usetable from '@com/useTable'
import CModal from '@com/useModal'
import { PlusOutlined } from '@ant-design/icons';


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
  const [defalutType, setdefalutType] = useState(0)
  // const [defalutroom, setdefalutroom] = useState()
  const [typeName, setTypeName] = useState('变压器')
  const [deviceList, setdeviceList] = useState([
    {
      name: '变压器1',
      id: 1,
    },
    {
      name: '变压器2',
      id: 2,
    },
  ])
  const [deviceValue, setdeviceValue] = useState()
  const onChangeDevice = (value) => {
    setdeviceValue(value)
  }
  const onChange = (value) => {
    setareaId(value)
  }
  // const onChangeRoom = (value) => {
  //   setdefalutroom(value)
  // }
  const [deviceInfoList,setdeviceInfoList]=useState([
    { title: '设备名称', data: 1,},
    { title: '设备编号', data: 2, },
    { title: '规格型号', data: 3,},
    { title: '设备类型', data: 4,},
  ])//基本信息
  const onChangeType = (value) => {
    setdefalutType(value)
    if (editModal == false)
      return false
    setTypeName(() => {
      // typeList.map(item => {
      //   if (item.id == value)
      //     return item.name
      // })
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
      dataIndex: 'alarmTime',
      key: 'alarmTime',
      align: 'center'
    },
    {
      title: '所属配电房',
      dataIndex: 'level',
      key: 'level',
      align: 'center'
    },
    {
      title: ' 设备类型',
      dataIndex: 'alarmEvent',
      key: 'alarmEvent',
      align: 'center'
    },
    {
      title: '设备型号',
      dataIndex: 'name',
      key: 'name',
      align: 'center'
    }, {
      title: '设备名称',
      dataIndex: 'name',
      key: 'name',
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
  const setDelete = (it) => {
    console.log(it)
    setDeleteModal(true)
  }
  const setEdit = (it) => {
    console.log(it)
    setEditModal(true)
    setCtitle('编辑设备台账')
    setdefalutType(1)
  }
  const [pageInfo, setpageInfo] = useState({
    pageNum: 1,
    pageSize: 10,
    total: 0
  })
  const [tabledata, setTabledata] = useState([1, 2])
  const changePage = (page, pageSize) => {
    setpageInfo({
      pageNum: page,
      pageSize: pageSize,
      total: 100
    })
  }
  const [deleteModal, setDeleteModal] = useState(false)
  const [editModal, setEditModal] = useState(false)
  const [Ctitle, setCtitle] = useState('新增设备台账')
  const deleteOk = () => {
    setDeleteModal(false)
  }
  const handleDelete = () => {
    setDeleteModal(false)
  }
  const editOk = () => {
    setEditModal(false)
  }
  const handleEdit = () => {
    setEditModal(false)
  }
  const openNewC = () => {
    setEditModal(true)
    setCtitle('新增设备台账')
    setdefalutType(1)
  }
  const [deviceInfo, setDeviceInfo] = useState([{
    label: '变压器',
    data: [
      {
        label: '设备名称',
        data: '',
        unit: ''
      }, {
        label: '设备编号',
        data: '',
        unit: ''
      }, {
        label: '规格型号',
        data: '',
        unit: ''
      }, {
        label: '设备类型',
        data: '',
        unit: ''
      },
    ]
  }, {
    label: '温度控制器',
    data: [
      {
        label: '厂家',
        data: '',
        unit: ''
      }, {
        label: '规格型号',
        data: '',
        unit: 'qq'
      },
    ]
  }])
  // const onChangeInput = (event) => {
  //   console.log(event)
  // }

  const [imageUrl, setImageUrl] = useState(''); // 初始图片路径
  // 初始图片路径

  const beforeUpload = async (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      //alert('You can only upload JPG/PNG file!');
      message.warning('图片格式不正确');
    }

    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      //alert('Image must smaller than 2MB!');
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
  // useEffect(() => {
  //   getRoomList()
  // }, [projectId, areaId])
  useEffect(() => {
    //
  }, [areaId, defalutType])
  return (
    <Pagecont bgcolor="transparent" pd="0" >
      <Title>
        <span className="text">设置台账管理</span>
      </Title>
      <Content>
        <div style={{ marginBottom: '16px' }}>
          <Select style={{ width: '264px' }} options={allOptions} value={0} onChange={onChange}
            fieldNames={{ label: 'name', value: 'id', options: 'options' }}>
          </Select>
          {/* <Divider style={{ margin: '0px 32px', height: '32px' }} type="vertical" />
          <Select style={{ width: '264px' }} options={roomList} value={defalutroom} onChange={onChangeRoom}
            fieldNames={{ label: 'name', value: 'id', options: 'options' }}>
          </Select> */}
          <Divider style={{ margin: '0px 32px', height: '32px' }} type="vertical" />
          <Select style={{ width: '264px' }} options={typeList1} value={defalutType} onChange={onChangeType}
            fieldNames={{ label: 'name', value: 'id', options: 'options' }}>
          </Select>
          <Button type='primary' style={{ position: 'absolute', right: '16px' }} onClick={openNewC}>新增台账</Button>
        </div>
        <Usetable
          hbg="#f0f9ff"
          hbc="#515151"
          columns={columns}
          dataSource={tabledata}
          pagination={{
            current: pageInfo.pageNum,
            pageSize: pageInfo.pageSize,
            total: pageInfo.total
          }}
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
                <Select style={{ width: '240px', marginBottom: '16px' }} options={allOptions} defaultValue={0} onChange={onChange}
                  fieldNames={{ label: 'name', value: 'id', options: 'options' }}>
                </Select>
                {/* <p>所属配电房</p>
                <Select style={{ width: '240px', marginBottom: '16px' }} options={roomList} value={defalutroom} onChange={onChangeRoom}
                  fieldNames={{ label: 'name', value: 'id', options: 'options' }}>
                </Select> */}
                <p>设备类型</p>
                <Select style={{ width: '240px', marginBottom: '16px' }} options={typeList} value={defalutType} onChange={onChangeType}
                  fieldNames={{ label: 'name', value: 'id', options: 'options' }}>
                </Select>
                <p>请选择变压器</p>
                <Select style={{ width: '240px', marginBottom: '16px' }} options={deviceList} value={deviceValue} onChange={onChangeDevice}
                  fieldNames={{ label: 'name', value: 'id', options: 'options' }}>
                </Select>
              </div>
              <Divider style={{ margin: '0px 32px', height: '704px' }} type="vertical" />
              <div className='right'>
                <div style={{ width: '231px', height: '704px', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ width: '231px', height: '240px', border: '1px solid #d2d2d2', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '16px' }}>
                    {imageUrl? <Image src={imageUrl} width={180} preview={false} />:
                    <Upload className='uploadBoxNew'
                    listType="picture-card"
                    beforeUpload={beforeUpload}
                    showUploadList={false}
                  >
                   <PlusOutlined style={{ fontSize: '32px',color: '#999' }}/>
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

                  {/* {deviceInfo.map(item => {
                  return <div>
                    <Divider dashed style={{ width: '100%' }}>{item.label}</Divider>
                    <div  className='deviceBox'>{item.data.map(it => {
                      return <div className='deviceItem'>
                        <span style={{width:'120px'}}>{it.label}</span>
                        <Input suffix={it.unit}  style={{width:'241px'}} value={it.data} onChange={()=>onChangeInput} />
                      </div>
                    })}</div>
                  </div>
                })} */}
                  <div>
                    <Divider dashed style={{ width: '100%' }}>{typeName}</Divider>
                    <div className='deviceBox'>
                      {deviceInfoList.map(item=>{return <div className='deviceItem'>
                        <span style={{ width: '120px' }}>{item.title}</span>
                        <Input suffix={''} style={{ width: '241px' }} value={item.data} disabled />
                      </div>})}
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
