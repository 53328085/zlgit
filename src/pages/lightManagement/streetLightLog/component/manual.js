import React, { useRef, useState, useEffect, useMemo } from "react";
import { Space, Form,   Input, Table, DatePicker, Select, message } from "antd";
import moment from "moment";
 
import { useSelector } from "react-redux";
import { selectProjectId } from "@redux/systemconfig";
import UserTable from "@com/useTable";
import Titlelayout from "@com/titlelayout";
import {CustButtonT,CustButton} from "@com/useButton"
import { result,disabledDate,state,manualcol } from "../data";

import { usePageManual,useSetReControl } from "../api.js";

import { Mainwrap,TitleBox } from "../style";

import { useAntdTable  } from "ahooks";
const { RangePicker } = DatePicker;
export default function Index() {
  const [form] = Form.useForm();
  const projectId = useSelector(selectProjectId);
  
 
 
  const getDetail = async ({ current, pageSize }, formData) => {
    try {
      if (!Number.isInteger(projectId)) {
        return {
          list: [],
          total: 0,
        };
      }
      const { name="", operater="", time, ...rest } = formData;
      if(!(time[0] && time[1])) return;
      let { data, success, total } = await usePageManual(
        {},
        { projectId,name, operater,  pageNum: current, pageSize, dtStart:time[0]?.startOf('day')?.format("YYYY-MM-DD HH:mm:ss"),dtEnd:time[1].format("YYYY-MM-DD HH:mm:ss"), ...rest }
      );
      if (success && Array.isArray(data) && data.length) {
        return {
          list: data,
          total,
        };
      } else {
        return {
          list: [],
          total,
        };
      }
    } catch (error) {}
  };

  const { tableProps, search, refresh } = useAntdTable(getDetail, {
    form,
    defaultPageSize: 15,
    refreshDeps: [projectId],
  });
  const {submit} = search

  const [selectedRow, setSelectedRow] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const onSelectChange = (newSelectedRowKeys, row) => {
    setSelectedRowKeys(newSelectedRowKeys)
 setSelectedRow(row);
 };
 const rowSelection = {
   selectedRowKeys,
   onChange: onSelectChange,
 };
const onControl =async()=> {
 try {
   if(selectedRow?.length <1) return message.warning("请选择设备")
   let conditions =selectedRow.map(s => ({brightness:s.brightness, csn:s.csn, dev:s.dev, type:s.type,gateway:s.gateway}))
   let body = {
     projectId,
     conditions
   }
   let {success, errMsg} = await useSetReControl({}, body)
   if(success) {
    message.success("重新控制成功")
    refresh()
   }else {
     message.warning(errMsg || "数据出错")
   }
  
 } catch (error) {
   console.log(error)
 }

}
  const Ctitle =<TitleBox>
    <span>手动控制执行明细</span>
    <CustButton onClick={onControl}>重新控制</CustButton>
  </TitleBox>

  return ( 
      <Mainwrap key="manual">
        <div className="up">
          <Form form={form} layout="inline">
            <Space>
            <Form.Item name="name" label="路灯名称" rules={[{
              type: "string",
              whitespace:true,
            }]}>
              <Input allowClear></Input>
            </Form.Item>
            <Form.Item name="operater" label="操作人" rules={[{
              type: "string",
              whitespace:true,
            }]}>
              <Input allowClear></Input>
            </Form.Item>
            <Form.Item name="result" label="控制状态" initialValue="0" >
              <Select options={result} style={{width: "180px"}}></Select>
            </Form.Item>
            <Form.Item name="ioState" label="在线状态" initialValue="0" >
              <Select options={state} style={{width: "180px"}}></Select>
            </Form.Item>
            <Form.Item
              name="time"
              label="操作时间"
              initialValue={[moment().subtract(1,"months"), moment()]}
              rules={[{
                required: true,
                message: "请选择执行执行时间"
              }]}
            ><RangePicker disabledDate={disabledDate}></RangePicker>
            </Form.Item>
            <CustButtonT text="search" onClick={submit}></CustButtonT>
            </Space>
          </Form>
        </div>
        <div className="down">
          <Titlelayout layout="flex" title={Ctitle} dr="column">
            <div className="outTbwrap">
              <div className="intbwrap">
                <UserTable columns={manualcol} {...tableProps} rowSelection={rowSelection} rowKey="id" ></UserTable>
              </div>
            </div>
          </Titlelayout>
        </div>
      </Mainwrap> 
  );
}
