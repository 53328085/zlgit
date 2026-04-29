import React, {
  useState,
  useCallback,
  useRef,
  useEffect,
  useMemo,
} from "react";
import { Checkbox, message, Tooltip, Space, Form } from "antd";

import { useOutletContext } from "react-router-dom";
import _  from "lodash";
import Pagecount from "@com/pagecontent";
import UseProTable from "@com/useTable/proTable";
import UserTree from "@com/useTree/nodeTree";
import {Cspin} from "@com/comstyled"
import { useRequest } from "ahooks";

import CModal from "@com/useModal";
import { ProExportExcel, CustButton, SetButton } from "@com/useButton";
import { isObject } from "@com/usehandler";

import { Contentbox, Checkboxwrap } from "../publicStyle/style";
import {
  useQueryRealtimeReadingList,
  useStartCalling,
  useCallingExResponse,
  useSetResult,
} from "./api";
import { extendcols,setcols } from "./data";
import { useCol } from "./usehook";

export default function Index() {
  let { exparams } = useOutletContext();
   let { areaId, projectId, energytype, alike } = exparams;
  const [form] = Form.useForm();
  const [checkedList, setCheckedList] = useState([]);
  const defaultsetting = setcols[energytype]
  const [columnsStateMap, setColumnsStateMap] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState({
    pageSize:20,
    pageNum:1, 
  });
  const [line, setLine] = useState(0);
  const [treeId, setTreeId] = useState();

  const modref = useRef();
  const idsRef= useRef([]);  
  const timer = useRef(null);
  const paramsRef = useRef([])
  const successfulData = useRef([])
  const selectedRow = useRef([]); // 已选择的行数据
 

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const columns = useCol({ energytype });

  const settingcols =setcols[energytype]

  const options = useMemo(() => {
    if (!isObject(extendcols)) return [];
    if (!Number.isInteger(Number.parseInt(energytype))) return [];
    return Array.from(extendcols[energytype])?.map((e) => ({
      label: e.title,
      value: e.dataIndex,
    }));
  }, [energytype]);

  const indeterminate = options.length > 0 && checkedList.length > 0 && checkedList.length < options.length;  
  const colsettingChange = (v) => {
    console.log(v);
    setColumnsStateMap(v);
  };

  const onSelectChange = (newkey, rows) => {
     let arr =[]
     console.log(rows)
     rows.forEach((item) => {
      options.forEach((v) => {
         let num = parseFloat(item[v.value])
         typeof   num=== 'number' &&   Number.isFinite(num) && arr.push(v.value)
      });
     
   });
    console.log(arr)
    selectedRow.current=arr
    setSelectedRowKeys(newkey);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
    hideSelectAll: true,
    preserveSelectedRowKeys: false,
  };

 

  // 使用ProTable
  const params = useMemo(() => {
    return {
      projectId,
      meterType: energytype,
      queryType: line,
      ids: treeId,
      filterInfo: alike,
      areaId,
      pageNum:page.pageNum,
      pageSize:page.pageSize,
    };
  }, [projectId, areaId, energytype, treeId, line, alike,page]);

  const [total, setTotal] = useState(0);
  const tbref = useRef();
  const pageChange=(page,pageSize)=>{
     setPage({
      pageNum:page,
      pageSize:pageSize
    })
  }
  const getTableData = async (params) => {
    
    let { projectId, meterType, ids, areaId, queryType,pageNum,pageSize } = params;
    try {
      let f =
        [projectId, meterType, areaId, queryType,pageNum,pageSize].every((v) =>
          Number.isInteger(v),
        ) && Array.isArray(ids);

      if (!f) return;
      let {
        success,
        data,
        total = 0,
      } = await useQueryRealtimeReadingList({}, params);

      setTotal(total);

     

      if (success && Array.isArray(data)) {
        let tb = data
        console.log(successfulData.current)
        if(successfulData.current?.length>0) {
           tb= data.map(item=>{
             let d = successfulData.current.find(d=>d.sn===item.sn)?.data ?? {}
            return {...item, ...d}
          })
        }

        setTableData(tb);
         
      } else {
         setTableData([]);
      }
    } catch (error) {
      console.log(error);
    }
  };
   const {refresh}=useRequest(()=>getTableData(params), {
    refreshDeps:[params]
  })
 



  const onSetResul =async()=>{ 
     try {
     let ids =  idsRef.current.map(item=>{
         let status = paramsRef.current.find(i=>i.sn==item.sn) ? 2 : 1
         return {
           id:item.id,
           status,
         }
      })
      if(ids.length>0) {
        await useSetResult({projectId}, ids)
      }
     
     } catch (error) {
       console.log(error)
     }

  }
    const onCancel=()=>{
     modref.current.onCancel()
  }
  const onCalling =async(i)=>{
   try {
    let body ={
      Calling: paramsRef.current,
      PointNames: checkedList
    }
    let {success, data } = await useCallingExResponse({}, body);
    if(success) {
       let fail = data.filter(item=> !item.isOk || item.errorCode != 0)?.map(d=>({sn:d.sn, taskNo:d.taskNo}))
       let successful =  data.filter(item=>  item.isOk && item.errorCode == 0)?.map(d=>({sn:d.sn, data:JSON.parse(d.data)})) 
       successfulData.current.push(...successful)
     
       if (fail.length > 0 && i<12 ) {
          paramsRef.current = fail
         
       } else {
          let tableclone = _.cloneDeep(tableData)
          let datas =  tableclone.map(item=>{
            let data = successfulData.current.find(d=>d.sn == item.sn)?.data??{}
            return {
              ...item,
              ...data 
            }
          })
          setTableData(datas)
          setLoading(false)
          onSetResul()
          onCancel()
          clearTimeout(timer.current)
       }
    }else {
       
      return Promise.reject(data)
    }
   } catch (error) {
    console.log(error)
     // return Promise.reject(error);
   } 
  }
  
  const loopCalling = async ()=>{   
    let counts = Array.from({length:13}, (_,i)=> i)
     for(let i of counts) {
      timer.current = setTimeout(async()=>{   
         onCalling(i)

      }, 5000*i)
     
     }
   
  }

  const onReading = () => {
    if (selectedRowKeys?.length == 0) return message.info("请选择抄读设备");
      console.log("selectedRow",selectedRow);
      setCheckedList(selectedRow.current)
    modref.current.onOpen();
  };

  const onExport = useCallback(() => {
    params.pageSize = total;
    params.current = 1;
    return getTableData(params);
  }, [total,params]);

  const parameter = {
    params: {
      showDevice: false,
    },
    limit: Number.isNaN,
  };
  const toolbar = [
    <Tooltip title="测点抄读后获取">
      <CustButton onClick={onReading}>抄读</CustButton>
    </Tooltip>,
    <ProExportExcel tb={tbref} className="realTimeMeterReading" />,
  ];

  const ckonChange = (v) => {
    console.log(v);
    setCheckedList(v);
  };
  const onOK = async () => {
    try {
      if(checkedList?.length<1) return message.error('请选择参数')
    
      let body = {
        Sns: selectedRowKeys,
        ProjectId: projectId,
      };
      let { success, data } = await useStartCalling({}, body);
      if ((success, Array.isArray(data) && data?.length > 0)) {
         setLoading(true);
        let fail = data.filter((d) => d.errorCode !== 0 || !d.isOk);
        if (fail?.length) {
          message.error(
            `抄读失败的设备SN：${fail.map((d) => d.errorMessage).join(",")}`,
          );
        }
        let sucessfulSn = data.filter((d) => d.errorCode === 0 && d.isOk)
        let params = sucessfulSn?.map((d) => ({ sn: d.sn, taskNo: d.taskNo }));
        
        if (params?.length) {
          idsRef.current = sucessfulSn.map((d) => ({id: d.id, sn: d.sn }));
          paramsRef.current = params;
          loopCalling()
        }else {
           setLoading(false);
        }
        
      } else {
        setLoading(false);
        if (!success) message.error("抄读失败");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const selectedAll =(e)=>{
      if(e.target.checked) {
        setCheckedList(options.map(item=>item.value))
      }else {
        setCheckedList([])

      }
  }
  return (
    <Pagecount showSearch={false} custserach={true} pd="0" bgcolor="none">
      <Contentbox>
        <UserTree
          parameter={parameter}
          correlation={1}
          isshow={true}
          areaId={areaId}
          showSearch={true}
          allselect={false}
          energytype={energytype}
          setTreeId={setTreeId}
          setLine={setLine}
          showline={true}
        />

        <div className="rightwrap">
          <div className="tbwrap">
            <UseProTable
              headerTitle="实时抄表详情"
              tableClassName="realTimeMeterReading"
              rowKey={(row) => row.sn}
              dataSource={tableData}
               ref={tbref}
              columns={columns}
              pagination={{
                pageSize: page.pageSize,
                showSizeChanger: true,
                total,
                showTotal: (total) => `共 ${total} 条`,
                onChange: pageChange,
              }}
              options={{
                 
                reload: refresh,
                 

              }}
            //  request={getTableData}
             // params={params}
              search={false}
              toolBarRender={() => toolbar}
              rowSelection={rowSelection}
              columnsState={{
                defaultValue: defaultsetting,
                value: columnsStateMap,
                onChange: colsettingChange,
              }}
              sheetName="实时抄表"
              onExport={onExport}
            ></UseProTable>
          </div>
        </div>
      </Contentbox>
      <CModal
        title="实时抄读参数选择"
        ref={modref}
     //   onOk={onOK}
        width={646}
        mold="cust"
        closable={true}
        footer={null}
      >
        <Cspin spinning={loading} tip="正在抄读，请稍候……">
        <Checkboxwrap>
               
          <Checkbox onClick={selectedAll} indeterminate={indeterminate}>全选</Checkbox>
          <div className="options">
            <Checkbox.Group
              options={options}
              value={checkedList}
              onChange={ckonChange}
            />
          </div>
          <div className="btn"><CustButton type="default" onClick={onCancel}>取消</CustButton><CustButton onClick={onOK}>确定</CustButton></div>
        </Checkboxwrap>
        </Cspin>
      </CModal>
      {/*  <Draggable ref={draggleRef} {...transferProps} /> */}
    </Pagecount>
  );
}
