import React,{useEffect, useState,useRef} from 'react'
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


// const treeData = [
//   {
//     title: 'parent 1',
//     key: '0-0',
//     children: [
//       {
//         title: 'parent 1-0',
//         key: '0-0-0',
//         disabled: true,
//         children: [
//           {
//             title: 'leaf',
//             key: '0-0-0-0',
//             disableCheckbox: true,
//           },
//           {
//             title: 'leaf',
//             key: '0-0-0-1',
//           },
//         ],
//       },
//       {
//         title: 'parent 1-1',
//         key: '0-0-1',
//         children: [
//           {
//             title: (
//               <span
//                 style={{
//                   color: '#1890ff',
//                 }}
//               >
//                 sss
//               </span>
//             ),
//             key: '0-0-1-0',
//           },
//         ],
//       },
//     ],
//   },
// ];

const getParentKey = (key, tree) => {
  let parentKey;
  for (let i = 0; i < tree.length; i++) {
    const node = tree[i];
    if (node.nodes) {
      if (node.nodes.some((item) => item.areaId === key)) {
        parentKey = node.key;
      } else if (getParentKey(key, node.nodes)) {
        parentKey = getParentKey(key, node.nodes);
      }
    }
  }
  return parentKey;
};

export default function Index() {
  const [datetype, setDatetype] = useState(1)
  const datetypeRef= useRef()
  datetypeRef.current = datetype
  const [arealist, setArealist] = useState([{ name: '全部园区', id: 0 }])
  const [planlist, setPlanlist] = useState([{name:'全部班次',id:0}])
  const [selectkeys, setSelectkeys] = useState([])
  const selectRef=useRef()
  selectRef.current=selectkeys
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
 
  //获取区域
  const getAreaAll = async () => {
    try {
      const resp = await energyShare.AeraQueryAll(projectId)
      if (resp.success) {
        if (Array.isArray(resp.data)) {
          setArealist([{ name: '全部园区', id: 0 }, ...resp.data])
          form.setFieldValue('area' ,0) 
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
    console.log(date)
    return date
  }
  //分时能耗
  const getQueryElectric =async ()=>{
    const {plan,area,...formvalue} = form.getFieldValue()
    const date = getdateformat()
    let params = {
      projectId,
      shift:plan?plan:0,
      type:formvalue.datetype,
      date,
      areaIds:[area?area:0],
      lineIds:selectRef.current
    }
   const res = await energyShare.QueryElectric(params)
   if(res.success){

   }else{
    message.error(res.errMsg)
   }
  }
  //树被选中
  const onCheck=(checkedKeys,e)=>{
    setSelectkeys([...checkedKeys])
    selectRef.current = [...checkedKeys]
    getQueryElectric()
  }
  //园区改变
  const changeArea=(v,option)=>{
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



  const [treeData, setTreeData] = useState(null)
 
  // const [expandedKeys, setExpandedKeys] = useState([]);
  // const [searchValue, setSearchValue] = useState('');
  // const [autoExpandParent, setAutoExpandParent] = useState(true);
  // const onExpand = (newExpandedKeys)=>{
  //   setExpandedKeys(newExpandedKeys)
  //   setAutoExpandParent(false)
  // }
  // const filtervalues = (data,v)=>{
  //  const arr= data.filter(it=>{
  //   console.log(it)
  //     if(it.title.includes(v)){
  //        return true
  //     }else{
  //      if(filtervalues(it.children,v).length>0){
  //       return true
  //      } 
  //     }
  //   })
  //   return arr
  // }
  //搜索数
  const onSearch=(v)=>{
    // console.log(v)
    // const list =  filtervalues(treeData,v)
    console.log(list)
    // const newExpandedKeys = treeData.map(it=>{
    //   if(it.name.indexOf(v)>-1){
    //     return getParentKey(v.areaId,treeData)
    //   }
    //   return null
    // }).filter((item, i, self) => item && self.indexOf(item) === i)
    // setExpandedKeys(newExpandedKeys);
    // setAutoExpandParent(true);

  }
  useEffect(()=>{
    getAreaAll()
    getQueryShifts()
    getQueryElectric()   
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
        <Timenergy/>
        </div>
        <Timepercent/>
      </div>
      
    </div>
  )
}
