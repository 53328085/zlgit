import React, { useRef, useState, useEffect } from "react";
import { Space, Form, Select, Input, Radio, Empty } from "antd";
import Pagecount from "@com/pagecontent";
import { useSelector } from "react-redux"
import { selectProjectId } from "@redux/systemconfig"
import UserTable from "@com/useTable";
import Titlelayout from "@com/titlelayout";
import BlueColumn from '@com/bluecolumn'
import Cempty from '@com/useEmpty'
import { i18t } from "@com/useButton"
import { cols } from "./data";

import emptyImg from './img/empty.svg'

import { useList, useDetail } from "./api.js";

import { Mainwrap, TitleBox } from "./style";
import { useAntdTable, useRequest } from "ahooks";

export default function Index() {

  const week = [
    { label: '周一', value: 1 },
    { label: '周二', value: 2 },
    { label: '周三', value: 3 },
    { label: '周四', value: 4 },
    { label: '周五', value: 5 },
    { label: '周六', value: 6 },
    { label: '周日', value: 0 },
  ]
  const getweek = new Map();
  week.forEach(w => {
    getweek.set(w.value, `${w.label}`)
  })
  console.log(getweek.get(0))
  const projectId = useSelector(selectProjectId)

  const [schemeId, setSchemeId] = useState(null)
  const [schemeName, setSchemeName] = useState('')
  const [alike, setAlike] = useState("")
  const [controlInfos, setControlInfos] = useState([])
  const [savingInfo, setSavingInfo] = useState([])
  const getDetail = async ({ current, pageSize }) => {
    try {
      if (!(Number.isInteger(projectId) && Number.isInteger(schemeId))) {
        return {
          list: [],
          total: 0
        }
      }
      let { data, success } = await useDetail({}, { projectId, schemeId, pageNum: current, pageSize })
      if (success && Array.isArray(data) && data.length) {
        setControlInfos(Array.isArray(data[0].controlInfos) ? data[0].controlInfos : [])
        setSavingInfo(Array.isArray(data[0].savingInfo) ? data[0].savingInfo : [])
        return {
          list: Array.isArray(data[0].airConditionerInfo) ? data[0].airConditionerInfo : [],
          total: data[0].airConditionerInfo.length
        }
      } else {
        setControlInfos([])
        setSavingInfo([])
        return {
          list: [],
          total: 0
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
        setSchemeId(data[0]?.id)
        setSchemeName(data[0]?.name)
        return data
      } else {
        setSchemeId(null)
        setSchemeName('')
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
    const selectedOption = options.find(opt => opt.id === v.target.value);
    if (selectedOption) {
      setSchemeName(selectedOption.name); // 更新选中的label
    } else {
      setSchemeName('');
    }
  }
  const onSearch = (v) => {
    setAlike(v)
  }



  return (
    <Pagecount pd="0" bgcolor="none">
      <Mainwrap>
        <Titlelayout layout="flex" title="空调控制方案列表" dr="column" bordered >
          <Input.Search placeholder="请输入关键字查询" allowClear onSearch={onSearch} />
          <Radio.Group value={schemeId} onChange={onChange} style={{ marginTop: "16px", maxHeight: "748px" }}>
            <Space direction="vertical" style={{ height: '690px', overflowY: "auto", width: "100%", scrollbarWidth: "thin" }}>
              {
                options?.map?.(o => <Radio value={o.id}>{o.name}</Radio>)
              }
            </Space>
          </Radio.Group>
        </Titlelayout>
        <div className="right">
          <Titlelayout layout="flex" title={schemeName} dr="column" bordered>
            <div className="scheme">
              <div className="scheme_left">
                <BlueColumn bg={{ height: 6, width: 6, borderRadius: '50%' }}
                  name='控制方案'>
                </BlueColumn>
                {controlInfos.length !== 0 ?
                  <div className="desc"
                    style={{ height: controlInfos.length < 2 ? '160px' : '329px' }}>

                    {
                      controlInfos?.map?.((e, index) => <div className="item">
                        <div className="title">{e.name}<div className="controlNum">{index + 1}/{controlInfos.length}</div> </div>
                        <div className="controlData">
                          <div className="timeBox">
                            <div className="titleName">时间区间</div>
                            <div className="time">
                              <div>{e.desc}</div>
                              <div className="day">
                                {/* {e?.weeks?.map?.(time => <div key={time} className="daybox">{getweek.get(time)}</div>)} */}
                                {e.type === 1 ? <>{week?.map?.(time => {
                                  const isInWeeks = e?.weeks?.includes(time.value);
                                  let className = "";
                                  if (isInWeeks) {
                                    className = time.value === 0 || time.value === 6 ? "green-text" : "blue-text";
                                  }
                                  else {
                                    className = "nomal-text";
                                  }

                                  return <div key={time.value} className={`${className} daybox`}>{time.label}</div>;
                                })}</>
                                  : <div className={e?.weeks[0] === 7 ? 'daybox green-text legal-holidays' : 'daybox legal-holidays'}>法定节假日</div>}
                              </div>
                            </div>
                          </div>
                          <div className="contentBox">
                            <div className="titleName">方案内容</div>
                            {e?.contentInfo?.map?.(info => <div className="schemeName">
                              <div className="schemeTitle">{info.content}</div>
                              <div className="con">{info.description}</div>
                            </div>)}
                          </div>
                        </div></div>
                      )
                    }
                  </div> :
                  <div className="desc" style={{ height: controlInfos.length < 2 ? '160px' : '329px' }}>
                    {/* <Cempty tip='暂无数据' /> */}
                    <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#606266' }}>
                      <Empty
                        image={emptyImg}
                        description={'暂无数据' ?? i18t("comm", "NoDataAvailable")}
                        imageStyle={{ width: '48px', height: '48px' }}
                      />
                    </div>
                  </div>}
              </div>
              <div className="scheme_right">
                <BlueColumn bg={{ height: 6, width: 6, borderRadius: '50%' }}
                  name='节能方案'>
                </BlueColumn>
                {savingInfo.length !== 0 ?
                  <div className="desc"
                    style={{ height: controlInfos.length < 2 ? '160px' : '329px' }}>
                    {savingInfo.map?.(e => <div className="schemeName"><div className="title">{e.content}</div>{e.description}</div>)}
                  </div> :
                  <div className="empty" style={{ height: controlInfos.length < 2 ? '160px' : '329px' }}>
                    {/* <Cempty tip='暂无数据' /> */}
                    <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#606266' }}>
                      <Empty
                        image={emptyImg}
                        description={'暂无数据' ?? i18t("comm", "NoDataAvailable")}
                        imageStyle={{ width: '48px', height: '48px' }}
                      />
                    </div>
                  </div>}
              </div>
            </div>
            <BlueColumn bg={{ height: 6, width: 6, borderRadius: '50%' }}
              name='空调绑定明细'>
            </BlueColumn>
            <UserTable style={{ marginTop: "5px" }} columns={cols} {...tableProps} scroll={{ y: controlInfos.length < 2 ? 370 : 195 }}></UserTable>
          </Titlelayout>
        </div>
      </Mainwrap>
    </Pagecount>
  );
}