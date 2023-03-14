import React, {useState, useRef, useEffect, useCallback} from 'react'
import { useRequest } from 'ahooks';
import style from './style.module.less';
import { Select,DatePicker,Table,Button, message, Radio } from 'antd';
import SearchTree from './searchTree'
import columns,  { onDesc} from './columns';
import dayjs from 'dayjs'
import {useSelector} from 'react-redux'
import {selectProjectId} from '@redux/systemconfig.js'
import { AreaSetting , eneryShift, Monitoring, energyQuota, EnergyLossRuntime} from '@api/api.js'
import {utils, writeFile} from 'xlsx'
import dashLine from '@imgs/line.png'
//dayjs bug
import weekday from "dayjs/plugin/weekday"
import localeData from "dayjs/plugin/localeData"
dayjs.extend(weekday)
dayjs.extend(localeData)

export default function Index() {
  const tableRef = useRef()
  const lineRef = useRef()
  const { Option } = Select;
  const [tableData, setTableData] = useState([])
  const [messageApi, contextHolder] = message.useMessage();
  const messageContent = (type, content) => {
    messageApi.open({
      type,
      content,
    })
  }
  const projectId = useSelector(selectProjectId);
  const { QueryAllArea } = AreaSetting
  const { queryShifts } = eneryShift
  const { LineManager: { LineManagerQuery } } = Monitoring
  const { querySpaceTrees } = energyQuota
  const { queryByLine, queryByBuilding } = EnergyLossRuntime
  //园区
  const [areaList, setAreaList] = useState([])
  const [defaultArea, setDefaultArea] = useState()
  const [areaId,setAreaId] = useState(0)
  const getAreaData = () =>{
    return QueryAllArea (projectId, 1).then(res=> {
      let {success, data} = res
      if(success && data){
        setAreaList(data)
        setDefaultArea(data[0].id)
        setAreaId(data[0].id)
      }else{
        messageContent('error', res.errMsg)
      }
    })
  }
  const { data:AreaData } = useRequest(getAreaData,{
    onSuccess:(result,params) => {}
  })
  const changeArea = (value) => {
    setAreaId(value)
  }
  //能源类型
  const [energyType, setEnergyType] = useState(1)
  const changeEnergyType = val => {
    setEnergyType(val)
    if(value =='line'){
      lineRef.current.reSet()
    }
  }
  //日期选择
  const [type, setType] = useState('year')
  let time = new Date()
  let year = time.getFullYear()
  let month = time.getMonth() + 1 
  month = month > 9 ? month : '0' + month
  let day = time.getDate()
  day = day > 9 ? day : '0' + day
  const [date, setDate] = useState(year.toString()+'-01-01')
  const changeDateType = val => {
    setType(val)
    if(val == 'year') setDate(year.toString()+'-01-01')
    if(val == 'month') setDate(year+'-'+month+'-01')
    if(val == 'date') setDate(year+'-'+month+'-'+day)
  }
  const changeDate = (date, dateString) => {
    if(type == 'year') setDate(dateString+'-01-01')
    if(type == 'month') setDate(dateString+'-01')
    if(type == 'date') setDate(dateString)
  }
  const PickerWithType = useCallback(({ type, onChange }) => {
    if (type === 'date') return <DatePicker allowClear={false}  picker={type} value={dayjs(date, 'YYYY-MM-DD')} format={'YYYY-MM-DD'} onChange={onChange} />;
    if (type === 'month') return <DatePicker allowClear={false}  picker={type} value={dayjs(date, 'YYYY-MM')} format={'YYYY-MM'} onChange={onChange} />;
    if (type === 'year') return <DatePicker allowClear={false}  picker={type} value={dayjs(date, 'YYYY')} format={'YYYY'} onChange={onChange} />;
  },[date])
  //班次
  const [shift, setShift] = useState(0)
  const changeShift = val => {
    setShift(val)
  }
  const [shiftList, setShiftList] = useState([])
  const getShifts = () => {
    return queryShifts(projectId).then(res => {
      let { success, data } = res
      if(success){
        setShiftList(data)
      }else{
        messageContent('error', res.errMsg)
      }
    })
  }
  const { data:shiftsData } = useRequest(getShifts,{
    onSuccess:(result,params) => {}
  })

  //树
  const options = [
    {
      label: '按回路',
      value: 'line',
    },
    {
      label: '按建筑',
      value: 'building',
    },
  ];
  const [value, setValue] = useState('line');
  const onChange = ({target:{value}})=>{
    setValue(value)
    setPageNum(1)
  }
  //回路
  const getLineTree = () => {
    let params = {
      projectId,
      type: energyType,
      areaId
    }
    return LineManagerQuery(params).then(res => {
      let { success, data } = res
      if(success){
        if(!data){
          messageContent('warning','当前园区不存在回路！')
          setLineTreeData([])
        }else{
          setLineTreeData(data)
        }
      }else{
        messageContent('error', res.errMsg)
      }
    })
  }
  const {run:runLine} = useRequest(getLineTree, {
    manual:true
  })
  //建筑
  const getBuildingTree = () => {
    return querySpaceTrees(projectId, areaId, '').then(res => {
      let { success, data } = res
      if(success){
        if(!data){
          messageContent('warning','当前园区不存在建筑！')
          setBuildTreeData([])
        }else{
          setBuildTreeData(data)
        }
      }else{
        messageContent('error', res.errMsg)
      }
    })
  }
  const {run:runBuilding} = useRequest(getBuildingTree, {
    manual:true
  })

  useEffect(()=>{
    if(areaId == 0) {return;}
    if(value == 'line'){
      runLine()
    }
    if(value == 'building'){
      runBuilding()
    }
  },[areaId, value, energyType])

  //树数据
  const[lineTreeData, setLineTreeData] = useState([])
  const fieldLineNames = {
    title:'name',
    key: 'id',
    children: 'nodes'
  }
  const[buildTreeData, setBuildTreeData] = useState([])
  const fieldBuildNames = {
    title:'name',
    key: 'areaId',
    level: 'level',
    children: 'nodes'
  }

  //查询表格
  const [pageNum, setPageNum] = useState(1)
  const [total, setTotal] = useState(0)
  const pageSize = 20
  //按线路
  const [lineParams, setLineParams] = useState([])
  let lineList = []
  const getLineFromChild = values => {
    setPageNum(1)
    setLineParams(values)
  }
  const getLineTable = () => {
    let params = {
      projectId,
      areaId,
      shiftId: shift,
      energyType,
      type: type == 'year'? 3 : type =='month' ? 2: 1,
      date,
      selectLineIds: lineParams
    }
    return queryByLine(pageNum, pageSize, params).then(res => {
      let {success, data} = res 
      if(success){
        if(data){
          setTableData(data)
        }else{
          setTableData([])
        }
      }else{
        messageContent('error', res.errMsg)
      }
    })
  }
  const {run:queryLineTable} = useRequest(getLineTable, {
    manual: true
  })
  useEffect(()=> {
    if(areaId == 0) return;
    if(value == 'line'){
      setSelectBuildIds([])
      setPageNum(1)
      queryLineTable()
    }
  },[value, lineParams, areaId, shift, energyType, type, date])

  //按建筑
  const [selectBuildIds, setSelectBuildIds] = useState([])
  const getBuildFromChild = values => {
    setPageNum(1)
    setSelectBuildIds(values)
  }
  const getBuildTable = () => {
    let params = {
      projectId,
      areaId,
      shiftId: shift,
      energyType,
      type: type == 'year'? 3 : type =='month' ? 2 : 1,
      date,
      selectLineIds: selectBuildIds
    }
    return queryByBuilding(pageNum, pageSize, params).then(res => {
      let {success, data} = res 
      if(success){
        if(data){
          setTableData(data)
        }else{
          setTableData([])
        }
      }else{
        messageContent('error', res.errMsg)
      }
    })
  }
  const {run:queryBuildTable} = useRequest(getBuildTable, {
    manual: true
  })
  useEffect(()=> {
    if(areaId == 0) return;
    if(value == 'building'){
      setLineParams([])
      setPageNum(1)
      queryBuildTable()
    }
  },[value, selectBuildIds, areaId, shift, energyType, type, date])

  //导出数据
  const exportData = () => {
    const params = { raw: true };
    const workbook = utils.book_new(); // 新建工作簿   
    let table = tableRef.current  
    const ws = utils.table_to_sheet(
      // 新建工作表
      table,
      params
    );
    utils.book_append_sheet(workbook, ws, "Sheet1"); // 把工作表添加到工作簿
    let file =  "xlsx";
    writeFile(workbook, '损耗分析.xlsx', { bookType: file }); // 下载
  }

  //分页
  const paginationProps = {
    current: pageNum, //当前页码
    pageSize, // 每页数据条数
    showTotal: () => (
      <span>总共{total}项</span>
    ),
    total, // 总条数
    onChange: page => handlePageChange(page), //改变页码的函数
    hideOnSinglePage: false,
    showSizeChanger: false,
  }
  const handlePageChange = (page) => {
    setPageNum(page)
    if(value == 'line'){
      queryLineTable()
    }
    if(value == 'building'){
      queryBuildTable()
    }
  }

  return (
    <div>
      {contextHolder}
      <div className={style.header}>
        <span style={{marginLeft: '16px',marginRight: 16}}>园区选择</span>
        <Select
          placeholder="请选择园区"
          size="middle"
          key={defaultArea}
          defaultValue={defaultArea}
          style={{width: '200px'}}
          onChange={changeArea}
        >
          {areaList.map(item => {
            return <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>
          })}
        </Select>
        <div className={style.line}></div>
        <span>能源类型</span>
        <Select
          placeholder="全部类型"
          size="middle"
          style={{width: '126px', marginLeft: '16px'}}
          defaultValue={1}
          onChange={changeEnergyType}
        >
          <Option value={1}>电</Option>
          <Option value={2}>水</Option>
          <Option value={3}>燃气</Option>
        </Select> 
        <div className={style.line}></div>
        <Select
          size="middle"
          style={{width: '80px', marginLeft:16, marginRight: '16px'}}
          defaultValue={"year"}
          onChange={changeDateType}
        >
          <Option value="date">日</Option>
          <Option value="month">月</Option>
          <Option value="year">年</Option>
        </Select>
        <PickerWithType 
          style={{width: '160px', marginRight: '16px'}} 
          type={type} 
          onChange={changeDate}
        ></PickerWithType>
        <Select
          size="middle"
          style={{width: '112px', marginLeft:16, marginRight: '16px'}}
          defaultValue={0}
          onChange={changeShift}
        >
          <Option value={0}>全部班次</Option>
          {shiftList.map(item =>{
            return <Option key={item.id} value={item.id}>{item.name}</Option>
          })}
        </Select> 
        <Button style={{marginRight:12,marginLeft:'auto', borderRadius:4, width:96 }} size='middle' onClick={exportData}>导出</Button>
      </div>
      <div className={style.content}>
        <div className={style.contentLeft}>
          <Radio.Group className={style.radioCss} options={options} onChange={onChange} value={value} />
          <img src={dashLine} className={style.radioLine}></img>
          {value == 'line' ? <SearchTree ref={lineRef} treeData={lineTreeData} fieldNames={fieldLineNames} getValues={getLineFromChild}></SearchTree> : null}
          {value == 'building' ? <SearchTree treeData={buildTreeData} fieldNames={fieldBuildNames} getValues={getBuildFromChild}></SearchTree> : null}
        </div>
        <div className={style.contentRight}>
          <div className={style.rightTitle}>损耗分析</div>
          <Table ref={tableRef} size='small' bordered style={{margin:'16px'}} dataSource={tableData} columns={columns} rowKey='Id' pagination={paginationProps}/>;
        </div>
      </div>
    </div>
  )
}
