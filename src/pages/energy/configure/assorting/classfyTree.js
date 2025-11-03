import React from "react";
import style from './style.module.less'
import { Button, Tree, Divider, Space } from "antd";
import {useTranslation} from "react-i18next"
import { cloneDeep } from "lodash";
import {useSelector} from 'react-redux'
import {publishState} from '@redux/systemconfig.js'
import Titlelayout from '@com/titlelayout'
import {AllExportButton, CustButton,TreeBtn} from "@com/useButton"
 
export default function Water (props) {
  const {t} = useTranslation(["button"])
  const isPublish = useSelector(publishState)
  console.log(isPublish)
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
                { isPublish ? null : <Space style={{position:"absolute", right: 0}}>
                 { item.level<5 ?  <TreeBtn   onClick={()=>addSon(item)} wh="auto" style={{padding: "0 8px"}} text="addSubitem" /> : null }
                    <TreeBtn onClick={()=>edit(name, item.energyId)} wh="60px" text="edit" /> 
                  {/*   {item.parentId != 0 ? <span style={{ color:'#237ae4', cursor:'pointer', textDecoration:'underline', marginRight: 32}} onClick={()=>settings(name, item.energyId)}>配置</span> : <div style={{width:28,marginRight: 32}}></div>} 比工的需求 一级也需要配置项*/}
                   <TreeBtn onClick={()=>settings(name, item.energyId)} wh="auto" style={{padding: "0 8px"}} text="configure" />  
                   
                    <TreeBtn type="3" onClick={()=>deleteRecord(item)} wh="60px" text="delete" /> 
                </Space> }
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
  const Title = (
    <div style={{display: 'flex',justifyContent: "space-between", alignContent: "center"}}>
      <span style={{lineHeight: '36px'}}>{props.title}</span>
      { isPublish ? null : <Space size={16}>
                    <CustButton wh="auto" onClick={()=>addParent()}>{t("button:addEnergyConsumeCategory")}</CustButton>
                    <AllExportButton onClick ={()=> importData()} /> 
                </Space> }
    </div>
  )
    return (
        <Titlelayout title= {Title}  layout="flex" dr="column" pv="0" bordered="n" rad="0px">
            <div className={style.mainContent}>
                <div className={style.classifyTree}>
                    { treeData.length>0 ? <Tree defaultExpandedKeys={[treeData[0].energyId.toString()]} blockNode selectable={false}>{renderTreeNodes(treeData)}</Tree> : null}
                </div>
            </div>
        </Titlelayout>
    )
}