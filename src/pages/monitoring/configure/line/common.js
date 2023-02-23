import React, { useEffect, useState } from 'react'
import { Divider, Select, Tree, Row, Col } from 'antd'
import commonstyle from './commonstyle.module.less'
let treeData = [
    {
        title: ' 1',
        key: '0-0',
        children: [
            {
                title: 'parent 1-0',
                key: '0-0-0',
                children: [
                    {
                        title: 'leaf',
                        key: '0-0-0-0',
                        disableCheckbox: true,
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
                children: [
                    {
                        title: (
                            <span
                                style={{
                                    color: '#1890ff',
                                }}
                            >
                                sss
                            </span>
                        ),
                        key: '0-0-1-0',
                    },
                ],
            },
        ],
    },
];
export default function Common() {
    const [tdata, setTdata] = useState([...treeData])
    const titlelinecss={
        background: '#ecf5ff',
        height: 32,
        lineHeight: '32px',
        
    }
    const maptreeData = (data) => {
        return data.map(it => {
            if (!it.children) {
                console.log(it)
                return {
                    ...it,
                    title: <Treeline tree={it}></Treeline>
                }
            } else {
                return {
                    ...it,
                    title: <Treeline tree={it}></Treeline>,
                    children: maptreeData(it.children)
                }
            }
        })
    }

    useEffect(() => {
        setTdata(() => maptreeData(tdata))

    }, [])

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Select style={{ width: 264 }}></Select>
                <div className={commonstyle.divBtn}>新增主线</div>
            </div>
            <Divider style={{ borderColor: '#d7d7d7', margin: '16px 0' }} dashed></Divider>
            <div style={{display:'flex',margin: '16px 0 24px 0'}}>
                <div style={{...titlelinecss,width:416,paddingLeft: 24}}>线路图</div>
                <div style={{...titlelinecss,width:48,margin:'0 16px'}}>设备数</div>
                <div style={{...titlelinecss,width:208,textAlign:'center'}}>操作</div>
            </div>
            <Tree
                className={commonstyle.treeclass}
                selectable={false}
                defaultExpandAll
                treeData={tdata}
            />
        </div>
    )
}

let Treeline = ({ tree }) => {
    const optcss={
        color:'#237ae4',
        textDecoration: 'underline',
        textAlign:'center',
        width:52
    }
  
    return (
        (<div style={{ display: 'flex',justifyContent:'space-between' }} >
            <div>
                线路1.1
            </div>
            <div style={{ display: 'flex',alignItems:'center' }}>
                <div className={commonstyle.numcss}>
                    1
                </div>
                <div style={{ display: 'flex' }}>
                    <div style={optcss} onClick={() => { console.log(tree) }}>新增</div>
                    <div style={optcss}>编辑</div>
                    <div style={optcss}>配置</div>
                    <div style={{...optcss,color:'#ff0000'}}>删除</div>
                </div>
            </div>

        </div>)
    )
}