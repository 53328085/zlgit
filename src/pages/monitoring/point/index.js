import React, {
  useState,
  useEffect,
  
  useRef,
  useCallback,
  
} from "react";
import { useSelector} from "react-redux";
 
import {
  
  Select,
  Radio,
  Pagination,
  Form,
  message,
  Space,
} from "antd";

import { Link, useOutletContext, useLocation} from "react-router-dom";
import { useAntdTable } from "ahooks";
import styled, {css} from "styled-components";
 
import imgurl from "./images/index.js";
import { Monitoring } from "@api/api.js";
import CommIcard from "@com/commIcard.jsx"
import {CustTransO, i18t, i18warning,ExportExcel, RadioT} from "@com/useButton"
import {
  selectProjectId,
  selectOneLevelDefaultId,
  deviceState,
  adaptation,
  themeColor
} from "@redux/systemconfig.js";

import Table from "@com/useTable";
import { Serach, Cdivider,  CPagination} from "@com/comstyled";
 
import Pagecount from "@com/pagecontent";
 
const sty =css`
grid-template-columns: repeat(auto-fill, minmax(438px, 1fr));
gap: 16px;
  flex: 1;
  .cardItem{
    .cardImg {
      width: 98px;
      height: 98px;
    }
  }
  

 
`

const Cardbox=styled.div`
 display: grid;
    grid-template-columns: repeat(auto-fill, minmax(438px, 1fr));
 //   grid-template-rows: repeat(4, 152px);
  //  row-gap: 16px;
    gap:16px;
    justify-content: space-between;
 
${props=> props.laptop ? sty : null}
  
`

export default function Index(props) {
  const tableLoadRef = useRef();
  const projectId = useSelector(selectProjectId);
  const [form] = Form.useForm();
  
  const {primaryderived} = useSelector(themeColor)
 
  let {exparams} = useOutletContext()
  let {deviceStyle,areaId} = exparams
  
  const dstate = useSelector(deviceState)
  let {laptop} = useSelector(adaptation)
 
  
  // const [messageApi, contextHolder] = message.useMessage();
  const {
   
    RuntimeDevice: {
      Statistics,
      Overview,
      CategoryImages,
    },
    DeviceManager: { QueryUsedDeviceCategory },
  } = Monitoring;
 
  let [overView, setoverView] = useState({
    details: undefined,
    categories: undefined,
  });


 
  const [isCard, setisCard] = useState(true); //卡片模式true或列表模式false
  let [total, setTotal] = useState(0);
  let [imageList, setimageList] = useState([]);
 
 
 
  
 
  const columns = [
    {
      title: i18t("comm","sn",{text:"设备"}),
      dataIndex: "sn",
      render: (sn) => (
        <Link
          to={{
            pathname: "/deviceDetail",
            search: `?sn=${encodeURIComponent(sn)}`,
          }}
          target="_blank"
        >
          {sn} 
        </Link>
      ),
      key: "sn",
      id: "id",
    },
    {
      title: i18t("comm","name",{text:"设备"}),
      dataIndex: "name",
      key: "name",
      id: "id",
    },
    {
      title: i18t("comm","category",{text:"设备"}),
      dataIndex: "category",
      key: "category",
      id: "id",
    },
    {
      title: i18t("comm","Status",{text:"设备"}),
      dataIndex: "state",
      render: (state) => (
        <span> {state == 1 ? "失联" : state == 2 ? "在线" : "告警"}</span>
      ),
      key: "state",
      id: "id",
    },
    {
      title: i18t("comm","address"),
      dataIndex: "address",
      key: "address",
      id: "id",
    },
    {
      title: i18t("comm","updateTime"),
      dataIndex: "lastSampleTime",
      key: "lastSampleTime",
      id: "id",
    },
  ];
  
 
 
  let initparams = useRef(); 
  const getOverviewData = ({ current, pageSize }, form) => {
    
    if(!Number.isFinite(deviceStyle)) return;
    initparams.current = {
      projectId,
      areaId,
      deviceStyle,
      pageNum: current,
      pageSize,
      category:"", 
    }
   

    return Overview(initparams.current).then((res) => {
      let { success, data, total} = res;
      if (success) {
        setoverView(data || []);
        setTotal(total);
       setimageList([data.imgUrl])
        let overViewList = [];
        data?.details?.map((item) => {
          let description = "";
          item.fields.map((items) => {
            description += items.name + " " + items.value + " ";
          });
          overViewList.push({ ...item, description: description });
        });
        return {
          total,
          list:overViewList,
        };
      } else {
        message.error(res.errMsg);
        return {
          total: 0,
          list: [],
        };
      }
    }).catch((e)=>{
      console.log(e)
    }) 
  };
  const { tableProps, search, run } = useAntdTable(getOverviewData, {
    form,
    defaultPageSize: 12,
    refreshDeps: [deviceStyle],
  });

  const { submit } = search; 
 

 

  const changeTab = (val) => {   
    setisCard(val.target.value == "card" ? true : false);
   
  }; 
  const onExport = useCallback(() => {
    initparams.current.pageSize = total
    initparams.current.pageNum = 1
    return Overview(initparams.current).then((res) => {
      let { success, data, total } = res;
      if (success) {
        let overViewList=[]
        data?.details?.map(item=>{
          let description=''
          item.fields.map(items=>{
             description+=items.name+' '+items.value+' '
          })
          overViewList.push({...item,description:description})
        })
        return {
          list: overViewList,
          total,
        };
      } else {
        message.error(res.errMsg);
        return {
          list: [],
          total: 0,
        };
      }
    }).catch(e => {
      console.log(e)
    });
  }, [total]);


 

 
  const changepage = (current, pageSize) => {
    try {
      let values = form.getFieldsValue();
      run({ current, pageSize }, values);
    } catch (error) {}
  };
 
  return (
    <Pagecount>
      <div className="flexcol">
       <Space size={laptop ? 8 :16} style={{ marginLeft: "auto" }}>
            <RadioT onChange={changeTab} />
          
            <ExportExcel disabled={isCard} tb={tableLoadRef} />           
          </Space>
        {isCard ? (
          <Cardbox laptop={laptop} >
            {tableProps?.dataSource?.length > 0 ?
                tableProps?.dataSource.map((item, index) => { // state 1, 离线 2 在线 3 告警; states 
                /*   let status =
                    Object.prototype.toString.call(item.status) ===
                    "[object Object]"
                      ? item.status[1]
                      : ""; */
                  let imgbase =(Array.isArray(imageList) && imageList?.length > 0) ? imageList[0] : imgurl.category
                   
                  return (
                    <div key={index}>
                      <Link
                        to={`/deviceDetail?sn=${encodeURIComponent(item.sn)}&deviceStyle=${encodeURIComponent(deviceStyle)}`}
                        target="_blank"
                      >
                      
                        <CommIcard
                          img={imgbase                         
                          }
                          title={item.name}
                          deviceStyle={deviceStyle}
                          value={item.address}
                          state={item.state}
                          fields={item.fields}
                          lastSampleTime={item.lastSampleTime}
                          category={item.sn}
                          device={2}
                        />
                      </Link>
                    </div>
                  );
                })
              : ""}
          </Cardbox>
        ) : (
            <Table
              columns={columns}
              {...tableProps}
              rowKey={(columns) => columns.id}
              ref={tableLoadRef}
              onExport={onExport}
              sheetName="设备监测"
             expandable={{
                expandedRowRender: (record) => (
                  <p
                    style={{
                      margin: 0,
                      textAlign: "center",
                    }}
                  >
                    {record.description}
                  </p>
                ),
                rowExpandable: (record) => record.description,
              }} 
            ></Table>
          
        )}
        {isCard && (
          <CPagination
            style={{ marginLeft: "auto", marginTop: "auto" }}
            size="small"
            onChange={changepage}          
            {...tableProps.pagination}
            showSizeChanger={false}
          />
        )}
      </div>
    </Pagecount>
  );
}
