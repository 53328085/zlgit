import React, { useState, useEffect } from 'react'
import {useSelector, useStore, useDispatch} from 'react-redux'
import UseHeader from '@com/useHeader'
import { Input, Button, Select, Radio, Pagination,Form,Table } from 'antd'
import { SearchOutlined } from '@ant-design/icons';
import style from './style.module.less'
import Icard from './card'
import imgurl from './images/index.js'
import { SettingManage } from '@api/api.js'
import { selectProjectId } from '@redux/systemconfig.js'

export default function Index(props) {
  const projectId = useSelector(selectProjectId)
  let [areaId, setAreaId] = useState(1)
  const headerProps = {
    isEnergy: false,//能耗类型
    isDate: false,//日期
    isShift: false,//班次
    isTab: false,//能耗、费用radioButton
    isSearch: false,//查询按钮
    isExport: false,//导出按钮
    //export: exportData //导出调用方法
  }
  let arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
  const showTotal = (total) => `共 ${total} 条记录`;
  const columns = [
    {
      title: '网关编号',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '网关型号',
      dataIndex: 'age',
      key: 'age',
    },
    {
      title: '网络连接',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: '联网方式',
      key: 'tags',
      dataIndex: 'address',
    },
    {
      title: '子设备',
      dataIndex: 'address',
      key: 'action',
    },
    {
      dataIndex: 'address',
      title: '所属项目',
      key: 'action',
    },
    {
      title: '安装地址',
      dataIndex: 'address',
      key: 'action',
    },
    {
      title: '更新时间',
      dataIndex: 'address',
      key: 'action',
    },
  ];
  const data = [
    {
      key: '1',
      name: 'John Brown',
      age: 32,
      address: 'New York No. 1 Lake Park',
    },
    {
      key: '2',
      name: 'Jim Green',
      age: 42,
      address: 'London No. 1 Lake Park',
    },
    {
      key: '3',
      name: 'Joe Black',
      age: 32,
      address: 'Sydney No. 1 Lake Park',
    },
  ];
  const [isCard,setisCard]=useState(true)//卡片模式true或列表模式false
  const getFromChild = data => {
    console.log(data.areaId)//园区id
    setAreaId(data.areaId)
  }
  const onChangeValue = e => {

  }//输入框改变值
  const onSearchList = () => {

  }//点击查询按钮
  const handleChange = () => {

  }//网关型号选择
  const handleChangeState = () => {

  }//网关状态选择
  const changeTab = val => {
  console.log(val.target.value)
  setisCard(val.target.value=='card'?true:false)
  }//切换卡片列表模式

  const handleExport = () => {

  }//数据导出
  const gotoDetail=(data)=>{
console.log(data)
  }//点击跳转网关详情
  useEffect(() => {
    
  }, [])
  return (
    <div>
      <UseHeader {...headerProps} getValues={getFromChild}></UseHeader>
      <div className={style.bottom}>
        <div className={style.bottomTab}>
          <span>网关查询</span><Input size="middle" placeholder='输入网关编号/安装地址' style={{ width: '260px', marginLeft: 16 }} onChange={onChangeValue} />
          <Button style={{ width: 80, backgroundColor: '#F5F7FA', color: '#515151' }} size="middle" onClick={() => { onSearchList() }}>查询</Button>
          <div style={{ marginLeft: 32, marginRight: 32, height: 32, borderLeft: "1px dashed #515151" }} ></div>
          <span>网关型号</span>
          <Select
            defaultValue="全部型号"
            style={{
              width: 200, marginLeft: 16
            }}
            onChange={handleChange}
            options={[
              {
                value: 0,
                label: '全部型号',
              },
              {
                value: 1,
                label: 'Lucy',
              },
              {
                value: 2,
                label: 'yiminghe',
              },
              {
                value: 3,
                label: 'Disabled',
              },
            ]}
          />
          <div style={{ marginLeft: 32, marginRight: 32, height: 32, borderLeft: "1px dashed #515151" }} ></div>
          <span>网关状态</span>
          <Select
            defaultValue={'全部' + '(129)'}
            style={{
              width: 200, marginLeft: 16
            }}
            onChange={handleChangeState}
            options={[
              {
                value: 0,
                label: '全部' + '(129)',
              },
              {
                value: 1,
                label: '正常' + '(125)',
              },
              {
                value: 2,
                label: '失联' + '(14)',
              },
            ]}
          />
          <div className={style.radioBox}>
            <Radio.Group onChange={changeTab} defaultValue="card" buttonStyle="solid">
              <Radio.Button style={{ width: '96px', marginLeft: 16, textAlign: 'center', }} value="card">卡片模式</Radio.Button>
              <Radio.Button style={{ width: '96px', textAlign: 'center', }} value="list">列表模式</Radio.Button>
            </Radio.Group>
            <Button style={{ width: 80, backgroundColor: '#F5F7FA', color: '#515151', marginLeft: 16 }} size="middle" onClick={() => { handleExport() }}>数据导出</Button>
          </div>
        </div>
        <div style={{ marginTop: 16, marginBottom: 16, width: 1649, borderTop: "1px dashed #515151" }} ></div>
        {isCard?<div className={style.cardBox}>
          {arr.map((item, index) => {
            return <div  key={index} onClick={()=>{gotoDetail(index)}}><Icard img={imgurl.category} title={'设备总数'} value={10} /></div>
          })}
        </div>:<div className={style.tableHead}><Table columns={columns} dataSource={data} pagination={false}/></div>}
        <Pagination className={style.pageNum} size="small" total={50} showTotal={showTotal} defaultPageSize={12} />
      </div>

    </div>
  )
}
