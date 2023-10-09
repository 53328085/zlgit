import React,{useEffect, useState,useRef,useMemo} from 'react'
import {useSelector } from 'react-redux'
import style from './style.module.less'
import styled from 'styled-components'
import CustContext from "@com/content.js";
import { drawEcharts } from "@com/useEcharts";
import Timenergy from './timenergy'
import Bluecolumn from '@com/bluecolumn';
import Timepercent from './timepercent'
import { energyShare, Monitoring } from '@api/api'
import {selectProjectId, selectOneLevel, selectOneLevelDefaultId} from '@redux/systemconfig.js'
import { Form, Select, DatePicker, message,Input,Tree ,Button, Space, Radio } from 'antd'
import moment from 'moment';
import UserSearch from "@com/useSerach";
import Titlelayout from "@com/titlelayout";
import UseTable from '@com/useTable'
const { Search } = Input;
const {Item} = Form
const {QuerySpaceTrees, queryArea, queryLine} = energyShare
const {LineManagerQuery} = Monitoring.LineManager // 线路查询
const Mainbox = styled.div`
  && {
    display: grid;
    grid-template-columns: 296px 952px 1fr;
    column-gap: 16px;
    .treebox {
       display: grid;
       grid-template-rows: 32px 32px 604px;
       row-gap: 32px;
    }
    .rightlayout {
      display: grid;
      grid-template-rows: 504px 1fr;
      row-gap: 16px;
    }
  }

`
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

const numberformat = (n) => {
   let num = parseFloat(n)
   if(num > 0) {
    return <span>&#43;{n}</span>
   }else if(num < 0) {
    return <span>&#45;{n}</span>
   }else {
    return <span>{n}</span>
   }

}

export default function Index() {
  const [form] =Form.useForm()
  const [treeData,setTreeData] =useState([])
  const [treeDatas,setTreeDatas]=useState([])
 
  const onelevel = useSelector(selectOneLevel)
  const areaId = useSelector(selectOneLevelDefaultId)

  const pieRef = useRef()
  const stackRef =useRef()
  const [selectkeys, setSelectkeys] = useState([])
  const selectRef=useRef()
  selectRef.current=selectkeys
 
  const projectId = useSelector(selectProjectId)
  const [typeTree, setTypeTree] = useState(1)
  
  const treekey =  typeTree == 1 ? "id" : "areaId"
  //const [detail, setDetail] = useState([])
  //const [momYoy, setMomYoy] = useState([])
 // const [proportion, setProportion] = useState([])

   const [datas, setDatas] = useState({})
 
   const columns = [
    {
        title: '分时能耗',
        dataIndex: 'name',
        key: 'name',
        onCell: ()=> ({style: {textAlign: "center" }}),
    },
    {
      title: '用电量',
      dataIndex: 'value',
      key: 'value',
     
    },
    {
      title: '环比',
      dataIndex: 'mom',
      key: 'mom',
      render: numberformat,
    },
    {
      title: '同比',
      dataIndex: 'yoy',
      key: 'yoy',
      render: numberformat,
    },
    
  ]
  //获取树的数据， 1 线路 2 网格
 const getTreeData= async ()=>{
    try {
      const areaName = onelevel.find(l => l.id == areaId).name
     
      let params =typeTree == 1 ? {
        projectId,
        areaId,
        type:0,
      } : typeTree == 2 ? {
        projectId,
        areaId,
        areaName,
      } : {}
      let hander = ['', LineManagerQuery, QuerySpaceTrees][typeTree]
      const {success, data} = await hander(params)
      if(success && Array.isArray(data)){
         setTreeData(data)
         setTreeDatas(data)
      }else{
        message.error(res.errMsg)
      }
      getDataByLine()
    } catch (error) {
      console.log(error)
    }
   
    
  } 
 // 根据区域查询
 const getDataByLine = async (ids=[]) => {
    try {
      let {type, date} = form.getFieldsValue()
      let time = getTime(type, date)
      let key = typeTree == 1 ? 'selectIds' : 'areaIds'
       let params = {
        projectId,
        shift: 0,
        type,
        date: time,
        [key]: ids
       }
      let hander = ['', queryLine, queryArea][typeTree]
      let {success, data} = await hander(params)
      if(success && data.constructor === Object) {
          let {detail = [], momYoy=[], proportion = []} = data
          setDatas({...data})
          // setDetail(detail)
           //setMomYoy(momYoy)
          // setProportion(proportion)
      }else {
        setDatas({})
          //setDetail([])
         // setMomYoy([])
         // setProportion([])
      }
    } catch (error) {
      
    }
   
     
 } 
 
useEffect(() => {
  let {detail = [], momYoy=[], proportion = []} = datas
  console.log(proportion)
  drawEcharts(pieRef.current, {
      pieData: { data: proportion, total: 100 },
      type: 3,
      legend: {
        bottom: 0,
        top: 'auto',
        itemGap: 5
      },
      grid: {
        bottom: 20
      }
  
  })



}, [datas])

 
 


 
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
     if(!areaId) return;
     getTreeData()
     
  },[areaId, typeTree])
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
   const radiosty = {
    display: 'grid',   
    gridTemplateColumns: '1fr 1fr',
    alignContent: 'center',
    borderBottom: '1px dotted #d7d7d7',
   }
  const switchLine = (e) => {
    
    setTypeTree(e.target.value)
  }
  const boxsty = {
    height: "100%",
    paddingTop: '16px',
  }
  return (
    <CustContext.Provider
    value={{
      form,
      custview: <CustView />,
    }}
  >
    <div style={{display: 'grid', gridTemplateRows: '48px 1fr', rowGap: '16px', flex: 1}}>
     <UserSearch></UserSearch>
     
      <Mainbox>
        <Titlelayout>
        <div className="treebox">
        <Radio.Group onChange={switchLine} style={radiosty} value={typeTree}>
          <Radio value={1}>按线路</Radio>
          <Radio value={2}>按网格</Radio>
         
        </Radio.Group>
          <Search 
          placeholder='请输入关键字查询' 
          onSearch={onSearch}
          />
          <Tree 
          treeData={treeData} 
          checkable 
         
          onCheck={onCheck}
          fieldNames={{title:'name',key: treekey,children:'nodes'}}
          />
        </div>
        </Titlelayout>
         <Titlelayout title="分时能耗">
               <div ref={stackRef} style={boxsty}></div>
         </Titlelayout>
         <div className='rightlayout'>
           <Titlelayout title="分时占比">
              <div ref={pieRef} style={boxsty}></div>
           </Titlelayout>
           <Titlelayout title="分时能耗同环比">
               <div style={boxsty}>
              <UseTable 
                columns={columns} 
                dataSource={datas.momYoy}
               

              ></UseTable>
              </div>
           </Titlelayout>
         </div>

      
        
      </Mainbox>
      
    </div>
    </CustContext.Provider>
  )
}



