import React, { useEffect, useState, useRef, memo } from "react";
import { useSelector } from "react-redux";


import {
  selectProjectId,

} from "@redux/systemconfig.js";
import { message, Input, Tree, Radio,  } from "antd";

import Titlelayout from "@com/titlelayout";
 
import { useNodeTree } from "./api";
import { Treecontainer } from "./style";
import { useGetXY } from "@com/usehandler";
const { Search } = Input;

export default memo(function Index({
  areaId,
  setTreeId,
  setLine,
  setNode,
  showline = true,
  scroll = 0,
  energytype,
  showSearch,
  sty = { bordered: "y", pv: "16px" },
  allselect = true, // 全选
  selectobj,
  
  treeName = "",
  title = "分类列表",
  mode = null,
  correlation = Number.POSITIVE_INFINITY, // 是否关联 属性
  hv = "32px", // 标题高度
  parameter={
    params:{
      showDevice:true
    },
    limit:3
  },
  ...restprop
}) {
  const [messageApi, contextHolder] = message.useMessage();

  const [treeData, setTreeData] = useState([]);

  const [checkedKeys, setCheckedKeys] = useState([]);

  const [keyword, setKeyword] = useState("");
  const projectId = useSelector(selectProjectId);
  const [typeTree, setTypeTree] = useState(0);

  const [expandedKeys, setExpandedKeys] = useState([]);

  const [indeterminate, setIndeterminate] = useState(false);
  const {scrollY} = useGetXY({selector:".ant-tree-list", extraHeight:16})

  let selected = useRef([]);
  let expanded = useRef([]);
  let keys = useRef([]);
  const getId = (nodes, key, children = "nodes") => {
    if (Array.isArray(nodes)) {
      for (let node of nodes) {
        let { keyStr, id, nodeType } = node;
      
        expanded.current.push(keyStr);
      
        if(Number.isInteger(parameter.limit)) {
           node["disableCheckbox"] = nodeType != 3;
           if (nodeType == 3 && selected.current?.length <parameter.limit) {
             keys.current.push(keyStr);
             selected.current.push(id);
           }
        }else {
          keys.current.push(keyStr);
           selected.current.push(id);
        }
       if (
          node[children] &&
          Array.isArray(node[children]) &&
          node[children]?.length > 0
        ) {
          getId(node[children], key, children);
        }
      }
    }
  };

  const fieldNames = { title: "name", key: "keyStr", children: "nodes" };

  const getTreeData = async (name = "") => {
    try {
      if (name != keyword) setKeyword(name);
      let params = {
        projectId,
        queryType: typeTree,
        areaIds: [areaId],
        keyword: name,
        showDevice: true,
        meterType: energytype,
        ...parameter.params
      };

      let { success, data, errMsg } = await useNodeTree({}, params);

      if (success && Array.isArray(data) && data.length > 0) {
        selected.current = [];
        keys.current=[];
        expanded.current = [];
        getId(data, "keyStr", "nodes");
         
         setCheckedKeys(keys.current)
        setExpandedKeys(expanded.current);
        setTreeId(selected.current);
        //   treeIdRef.current = arr
        setIndeterminate(false);

        setTreeData(data);
      } else {
        setTreeData([]);
        setCheckedKeys([]);
        setTreeId([])
        // message.error(errMsg || '数据出错')
      }
    } catch (error) {
      console.log(error);
    }
  };
  // 根据区域查询

  // 复选框模式
  const onCheck = (data, e) => {
    try {
     
      if (Array.isArray(checkedKeys) && checkedKeys?.length > 2 && e.checked)
        return messageApi.warning("最多选择3个设备", 3);

      const { checkedNodes } = e;
      let ids = checkedNodes?.map?.((d) => d.id)
      setTreeId(ids);
      setCheckedKeys(data.checked);
      selected.current = ids
    } catch (error) {
      console.log(error);
    }
  };

  // 树搜索
  const onExpand = (newExpandedKeys, obj) => {
    setExpandedKeys(newExpandedKeys);
  };

  useEffect(() => {
    let f = [areaId, projectId, energytype, typeTree].every((v) =>
      Number.isInteger(Number.parseInt(v)),
    );

    if (f) {
      getTreeData();
    }
  }, [areaId, typeTree, energytype, projectId]);

  const radiosty = {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    alignContent: "center",
  };

  const switchLine = (e) => {
     
   

   // setTreeId([]);
    //setCheckedKeys([]);

    setTypeTree(e.target.value);
    setLine(e.target.value);
    setKeyword("");
  };
  const onChange = (e) => {
    setKeyword(e.target.value);
  };

  return (
    <Titlelayout
      key="line"
      layout="flex"
      bordered={sty.bordered}
      pv={sty.pv}
      hv={hv}
      title={title}
    >
      {contextHolder}
      <Treecontainer showline={showline.toString()}>
        {treeName ? (
          <div className="treeName">
            {treeName}
          </div>
        ) : null}
        <div className="treebox" >
          {showline && (
            <Radio.Group
              onChange={switchLine}
              style={radiosty}
              value={typeTree}
            >
              <Radio value={0}>按网格</Radio>
              <Radio value={1}>按线路</Radio>
            </Radio.Group>
          )}
          {showSearch && (
            <Search
              placeholder="请输入关键字查询"
              allowClear
              value={keyword}
              onChange={onChange}
              onSearch={getTreeData}
            />
          )}

          <Tree
            treeData={treeData}
            checkable={true}
            onExpand={onExpand}
            classNames="cstree"
            expandedKeys={expandedKeys}
            checkedKeys={checkedKeys}
            
            onCheck={onCheck}
            multiple={true}
            fieldNames={fieldNames}
            checkStrictly={true} // true : 完全受控，父子节点不关联, false : 父子节点关联
            indeterminate={indeterminate}
            height={scrollY}
            {...restprop}
          />
        </div>
      </Treecontainer>
    </Titlelayout>
  );
});
