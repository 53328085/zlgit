import React, {useState, useEffect, useMemo, forwardRef, useImperativeHandle} from 'react'
import {Drawer, Button, Table, Typography, Checkbox} from 'antd'
import {nanoid} from '@reduxjs/toolkit'
import {useSelector} from 'react-redux'
import styled from 'styled-components'
import {runMenus, setMenus, siderRunMenus} from '@redux/systemconfig.js'
import CustTable from '@com/useTable'
import { User } from "@api/api.js";
const { Text, Link, Paragraph  } = Typography
const CheckboxGroup = Checkbox.Group;
const CustDrawer = styled(Drawer)`
   && {
    .ant-drawer-body {
        padding: 0px;
        font-size: 14px;
        display: flex;
        flex-direction: column;
        .tbtitle {
            padding-left: 32px;
            height: 36px;
            background-color: #f2f2f2;
            display: grid;
            grid-template-columns: 150px repeat(3, 1fr);
            align-items: center;
            justify-content: center;
        }
      .firstrow {
        padding-left: 32px;
      }
    }
   }


`
 function Index({projectId, userId}, ref) {
    console.log(projectId, userId)
    const [open, setOpen] = useState(false)
    const menus = useSelector(runMenus)
    const SetMenus = useSelector(setMenus)
    const siderMenus = useSelector(siderRunMenus)
    
    const [bkgnd] = useState(SetMenus?.filter(m => ['0102', '0103'].includes(m.no))) // 后台控制模块
    const [bigScrren] = useState(SetMenus?.filter(m => ['0101'].includes(m.no))) // 数据大屏模块
    const [projectsummary] = useState(menus?.filter(m => ['0104'].includes(m.no))) // web端功能模块 功能概述模块
    const [tbdata, setTbdata] = useState([])
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const  MenuNos = {}
    const onClose = () => {
        setOpen(false)
    }
    const onOpen = () => {
        setOpen(true)
    }
    useImperativeHandle(ref, () => ({
        onClose,
        onOpen,
    }))
    const saveMenu =() => {
        User.setMenus({projectId, userId})
    }
   
    const rowmove = {
      up: (record,index) => {
        setTbdata(arr => {
          let prerow = arr[index - 1];
          arr[index] = prerow;
          arr[index - 1] = record;
          console.log(arr)
          return [...arr]
        })
     
      },
      down: (record,index) => {
        setTbdata(arr => {
          let nextrow = arr[index + 1];
          arr[index] = nextrow;
          arr[index + 1] = record;
          return [...arr]
        })
       
      }
    }
    const rowlen = useMemo(() => menus.length, [menus])
   
    const columns = [
      {
      title: '',
      dataIndex: 'label',
      width: 182, 
      className: 'firstrow'
     },
     {
        title: '',
        dataIndex: 'no',
        render: (text) => {
         console.log(text)
         return <Checkbox value={text}>选中</Checkbox>
       },
        align: 'center'
     },
     {
      title: '',
      dataIndex: 'up',
      render: (_, record, index) => index !==0 && (<Link onClick={() => rowmove.up(record, index)}>上移一行</Link>),
      align: 'center',
     },
     {
      title: '',
      dataIndex: 'down',
      render: (_, record, index) => index <  rowlen - 1 && (<Link onClick={() => rowmove.down(record, index)} type="danger">下移一行</Link>),
      align: 'center'
     },
     
  ]
   const TableList = ({title, data}) => {
    console.log(data)
   // const defaultCheckedList = useState()
    const [checkedList, setCheckedList] = useState(() => data.map(d => {
        if(d.select == 1) return d.no;
    }));
    const [allSelect] = useState(() => data.no)
    const [indeterminate, setIndeterminate] = useState(false);
    const [checkAll, setCheckAll] = useState(false);
    const onCheckAllChange = (e) => {
        setCheckedList(e.target.checked ? allSelect : []);
        setIndeterminate(false);
        setCheckAll(e.target.checked);
    }
  
    const onChange = () => {}
    return (
        <>
          <div className='tbtitle'>
              <Text  strong ellipsis>{title}</Text> 
              <Text><Checkbox indeterminate={indeterminate} onChange={onCheckAllChange} checked={checkAll}>
                       选择全部
                    </Checkbox>
             </Text>
          </div>
          <CheckboxGroup onChange={onChange} value={checkedList} >
                 <CustTable columns={columns} dataSource={data} rowKey="key" pagination={false} showHeader={false} bordered={false} ></CustTable>
          </CheckboxGroup>
        </>
    )
   }

    return (
      <CustDrawer open={open} title="项目权限选择" width={608} onClose={onClose} closable={false}  extra={<Button type="primary" onClick={() => saveMenu()}>保存</Button>}>
           {
             Array.isArray(bkgnd) && <TableList title="后台控制模块" data={bkgnd} key={nanoid()} /> 
           }
           {
             Array.isArray(bigScrren) && <TableList title="数据大屏模块" data={bigScrren} key={nanoid()} /> 
           }
            {
             Array.isArray(projectsummary) && <TableList title="Web端功能模块" data={projectsummary} key={nanoid()} /> 
           }
           {
            Array.isArray(menus) && menus.map(m => {
                if (m.no == '0104') return null;
                return (
                    <TableList title={m.label} data={siderMenus[m.key]} key={nanoid()} /> 
                )
            })
           }
      </CustDrawer>
    )
}
export default forwardRef(Index)