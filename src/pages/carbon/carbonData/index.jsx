import React, { useState, useRef} from 'react'
import {useAntdTable} from 'ahooks'
 
import Pagecount from '@com/pagecontent'
import styled from 'styled-components'
import {  message, Space} from 'antd'
import {useOutletContext} from 'react-router-dom'
import {CustButtonT, CustTransO,i18t, i18warning, i18success} from "@com/useButton"
import Titlelayout from "@com/titlelayout"
 
import {Carbon} from '@api/api'
import CTree from './ctree'
import Usetable from '@com/useTable'
import {getTime} from "@com/usehandler"

 
const Mainbox = styled.div`
  display: grid;
  grid-template-columns: 296px minmax(1368px, auto);
  column-gap: 16px;
  flex: 1;
  .tablebox {
    flex: 1;
    display: flex;
    padding-top: 16px;
    .rowbg {
      background-color: #fdfdfd;
    }
  }
  
`
const columns = [
  {
    title: i18t("comm","name"),
    dataIndex: 'name',
    key: 'name',
    width: 180
  },
  {
    title: i18t("comm","StartDate"),
    dataIndex: 'startDate',
    key: 'startDate',
    width: 180,
    render: (text) => {
      return <CustTransO ns="comm" text="intlDateTime" val={new Date(Date.parse(text))} />
    }

  },
  {
    title: i18t("comm","EndDate"),
    dataIndex: 'endDate',
    key: 'endDate',
    width: 180,
    render: (text) => {
      return <CustTransO ns="comm" text="intlDateTime" val={new Date(Date.parse(text))} />
    }
  },
  {
    title: i18t("comm","Carbonemissionl", {param: '(tCO₂)'}),
    dataIndex: 'value',
    key: 'value',
    width: 180,
    render: (text) => {
      return <CustTransO ns="comm" text="intlNumberWithOptions" val={parseFloat(text)} />
    }
  },
]
export default function Index() { 
  let {exparams, enterpriseId} = useOutletContext() 
  
  let {  date,   type} = exparams

  const [treeId, setTreeId] = useState(null)
 
  const params = useRef({})
  const getTabledata =({current, pageSize}) => {
    if(Number.isInteger(enterpriseId) && type && date && Array.isArray(treeId)) {     
        let params = {
        enterpriseId,
        type,
        date: getTime(date, type),
        FacilityIds:  treeId
      }
      return Carbon.QueryEmissionDataPost(current, pageSize, params).then(res => {
          let {success, data, errMsg, total} = res
          if(success && Array.isArray(data) && data.length > 0) {
            return {
              list: data,
              total,
            }
          }else {
            if(!success) i18warning(errMsg)
             return {
              list: [],
              total: 0
             }
          }
      })         
    }else {
    
    }
  }
  const {tableProps} = useAntdTable(getTabledata, {
    defaultPageSize: 14,
    refreshDeps: [enterpriseId, treeId, date, type]
  })
 
  const onExport = async() => {
    try {
      let params = {
        enterpriseId,
        type,
        date: getTime(date, type),
        FacilityIds:  treeId
      }
       let data = await Carbon.ExportDataPost(params)
       console.log(data)
       let blob = new Blob([data], {
        type: "application/x-msdownload",
      }); 
     
      let url = window.URL.createObjectURL(blob); 
      let a = document.createElement("a");
      a.href = url;
      a.download = `碳排查数据.xlsx`;
      document.body.appendChild(a);
      a.click();
     
      document.body.removeChild(a);
    } catch (error) {
      console.log(error)
    }
   
  }
 
  const CTitle = (
    <div style={{display: 'flex', alignItems: "center", justifyContent: "space-between"}}>
        <span><CustTransO ns="carbon" text="carbonemission" param="(tCO₂)" /></span>
        <Space>
          <CustButtonT text="export" src='export' onClick={onExport} /> 
        </Space>
    </div>
  )
  return (
    <Pagecount bgcolor="transparent" pd="0">
       <Mainbox>
        <CTree enterpriseId={enterpriseId} setTreeId={setTreeId} />
      {/*  <UserTree areaId={areaId}   setTreeId={setTreeId} setLine={setLine}     />  */}
     
          <Titlelayout title={CTitle} layout="flex">
              <div className='tablebox'>
                 <Usetable columns={columns} {...tableProps} hbg="#ecf5ff" hbc="#515151" rowClassName={(_, index) => index %2==0 ? "rowbg" : null} />
              </div>
          </Titlelayout>
       </Mainbox> 
    </Pagecount>
  )
}
