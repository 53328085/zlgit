import React, { useRef, useState, useEffect, useMemo } from "react";
import { Space, Form,   Input, Table, DatePicker } from "antd";
import moment from "moment";
 
import { useSelector } from "react-redux";
import { selectProjectId } from "@redux/systemconfig";
import UserTable from "@com/useTable";
import Titlelayout from "@com/titlelayout";
import Details from './details'
import {CustButtonT} from "@com/useButton"
import { useCols,disabledDate } from "../data";

import { usePageAuto,usePageAutoDetails } from "../api.js";

import { Mainwrap } from "../style";

import { useAntdTable  } from "ahooks";
const { RangePicker } = DatePicker;
export default function Index() {
  const [form] = Form.useForm();
  const projectId = useSelector(selectProjectId);
  const dRef = useRef()
  const getDetails = (row) => {
     dRef.current.onOpen(row)
 }
 const cols = useCols(getDetails)
  const getList = async ({ current, pageSize }, formData) => {
    try {
      if (!Number.isInteger(projectId)) {
        return {
          list: [],
          total: 0,
        };
      }
      const { name="", time } = formData;
      if(!(time[0] && time[1])) return;
      let { data, success, total } = await usePageAuto(
        {},
        { projectId, name, pageNum: current, pageSize, dtStart:time[0]?.startOf('day')?.format("YYYY-MM-DD"),dtEnd:time[1].format("YYYY-MM-DD") }
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

  const { tableProps, search } = useAntdTable(getList, {
    form,
    pageSize: 14,
    refreshDeps: [projectId],
  });
  const {submit} = search

 
  return (
    
      <Mainwrap key="auto">
        <div className="up">
          <Form form={form} layout="inline">
            <Space>
            <Form.Item name="name" label="方案名称" rules={[{
              type: "string",
              whitespace:true,
            }]}>
              <Input allowClear></Input>
            </Form.Item>
            <Form.Item
              name="time"
              label="执行时间"
              initialValue={[moment().subtract(1, "months"), moment()]}
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
          <Titlelayout layout="flex" title="路灯控制方案执行明细" dr="column">
            <div className="outTbwrap">
              <div className="intbwrap">
                <UserTable columns={cols} {...tableProps} summary={(pageData)=> { 
                   let bindtotal=0, successtotal = 0 , failtotal = 0, percenttotal ;
                   pageData?.forEach(({bindNum,success, fail}) => {
                      bindtotal+=Number.isInteger(bindNum) ? bindNum : 0
                      successtotal+=Number.isInteger(success) ? success : 0
                      failtotal+=Number.isInteger(fail) ? fail : 0
                   });
                   if(failtotal==0 && successtotal > 0) {
                     percenttotal="100%"
                   }else if(failtotal!==0 && successtotal!==0) {
                      percenttotal =  (parseFloat(successtotal / (failtotal+successtotal))*100)?.toFixed(2) + "%"
                   }
                   return (
                    <>
                      <Table.Summary.Row style={{backgroundColor: "#f6f6f6", textAlign: "center"}}>
                        <Table.Summary.Cell index={0}>汇总</Table.Summary.Cell>
                        <Table.Summary.Cell index={1}>
                           {bindtotal} 
                        </Table.Summary.Cell>
                        <Table.Summary.Cell index={2}>
                           {successtotal} 
                        </Table.Summary.Cell>
                        <Table.Summary.Cell index={3}>
                           {failtotal} 
                        </Table.Summary.Cell>
                        <Table.Summary.Cell index={3}>
                           {percenttotal} 
                        </Table.Summary.Cell>
                        <Table.Summary.Cell index={4}> 
                        </Table.Summary.Cell>
                      </Table.Summary.Row>
                      
                    </>
                  );
                }}></UserTable>
              </div>
            </div>
          </Titlelayout>
        </div>
        <Details projectId={projectId} ref={dRef} />
      </Mainwrap>
  );
}
