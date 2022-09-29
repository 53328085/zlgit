import React from "react";
import style from './style.module.less'
import { Tree } from "antd";

export default function Index(){
    const treeData = [
        {
          title: 'parent 1',
          key: '0-0',
          children: [
            {
              title: 'parent 1-0',
              key: '0-0-0',
              children: [
                {
                  title: 'leaf',
                  key: '0-0-0-0',
                },
                {
                  title: 'leaf',
                  key: '0-0-0-1',
                },
              ],
            },
            {
              title: 'parent 1-1',
              key: '0-0-1',
            },
          ],
        },
    ];

    const onSelect = (selectedKeys, info) => {
        console.log('selected', selectedKeys, info);
    };
    
    const onCheck = (checkedKeys, info) => {
        console.log('onCheck', checkedKeys, info);
    };

    const titleRender = (data)=>{
        return <div style={{color:'#f00',width:'100%'}}>{data.title}
            <span style={{marginLeft:'auto'}}>新增</span><span>编辑</span><span>配置</span><span>删除</span>
        </div>
    }

    return (
        <div className={style.main}>
            <div className={style.header}>
                <div className={style.addButton}>新增能耗分类</div>
                <div className={style.batchImport}>批量导入配置</div>
            </div>
            <div className={style.content}>
                <div className={style.treeList}>
                <Tree
                    checkable
                    defaultExpandedKeys={['0-0-0', '0-0-1']}
                    defaultSelectedKeys={['0-0-0', '0-0-1']}
                    defaultCheckedKeys={['0-0-0', '0-0-1']}
                    onSelect={onSelect}
                    onCheck={onCheck}
                    treeData={treeData}
                    titleRender={titleRender}
                />
                </div>
            </div>
        </div>
    )
}