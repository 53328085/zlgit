import React,{useEffect, useState,useRef,useMemo} from 'react'
import {useSelector } from 'react-redux'
import style from './style.module.less'
import Timenergy from './timenergy'
import Bluecolumn from '@com/bluecolumn';
import Timepercent from './timepercent'
import { energyShare } from '@api/api'
import { Form, Select, DatePicker, message,Input,Tree ,Button } from 'antd'
import moment from 'moment';

export default function Index() {

  const [treeData,setTreeData] =useState([])
  const [treeDatas,setTreeDatas]=useState([])
  const [datetype, setDatetype] = useState(1)
  const datetypeRef= useRef()
  datetypeRef.current = datetype
  const [arealist, setArealist] = useState([{ name: '全部园区', id: 0 }])
  const [planlist, setPlanlist] = useState([{name:'全部班次',id:0}])

  const pieRef = useRef()
  const columnRef =useRef()
  const [selectkeys, setSelectkeys] = useState([])
  const selectRef=useRef()
  selectRef.current=selectkeys
  const [form] =Form.useForm()
  const { Search } = Input;
  const projectId = useSelector(state => state.system.menus.projectId)
  const oneLevel = useSelector(state=>state.system.onelevel)
  const areaOptions =oneLevel.length>0?useMemo(()=>([{name:oneLevel[0].levelName,id:0},...oneLevel]),[oneLevel]):[]
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
       setTreeDatas([...res.data])
    }else{
      message.error(res.errMsg)
    }
    console.log(res)
  }
  //获取日期格式
  const getdateformat = ()=>{
    let date= form.getFieldsValue().datevalue
 
    if(datetypeRef.current===1){
      date = moment(date).format('YYYY-MM-DD')
    }else if(datetypeRef.current ===2){
      date = moment(date).format('YYYY-MM-01')
    }else if(datetypeRef.current ===3){
      date = moment(date).format('YYYY-01-01')
    }
    return date
  }
  //分时能耗
  const getQueryElectric =async ()=>{
    const {plan,area,...formvalue} = form.getFieldValue()
    const date = getdateformat()
    let areaId
      if(area){
        areaId= [area]
      }else{
        areaId= oneLevel?.map(it=>it.id)
      }
    let params = {
      projectId,
      shift:plan?plan:0,
      type:formvalue.datetype,
      date,
      areaIds:areaId,
      lineIds:selectRef.current
    }
   const res = await energyShare.QueryElectric(params)
   if(res.success){
    pieRef.current.setPieData([...res.data.proportion])
    columnRef.current.setList({...res.data.detail})
   }else{
    message.error(res.errMsg)
   }
  }
  //树被选中
  const onCheck=(checkedKeys,e)=>{
    if(Array.isArray(checkedKeys)){
      setSelectkeys([...checkedKeys])
      selectRef.current = [...checkedKeys]
    }
   
    getQueryElectric()
  }
  //园区改变
  const changeArea=(v,option)=>{
    setSelectkeys([])
    selectRef.current=[]
    getQuerySpaceTrees(v,option.name)
    getQueryElectric()
  }
  //日期类型改变
 const changeDateType = (v) => {
    setDatetype(v)
    datetypeRef.current=v
    getQueryElectric()
  }
  //改变日期
  const changeDatevalue = ()=>{
    getQueryElectric()

  }
  const changePlan=()=>{
    getQueryElectric()
  }
  //树筛选
   const filterSearchTree = (nodes, predicate, wrapMatchFn = () => false) => {
    // 如果已经没有节点了，结束递归
    if (!(nodes && nodes.length)) {
      return []
    }
    const newChildren = []
    for (let i = 0; i < nodes.length; i++) {
      const node ={...nodes[i]} 
      // 想要截止匹配的那一层（如果有匹配的则不用递归了，直接取下面所有的子节点）
      if (wrapMatchFn(node) && predicate(node)) {
        newChildren.push(node)
        continue
      }
      console.log(node)
      const subs = filterSearchTree(node.nodes, predicate, wrapMatchFn)
      console.log(subs)
      // 以下两个条件任何一个成立，当前节点都应该加入到新子节点集中
      // 1. 子孙节点中存在符合条件的，即 subs 数组中有值
      // 2. 自己本身符合条件
      if ((subs && subs.length) || predicate(node)) {
        node.nodes = subs || []
        newChildren.push(node)
      }
      console.log('subs')
    }
    return newChildren.length ? newChildren : []
  }
  //搜索数
  const onSearch=(v)=>{
    if(!v){
      setTreeData(()=>{return treeDatas})
      return 
    }
    console.log(treeDatas)
    const filterData = filterSearchTree(treeDatas,(node) => {
      if (node.name.indexOf(v) !== -1) {
          return true;
      }
      return false;
  })
  console.log(filterData)
  setTreeData(()=>{return filterData})
  }
  useEffect(()=>{
    if(oneLevel.length>0){
      getQuerySpaceTrees(0,oneLevel[0]?.levelName)
      getQueryShifts()
      getQueryElectric() 
    }
     
  },[])
  
  return (
    <div className={style.timesharing}>
      <Form
        className={style.mgbt0}
        form={form}
        colon={false}
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
            <Form.Item label={oneLevel[0]?.levelName} name="area">
              <Select
              defaultValue={oneLevel.length>0?0:null}
                style={{ width: 200 }} 
                
                fieldNames={{
                  label: "name",
                  value: "id"
                }}
                options={areaOptions}
                // options={arealist}
                
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
              <DatePicker picker={datetype==1?'date':datetype==2?'month':'year'} onChange={changeDatevalue}></DatePicker>
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
                onChange={changePlan}
                ></Select>
            </Form.Item>
            </div>
        </div>
      </Form>
      <div className={style.sharecontent}>
        <div className={style.radiotree}>
          <Search 
          placeholder='请输入关键字查询' 
          style={{marginBottom:24}} 
          onSearch={onSearch}
          />
          <Tree 
          treeData={treeData} 
          checkable 
          // onExpand={onExpand}
          // expandedKeys={expandedKeys}
          // autoExpandParent={autoExpandParent}
          onCheck={onCheck}
          fieldNames={{title:'name',key:'areaId',children:'nodes'}}
          />
        </div>
        <div className={style.sharingtime}>
        <Bluecolumn name="分时能耗"/>
        <div style={{height:'16px'}}> </div>
        
        <Timenergy ref={columnRef}/>
        </div>
        <div>
        <Timepercent ref={pieRef}/>
        </div>
        
      </div>
      
    </div>
  )
}



