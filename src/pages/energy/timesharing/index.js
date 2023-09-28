import React,{useEffect, useState,useRef,useMemo} from 'react'
import {useSelector } from 'react-redux'
import style from './style.module.less'
import styled from 'styled-components'
import CustContext from "@com/content.js";
import { drawEcharts } from "@com/useEcharts";
import Timenergy from './timenergy'
import Bluecolumn from '@com/bluecolumn';
import Timepercent from './timepercent'
import { energyShare } from '@api/api'
import {selectProjectId, selectOneLevel} from '@redux/systemconfig.js'
import { Form, Select, DatePicker, message,Input,Tree ,Button, Space } from 'antd'
import moment from 'moment';
import UserSearch from "@com/useSerach";
const { Search } = Input;
const {Item} = Form
const {QuerySpaceTrees, queryArea, queryLine} = energyShare
const Mainbox = styled.div`
  && {
    display: grid;
    grid-template-columns: 296px 952px 1fr;
    column-gap: 16px;
  }

`
export default function Index() {
  const [form] =Form.useForm()
  const [treeData,setTreeData] =useState([])
  const [treeDatas,setTreeDatas]=useState([])
 
  const onelevel = useSelector(selectOneLevel)


  const pieRef = useRef()
  const columnRef =useRef()
  const [selectkeys, setSelectkeys] = useState([])
  const selectRef=useRef()
  selectRef.current=selectkeys
 
  const projectId = useSelector(selectProjectId)
 
 
  const getTime = (date, type)=> {
    let time
        if(type == 0) {
          time=date.format('YYYY-MM-DD')
      }else if(type == 1) {
          time = data.startOf("month").format('YYYY-MM-DD')
      }else if(type == 2) {
          time = data.startOf("year").format('YYYY-MM-DD')
      }
    return time
  }
 
 
  //获取树
  const getQuerySpaceTrees= async (e)=>{
    try {
      const {area, date, type} = form.getFieldsValue()
      console.log(onelevel)
      const areaName = onelevel.find(l => l.id == area).name
     
      let params ={
        projectId,
        areaId: area,
        areaName,
      }
      const {success, data} = await QuerySpaceTrees(params)
   
      if(success && Array.isArray(data)){
         setTreeData([...res.data])
         setTreeDatas([...res.data])
      }else{
        message.error(res.errMsg)
      }
    } catch (error) {
      
    }
   
    
  }
 
  //分时能耗
/*   const getQueryElectric =async ()=>{
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
    pieRef.current.setAnalysisDes(res.data.analysisDes)
    columnRef.current.setList({...res.data.detail})
   }else{
    message.error(res.errMsg)
   }
  } */
  //树被选中
  const onCheck=(checkedKeys,e)=>{
    if(Array.isArray(checkedKeys)){
      setSelectkeys([...checkedKeys])
      selectRef.current = [...checkedKeys]
    }
   
  //  getQueryElectric()
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
     if(onelevel?.length <1) return;
     getQuerySpaceTrees()
  },[onelevel])
  const [timetype, setTimetype] = useState(0) // 日、月、年 0,1,2
 
  
  const picker= ['date', 'month', 'year'][timetype];
  const timechange = (e) => {
    setTimetype(e);
   // getData()
 }
  const CustView = () => {
    
     return (
        <Space size={16} style={{marginLeft: "auto"}}>
         <Item  name="type" initialValue={0}>
            <Select style={{width: '80px'}}   options={[
             {value: 0, label: '日'},
             {value: 1, label: '月'},
             {value: 2, label: '年'},
            ]}
            onChange={timechange}
            ></Select>
         </Item>
 
         <Item nostyle name="date"  initialValue={moment(new Date(), 'YYYY-MM-DD')}>
           <DatePicker placeholder="请选择日期" picker={picker}  style={{width: '160px'}} />
         </Item>       
       </Space>
       
     )
   }
  return (
    <CustContext.Provider
    value={{
      form,
      custview: <CustView />,
      handler: getQuerySpaceTrees,
     
    }}
  >
    <div style={{display: 'grid', gridTemplateRows: '48px 1fr', rowGap: '16px', flex: 1}}>
     <UserSearch></UserSearch>
     
      <Mainbox>
        <div className={style.radiotree}>
          <Search 
          placeholder='请输入关键字查询' 
          style={{marginBottom:24}} 
          onSearch={onSearch}
          />
          <Tree 
          treeData={treeData} 
          checkable 
         
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
        
      </Mainbox>
      
    </div>
    </CustContext.Provider>
  )
}



