import React from "react";
import style from './style.module.less'
import { Button, Tree } from "antd";
import dashed from '@imgs/dashed.png'
import { cloneDeep } from "lodash";

export default function Water (props) {
  const { getValues } = props;
  //线路图
  const {TreeNode} = Tree;
  const treeData = props.treeData ? cloneDeep(props.treeData) : [];

  const nodeTitle = {
    display: 'flex',
    position: 'relative',
    cursor:'default',
    lineHeight:'32px'
  }
  const nodeAction = {
    position: 'absolute',
    right: 0,
    width:'268px',
    display:'flex',
    justifyContent:'flex-end',
    fontSize:'14px',
  }
  const renderTreeNodes = (data) => {
    data = cloneDeep(data);
    let nodeArr = data.map((item) => {
        let name = cloneDeep(item.energyName);
        item.energyName = (
            <div style={nodeTitle}>
                <span style={ item.parentId == 0 ? { fontSize: 16 }:{} }>{item.energyName}</span>
                <div style={nodeAction}>
                    {item.parentId == 0 ? <span style={{ color:'#237ae4', cursor:'pointer', textDecoration:'underline' }} onClick={()=>addSon(item)}>新增子项</span> : null}
                    <span style={{ color:'#237ae4',  cursor:'pointer', textDecoration:'underline', marginLeft: 32, marginRight: 32}} onClick={()=>edit(name, item.energyId)}>编辑</span>
                    {item.parentId != 0 ? <span style={{ color:'#237ae4', cursor:'pointer', textDecoration:'underline', marginRight: 32}} onClick={()=>settings(name, item.energyId)}>配置</span> : <div style={{width:28,marginRight: 32}}></div>}
                    <span style={{ color:'#f33', cursor:'pointer', textDecoration:'underline' }} onClick={()=>deleteRecord(item)}>删除</span>
                </div>
            </div>
        )

        if(item.childs && item.childs.length > 0){
            return (
                <TreeNode title={item.energyName} key={item.energyId} dataRef={item}>
                    {renderTreeNodes(item.childs)}
                </TreeNode>
            )
        }
        return <TreeNode title={item.energyName} key={item.energyId}></TreeNode>
    })
    return nodeArr;
  }

  const addSon = (item)=> {
    let values = {
        data: item,
        tag: 'addSon'
    }
    getValues(values)
  }
  const edit = (name, id)=> {
    let values = {
        data: {
            energyName:name,
            energyId:id
        },
        tag: 'edit'
    }
    getValues(values)
  }
  const settings = (name, id) => {
    let values = {
        data: {
            energyName:name,
            energyId:id
        },
        tag: 'settings'
    }
    getValues(values)
  }
  const deleteRecord = (item)=> {
    let values = {
        data: item,
        tag: 'delete'
    }
    getValues(values)
  }
  const addParent = () => {
    let values = {
        data: {},
        tag: 'addParent'
    }
    getValues(values)
  }
  const importData = () => {
    let values = {
        data: {},
        tag: 'importData'
    }
    getValues(values)
  }
    
    return (
        <div className={style.classfyContent}>
            <div className={style.headerTitle}>
                <span>{props.title}</span>
                <div className={style.headerButton}>
                    <Button type="primary" size="middle" style={{width: 112, marginRight: 16, height: 36}} onClick={()=>addParent()}>新增能耗分类</Button>
                    <Button type="primary" size="middle" style={{width: 112,  height: 36}} onClick ={()=> importData()}> 批量导入</Button>
                </div>
            </div>
            <img className={style.dashedLine} src={dashed}></img>
            <div className={style.mainContent}>
                <div className={style.classifyTree}>
                    { treeData.length>0 ? <Tree defaultExpandedKeys={[treeData[0].energyId.toString()]} blockNode selectable={false}>{renderTreeNodes(treeData)}</Tree> : null}
                </div>
            </div>
        </div>
    )
}