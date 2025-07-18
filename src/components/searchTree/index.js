import React, { useState, useEffect, Fragment, useMemo } from "react";
import style from "./style.module.less";
import { Input, Tree, Empty } from "antd";
import dashLine from "@imgs/line.png";
import { cloneDeep } from "lodash";

export default function Index(props) {
  // const { getValues, getTreeKey} = props;
  console.log(props.treeData)
  const { getValues } = props;
  const [checkedKeys, setCheckedKeys] = useState([])
  const { Search } = Input;
  let dataList = [];

  let arr = [], seracharr = [];
  let stair = props.treeData?.map(t => t.areaId); // 一级id

  const getId = (nodes, array) => {
    console.log(array)
    if (Array.isArray(nodes)) {
      for (let node of nodes) {
        array?.push(node.areaId)
        if (node.childs && Array.isArray(node.childs) && node.childs.length > 0) {
          getId(node.childs)
        }
      }


    }

  }
  const getbyname = (data, name) => {

    if (Array.isArray(data) && data?.length > 0) {
      for (let node of data) {
        let id = node.areaId
        if (node.name.includes(name)) seracharr.push(id)
        if (stair.includes(id)) {
          let childs = data.find(d => d.areaId == id)?.childs
          getId(childs, seracharr)
        } else {
          if (Array.isArray(node.childs) && node.childs?.length > 0) getbyname(node.childs, name)
        }

      }
    }

  }
  useEffect(() => {
    if (!Array.isArray(props.treeData)) return;
    getId(props.treeData, arr);
    setCheckedKeys(arr);
    getValues(arr)
  }, [props.treeData])
  const generateList = (data) => {
    if (!Array.isArray(data)) return;
    for (let i = 0; i < data.length; i++) {
      const node = data[i];
      dataList.push({
        [props.fieldNames.key]: node[props.fieldNames.key],
        [props.fieldNames.title]: node[props.fieldNames.title],
      });
      if (node[props.fieldNames.children]) {
        generateList(node[props.fieldNames.children]);
      }
    }
  };
  generateList(props.treeData);

  const getParentKey = (key, tree) => {
    let parentKey;
    for (let i = 0; i < tree.length; i++) {
      const node = tree[i];
      if (node[props.fieldNames.children]) {
        if (
          node[props.fieldNames.children].some(
            (item) => item[props.fieldNames.key] === key
          )
        ) {
          parentKey = node[props.fieldNames.key];
        } else if (getParentKey(key, node[props.fieldNames.children])) {
          parentKey = getParentKey(key, node[props.fieldNames.children]);
        }
      }
    }
    return parentKey;
  };

  const [state, setstate] = useState({
    expandedKeys: [],
    searchValue: "",
    autoExpandParent: false,
  });

  const onExpand = (expandedKeys) => {
    setstate({
      expandedKeys: expandedKeys,
      searchValue: "",
      autoExpandParent: false,
    });
  };

  const onSearch = (value) => {
    setCheckedKeys([])
    getbyname(props.treeData, value);


    setCheckedKeys(seracharr);
    getValues(seracharr)
    const expandedKeys = dataList
      .map((item) => {
        if (item[props.fieldNames.title].indexOf(value) > -1) {
          return getParentKey(item[props.fieldNames.key], props.treeData);
        }
        return null;
      })
      .filter((item, i, self) => item && self.indexOf(item) === i);
    console.log(expandedKeys)
    setstate({
      expandedKeys: expandedKeys,
      searchValue: value,
      autoExpandParent: true,
    });
  };

  const { searchValue, expandedKeys, autoExpandParent } = state;
  //搜索结果重新渲染Treenode，存在一个问题，如果搜索功能和编辑树功能同时需要的话，树组件中
  //tree={loop(treeData)}会造成编辑树功能无法重新渲染树，node中input渲染不出来
  const loop = (data) =>

    data.map((item) => {
      const index = item[props.fieldNames.title].indexOf(searchValue);
      const beforeStr = item[props.fieldNames.title].substr(0, index);
      const afterStr = item[props.fieldNames.title].substr(
        index + searchValue.length
      );
      const title =
        index > -1 ? (
          <span>
            {beforeStr}
            <span style={{ color: "#f50" }}>{searchValue}</span>
            {afterStr}
          </span>
        ) : (
          <span>{item[props.fieldNames.title]}</span>
        );
      if (item[props.fieldNames.children]) {
        return {
          [props.fieldNames.title]: title,
          [props.fieldNames.key]: item[props.fieldNames.key],
          [props.fieldNames.children]: loop(item[props.fieldNames.children]),
        };
      }

      return {
        [props.fieldNames.title]: title,
        [props.fieldNames.key]: item[props.fieldNames.key],
      };
    });

  const onCheck = (checkedKeys, info) => {
    // console.log(info,checkedKeys)
    // getTreeKey(checkedKeys)
    console.log(checkedKeys, info)

    setCheckedKeys(checkedKeys)
    // getValues(checkedKeys);
    getValues(info.checkedNodesPositions)
  };

  return (
    <div className={style.contentLeft}>
      {props.title ? <div className={style.title}>{props.title}</div> : null}
      <Search
        placeholder="请输入关键字查询"
        size="middle"
        onSearch={onSearch}
        style={{
          width: "100%",
        }}
      />
      <img src={dashLine} className={style.radioLine}></img>
      {(Array.isArray(props.treeData) && props.treeData?.length > 0) ? (
        <Tree
          style={{ height: "600px", overflow: "auto", fontSize: 16 }}
          checkable
          defaultExpandAll={true}
          onExpand={onExpand}
          expandedKeys={expandedKeys}
          autoExpandParent={autoExpandParent}
          treeData={loop(props.treeData)}
          onCheck={onCheck}
          fieldNames={props.fieldNames}
          checkedKeys={checkedKeys}
        />
      ) : (
        <Empty style={{ marginTop: 120 }}></Empty>
      )}
    </div>
  );
}
