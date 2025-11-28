import React, { useMemo, useRef, useState, useCallback } from "react";
import { Space, Form, message, Typography, Input } from "antd";
import moment from "moment";
import { useAntdTable } from "ahooks";
import { useSelector } from "react-redux";
import { useOutletContext } from "react-router-dom";
import Pagecount from "@com/pagecontent";
import UserTable from "@com/useTable";
import Titlelayout from "@com/titlelayout";
import { CustButtonT, CustButton, ExportExcel } from "@com/useButton";
import CModal from "@com/useModal";
import { selectUser } from "@redux/user";
import { selectOneLevelDefaultId } from "@redux/systemconfig";
import { usePage, useAdd, useUpdate, useDelete } from "./api";
import { cols, section,rules, w255,timings,forbidControls,esaving} from "./data";
import { Mainbox, Title, Scene } from "./style";
import BindLight from "./bind";
import { Serach } from "@com/comstyled";
 
const { Link } = Typography;


export default function Index() {
  const delref = useRef();
  const exprotref = useRef();
  const bindRef = useRef();
  const { name } = useSelector(selectUser);
  const [form] = Form.useForm();
  const [newform] = Form.useForm();
  const { projectId } = useOutletContext();
  const areaId = useSelector(selectOneLevelDefaultId);
  const sence = Form.useWatch("scenes", newform);
  const [cusac, setcusac] = useState(0);
  const [cusac1, setcusac1] = useState({
    "0":0,
  });
  const [cusac2, setcusac2] = useState({
    "0":0,
  });
  
  const [isadd, setIsadd] = useState(1); // 0 新增 1 编辑 2 克隆
  const [total, setTotal] = useState(0);
  const [strategyName, setStrategyName] = useState("");
  const editRef = useRef();
  const tbref = useRef();
  const [Ctitle, msg] = useMemo(() => {
    let title = ["新建空调控制方案", "编辑方案", "新建空调控制方案"][isadd];
    let msg = ["新增成功", "编辑成功", "克隆成功"][isadd];
    return [title, msg];
  }, [isadd, strategyName]);

 


  const sectionItems = useMemo(() => {
    let params = {};

    return section({ cusac, setcusac,cusac1, setcusac1,cusac2, setcusac2, params });
  }, [cusac, setcusac,cusac1, setcusac1,cusac2, setcusac2 ]);
  /* const timingsItems = useMemo(() => {
    let params = {
      type:1
    };

    return timings({ cusac1, setcusac1, params });
  }, [cusac1, setcusac1]);

  const forbidControlsItems = useMemo(() => {
    let params = {
      type:1
    }; 

    return forbidControls({ cusac2, setcusac2, params });
  }, [cusac2, setcusac2]);*/
  const downParams = useRef();
  const getData = async ({ current, pageSize }, formData) => {
    try {
      if (!Number.isInteger(parseInt(projectId))) return;
      const { alike = "" } = formData;
      let params = {
        projectId,
        alike,
        pageNum: current,
        pageSize,
      };
      downParams.current = params;
      let { data, success, total, errMsg } = await usePage({}, params);

      if (success && Array.isArray(data)) {
        setTotal(total);
        return {
          list: data,
          total,
        };
      } else {
        if (!success) message.warning(errMsg || "接口出错");
        return {
          list: [],
          total: 0,
        };
      }
    } catch (error) {
      console.log(error);
    }
  };
  const { tableProps, search, refresh } = useAntdTable(getData, {
    form,
    defaultPageSize: 14,
    refreshDeps: [projectId],
  });

  const onAdd = () => {
    setIsadd(0);
    setcusac(0)
    setcusac1({"0":0})
    setcusac2({"0":0})
    newform.setFieldsValue({ projectId, creater: name, id: 0 });

    editRef.current.onOpen();
  };
  const onBind = () => {
    bindRef.current.onOpen();
  };
  const delparams = useRef();
  const onDel = ({ strategyId, strategyName }) => {
    setStrategyName(strategyName);
    delparams.current = {
      id: strategyId,
      projectId,
    };
    delref.current.onOpen();
  };
  const onEdit = (row, type) => {
     try {
      
 
    setIsadd(type);
     console.log(row)
    const { strategies, strategyName, creater, strategyId, ...rest } = row;
    
    console.log(JSON.parse(strategies))
    
    const {controls, esaving} = JSON.parse(strategies)
    const section = controls.map(co => {
      const {  section, forbidControls,timings,eForbid,eTiming } = co
      const {dtEnd,dtStart,weeks,...rest} =section
      return {
         weeks: (Array.isArray(weeks) && weeks.length > 0) ? weeks : null,
         date: [moment(dtStart, "YYYY-MM-DD"),moment(dtEnd, "YYYY-MM-DD")],
         forbidControls:forbidControls.map(f => {
          let {type, dtStart, dtEnd} = f
          return {type, time: [moment(dtStart, "HH:mm"),moment(dtEnd, "HH:mm")]}
         }) ,
         timings:  timings.map(t =>  ({...t, time: moment(t.time, "HH:mm")})),
         eTiming,
         eForbid,
         ...rest

      }



    })
 
    let params = {
      projectId,
      schemeName: type == 1 ? strategyName : strategyName + "_副本",
      section,
      esaving,
      id: type == 1 ? strategyId : 0,
      creater, 
    };

    newform.setFieldsValue(params);
    editRef.current.onOpen();
  } catch (error) {
      console.log(error)
  }
  };

  const onOk = async () => {
    try {
      let values = await newform.validateFields();
      console.log(values)
      const { schemeName,projectId,creater, section,  esaving,id, } = values;
      const {cold, hight, ...erest} = esaving
      const controls = section.map(se => {
        let {checked, date,eForbid, eTiming,  forbidControls,timings,weeks, type, ...rest} = se
        let forbid=forbidControls.filter(f => Array.isArray(f?.time)&&f?.time?.length==2)  
        let timeing = timings.filter(t=> t.time)
        if (type==2) {
           weeks = weeks ? [7] : []
        }
        return {
           eForbid,
           eTiming,
           section: {
            dtStart:date?.[0]?.format?.("YYYY-MM-DD"),
            dtEnd:date?.[1]?.format?.("YYYY-MM-DD"),
            type,
            weeks,
            ...rest
           },
           timings: timeing.map(t=> {
            const {temperature, time, ...ret} =t
             return {
               temperature: Array.isArray(temperature) ? temperature?.[0] : temperature,
               time: time?.format?.("HH:mm"),
               ...ret
             }
           }),
           forbidControls: forbid.map(f=> {
             const {type, time} = f
             return {
               type,
               dtStart: time?.[0]?.format?.("HH:mm"),
               dtEnd: time?.[1]?.format?.("HH:mm")
             }

           })
        }
      })
      const strategies ={
        controls,
        esaving: {
          coldLower: cold?.[0],
          coldUpper: cold?.[1],
          hotLower:hight?.[0],
          hotUpper:hight?.[1],
          ...erest,

        },

      }
      console.dir(strategies)
      let params = {
          projectId,
          creater,
          schemeName,
          id,
          strategies: JSON.stringify(strategies)
      };
     
      let hander = [useAdd, useUpdate, useAdd][isadd];
      let { success, errMsg } = await hander({}, params);
      if (success) {
        message.success(msg);
        if (isadd !== 0) {
          editRef.current.onCancel();
        }
        refresh();
      } else {
        message.warning(errMsg || "数据出错");
        return Promise.reject("")
      }
    } catch (error) {
      console.log(error);
      const {errorFields} = error
      let msg = errorFields.map(e => e.errors.join()).join("|")
      message.warning(msg, 2)
      return Promise.reject("");
    }
  };

  const onOkDel = async () => {
    try {
      let { success, errMsg } = await useDelete(delparams.current);
      if (success) {
        message.success("删除成功");
        delref.current.onCancel();
        refresh();
      } else {
        message.warning(errMsg || "数据出错");
      }
    } catch (error) {}
  };

  const showexport = () => {
    exprotref.current.onOpen();
  };
  const columns = [
    ...cols,
    {
      title: "操作",
      key: "option",
      render: (_, row) => (
        <Space>
          <Link onClick={() => onEdit(row, 1)}>编辑</Link>
          <Link onClick={() => onEdit(row, 2)}>克隆</Link>
          <Link type="danger" onClick={() => onDel(row)}>
            删除
          </Link>
        </Space>
      ),
    },
  ];
  const onExport = useCallback(() => {
    downParams.current.pageNum = 1;
    downParams.current.pageSize = total;
    return usePage({}, downParams.current).then((res) => {
      let { success, data, total } = res;
      if (success && Array.isArray(data)) {
        return {
          list: data,
          total,
        };
      } else {
        if (!success) message.warning(errMsg || "接口出错");
        return {
          list: [],
          total: 0,
        };
      }
    });
  }, [total]);
  const [strategyId, setStrategyId] = useState(null);
  const title = (
    <Title>
      <span>空调控制方案列表</span>
      <Space size={16}>
        <CustButton onClick={() => onAdd()}>新建方案</CustButton>
        <CustButton disabled={!strategyId} onClick={() => onBind()}>
          绑定空调
        </CustButton>
        <ExportExcel tb={tbref}></ExportExcel>
      </Space>
    </Title>
  );

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setStrategyId(selectedRowKeys);
      console.log(
        `selectedRowKeys: ${selectedRowKeys}`,
        "selectedRows: ",
        selectedRows
      );
    },
    type: "radio",
    columnTitle: "选择",
  };
  return (
    <Pagecount pd="0" bgcolor="none">
      <Mainbox>
        <div className="search">
          <Form form={form} layout="inline" colon={false}>
            <Form.Item name="alike">
              <Serach
                onSearch={search.submit}
                placeholder="请输入方案名称或创建人"
              ></Serach>
            </Form.Item>
          </Form>
        </div>
        <Titlelayout layout="flex" title={title}>
          <UserTable
            columns={columns}
            {...tableProps}
            onExport={onExport}
            rowKey={(row) => row.strategyId}
            ref={tbref}
            rowSelection={rowSelection}
            sheetName="空调方案"
          ></UserTable>
        </Titlelayout>
      </Mainbox>
      <CModal
        title={Ctitle}
        onOk={onOk}
        width={1380}
        mold="cust"
        custft={isadd == 0}
        ref={editRef}
      >
        <Form
          form={newform}
          labelAlign="left"
          labelCol={{ flex: "7em" }}
          preserve={false}
          size="small"
          colon={false}
        >
          <Scene>
            <div className="scname" key="scname">
              <Form.Item
                label="方案名称"
                name="schemeName"
                rules={rules}
                labelAlign="left"
              >
                <Input placeholder="请输入" style={w255}></Input>
              </Form.Item>
            </div>
            <div className="mainbox" key="maibox">
              <div className="layout" key="leftlayout">
                <div className="title">控制策略</div>
                {sectionItems}
              {/*   {timingsItems}
                {forbidControlsItems}  */}
                <Form.Item name="id" initialValue={0} noStyle>
                  <Input hidden />
                </Form.Item>
                <Form.Item name="creater" initialValue="" noStyle>
                  <Input hidden></Input>
                </Form.Item>
                <Form.Item name="projectId" noStyle>
                  <Input hidden></Input>
                </Form.Item>
              </div>
              <div className="layout" key="rightlayout">
                <div className="title">
                  节能策略
                </div>
              {esaving}
              </div>
             
            </div>
          </Scene>
        </Form>
      </CModal>

      <CModal
        title="删除"
        ref={delref}
        width={512}
        mold="cust"
        type="warn"
        onOk={onOkDel}
      >
        是否确认删除“{strategyName}”方案？
      </CModal>
      <CModal
        title="批量导入"
        ref={exprotref}
        width={512}
        type="drag"
        onOk={onOkDel}
      ></CModal>
      <BindLight
        strategyId={strategyId}
        projectId={projectId}
        areaId={areaId}
        onrefresh={refresh}
        ref={bindRef}
      />
    </Pagecount>
  );
}
