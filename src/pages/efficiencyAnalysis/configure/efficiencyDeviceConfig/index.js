import React, { useRef, useState, useEffect } from "react";
import { Space, Form, Select, Input, Radio, Typography, List } from "antd";
import {PlusCircleOutlined} from "@ant-design/icons"
import Pagecount from "@com/pagecontent";
import { useSelector } from "react-redux"
import { selectProjectId,levelDefaultLabel } from "@redux/systemconfig"
import UserTable from "@com/useTable";
import Titlelayout from "@com/titlelayout";
import {AreaSelect, Cform} from "@com/useSerach/comhead.js"
 

import { cols, mockopt } from "./data";

import { useList, useDetail } from "./api.js";

import { Mainwrap } from "./style";
import{TitleBox} from "@com/comstyled"
import { useAntdTable, useRequest } from "ahooks";

export default function Index() {
  const [form] = Form.useForm();
 // const [params, setexparams] = useState({})
  // const [areaName, setAreaName] = useState()
  const varlabel = useSelector(levelDefaultLabel)
  const projectId = useSelector(selectProjectId)

  const [schemeId, setSchemeId] = useState(null)
  const [alike, setAlike] = useState("")
  const [explains, setExplains] = useState([])
 
  const setexparams = (params) => {
     console.log("params")
     console.log(params)
  }
 
  const props = {
    config:{isdate: true,shiftNo:true},
    setexparams,
     
    //setAreaName,
  };
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

 const Ctitle = (<TitleBox>
  <span>能效设备类型</span>
  <Typography.Link><PlusCircleOutlined style={{marginRight: "8px"}} />添加</Typography.Link>
 </TitleBox>)
 const Dtitle = (<TitleBox>
  <span>设备列表(空压机)</span>
   <Space size={16}></Space>
 </TitleBox>)
  return (
    <Pagecount pd="0" bgcolor="none">
      <Mainwrap>
        <Titlelayout layout="flex" title={Ctitle} dr="column"  >
          <Input.Search placeholder="请输入关键字查询" allowClear onSearch={onSearch} />
          <Radio.Group value={schemeId} onChange={onChange} style={{ marginTop: "16px" }}>
            <List 
            dataSource={mockopt}
            split={false}
            size="small"
            renderItem={(item) => (
              <List.Item>
                {item}
              </List.Item>
            )}
            ></List>
            <Space direction="vertical">
              {
               
              }
             {/*  {
                options?.map?.(o => <Radio value={o.id}>{o.name}</Radio>)
              } */}
            </Space>
          </Radio.Group>
        </Titlelayout>
         
        <div className="right">
          <Cform form={form} layout="inline">
            <Space size={16}>
               <Form.Item label={varlabel} name="areaId">
                <AreaSelect  isall={false} />
               </Form.Item>
               <Form.Item label="设备查询">
                 <Input style={{width: "200px"}}></Input> 
               </Form.Item>
            </Space>
          </Cform>
          <Titlelayout layout="flex" title="空压机列表" dr="column"> 
              <div className="outtbwrap">
                <div className="inerwrap">
                <UserTable columns={cols} {...tableProps} ></UserTable>   
                </div>
              </div>
          </Titlelayout>
        </div>
         
      </Mainwrap>
    </Pagecount>
  );
}
