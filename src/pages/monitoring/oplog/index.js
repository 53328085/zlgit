import React, { useState, useEffect } from 'react'
import { useSelector, useStore, useDispatch } from 'react-redux'
import { nanoid } from '@reduxjs/toolkit'
import { useRequest, useToggle, useAntdTable } from 'ahooks'
import { GetLogOperation, OpLog } from '@api/api.js'
import { Form, DatePicker, Input, Button, Table, Pagination, Select } from 'antd'
import { SearchOutlined, CaretUpOutlined, CaretDownOutlined } from '@ant-design/icons';
import Pagecount from '@com/pagecontent'
import UserTable from '@com/useTable'
import CustContext from '@com/content.js'
import { selectProjectId, selectOneLevel } from '@redux/systemconfig.js'
import imgurl from './images/index.js'
import style from './style.module.less'
import moment from 'moment'
const { RangePicker } = DatePicker;

export default function Index() {
  const projectId = useSelector(selectProjectId)
  const areaList = useSelector(selectOneLevel)
  const [defaultArea, setDefaultArea] = useState(areaList[0].id)
  let [areaId, setAreaId] = useState(1)
  const changeArea = (value) => {
    setAreaId(value);
  };
  const submit = (data, dataString) => {
    console.log(dataString)
  }
  const changeType = () => {

  }
  let [state, setstate] = useState(1)
  const changeTab = val => {
    setstate(val)
  }
  const exportExecel = () => {
    tableLoadRef.current.download()
  }//数据导出
  const columnsLog = [
    {
      title: '操作时间',
      dataIndex: 'sn',
      key: 'sn',
      id: 'id'
    },
    {
      title: '操作用户',
      dataIndex: 'category',
      key: 'category',
      id: 'id'
    },
    {
      title: '终端IP',
      dataIndex: 'category',
      key: 'category',
      id: 'id'
    },
    {
      title: '操作类型',
      dataIndex: 'category',
      key: 'category',
      id: 'id'
    },
    {
      title: '操作结果',
      dataIndex: 'category',
      key: 'category',
      id: 'id'
    },
  ];
  const columnsLogD = [
    {
      title: '设备编号',
      dataIndex: 'sn',
      key: 'sn',
      id: 'id'
    },
    {
      title: '设备类型',
      dataIndex: 'category',
      key: 'category',
      id: 'id'
    },
    {
      title: '设备型号',
      dataIndex: 'category',
      key: 'category',
      id: 'id'
    },
    {
      title: '安装地址',
      dataIndex: 'category',
      key: 'category',
      id: 'id'
    },
    {
      title: '操作时间',
      dataIndex: 'category',
      key: 'category',
      id: 'id'
    },
    {
      title: '描述',
      dataIndex: 'category',
      key: 'category',
      id: 'id'
    },
    {
      title: '设备状态',
      dataIndex: 'category',
      key: 'category',
      id: 'id'
    },
    {
      title: '操作者',
      dataIndex: 'category',
      key: 'category',
      id: 'id'
    },
  ];
  let [dataSourceLog, setdataSourceLog] = useState([])
  let [dataSourceLogD, setdataSourceLogD] = useState([])
  let [pageNumD, setpageNumD] = useState(1)
  let [totalalarmD, settotalalarmD] = useState(1)
  const onChangePageLogD = (page, pageSize) => {
    console.log(page)
    setpageNumD(page)
  }
  let [pageNum, setpageNum] = useState(1)
  let [totalalarm, settotalalarm] = useState(1)
  const onChangePageLog = (page, pageSize) => {
    console.log(page)
    setpageNum(page)
  }
  const onChangeValue = e => {
    //inputValue = e.target.value
  }//输入框改变值
  const onSearchList = () => {
    //params.alike = inputValue
    // getOverview()
  }//点击查询按钮
  return (
    <div className={style.main}>
      <div className={style.header}>
        <Button className={state == 1 ? style.tabon : style.taboff} onClick={() => { changeTab(1) }}>操作日志</Button>
        <Button className={state == 2 ? style.tabon : style.taboff} onClick={() => { changeTab(2) }}>设备日志</Button>
      </div>
      <div className={style.body}>
        {state == 1 ? <div className={style.mainBox}>
          <div className={style.bodyHeader}>
            <RangePicker className={style.dataPick} separator='至' onCalendarChange={submit} format="YYYY-MM-DD HH:mm:ss" />
            <Button style={{ width: 96, height: 32, color: '#FFF', marginLeft: 16 }} type="primary" onClick={changeType} icon={<SearchOutlined />}> 查询</Button>
            <Button style={{ width: 96, backgroundColor: '#FFF', color: '#515151', position: 'absolute', right: 0 }} size="middle" onClick={() => { exportExecel() }}>导出</Button>
          </div>
          <img src={imgurl.line} className={style.timeline} ></img>
          <Table columns={columnsLog} dataSource={dataSourceLog} rowKey={columnsLog => columnsLog.id} className={style.alarmTable} bordered></Table>
          <Pagination className={style.pageNumD} size="small" current={pageNum} total={totalalarm} defaultPageSize={18} onChange={onChangePageLog} />
        </div> : <div className={style.mainBox}>
          <div className={style.bodyHeader}>
            <span style={{ marginLeft: "16px", marginRight: 16 }}>{areaList[0]?.levelName || '园区'}选择</span>
            <Select
              placeholder="请选择园区"
              size="middle"
              key={defaultArea}
              defaultValue={defaultArea}
              style={{ width: "200px" }}
              onChange={changeArea}
            >
              {areaList.map((item) => {
                return (
                  <Select.Option key={item.id} value={item.id}>
                    {item.name}
                  </Select.Option>
                );
              })}
            </Select>
            <div style={{ marginLeft: 32, marginRight: 32, height: 32, borderLeft: "1px dashed #515151" }} ></div>
            <span style={{ marginRight: 16 }}>设备查询</span>
            <Input placeholder='请输入设备编号/安装地址' style={{ width: 240, marginLeft: 16 }} size='middle' onChange={onChangeValue}></Input>
            <Button size='middle' style={{ width: 80, backgroundColor: 'rgb(245,247,250)',borderLeft:'none' }} onClick={() => { onSearchList() }}>查询</Button>
            <div style={{ marginLeft: 32, marginRight: 32, height: 32, borderLeft: "1px dashed #515151" }} ></div>
            <RangePicker className={style.dataPick} separator='至' onCalendarChange={submit} format="YYYY-MM-DD HH:mm:ss" />
            <Button style={{ width: 96, height: 32, color: '#FFF', marginLeft: 16 }} type="primary" onClick={changeType} icon={<SearchOutlined />}> 查询</Button>
            <Button style={{ width: 96, backgroundColor: '#FFF', color: '#515151', position: 'absolute', right: 0 }} size="middle" onClick={() => { exportExecel() }}>导出</Button>
          </div>
          <img src={imgurl.line} className={style.timeline} ></img>
          <Table columns={columnsLogD} dataSource={dataSourceLogD} rowKey={columnsLogD => columnsLogD.id} className={style.alarmTable} bordered></Table>
          <Pagination className={style.pageNumD} size="small" current={pageNumD} total={totalalarmD} defaultPageSize={18} onChange={onChangePageLogD} />
        </div>}
      </div>
    </div>
  )
}
