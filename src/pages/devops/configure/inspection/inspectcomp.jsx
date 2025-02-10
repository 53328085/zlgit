
import React, { useEffect, useState, useRef, forwardRef, useImperativeHandle, Fragment, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { Divider, Select, Tree, Row, Col, Input, Form, message, Drawer, Table,Button } from 'antd'
import { publishState } from '@redux/systemconfig'
import BlueColumn from '@com/bluecolumn'
import commonstyle from './commonstyle.module.less'
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import {operationDesigin} from '@api/api'
import styled, {css} from 'styled-components'
import {CustButton, CustButtonT} from "@com/useButton"
import UsetTable from "@com/useTable";
const csssty = css`
  .transferContent {
    padding: 16px;
  }
  .leftTable {
    row-gap: 16px;
  }
  .actions {
    margin: 0px 8px;
   
  }
`;
const Mainbox = styled.div`
   &&{
    
    background-color: #003366;
    padding: 32px;
    display: flex;
    position: fixed;
    top:  0px;
    left:200px;
     bottom: 0;
     right: 0;
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    grid-template-rows: 1fr;
    transition: all .75s linear;
    z-index: 1999;
    transform: translateX(${props => props.open ? 0 : '3000px'});
   
  .leftTable {
    height: inherit;
    display: flex;
    flex-direction: column;
    row-gap: 32px;
  }

  .subTable {
    padding: 16px;
    background-color: #fff;
    border-radius: 2px;
     display: flex;
     flex-direction: column;
     row-gap: 16px;
    flex: 1;
  }

  .otherSubTable {
    flex: 1;
    padding: 16px 16px 0 16px;
    background-color: #fff;
    border-radius: 2px;
    display: flex;
    flex-direction: column;
    row-gap: 16px;
  }

  .mainContent {
    flex: 1;
    position: relative;
    overflow: auto;
  }

  .actions {
    margin: 0 32px;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly; 
    
  }

  .rightTable {
    //  width: 714px;
    //  height: 696px;
    border-radius: 2px;
    padding: 16px 16px 0 16px;
    background-color: #fff;
    display: flex;
    flex-direction: column;
    row-gap: 16px;
  }
  .rightTable,
  .leftTable {
    .publicTitle {
      height: 32px;
      padding-left: 16px;
      line-height: 32px;
      font-size: 14px;
      color: #333;
      border-left: 4px solid var(--ant-primary-color);
    }
    .searchInput {
      display: flex;
      align-items: center;
      column-gap: ${props=> props.theme.laptop ? "8px" : "16px"};
      height: 32px;
      .ipt {
        display: flex;
        column-gap: 8px;
        align-items: center;

       

      }
      
    }
    .mainTable {
      padding: 16px;
      background-color: #fff;
      border-radius: 2px;
      display: flex;
      flex-direction: column;
      row-gap: 16px;
      flex: 1;
      
    }
    .tbwrap {
        position: absolute;
        width: 100%; 
      }
  }

  ${props =>props.theme.laptop ? csssty : null}
}
`;
//配置线路
export let SetLine = forwardRef(({  getQueryPageDevice,areaId,addform,form, laptop }, ref) => {
    const [open,setOpen] = useState(false)
    const publish = useSelector(publishState)
    const { Search } = Input;
    const [dataSource, setDataSource] = useState([])//未选data
    const [copydataSource, setCopydataSource] = useState([])
    const [selectedRowKeys, setSelectedRowKeys] = useState(null);//未选线路check
    const [selectedRows, setSelectedRows] = useState([]);//未选线路选中data
    const [subMeter, setSubMeter] = useState([]); //选择设备data
    const [subMeterRowKeys, setSubMeterRowKeys] = useState([]);//选中check
    const [subSelectedRows, setSubSelectedRows] = useState([]);//选中设备(check)data

    const [lineId, setLineId] = useState(null);
    const [searchValue, setSearchValue] = useState(""); //搜索值
    const [devicetype,setDeviceType] = useState(0);//设备类型
    const projectId = useSelector(state => state.system.menus.projectId)
    // const deviceoptions=[
    //     {label:'全部',value:0},
    //     {label:'电表',value:1},
    //     {label:'水表',value:2},
    //     {label:'燃气表',value:3},
    //     {label:'传感器',value:4},
    //     {label:'变压器',value:5},
    //     {label:'储能设备',value:11}
    // ]
    const columns = [
        { title: '巡检点名称', dataIndex: 'name', align: "center", },
        { title: '具体位置', dataIndex: 'position', align: "center", },
        // { title: '安装地址', dataIndex: 'address', align: "center", },

    ]
    
     //获取已选和未选设备
  const getQueryDeviceList=async(deviceStyle=0,alike="")=>{
    let params={
      projectId,
      areaId,
      deviceStyle,
      alike
    }
   const res = await operationDesigin.QueryDeviceList(params)
   if(res.success){
    setDataSource([...res.data.unused])
    setCopydataSource([...res.data.unused])
    setSubMeter([...res.data.used])
   }else{
    setDataSource([])
    setSubMeter([])
    message.error(res.errMsg)
   }
  }
    //关闭抽屉
    const close = () => { 
        form()?.setFieldValue("group",subMeter)
        setOpen(false)
        setSearchValue("")
        setDeviceType(0)
        // let str=''
        // console.log(subMeter)
        // if(Array.isArray(subMeter)&&subMeter.length>0){
        //     subMeter.forEach(it=>{
        //         str+=it.name+';'
        //     })
        //     console.log(str)
        //     addform.setFieldValue('deviceGroup',str)
        // }
        
        // setSelectedRowKeys([])
        // setSubMeterRowKeys([])
       
    }
    //未选择线路check
    const onSelectChange = (newSelectedRowKeys, selectedRows, info) => {
        console.log(newSelectedRowKeys)
        setSelectedRowKeys(newSelectedRowKeys)
        setSelectedRows(selectedRows)
    }
    //分表check
    const subMeterSelectChange = (newSelectedRowKeys, selectedRows) => {
        setSubMeterRowKeys(newSelectedRowKeys)
        setSubSelectedRows(selectedRows)
    }

    //未选择to分表
    const subToLeft = () => {
        if (selectedRows.length <= 0) {
            message.warning('请至少选择一项!')
            return
        }
        const arr = dataSource.filter(it => !selectedRowKeys.includes(it.id))
        const unarr = copydataSource.filter(it => !selectedRowKeys.includes(it.id))
        setSubMeter([...selectedRows, ...subMeter])
        setSubMeterRowKeys([])
        setDataSource([...arr])
        setCopydataSource([...unarr])
        setSelectedRowKeys([])
        setSelectedRows([])
    }
    //分表to未选择
    const subToRight = () => {
        if (subSelectedRows.length <= 0) {
            message.warning('请至少选择一项!')
            return
        }
        const arr = subMeter.filter(it => !subMeterRowKeys.includes(it.id))
        console.log(arr, selectedRowKeys, selectedRows)
        setDataSource([...subSelectedRows, ...dataSource])
        setCopydataSource([...subSelectedRows, ...copydataSource])
        setSubMeter([...arr])
        setSelectedRowKeys([])
        setSubSelectedRows([])
        setSubMeterRowKeys([])
    }
  


    //保存线路编辑
    // const saveConfig = async () => {
    //     setSearchValue("")
    //     const subsn = subMeter.map(it =>({sn:it.sn,lngLat:it.lngLat,lngLatAddress:it.lngLatAddress}) )
    //     console.log(subMeter)
    //     let params = {
    //         projectId,
    //         group:subsn,
    //         areaId,
    //     }
    //     const resp = await operationDesigin.ConfigureDevice(params)
    //     if (resp.success) {
    //         message.success('线路配置成功')
    //         setOpen(false)
    //         getQueryPageDevice()
    //     } else {
    //         message.error(resp.errMsg)
    //     }
    // }
    //搜索
    const onSearch = async (value, event) => {
        setSelectedRowKeys([])
        setSelectedRows([])
        let filterarr;
        if(devicetype===0){
            if (!value) {
                setDataSource([...copydataSource])
                return
            }else{
                filterarr = copydataSource.filter(it => {
                    return (it.name.includes(value) || it.position.includes(value))
                }) 
            }
          
        }else{
            if (!value) {
                filterarr=  copydataSource.filter(it=>{
                    return it.deviceStyle === devicetype
                })
                setDataSource([...filterarr])
                return
            }else{
                filterarr = copydataSource.filter(it => {
                    return (it.name.includes(value) || it.position.includes(value))&&it.deviceStyle === devicetype
                })
            }
        
        }
        setDataSource([...filterarr])
    }
    //设备类型改变
    // const changeType=(v)=>{
    //     setDeviceType(v)
    //     setSelectedRowKeys([])
    //     setSelectedRows([])
    //     let filterarr;
    //     if(!searchValue){
    //         if(v===0){
    //             setDataSource([...copydataSource])
    //             return
    //         }else{
    //             filterarr  =  copydataSource.filter(it=>{
    //                 return  it.deviceStyle === v
    //             })
    //         }
           
    //     }else{

    //         if(v===0){
    //          filterarr= copydataSource.filter(it=>{
    //                 return it.sn.indexOf(searchValue)!==-1||it.address.indexOf(searchValue)!==-1
    //             })
    //             // setDataSource([...filterarr])
    //             // return
    //         } else{
    //             filterarr= copydataSource.filter(it=>{
    //                 return (it.sn.indexOf(searchValue)!==-1||it.address.indexOf(searchValue)!==-1)&&it.deviceStyle === v
    //             })
    //         }
          
    //         // setDataSource([...copydataSource])
    //     }
    //     console.log(filterarr)
    //     setDataSource([...filterarr])
    // }
 
    useImperativeHandle(ref, () => ({
        setDataSource,
        setSelectedRowKeys,
        setSubMeter,
        setLineId,
        setCopydataSource,
        setSubMeterRowKeys,
        setSearchValue,
        setOpen,
        getQueryDeviceList,
        subMeter
    }))
    useEffect(()=>{
        // getQueryDeviceList()
    },[areaId])
    const btnsty = laptop
    ? {
        height: "32px",
        width: "55px",
      }
    : {
        height: "46px",
        width: "68px",
      };
  const savesty = laptop
    ? {
        height: "34px",
        width: "120px",
      }
    : {
        height: "46px",
        width: "146px",
      };
 const rightref = useRef()
    return (
        <Mainbox open={open}>
            <div className="leftTable">
                <div className="otherSubTable">
                <div  className='publicTitle'>已选中的巡检点</div>
                <div className="mainContent">
                <div className="tbwrap">
                    <UsetTable
                        bordered
                        pagination={false}
                        rowSelection={{ onChange: subMeterSelectChange, selectedRowKeys: subMeterRowKeys }}
                        columns={columns}
                        dataSource={subMeter}
                        rowKey={record => record.id}
                    ></UsetTable>
                </div>
                </div>
                </div>
            </div>
            <div className="actions">
                {publish ? null : <>
                    {/* <div style={{ marginTop: 21 }}>
                        <div style={{ color: '#fff', marginBottom: 16 }}>选择设备</div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <div style={btncss} className={commonstyle.btnhover} onClick={summaryToLeft}><LeftOutlined style={{ color: '#fff', fontSize: 20 }} /></div>
                            <div style={btncss} className={commonstyle.btnhover} onClick={summaryToRight}><RightOutlined style={{ color: '#fff', fontSize: 20 }} /></div>
                        </div>
                    </div> */}
                    <div >
                        <div style={{ color: '#fff', marginBottom: 16 }}>选择巡检点</div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <CustButton onClick={subToLeft} icon={<LeftOutlined   />} style={btnsty} /> 
                            <CustButton onClick={subToRight} icon={<RightOutlined   />} style={btnsty} /> 
                        </div>
                    </div>
                </>}

                <CustButtonT text="save" onClick={close} style={savesty} /> 
            
            </div>
            <div className="rightTable" ref={rightref}>
            <div className="publicTitle">未选中的巡检点</div> 
                    
                    <div className="searchInput">
                  
                    <div>
                        <Search style={{ width: '100%', borderRadius: 16, marginLeft: 16 }} placeholder="请输入巡检点关键字查询" onSearch={onSearch} value={searchValue} onChange={(e) => { setSearchValue(e.target.value) }}></Search>
                    </div>
                    </div>
                    <div className="mainContent">
                    <div className="tbwrap"> 
                    <UsetTable
                        bordered
                        pagination={false}
                        rowSelection={{ selectedRowKeys, onChange: onSelectChange }}
                        columns={columns}
                        dataSource={dataSource}
                       
                        rowKey={record => record.id}
                    ></UsetTable>
                    </div>
                    
                </div>
            </div>
     
        </Mainbox>
    )
})
