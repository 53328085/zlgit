import React, { useRef, useState, useEffect } from "react";
import { Space, Form, Select, Input, Radio } from "antd";
import Pagecount from "@com/pagecontent";
import { useSelector } from "react-redux"
import { selectProjectId } from "@redux/systemconfig"
import UserTable from "@com/useTable";
import Titlelayout from "@com/titlelayout";


import { cols } from "./data";

import { useList, useDetail } from "./api.js";

import { Mainwrap, TitleBox } from "./style";
import useTable from "@com/useTable";
import { useAntdTable, useRequest } from "ahooks";

export default function Index() {

  const projectId = useSelector(selectProjectId)

  const [schemeId, setSchemeId] = useState(null)
  const [alike, setAlike] = useState("")
  const [explains, setExplains] = useState([])
  const getDetail = async ({ current, pageSize }) => {
    try {
      if (!(Number.isInteger(projectId) && Number.isInteger(schemeId))) {
        return {
          list: [],
          total: 0
        }
      }
      let { data, success, total } = await useDetail({}, { projectId, schemeId, pageNum: current, pageSize })
      if (success && Array.isArray(data) && data.length) {
        setExplains(Array.isArray(data[0].senceDes) ? data[0].senceDes : [])
        return {
          list: Array.isArray(data[0].streetLightInfo) ? data[0].streetLightInfo : [],
          total
        }
      } else {
        setExplains([])
        return {
          list: [],
          total
        }

      }
    } catch (error) {

    }
  }

  const { tableProps } = useAntdTable(getDetail, {
    pageSize: 14,
    refreshDeps: [projectId, schemeId]
  })

  const getData = async () => {
    try {
      let { success, data, errMsg } = await useList({
        projectId,
        alike,
      });
      if (success && Array.isArray(data) && data.length) {
        //  setOptions(data)
        setSchemeId(data[0]?.id)
        return data
      } else {
        // setOptions([])
        setSchemeId(null)
        if (!success) {
          return Promise.reject(errMsg)
        } else {
          return []
        }

      }
    } catch (error) {
      return Promise.reject(error)
    }
  };
  const { data: options } = useRequest(getData, {
    refreshDeps: [projectId, alike]
  })

  const onChange = (v) => {
    setSchemeId(v.target.value)
  }
  const onSearch = (v) => {
    setAlike(v)
  }



  return (
    <Pagecount pd="0" bgcolor="none">
      <Mainwrap>
        <Titlelayout layout="flex" title="策略列表" dr="column"  >
          <Input.Search placeholder="请输入关键字查询" allowClear onSearch={onSearch} />
          <Radio.Group value={schemeId} onChange={onChange} style={{ marginTop: "16px" }}>
            <Space direction="vertical">
              {
                options?.map?.(o => <Radio value={o.id}>{o.name}</Radio>)
              }
            </Space>
          </Radio.Group>
        </Titlelayout>
        <div className="right">
          <Titlelayout layout="flex" title="园区道路灯控制方案" dr="column">

            <div className="desc">
              {
                explains?.map?.(e => <div className="item">
                  <div className="title">{e.title}</div>
                  <div className="content">
                    <ol>
                      {e.description?.split("\n").map(t => t ? <li>{t}</li> : null)}
                    </ol>

                  </div>
                </div>)
              }
            </div>
            <Titlelayout title="路灯绑定明细" bg="transparent" pv="0px 24px 16px 16px">
              <UserTable columns={cols} {...tableProps} ></UserTable>
            </Titlelayout>
          </Titlelayout>
        </div>
      </Mainwrap>
    </Pagecount>
  );
}
