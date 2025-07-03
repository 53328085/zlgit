import React, { useRef, useState, useEffect, useMemo } from "react";
import { Space, Form,   Input, Table, DatePicker } from "antd";
import moment from "moment";
import Pagecount from "@com/pagecontent";
import { useSelector } from "react-redux";
import { selectProjectId } from "@redux/systemconfig";
import UserTable from "@com/useTable";
import Titlelayout from "@com/titlelayout";
import {CustButtonT} from "@com/useButton"
import { cols } from "./data";

import { usePage } from "./api.js";

import { Mainwrap } from "./style";

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
      const { name="", time } = formData;
      if(!(time[0] && time[1])) return;
      let { data, success, total } = await usePage(
        {},
        { projectId, name, pageNum: current, pageSize, dtStart:time[0].format("YYYY-MM-DD HH:mm:ss"),dtEnd:time[1].format("YYYY-MM-DD HH:mm:ss") }
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

  const { tableProps, search } = useAntdTable(getDetail, {
    form,
    pageSize: 14,
    refreshDeps: [projectId],
  });
  const {submit} = search

  const disabledDate = (current) => {
    
    return   current > moment().endOf('day');
  };
  return (
    <Pagecount pd="0" bgcolor="none">
      <Mainwrap>
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
              initialValue={[moment().startOf("day"), moment()]}
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
                      percenttotal =  (parseFloat(failtotal / (failtotal+successtotal))*100)?.toFixed(2) + "%"
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
      </Mainwrap>
    </Pagecount>
  );
}
