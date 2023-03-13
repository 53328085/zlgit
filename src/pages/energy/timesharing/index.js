import React,{useEffect, useState} from 'react'
import  SelectForm from '@com/useSelect'
import {useSelector } from 'react-redux'
import style from './style.module.less'
import RadioTree from '@com/radiotree'
import Timenergy from './timenergy'
import Bluecolumn from '@com/bluecolumn';
import Timepercent from './timepercent'
import { energyShare } from '@api/api'
import { Form, Select, DatePicker, message,Input,Tree  } from 'antd'
import moment from 'moment';
export default function Index() {
  const [datetype, setDatetype] = useState()
  const [arealist, setArealist] = useState([{ name: '全部园区', id: 0 }])
  const [planlist, setPlanlist] = useState([{name:'全部班次',id:0}])
  
  const [treeData, setTreeData] = useState(null)
  const [expandedKeys, setExpandedKeys] = useState([]);
  const [autoExpandParent, setAutoExpandParent] = useState(true);


  const [form] =Form.useForm()
  const { Search } = Input;
  const projectId = useSelector(state => state.system.menus.projectId)
  const typeoptions = [{
    label: '日',
    value: 1
  }, {
    label: '月',
    value: 2
  }, {
    label: '年',
    value: 3
  }]
  const energyoptions = [{
    label: '电',
    value: 1
  }]
  const divcss = {
    width:96,
    height:32,
    textAlign: 'center',
    lineHeight: '32px',
    border: '1px solid #d7d7d7',
    borderRadius: 4,
    cursor: 'pointer'
  }
  const onExpand = (newExpandedKeys) => {
    setExpandedKeys(newExpandedKeys);
    setAutoExpandParent(false);
  };
  const changeDateType = (v) => {
    setDatetype(v)
  }
  //获取区域
  const getAreaAll = async () => {
    try {
      const resp = await energyShare.AeraQueryAll(projectId)
      if (resp.success) {
        if (Array.isArray(resp.data)) {
          setArealist([{ name: '全部园区', id: 0 }, ...resp.data])
          form.setFieldsValue({area:{ label: '全部园区', value: 0 }})
          getQuerySpaceTrees(0,"全部园区")
        } else {
          setArealist([])
        }
      } else {
        message.error(resp.errMsg)
      }
    } catch (e) {
      console.log(e)
    }
  }
  //获取班次
  const getQueryShifts = async () => {
    const res = await energyShare.QueryShifts(projectId)
    if (res.success) {
      if (Array.isArray(res.data)) {
        setPlanlist([{name:'全部班次',id:0},...res.data])
        form.setFieldValue('plan',0)
      } else {
        setPlanlist([])
      }
    } else {
      message.error(res.errMsg)
    }
  }
  //获取树
  const getQuerySpaceTrees=async (areaId,areaName)=>{
    let params ={
      projectId,
      areaId,
      areaName,
    }
    const res = await energyShare.QuerySpaceTrees(params)
    if(res.success){
      setTreeData([...res.data])
    }else{
      message.error(res.errMsg)
    }
    console.log(res)
  }
  //园区改变
  const changeArea=(v,option)=>{
    console.log(v,option)
    getQuerySpaceTrees(v,option.name)
  }
  //搜索数
  const onSearch=(v)=>{
    console.log(v)
    treeData.map(it=>{
      // if(it.name.indexOf(v))
    })
  }
  useEffect(()=>{
    getAreaAll()
    getQueryShifts()
  
  },[])
  return (
    <div className={style.timesharing}>
      {/* <SelectForm isplan={true} isset={false}/> */}
      <Form
        className={style.mgbt0}
        form={form}
        initialValues={
          {
            energytype: 1,
            datetype: 1,
            datevalue: moment(new Date()),
          }
        }
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 16px', background: '#fff' }}>
          <div style={{ display: 'flex', }}>
            <Form.Item label="园区选择" name="area">
              <Select
                style={{ width: 200 }} 
                fieldNames={{
                  label: "name",
                  value: "id"
                }}
                options={arealist}
                onChange={changeArea}
              ></Select>
            </Form.Item>
            <Form.Item label="能源类型" style={{ marginLeft: 64 }} name="energytype">
              <Select style={{ width: 112 }} options={energyoptions} disabled></Select>
            </Form.Item>
            <Form.Item name='datetype'>
              <Select style={{ width: 80,marginLeft: 32 }} options={typeoptions} onChange={changeDateType}></Select>
            </Form.Item>
            <Form.Item style={{ marginLeft: 16 }} name="datevalue">
              <DatePicker picker={datetype} onChange={(value,option)=>{   console.log(moment(value).format('YYYY-MM-DD'))}}></DatePicker>
            </Form.Item>
            <Form.Item style={{ marginLeft: 16 }} name="plan">
              <Select
                style={{ width: 102 }}
                fieldNames={{
                  label: "name",
                  value: "id"
                }}
                options={
                  planlist
                }
                
                ></Select>
            </Form.Item>
            </div>
            <div style={divcss}>导出</div>
        </div>
      </Form>
      <div className={style.sharecontent}>
        {/* <RadioTree/> */}
        <div className={style.radiotree}>
          <Search 
          placeholder='请输入关键字查询' 
          style={{marginBottom:24}} 
          onSearch={onSearch}
          onExpand={onExpand}
          expandedKeys={expandedKeys}
          autoExpandParent={autoExpandParent}
          />
          <Tree treeData={treeData} checkable fieldNames={{title:'name',key:'areaId',children:'nodes'}}/>
        </div>
        <div className={style.sharingtime}>
        <Bluecolumn name="分时能耗"/>
        <div style={{height:'16px'}}> </div>
        <Timenergy/>
        </div>
        <Timepercent/>
      </div>
      
    </div>
  )
}
