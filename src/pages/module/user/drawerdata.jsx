import React, {useState, useEffect, useLayoutEffect, useMemo, forwardRef, useImperativeHandle} from 'react'
import {Drawer, Button, Table, Typography, Checkbox, Tabs} from 'antd'
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
    const [value, setvalue] = useState('area')
    const [tableData, setTableData] = useState({
      area: [],
      device: [],
      energy: [],
    }) 
    const [open, setOpen] = useState(false) 
    const datas = tableData[value];
    const tabs = [
          {label: '园区权限', key: 'area'},
          {label: '能耗权限', key: 'energy'},
          {label: '设备权限', key: 'device'},
      ]
    
   

  
    
    const onClose = () => {
      
        setOpen(false)
    }
    const onOpen = () => {
        setvalue('area')
        setOpen(true)
    }
    useImperativeHandle(ref, () => ({
        onClose,
        onOpen,
    }))
    const dkeyname = {meterEnable: '测点', gatewayEnable: '网关', cameraEnable: '摄像头', sensorEnable: '传感器'}
    const ekeyname = {
      coalEnabled: '煤炭',
      electricEnabled: '电',
      gasEnabled: '燃气',
      oilEnabled: '燃油',
      steamEnabled: '蒸汽',
      waterColdEnabled: '冷水',
      waterHotEnabled: '热水',
    }
    const getDataRights =  () => { 
        let f = !!projectId && !!userId
        if (!f)  return;
         User.GetDataRights({projectId, userId}).then(res => {
             let {success, data} = res
             if (success && data) {
              let {area, device, energy} = data || {}
              let   devicedata = [], energydata =[]
              for(let [key, value] of Object.entries(energy)) {
                energydata.push({
                    name: ekeyname[key],
                    select: value,
                    id: key
                  })
              }
              for(let [key, value] of Object.entries(device)) {
                devicedata.push({
                  name: dkeyname[key],
                  select: value,
                  id: key
                })
            }
              setTableData({
                  ...tableData,
                  area,
                  device: devicedata,
                  energy: energydata,
                 });
             }
         }).catch(e => {
            console.log(e)
         });
    }
    const columns =[
          {
          title: '',
          dataIndex: 'name',
          width: 182, 
          className: 'firstrow'
        },
        {
            title: '',
            dataIndex: 'id',
            render: (text) => { 
            return <Checkbox value={text}>选中</Checkbox>
          },
            align: 'center'
        }
        
       ]

    const MenuNos = {};
    const saveMenu = async () => {
       try {
        let params = []; 
        if (value == 'area') {
          params = MenuNos['area']
        } else {
          params = {}
          for(let key of MenuNos[value]) {
             params[key] = 1
          }
        }
        let {success, errMsg} =  await  User[`SetDataRights${value}`]({projectId, userId}, params)
        success && custMsg({content: '设置成功', onClose: () => { 
          setOpen(false) 
          getDataRights()
        }})
       } catch (error) {
         console.log(error);
       }
      
    }
   
    
   
    
  useEffect(() => {
    getDataRights();
}, [projectId, userId])

   const TableList = ({title, data}) => {     
    console.log(data)
    const choose = (data=[]) =>  data?.filter(d => d.select == 1).map(d => d.id);
   
    const [checkedList, setCheckedList] = useState(choose(data));
    const [allSelect] = useState(() => data?.map(d => d.id))
    const [indeterminate, setIndeterminate] = useState(false);
    const [checkAll, setCheckAll] = useState(() => data?.length === checkedList?.length);    
    const onCheckAllChange = (e) => {
        setCheckedList(e.target.checked ? allSelect : []);
        setIndeterminate(false);
        setCheckAll(e.target.checked);
    }
    console.log(checkedList);
    const onChange = (list) => {
        
       setCheckedList(list)
       setIndeterminate(!!list.length && list.length < data?.length)
       setCheckAll(list.length === data.length)
    }
    useEffect(() => {
      MenuNos[value] = checkedList;
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
                 <CustTable columns={columns} dataSource={data} rowKey="id" pagination={false} showHeader={false} bordered={false} ></CustTable>
          </CheckboxGroup>
        </>
    )
   }

   const items =  tabs.map(t => ({
    key: t.key,
    label: t.label,
    children:  <TableList title={t.label} data={datas} /> 
    }))
    const tabChange =(t) => {
      console.log(t);
      setvalue(t);
    }
    return (
   
      <CustDrawer open={open} title="数据权限选择" width={608} onClose={onClose} closable={false}  extra={<Button type="primary" onClick={saveMenu}>保存</Button>}>  
          <Tabs  items={items} onChange={tabChange} activeKey={value} />
      </CustDrawer>
    
    )
}
export default forwardRef(Index)