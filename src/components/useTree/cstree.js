import React, { useEffect, useState, useRef, memo, useMemo } from "react";
import { useSelector } from "react-redux";

import styled from "styled-components";

import {
  energyShare,
  Monitoring,
  EnergyPublicRuntime,
  DMAPartition,
  Apimethod,
} from "@api/api";
import {
  selectProjectId,
  selectOneLevel,
  lightlevel,
} from "@redux/systemconfig.js";
import { message, Input, Tree, Radio, Checkbox, Switch } from "antd";

import Titlelayout from "@com/titlelayout";
import { useLocation } from "react-router-dom";
import { useTree } from "./api";
import { Treebox } from "./style";
import { useGetId } from "./usehook";
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
  dispart = false, // 空调管理 --手动控制页面传部分数据，其他页面传全部数据
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

  let selected = useRef([]);
  let expanded = useRef([]);
  const getId = (nodes, key, children = "nodes") => {
    if (Array.isArray(nodes)) {
      for (let node of nodes) {
        let { keyStr, id, nodeType } = node;
        node["disableCheckbox"] = nodeType != 3;
        if (nodeType == 3 && selected.current?.length < 3) {
          expanded.current.push(keyStr);
          selected.current.push(id);
        } else if (
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
      };

      let { success, data, errMsg } = await useTree({}, params);

      if (success && Array.isArray(data) && data.length > 0) {
        getId(data, "keyStr", "nodes");

        //  setCheckedKeys(selected.current)
        setExpandedKeys(expanded.current);
        setTreeId(selected.current);
        //   treeIdRef.current = arr
        setIndeterminate(false);

        setTreeData(data);
      } else {
        setTreeData([]);
        setCheckedKeys([]);
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
      console.log(e);
      if (Array.isArray(checkedKeys) && checkedKeys?.length > 2 && e.checked)
        return messageApi.warning("最多选择3个设备", 3);

      const { checkedNodes } = e;

      setTreeId(checkedNodes?.map?.((d) => d.id));
      setCheckedKeys(data.checked);
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
    console.log(e.target.value);
    selected.current = [];
    expanded.current = [];

    setTreeId([]);
    setCheckedKeys([]);

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
      <div
        style={{
          height: scroll ? scroll : "750px",
          overflow: "auto",
          flex: 1,
          scrollbarWidth: "thin",
        }}
      >
        {treeName ? (
          <div
            style={{
              color: "#515151",
              fontWeight: "bold",
              marginBottom: "8px",
            }}
          >
            {treeName}
          </div>
        ) : null}
        <Treebox showline={showline.toString()}>
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
            expandedKeys={expandedKeys}
            checkedKeys={checkedKeys}
            onCheck={onCheck}
            multiple={true}
            fieldNames={fieldNames}
            checkStrictly={true} // true : 完全受控，父子节点不关联, false : 父子节点关联
            indeterminate={indeterminate}
            {...restprop}
          />
        </Treebox>
      </div>
    </Titlelayout>
  );
});
