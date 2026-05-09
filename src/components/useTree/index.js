import React, { useEffect, useState, useRef, memo, useMemo } from 'react'
import { useSelector } from 'react-redux'
 
 
 
import { energyShare, Monitoring, EnergyPublicRuntime, DMAPartition, Apimethod } from '@api/api'
import { selectProjectId, selectOneLevel, lightlevel } from '@redux/systemconfig.js'
import { message, Input, Tree, Radio, Checkbox, Switch } from 'antd'
 
import Titlelayout from "@com/titlelayout";
import { useLocation } from "react-router-dom"
import {Treecontainer}  from "./style"
 
 
const { Search } = Input;
const { useTree: lightTree } = new Apimethod( //照明管理 手动控制 查询线路
  "get",
  "Light/StreetLightCommon/Tree"
);
const { useTree: AirTree } = new Apimethod( // 空调管理 手动控制 查询线路
  "get",
  "Conditioner/AirConditionerCommon/Tree"
);
const { useQueryElectricClassifys } = new Apimethod( // 能源类型
  "get",
  "/Energy/EnergyClassifyDesigner/QueryElectricClassifys"
);
const { useQuerySpaceTree } = new Apimethod( // 光伏发电--发电统计
  "get",
  "Solar/RuntimeStatistic/QuerySpaceTree"
)
const { QuerySpaceTrees, } = energyShare
const { DMAGetTree } = DMAPartition
const { LineManagerQuery } = Monitoring.LineManager // 线路查询
const { queryEnergyCategoryTree } = EnergyPublicRuntime
import { useGetXY } from "@com/usehandler";
 
export default memo(function Index({ areaId, setTreeId, setLine, setNode, showline = true, scroll = 0, datatype = NaN, energytype, showSearch,
  sty = { bordered: 'y', pv: '16px' },
  allselect = true,  // 全选
  selectobj,
  multiple = true,
  treeName = '',
  title = "",
  mode = null,
  correlation = Number.POSITIVE_INFINITY, // 是否关联 属性
  hv = "32px", // 标题高度
  dispart=false, // 空调管理 --手动控制页面传部分数据，其他页面传全部数据
  ...restprop }) {
  // datatype =0 或 =2
  const levelone = useSelector(selectOneLevel)
  const lightone = useSelector(lightlevel)
 
  const {scrollY} = useGetXY({selector:".ant-tree-list", extraHeight:16})
  const [treeData, setTreeData] = useState([])
  const location = useLocation();
  const { state } = location
 
  const isshow = useMemo(() => {
    const { nested, primary } = state
    return ["report", "public"].includes(nested) && primary == "runtimeEnergy" || ["public"].includes(nested) && primary == "airConditioningManagement"
  }, [state])
  const [checkedKeys, setCheckedKeys] = useState([])
 
  const [keyword, setKeyword] = useState('')
  const projectId = useSelector(selectProjectId)
  const [typeTree, setTypeTree] = useState(0)
 
  //const treekey = datatype === 0 ? 'areaId' : datatype === 2||3 ? 'id' :  typeTree == 0 ? "areaId" : "id";
  const treekey = datatype === 0 ? 'areaId' : [1, 2, 3, 4].includes(datatype) ? 'id' : [5].includes(datatype) ? "key" : typeTree == 0 ? "areaId" : "id";
 
 
  // const treekey =  typeTree == 0 ?  "areaId" : "id" ; 
  const [expandedKeys, setExpandedKeys] = useState([]);
  let treeIdRef = useRef([])
  let postid = useRef(new Set()) //  空调 树
  let pvid = useRef([]) // 光伏发电 --电量统计 树
  const [indeterminate, setIndeterminate] = useState(false);
  const [checked, setChecked] = useState(false)
  const [schecked, setschecked] = useState(correlation)
  const strictyly = schecked == 1
 
  const allSelected = ({ target: { checked } }) => {
    
    if (checked) {
      if (datatype == 5) {
        let areId = Array.from(postid.current)?.map(d => parseInt(d.slice(2)))
        setTreeId(areId)
      } else {
        setTreeId(treeIdRef.current)
      }
      setCheckedKeys(treeIdRef.current)
      setChecked(true)
    } else {
      setCheckedKeys([])
      setTreeId([])
      setChecked(false)
    }
    setIndeterminate(false)
  }
 
  let arr = [], 
  expand = [],  
  airexpand=[], //空调展开
  part=[] ; // 获取部分数据;
  const getpart=(nodes, type, child='nodes')=>{
     console.log('nodes',nodes)
     if (Array.isArray(nodes)) {
       for (let node of nodes) { 
        if (node.type == 2) {
          part.push(node[type] )
        }
         if (node[child] && Array.isArray(node[child]) && node[child]?.length > 0) {
          getpart(node[child], type, child)
         }
       }
     }
  }
  
  const getId = (nodes, type, child = 'nodes') => {
    
    if (Array.isArray(nodes)) { 
      for (let node of nodes) {
        let { level, areaId, id, sn } = node
 
        if (level <= 2 && treekey == 'areaId') {
          expand.push(areaId)
        } else if (treekey == 'id') {
          expand.push(id)
        }
        if (allselect) {
          if (datatype == 5) {   // 空调
            if (node.type == 2 || (node.type == 1 && node[child]?.length > 0)) {
              arr.push(node[type])
               
              if (node.type == 2) {
                postid.current.add(node[type])
              }
              if(node.expand){ //空调展开
                airexpand.push(node[type])
              }
            }
 
          } else if (datatype == 7) { // 光伏发电
            pvid.current.push({ sn, level })
            arr.push(node[type])
          } else {
            arr.push(node[type])
          }
 
        }
        if (!allselect && arr.length == 0) {
          arr.push(nodes[0][type])
        }
        if (mode && node?.[child]?.length > 0) {
          // console.log(node)
          arr.push(node[type])
        }
        if (node[child] && Array.isArray(node[child]) && node[child]?.length > 0) {
          getId(node[child], type, child)
        }
      }
    }
  }
 
  // const fieldNames = datatype === 2 ? { title: 'name', key: treekey, children: 'childs' } : datatype === 3 ? { title: 'name', key: treekey, children: 'children' } : { title: 'name', key: treekey, children: 'nodes' }
 
  const fieldNames = useMemo(() => {
    if (Number.isNaN(areaId)) {
      return { title: "name", key: "id" }  //  一级
    } else {
      return {
        "1": { title: 'name', key: treekey, children: 'nodes' },
        "2": { title: 'name', key: treekey, children: 'childs' },
        "3": { title: 'name', key: treekey, children: 'children' },
        "4": { title: 'name', key: treekey, children: 'nodes' },
        "5": { title: 'name', key: treekey, children: 'nodes' },
        "6": { title: 'energyName', key: "energyId", children: 'childs' },
        "7": { title: 'name', key: "sn", children: 'nodes' },
      }[datatype?.toString()] || { title: 'name', key: treekey, children: 'nodes' }
    }
  }, [datatype, treekey, areaId])
 
 
  //const fieldNames= {title:'name',key: treekey,children:'nodes'}  
 
  //获取树的数据，0 网格, 1 线路, 2 公共能耗分类
  //console.log("expand", expand, "fieldNames", fieldNames)
  const getTreeData = async (name = '') => {
    let idx = Number.isInteger(datatype) ? datatype : typeTree;
    //  console.log(name, idx)
    if (Number.isInteger(datatype) && !energytype) return
    try {
      if (name != keyword) setKeyword(name)
      let params = [{
        projectId,
        areaId,
        areaName: name,
      },
      {
        projectId,
        areaId,
        type: energytype,
        lineName: name
      },
      {
        projectId,
        categoryType: energytype,
        name
      },
        projectId,
      {
        projectId,
        areaId: Number.isNaN(areaId) ? 0 : areaId,
        lineType: 22,
        keyword: name,
      },
      {
        projectId,
        keyword: name,
      },
      {
        projectId,
        type: energytype,
      },
      {
        projectId,
        areaId,
        //  name: name,
      }
      ][idx]
      if (idx == 3 && name) {
        const data = filterTreeIterative(treeData, name)
        treeIdRef.current = arr
        setIndeterminate(false)
        setChecked(true)
        setTreeData(data)
        setCheckedKeys(() => arr);
        setExpandedKeys(expand)
        setTreeId(arr);
        return
      }
      let hander = [QuerySpaceTrees, LineManagerQuery, queryEnergyCategoryTree, DMAGetTree, lightTree, AirTree, useQueryElectricClassifys, useQuerySpaceTree][idx]
 
      /*  if(lineType == "3") {
         hander = QuerySpaceTrees
         params = {
             projectId,
             areaId,
             areaName:name,
           }
       } */
 
      let { success, data, errMsg } = await hander(params)
 
 
      if (success && Array.isArray(data) && data.length > 0) {
        //  console.log(idx)
        let energyDatas = []
        if (datatype == 6) {
          energyDatas = [{
            energyId: 0,
            energyName: "全部",
            parentId: 0,
            childs: data
          }]
        }
        if (mode) {
          let mdata = data.filter(d => mode(d))
          getId(mdata, "id")
        } else {
          switch (idx) {
            case 0:
              getId(data, 'areaId');
              break;
            case 1:
              getId(data, 'id');
              break;
            case 2:
              getId(data, 'id', 'childs')
              break;
            case 3:
              getId(data, 'id', 'children')
              break;
            case 4:
              getId(data, 'id', 'nodes')
              break;
            case 5:
              getId(data, 'key', 'nodes') 
              getpart(data[0]?.nodes?.[0]?.nodes, 'key', 'nodes')//  空调树默认传部分数据
              break;
            case 6:
              getId(energyDatas, 'energyId', 'childs')
              break;
            case 7:
              getId(data, 'sn', 'nodes')
              break;
            default:
              break
 
          }
        }
 
 
        treeIdRef.current = arr
        setIndeterminate(false)
        setChecked(true)
        if (datatype == 6) {
          setTreeData(energyDatas)
          setNode && setNode?.(energyDatas?.[0]) //  获取节点
        } else {
          setTreeData(data)
          setNode && setNode?.(data?.[0]) //  获取节点
        }
 
        setCheckedKeys(() => arr);
        if (datatype == 6) {
          setExpandedKeys(arr)
        } else {
          setExpandedKeys(expand)
        }
 
        if (datatype == 5) { // 空调树   
          setExpandedKeys(airexpand)      
          if (!dispart) {
            let areId = Array.from(postid.current)?.map(d => {
              let id = parseInt(d.slice(2))
  
              return id
            })
  
            setTreeId(areId)
          }else{
          let areId = part?.map(d => {
            let id = parseInt(d.slice(2))
 
            return id
          })
          setCheckedKeys(part)
          console.log("areId", areId)
         
          setTreeId(areId)
          setIndeterminate(true)
          setChecked(false)
        }
        } else if (datatype == 6) { // 分类能耗--能源类型
          setTreeId([0])
        } else if (datatype == 7) {
          setTreeId(pvid.current)
        } else {
          setTreeId(arr);
        }
 
 
 
        /*  if(name) {
             setTreeId(arr)
             setCheckedKeys(arr)
         }else {
          setTreeId([])
          setCheckedKeys([])
         }
       */
      } else {
        treeIdRef.current = []
        setTreeData([])
        setCheckedKeys([])
        // message.error(errMsg || '数据出错')
      }
 
    } catch (error) {
      console.log(error)
    }
 
 
  }
  // 根据区域查询
 
  // 复选框模式
  const onCheck = (data, e) => { // 受控
    console.log(e)
    try {
      if (mode && !mode(e.node)) return message.warning("该线路没有子线路，末级节点没有线损")
      let checked
 
      if (schecked == 1 || restprop?.checkStrictly) {
        checked = data.checked
      } else {
        checked = data;
      }
 
 
 
      let f = checked?.length > 0 && checked?.length < treeIdRef.current?.length
      setIndeterminate(f)
      if (datatype == 5) {
 
        let areId = checked.filter(d => Array.from(postid.current)?.includes(d))?.map(i => parseInt(i.slice(2)))
 
        setTreeId(areId)
      } else if (datatype == 7) {
        pvid.current = [];
        getId(e.checkedNodes, "sn", "nodes")
        setTreeId(pvid.current)
      } else {
        setTreeId(checked)
      }
 
      setCheckedKeys(checked)
      setChecked(checked?.length === treeIdRef.current?.length)
    } catch (error) {
      console.log(error)
    }
 
 
  }
 
  //  单选模式
  const onSelect = (selectedKeys, e) => {   // 损耗分析 不是一级节点而且没有子节点的不需要查询。传入一个函数
    console.log(selectedKeys)
    if (mode) return
    setNode && setNode?.(e.node)
    if (datatype == 5) {
      let areId = selectedKeys.filter(d => Array.from(postid.current)?.includes(d))?.map(i => parseInt(i.slice(2)))
      console.log(areId)
      setTreeId(areId)
    } else {
      setTreeId(selectedKeys)
    }
    setCheckedKeys(selectedKeys)
 
 
  }
 
 
 
  // 树搜索
  const onExpand = (newExpandedKeys, obj) => {
 
    setExpandedKeys(newExpandedKeys);
 
  };
  const Relevancy = (e) => {
    setschecked(e.target.value)
  }
 
  useEffect(() => {
    if (Number.isNaN(areaId) && typeTree == 0) return
    let f = [areaId, projectId].every(v => Number.isInteger(v))
    let f2 = Number.isNaN(areaId) && typeTree == 1
    if (f || f2) {
      getTreeData()
    }
 
 
  }, [areaId, typeTree, datatype, energytype, projectId])
 
 
  const leveloneTree = () => {
    const levels = state?.primary === "lightManagement" ? lightone : levelone
    if (Number.isNaN(areaId) && Array.isArray(levels)) {
      setTreeData(levels)
 
      let arr = levels.map(l => l.id)
 
      treeIdRef.current = arr
      setIndeterminate(false)
      setChecked(true)
 
      setCheckedKeys(arr);
      setExpandedKeys(arr)
      setTreeId(arr);
    }
  }
 
 
  useEffect(() => {  //  用一级区域做为树结构数据
    leveloneTree()
 
 
 
  }, [areaId, levelone, lightone, state?.primary])
 
  const radiosty = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    alignContent: 'center',
  }
  const radiosty2 = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    alignContent: 'center',
 
  }
  const switchLine = (e) => {
    console.log(e.target.value)
    if (Number.isNaN(areaId) && e.target.value == 0) {
      leveloneTree()
    } else {
      setTreeId([])
      setCheckedKeys([])
    }
    setTypeTree(e.target.value)
    setLine(e.target.value)
    setKeyword('')
  }
  const onChange = (e) => {
    setKeyword(e.target.value)
  }
 
  return (
 
    <Titlelayout key="line" layout="flex" bordered={sty.bordered} pv={sty.pv} hv={hv} title={title}>
      <Treecontainer showline={showline.toString()}>
        {treeName ? <div  className='treeName'>{treeName}</div> : null}
        <div className='treebox' >
          {showline && <Radio.Group onChange={switchLine} style={radiosty} value={typeTree}>
            <Radio value={0}>按网格</Radio>
            <Radio value={1}>按线路</Radio>
          </Radio.Group>
          }
          {showSearch && <Search
            placeholder='请输入关键字查询'
            allowClear
            value={keyword}
            onChange={onChange}
            onSearch={getTreeData}
          />}
 
          {allselect && <div  className='allselect'>
            <Checkbox onChange={allSelected} indeterminate={indeterminate} checked={checked}>全选</Checkbox>
            {isshow && <Radio.Group style={radiosty2} onChange={Relevancy} value={schecked}>
              <Radio value={1}>不关联</Radio>
              <Radio value={2}>关联</Radio>
            </Radio.Group>}</div>
          }
          <Tree
            treeData={treeData}
            checkable={multiple}
            onExpand={onExpand}
            expandedKeys={expandedKeys}
            checkedKeys={checkedKeys}
            selectedKeys={checkedKeys}
            onCheck={onCheck}
            onSelect={onSelect}
            fieldNames={fieldNames}
            multiple={multiple}
            checkStrictly={strictyly} // true : 完全受控，父子节点不关联, false : 父子节点关联
            indeterminate={indeterminate}
             height={scrollY}
            {...restprop}
          />
        </div></Treecontainer>
    </Titlelayout>
 
  )
})
 
 
 
 
/**
 * 前端过滤树结构数据(本地过滤)
 */
const filterTreeIterative = (tree, keyword) => {
  if (!keyword) return tree
  const result = []
  const stack = [...tree]
  while (stack.length) {
    const node = stack.pop()
    const isMatch = node.name.includes(keyword)
    if (isMatch) {
      result.push(node)
    } else if (node.children?.length) {
      const filteredChildren = filterTreeIterative(node.children, keyword);
      if (filteredChildren.length) {
        result.push({
          ...node,
          children: filteredChildren
        })
      }
    }
  }
  return result.reverse();
}