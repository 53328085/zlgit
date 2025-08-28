import React, { useEffect, useState, useRef, memo, useMemo } from 'react'
import { useSelector } from 'react-redux'

import styled from 'styled-components'

import { energyShare, Monitoring, EnergyPublicRuntime, DMAPartition,Apimethod } from '@api/api'
import { selectProjectId, selectOneLevel } from '@redux/systemconfig.js'
import { message, Input, Tree, Radio, Checkbox, Switch } from 'antd'

import Titlelayout from "@com/titlelayout";
import { useLocation } from "react-router-dom"
const { Search } = Input;
const { useTree:lightTree } = new Apimethod( //照明管理 手动控制 查询线路
  "get",
  "Light/StreetLightCommon/Tree"
);
const { QuerySpaceTrees, } = energyShare
const { DMAGetTree } = DMAPartition
const { LineManagerQuery } = Monitoring.LineManager // 线路查询
const { queryEnergyCategoryTree } = EnergyPublicRuntime
const Treebox = styled.div`
       display: grid;
       grid-template-rows: ${(props) => props.showline == "false" ? '32px 32px 1fr' : '32px 32px 32px 556px'};
       row-gap: 16px;
       flex: 1;
       height: 100%;
       .ant-tree{
       //  overflow-y: auto; 
       }
`

export default memo(function Index({ areaId, setTreeId, setLine, showline = true, datatype = NaN, energytype, sty = { bordered: 'y', pv: '16px' }, allselect = true, selectobj, multiple = true, treeName = '',title="", ...restprop }) {
  // datatype =0 或 =2
  const [treeData, setTreeData] = useState([])

  const location = useLocation();
  const { state } = location
  const isshow = useMemo(() => {
    const { nested, primary } = state
    return nested == "report" && primary == "runtimeEnergy"
  }, [state])
  const [checkedKeys, setCheckedKeys] = useState([])

  const [keyword, setKeyword] = useState('')
  const projectId = useSelector(selectProjectId)
  const [typeTree, setTypeTree] = useState(0)

  //const treekey = datatype === 0 ? 'areaId' : datatype === 2||3 ? 'id' :  typeTree == 0 ? "areaId" : "id";
  const treekey = datatype === 0 ? 'areaId' : (datatype === 2 || datatype === 3 || datatype === 4) ? 'id' : typeTree == 0 ? "areaId" : "id";


  // const treekey =  typeTree == 0 ?  "areaId" : "id" ; 
  const [expandedKeys, setExpandedKeys] = useState([]);
  let treeIdRef = useRef([])
  const [indeterminate, setIndeterminate] = useState(false);
  const [checked, setChecked] = useState(false)
  const [schecked, setschecked] = useState(1)
  const strictyly = schecked == 1

  const allSelected = ({ target: { checked } }) => {

    if (checked) {
      setCheckedKeys(treeIdRef.current)
      setTreeId(treeIdRef.current)
      setChecked(true)
    } else {
      setCheckedKeys([])
      setTreeId([])
      setChecked(false)
    }
    setIndeterminate(false)
  }

  let arr = [], expand = []
  const getId = (nodes, type, child = 'nodes') => {
    if (Array.isArray(nodes)) {
      for (let node of nodes) {
        let { level, areaId, id } = node

        if (level <= 2 && treekey == 'areaId') {
          expand.push(areaId)
        } else if (treekey == 'id') {
          expand.push(id)
        }
        if (allselect) {
          arr.push(node[type])
        }
        if (!allselect && arr.length == 0) {
          arr.push(nodes[0][type])
        }
        if (node[child] && Array.isArray(node[child]) && node[child]?.length > 0) {
          getId(node[child], type, child)
        }
      }
    }
  }

 // const fieldNames = datatype === 2 ? { title: 'name', key: treekey, children: 'childs' } : datatype === 3 ? { title: 'name', key: treekey, children: 'children' } : { title: 'name', key: treekey, children: 'nodes' }
  
 const fieldNames =useMemo(()=> {
  return {
    "2":{ title: 'name', key: treekey, children: 'childs' },
    "3":{ title: 'name', key: treekey, children: 'children' },
    "4":{ title: 'name', key: treekey, children: 'nodes' },
  }[datatype?.toString()] || { title: 'name', key: treekey, children: 'nodes' }
 },[datatype, treekey]) 
 
 
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
        areaId,
        lineType: 22,
        keyword:name,
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
      let hander = [QuerySpaceTrees, LineManagerQuery, queryEnergyCategoryTree, DMAGetTree, lightTree][idx]

      /*  if(lineType == "3") {
         hander = QuerySpaceTrees
         params = {
             projectId,
             areaId,
             areaName:name,
           }
       } */

      const { success, data, errMsg } = await hander(params)
      if (success && Array.isArray(data)) {
      //  console.log(idx)
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
          default:
            break

        }

        treeIdRef.current = arr
        setIndeterminate(false)
        setChecked(true)
        setTreeData(data)
        setCheckedKeys(() => arr);
        setExpandedKeys(expand)
        setTreeId(arr);

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
   // console.log(data, e)
    let checked
    
      if (schecked == 1) {
        checked = data.checked
      } else {
        checked = data;
      }
    


    let f = checked?.length > 0 && checked?.length < treeIdRef.current?.length
    setIndeterminate(f)
    setTreeId(checked)
    setCheckedKeys(checked)
    setChecked(checked?.length === treeIdRef.current?.length)

  }

//  单选模式
const onSelect=(selectedKeys, e)=> {
 //  console.log(selectedKeys)
  // console.log(e)
  setTreeId(selectedKeys)
}



  // 树搜索
  const onExpand = (newExpandedKeys, obj) => {

    setExpandedKeys(newExpandedKeys);

  };
  const Relevancy = (e) => {
    setschecked(e.target.value)
  }

  useEffect(() => {
    let f = [areaId, projectId].every(v => Number.isInteger(v))
    if (f) {
      getTreeData()
    }


  }, [areaId, typeTree, datatype, energytype, projectId])

  const radiosty = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    alignContent: 'center',
    borderBottom: '1px dotted #d7d7d7',
  }
  const radiosty2 = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    alignContent: 'center',

  }
  const switchLine = (e) => {
    setTypeTree(e.target.value)
    setLine(e.target.value)
    setTreeId([])
    setCheckedKeys([])
    setKeyword('')
  }
  const onChange = (e) => {
    setKeyword(e.target.value)
  }

  return (

    <Titlelayout key="line" layout="flex" bordered={sty.bordered} pv={sty.pv} hv="32px" bg="none" title={title}>
      <div style={{height:'750px', overflow:'auto'}}>
        {treeName ? <div style={{ color: '#515151', fontWeight: 'bold', marginBottom: '8px' }}>{treeName}</div> : null}
        <Treebox showline={showline.toString()}>
          {showline && <Radio.Group onChange={switchLine} style={radiosty} value={typeTree}>
            <Radio value={0}>按网格</Radio>
            <Radio value={1}>按线路</Radio>

          </Radio.Group>
          }
          <Search
            placeholder='请输入关键字查询'
            allowClear
            value={keyword}
            onChange={onChange}
            onSearch={getTreeData}
          />

          {allselect && <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>  <Checkbox onChange={allSelected} indeterminate={indeterminate} checked={checked}>全部选中</Checkbox>
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
            onCheck={onCheck}
            onSelect={onSelect}
            fieldNames={fieldNames}
            checkStrictly={strictyly} // true : 完全受控，父子节点不关联, false : 父子节点关联
            indeterminate={indeterminate}  
            {...restprop}         
          />
        </Treebox></div>
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


