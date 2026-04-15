import React, { useState, useRef, useEffect, useCallback } from "react";
import { nanoid } from "@reduxjs/toolkit";
import { Form, Radio, Space, DatePicker, Select, Pagination, } from "antd";
import styled, {css} from "styled-components";
import UserSearch from "@com/useSerach";
import CustContext from "@com/content.js";
import { useAntdTable } from 'ahooks'
import { QueryElectric, DesElectric } from "@api/api.js"
import Titlelayout from "@com/titlelayout";
import Citem from './item'
import CitemAll from './itemAll'
import { useSelector } from 'react-redux'
import { selectProjectId, selectOneLevelDefaultId, selectOneLevel, levelDefaultLabel,adaptation } from '@redux/systemconfig.js'
import dayjs from 'dayjs';
import { getTime } from "@com/usehandler"
import UseTable from "@com/useTable"
import { ExportExcel } from '@com/useButton'
const sty= css`
  .card {
    grid-template-columns: repeat(auto-fill, minmax(394px, 1fr) );
    gap:16px
  }
`
const Mainbox = styled.div`
display: grid;
 grid-template-rows: 48px 1fr;
  row-gap: 16px;
   flex: 1;
 
  
`
const Laybox = styled.div`
  display: grid;
  
  flex: 1;
  //margin-top: 16px;
  //padding-top: 16px;
  //border-top: 1px dotted #d7d7d7;
  grid-template-rows: 1fr 24px;
  row-gap: 16px;

  .card {
    flex: 1;
    display: grid;
    grid-template-columns: repeat(auto-fill, 394px);
    //grid-template-rows: repeat(2, 316px);
    gap: 16px;
 //   gap: 16px;
    justify-content: space-between;
   
  }
  ${props=>props.theme.laptop ? sty : null}
 
 
`;
const CustTitle = styled.div`
  font-size: 14px;
  color: #515151;
  display: flex;
  justify-content: space-between;
  align-items: center;

`;








const Radiogroup = styled(Radio.Group)`
  && {
    .ant-radio-button-wrapper.ant-radio-button-wrapper-in-form-item {
      width: 96px;
      text-align: center;
      &:first-child {
        border-radius: 16px 0 0 16px;
      }
     &:last-child {
      border-radius: 0 16px 16px 0;
     }
    }
  }

`

// 总尖峰平谷对应E,E1,E2,E3,E4



const nf = new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 });
export default function Index() {
  const projectId = useSelector(selectProjectId);
  const areaId = useSelector(selectOneLevelDefaultId)
  const areaData = useSelector(selectOneLevel)
  const levelname = useSelector(levelDefaultLabel)
  const {laptop} = useSelector(adaptation)
  const [tableData, setTableData] = useState([])
  const [tableDataAll, setTableDataAll] = useState([])
  const [form] = Form.useForm();
  const { Item } = Form
  const [value, setvalue] = useState("1");

  const [timetype, setTimetype] = useState(1) // 日、月、年 1， 2， 3


  const picker = ['', 'date', 'month', 'year'][timetype];

  const [params, setParams] = useState({
    projectId,
    pageNum: 1,
    pageSize: 12,
    areaId,
    type: 1,
    date: getTime(dayjs(), 1)
  })

  // const {detail, total='', proportion, coalStandard, consume={}, analysisDes='', ...energyitem} = qverview;
  const [total, setTotal] = useState(0)

  const headsty = (bg) => ({
    background: bg,
    color: "#fff",
    textAlign: "center"
  })
  const columns = [
    {
      dataIndex: "name",
      title: "设备名称",
    },
    {
      dataIndex: "sns",
      title: "设备编号",
      render: (text) => <span>{text}</span>
    },
    {
      dataIndex: "areaName",
      title: "区域名称",

    },
    {
      dataIndex: "address",
      title: "安装位置",

    },
    {
      dataIndex: "e",
      title: "总能耗(kWh)",
      onHeaderCell: () => ({ style: headsty("#000") })
    },
    {
      dataIndex: "e2",
      title: "峰能耗(kWh)",
      onHeaderCell: () => ({ style: headsty("#f33") })
    },
    {
      dataIndex: "e3",
      title: "平能耗(kWh)",
      onHeaderCell: () => ({ style: headsty("#f90") })
    },
    {
      dataIndex: "e4",
      title: "谷能耗(kWh)",
      onHeaderCell: () => ({ style: headsty("#093") })
    }

  ]
  // columns[2].title = levelname
  const [mode, setMode] = useState(1)
  const [showAll, setshowAll] = useState(false)
  const sortClass = sortData => {
    const groupBy = (array, f) => {
      let groups = {};
      array.forEach(o => {
        let group = JSON.stringify(f(o));
        groups[group] = groups[group] || [];
        groups[group].push(o);

      });
       console.log(groups)
      return Object.keys(groups).map(group => {
        return  groups[group]
      })
    }
    const sorted = groupBy(sortData, item => {
      return item.areaName;
    })
    return sorted;
  }
  const getData = async () => {
    try {
      let { success, data, total } = await QueryElectric.query({ ...params })
      if (success && Array.isArray(data) && data.length > 0) {

        let imageKeys = data.map(d => d.imageKey)
        let promises = imageKeys.map(key => DesElectric.QueryImage(key))
        let result = await Promise.allSettled(promises)
        result.forEach(r => {
          if (r.status == 'fulfilled' && r.value?.success) {
            let { data: imagedata } = r.value

            data.forEach(d => {
              if (d.imageKey == imagedata.imageKey) {

                d.image = imagedata.image;
              }
              areaData.forEach(name => {
                if (d.areaId == name.id) {
                  d.areaName = name.name;
                }
              })

            })

          }
        })
        if (areaId == 0) {
          setshowAll(true)
          const groupedItems = Object.entries(
            data.reduce(
              (prev, next) => (
                {
                  ...prev,
                  [next.areaName]: [...(prev[next.areaName] || []), { ...next }]
                }),
              {})
          ).map(([areaName, value]) => ({ areaName, value }));
          // let newData = {}

          // data.forEach(e => {
          //   // 新建属性名
          //   if (Object.keys(newData).indexOf('' + e.areaName) === -1) {
          //     newData[e.areaName] = []
          //   }
          //   // 对应插入属性值
          //   newData[e.areaName].push(e)
          // })
          // console.log(newData)
          // let groupedItems = Object.entries(newData).map(([areaName, value]) => ({ areaName, value }))
          // console.log(groupedItems)
          // sortClass(data)
          
          // console.log(groupedItems)
          setTableDataAll( sortClass(data))
          console.log("---tableDataAll", sortClass(data),groupedItems)
        } else {
          setshowAll(false)
        }
        setTableData(data)
        setTotal(total)
      } else {
        setTotal(0)
        setTableData([])
        setTableDataAll([])
      }

    } catch (error) {

    }


  }

  const onChange = (e) => {
    setMode(e.target.value)
  }



  useEffect(() => {
    getData()
  }, [params, areaId])
  const tbref = useRef();
  const onExport = useCallback(() => {

    return QueryElectric.query({
      ...params,
      pageNum: 1,
      pageSize: total,
    }).then(res => {
      let { success, data, total } = res;
      if (success) {
        return {
          list: Array.isArray(data) ? data : [],
          total,
        };
      } else {
        message.error(res.errMsg);
        return {
          list: [],
          total: 0,
        };
      }

    }).catch()
  }, [total])
  const Title = (
    <CustTitle className="t">
      重点设备分时能耗
      <Space size={32}>
        <Radiogroup options={[
          {
            label: "卡片模式",
            value: 1
          },
          {
            label: "列表模式",
            value: 2
          }
        ]}
          optionType="button"
          buttonStyle="solid"
          onChange={onChange}
          value={mode}
        ></Radiogroup>
       <ExportExcel tb={tbref} disabled={mode == 1} />
      </Space>
    </CustTitle>
  );

  const dateChange = (e) => {
    let date = getTime(e, timetype)
    setParams({ ...params, date })
  }


  const timechange = (e) => {
    setTimetype(e);
    let date = getTime(dayjs(), e)

    setParams({ ...params, type: e, date })
  }
  const pagechange = (page, pageSize) => {
    setParams({ ...params, pageNum: page, pageSize })
  }
  const CustView = () => {
    const viewstyle = {
      display: 'flex',
      justifyContent: "space-between",
      flex: 1, 
    }
    return (
      <div style={viewstyle}>

        <Space size={16}>
          <Item name="type" initialValue={1}>
            <Select style={{ width: '80px' }} options={[
              { value: 1, label: '日' },
              { value: 2, label: '月' },
              { value: 3, label: '年' },
            ]}
              onChange={timechange}
            ></Select>
          </Item>

          <Item nostyle name="date" initialValue={dayjs(new Date(), 'YYYY-MM-DD')}>
            <DatePicker placeholder="请选择日期" picker={picker} onChange={dateChange} style={{ width: '160px' }} />
          </Item>
        </Space>
      </div>
    )
  }


  const items = <div>  {areaId != 0 && !showAll ?
    <div className="card">{tableData.map(d => <Citem  {...d} laptop={laptop}  key={nanoid()} />)} </div> :
    <div>{tableDataAll.map(d => <CitemAll  {...d} key={nanoid()} />)}</div>
  }</div>
  const showTotal = (total) => `共${total}条记录`;
  return (
    <CustContext.Provider
      value={{
        form,
        custview: <CustView />,
        // tabs,
        handler: (e) => {
          setParams({ ...params, areaId: e })
        },
        value,
        setvalue,
      }}
    >

      <Mainbox>
        <UserSearch></UserSearch>

        <Titlelayout title={Title} layout="flex">
          <Laybox laptop={laptop}>

            {
              mode == 1 ? items : <UseTable dataSource={tableData} columns={columns} key={nanoid()} ref={tbref} sheetName="重点设备" onExport={onExport} />
            }

            <Pagination showTotal={showTotal} defaultPageSize={12} defaultCurrent={1} total={total} size="small" style={{ marginLeft: "auto" }} onChange={pagechange}></Pagination>
          </Laybox>
        </Titlelayout>

      </Mainbox>
    </CustContext.Provider>
  );
}
