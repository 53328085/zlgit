import React, {useState, useEffect, useLayoutEffect, useMemo, forwardRef, useImperativeHandle} from 'react'
import {Drawer, Button, Table, Typography, Checkbox} from 'antd'
import {nanoid} from '@reduxjs/toolkit'
import styled from 'styled-components'
import CustTable from '@com/useTable'
import { User } from "@api/api.js";
import {custMsg} from '@com/usehandler'
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
    const [menus, setMenus] = useState([]) 
    const [open, setOpen] = useState(false)
    let exclude = ['01','02','0101','0102', '0103', '0104']
    const bkgnd = menus.filter(m => ['0102', '0103'].includes(m.no)) // 后台控制 (项目设置， 平台设置)
    const bigScrren = menus.filter(m => ['0101'].includes(m.no)) // 数据大屏模块
    const projectsummary = menus.filter(m => ['0104'].includes(m.no)) // 项目概述
    const AllRunMenus = menus.filter(m => m.parentNo == '01').filter(m => !exclude.includes(m.no)) 

    const allSinderRunMenus = {}
   
    AllRunMenus.forEach(item => {
        let {no, key, parentNo} = item 
        if (!exclude.includes(item.no)) {
            allSinderRunMenus[key] = menus?.filter(m => m.parentNo == no) 
        }   
     })  
    
    const  MenuNos =  {}
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
    const queryUserMenus =  () => { 
        let f = !!projectId && !!userId
        if (!f)  return;
         User.QueryUserMenus({projectId, userId}).then(res => {
             let {success, data} = res
             if (success && Array.isArray(data)) {
                 setMenus([...data]);
             }
         }).catch(e => {
            console.log(e)
         });
    }
  //  const QuserMenus = useMemo(() => queryUserMenus, [])
    const saveMenu = async () => {
        try {
                           // 只要有一个子，父需要传
            let Nos = []
            for(let [key, value] of Object.entries(MenuNos)) {
               if(Array.isArray(value) && value.length > 0) {
                  Nos = [...Nos, key, ...value]
               }
            }
            let paramsNos = [...new Set(Nos)]
            let {success, errMsg} = await  User.SetMenus({projectId, userId}, paramsNos)
            success &&  custMsg({content: '保存成功', oncClose: () => {
                setOpen(false)
            }})
            !success && custMsg({success, content: errMsg || '数据出错'})
        } catch (error) {
            console.log(error)
        }
    
      //  
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
  useEffect(() => {
    queryUserMenus();
}, [projectId, userId])
   const TableList = ({title, data, mod}) => {
     
   // const defaultCheckedList = useState()
    const [checkedList, setCheckedList] = useState(() => data.map(d => {
        if(d.select == 1) return d.no;
    }));
    const [allSelect] = useState(() => data.map(d => d.no))
    const [indeterminate, setIndeterminate] = useState(false);
    const [checkAll, setCheckAll] = useState(() => data.length === checkedList.length);
    const onCheckAllChange = (e) => {
        setCheckedList(e.target.checked ? allSelect : []);
        setIndeterminate(false);
        setCheckAll(e.target.checked);
    }
  
    const onChange = (list) => {
       setCheckedList(list)
       setIndeterminate(!!list.length && list.length < data.length)
       setCheckAll(list.length === data.length)
    }
    useEffect(() => {
        MenuNos[mod] = checkedList;
    }, [checkedList])
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
                 <CustTable columns={columns} dataSource={data} rowKey="no" pagination={false} showHeader={false} bordered={false} ></CustTable>
          </CheckboxGroup>
        </>
    )
   }

    return (
      <CustDrawer open={open} title="项目权限选择" width={608} onClose={onClose} closable={false}  extra={<Button type="primary" onClick={saveMenu}>保存</Button>}>
           {
             Array.isArray(bkgnd) && <TableList title="后台控制模块" mod='0103' data={bkgnd} key={nanoid()} /> 
           }
           {
             Array.isArray(bigScrren) && <TableList title="数据大屏模块" mod={bigScrren[0]?.no} data={bigScrren} key={nanoid()} /> 
           }
            {
             Array.isArray(projectsummary) && <TableList title="Web端功能模块" mod={projectsummary[0]?.no} data={projectsummary} key={nanoid()} /> 
           }
           {
            Array.isArray(AllRunMenus) && AllRunMenus.map(m => {
                if (m.no == '0104') return null;
                return (
                    <TableList title={m.label} mod={m.no} data={allSinderRunMenus[m.key]} key={nanoid()} /> 
                )
            })
           }
      </CustDrawer>
    )
}
export default forwardRef(Index)