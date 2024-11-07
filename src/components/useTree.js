import React, { useEffect, useState, useRef, memo } from 'react'
import { useSelector } from 'react-redux'

import styled from 'styled-components'

import { energyShare, Monitoring, EnergyPublicRuntime } from '@api/api'
import { selectProjectId, selectOneLevel } from '@redux/systemconfig.js'
import { message, Input, Tree, Radio, Checkbox } from 'antd'

import Titlelayout from "@com/titlelayout";

const { Search } = Input;

const { QuerySpaceTrees } = energyShare
const { LineManagerQuery } = Monitoring.LineManager // 线路查询
const { queryEnergyCategoryTree } = EnergyPublicRuntime
const Treebox = styled.div`
       display: grid;
       grid-template-rows: ${(props) => props.showline == "false" ? '32px 32px 1fr' : '32px 32px 32px 556px'};
       row-gap: 16px;
       flex: 1;
       .ant-tree{
        overflow-y: auto;
       }
`

export default memo(function Index({ areaId, setTreeId, setLine, showline = true, datatype = NaN, energytype, sty = { bordered: 'y', pv: '16px' }, ...restprop }) {
  // datatype =0 或 =2
  const [treeData, setTreeData] = useState([])


  const [checkedKeys, setCheckedKeys] = useState([])

  const [keyword, setKeyword] = useState('')
  const projectId = useSelector(selectProjectId)
  const [typeTree, setTypeTree] = useState(0)

  const treekey = datatype === 0 ? 'areaId' : datatype === 2 ? 'id' : typeTree == 0 ? "areaId" : "id";

  // const treekey =  typeTree == 0 ?  "areaId" : "id" ; 
  const [expandedKeys, setExpandedKeys] = useState([]);
  let treeIdRef = useRef([])
  const [indeterminate, setIndeterminate] = useState(false);
  const [checked, setChecked] = useState(false)
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
        arr.push(node[type])
        if (node[child] && Array.isArray(node[child]) && node[child]?.length > 0) {
          getId(node[child], type, child)
        }
      }
    }
  }

  const fieldNames = datatype === 2 ? { title: 'name', key: treekey, children: 'childs' } : { title: 'name', key: treekey, children: 'nodes' }
  //const fieldNames= {title:'name',key: treekey,children:'nodes'}  

  //获取树的数据，0 网格, 1 线路, 2 公共能耗分类

  const getTreeData = async (name = '') => {
    let idx = Number.isInteger(datatype) ? datatype : typeTree;

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
      }

      ][idx]

      let hander = [QuerySpaceTrees, LineManagerQuery, queryEnergyCategoryTree][idx]

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
        console.log(idx)
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
          default:
            break

        }


        treeIdRef.current = arr
        setIndeterminate(false)
        setChecked(true)
        setTreeData(data)
        setCheckedKeys(arr);
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
  const onCheck = ({ checked }) => {
    let f = checked?.length > 0 && checked?.length < treeIdRef.current?.length
    setIndeterminate(f)
    setTreeId(checked)
    setCheckedKeys(checked)
    setChecked(checked?.length === treeIdRef.current?.length)

  }
  // 树搜索
  const onExpand = (newExpandedKeys, obj) => {

    setExpandedKeys(newExpandedKeys);

  };


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

    <Titlelayout key="line" layout="flex" bordered={sty.bordered} pv={sty.pv}>
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
        <Checkbox onChange={allSelected} indeterminate={indeterminate} checked={checked}>全部选中</Checkbox>
        <Tree
          treeData={treeData}
          checkable

          onExpand={onExpand}
          expandedKeys={expandedKeys}
          checkedKeys={checkedKeys}
          onCheck={onCheck}
          fieldNames={fieldNames}
          checkStrictly
          indeterminate={indeterminate}
        />
      </Treebox>
    </Titlelayout>

  )
})



