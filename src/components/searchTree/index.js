import React, { useState, useEffect, Fragment } from "react";
import style from "./style.module.less";
import { Input, Tree, Empty } from "antd";
import dashLine from "@imgs/line.png";
import { cloneDeep } from "lodash";

export default function Index(props) {
  // const { getValues, getTreeKey} = props;
  const { getValues } = props;
  const { Search } = Input;
  let dataList = [];
  const generateList = (data) => {
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

  const onSearch = (e) => {
    const { value } = e.target;
    const expandedKeys = dataList
      .map((item) => {
        if (item[props.fieldNames.title].indexOf(value) > -1) {
          return getParentKey(item[props.fieldNames.key], props.treeData);
        }
        return null;
      })
      .filter((item, i, self) => item && self.indexOf(item) === i);
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
    getValues(info.checkedNodesPositions);
  };

  return (
    <div className={style.contentLeft}>
      {props.title ? <div className={style.title}>{props.title}</div> : null}
      <Search
        placeholder="请输入关键字查询"
        size="middle"
        onChange={onSearch}
        style={{
          width: 256,
        }}
      />
      <img src={dashLine} className={style.radioLine}></img>
      {props.treeData.length > 0 ? (
        <Tree
          style={{ height: "636px", overflow: "auto", fontSize: 16 }}
          checkable
          defaultExpandAll={true}
          onExpand={onExpand}
          expandedKeys={expandedKeys}
          autoExpandParent={autoExpandParent}
          treeData={loop(props.treeData)}
          onCheck={onCheck}
          fieldNames={props.fieldNames}
        />
      ) : (
        <Empty style={{ marginTop: 120 }}></Empty>
      )}
    </div>
  );
}
