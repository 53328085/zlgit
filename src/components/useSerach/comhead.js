import React, { useState, useEffect, useRef, useMemo, Fragment } from "react";
import { useLocation } from "react-router-dom"
import { Form, Select, Space, DatePicker, message, Input, Button, } from "antd";
import { useRequest } from 'ahooks'
import styled from "styled-components";
import { ExportExcel, i18t, CustTransO } from '@com/useButton'
import { useSelector, useDispatch } from 'react-redux'
import { levelDefaultLabel, selectProjectId, selectshifts, filterDeviceStyle, selectOneLevelDefaultId, selectOneLevel, setCurrentlevel, deviceStyle, getThemeColor, themeColor, setIntl, adaptation } from '@redux/systemconfig.js'
import moment from "moment";
import 'moment/locale/zh-cn';
const { RangePicker } = DatePicker;
import { SiteManagerDesigner, PCSMonitorRuntime, StorageContainerDesigner, Editapi } from '@api/api'
import { Cdivider, Radiogroup } from '@com/comstyled'
import { filterProps } from '@com/usehandler'


import Enery from "./enery";

const { FindContainerList } = StorageContainerDesigner  //储能柜

const Cform = styled(Form)`
    background: #fff;
    padding: 7px 16px;
    border-top: 1px solid #dedede;
    border-bottom: 1px solid #dedede;
    height: max-content;
    display: flex;
   &&{
    .ant-form-item {
        margin: 0px;
    }
   } 
`



const { Item } = Form;
export const AreaSelect = ({ value, onChange, isall, ...otherProps }) => {
  const levelone = useSelector(selectOneLevel)
  const filter = levelone?.filter?.(f => f.id != 0);
  let options = [];
  if (filter?.length > 0) {
    options = isall ? [isall, ...filter] : filter
  }

  return (
    <Select  {...otherProps} defaultValue={value} onChange={onChange} options={options} fieldNames={{ label: 'name', value: 'id', options: 'options' }}>

    </Select>
  )

}
// 1.   状态中获取
export default function UseSerach(props) {


  const { config = {}, custview = null, record = null } = props

  const { isAreaId = true, gas = true, daterang = 'day', isdaterange = false } = config
  const dispatch = useDispatch()

  const { state = {} } = useLocation()
  const { nested, primary } = state

  const [form] = Form.useForm()

  if (JSON.stringify(form.getFieldsValue()) === '{}') {
    form.setFieldValue('date', moment())
  }

  const projectId = useSelector(selectProjectId)
  const varlabel = useSelector(levelDefaultLabel)
  const oneLevelDefaultId = useSelector(selectOneLevelDefaultId) // 选择后的值 
  let [AreaID, setAreaid] = useState(oneLevelDefaultId)
  const [energyoptions, setEnergyoptions] = useState([])
  const energyTypeDefault = useRef(1)
  const levelone = useSelector(selectOneLevel)
  const { laptop } = useSelector(adaptation)
  //const DeviceStyle = useSelector(filterDeviceStyle)  
  const [DeviceStyle, setDeviceStyle] = useState([])

  const areaName = levelone?.find(l => l.id == AreaID)?.name;
  props.setAreaName(areaName)
  let shifts = useSelector(selectshifts)

  const [allshifts] = useState([...shifts, { id: 0, name: i18t("comm", "Allflights"), startTime: "", endTime: "" }])
  const [options, setOptions] = useState([]) // 

  const [pcsoptions, setPcsoptions] = useState([])
  const [tankoptions, setTankoptions] = useState([])
  const deviceStyles = useSelector(deviceStyle)
  let currdeviceStyle = `deviceStyle_${projectId}`
  const getDever = async () => {
    try {
      let stordevices = window.localStorage.getItem(currdeviceStyle);
      let initdeviceStyle = parseInt(stordevices)

      let { success, data } = await Editapi.FilterDeviceStyle(projectId)
      if (success && Array.isArray(data) && data.length > 0) {
        let filte = data.filter(d => d.deviceStyle != 6)
        setDeviceStyle(filte)
        if (initdeviceStyle && filte.find(d => d.deviceStyle == initdeviceStyle)) {
          form.setFieldValue('deviceStyle', initdeviceStyle)
        } else {
          form.setFieldValue('deviceStyle', filte[0].deviceStyle)
        }
      } else {
        form.setFieldValue('deviceStyle', null)
        if (!success) return
        if (filte?.length == 0) message.warning('没有设置设备')
      }

      props.setexparams({ ...form.getFieldsValue(true) })
    } catch (error) {
      console.log(error)
    }

  }

  const getEnergyType = async () => {
    try {
      if (!Number.isInteger(parseInt(projectId))) return
      let { success, data } = await Editapi.QueryEnergyType(projectId)
      if (success && Array.isArray(data) && data?.length) {
        let types = data.map((d, index) => ({ label: d.name, value: d.type }))
        energyTypeDefault.current = types[0].value
        setEnergyoptions(types)
      } else {
        energyTypeDefault.current = 1
        setEnergyoptions([])
      }
    } catch (error) {
      console.log(error)
    }
  }
  const getopti = async () => { // 站点选择
    try {
      let { success, data, errMsg } = await SiteManagerDesigner.FindSiteList(projectId, AreaID)
      if (success && Array.isArray(data) && data.length > 0) {
        setOptions([...data])
        let { name: stationName, id } = data[0]
        form.setFieldValue('stationName', { label: stationName, value: id, })

        props.setexparams({ ...form.getFieldsValue(true) })

        if (props.config.isTank) getTank();
        if (props.config.isPcs && !props.config.isTank) getPcs();
      } else {
        setOptions([])
        form.setFieldsValue({
          stationName: { label: null, value: null, id: null }
        })
        props.setexparams({ ...form.getFieldsValue(true) })
        if (!success) return message.warning(errMsg)
        if (data?.length < 1) return message.warning("站点暂无数据")
      }
    } catch (error) {
      console.log(error)
    }

  }
  useEffect(() => {
    if (!props.config?.isSite) return;
    if (Number.isInteger(AreaID) && Number.isInteger(projectId)) {
      getopti();

    }


  }, [props.config?.isSite, AreaID, projectId])
  useEffect(() => {
    if (Number.isInteger(projectId) && props.config?.isdevsty) {
      getDever()
    }

  }, [projectId, props.config?.isdevsty])

  useEffect(() => {
    getEnergyType()
  }, [projectId])

  const onChange = (e, option) => {
    dispatch(setCurrentlevel(option))
    setAreaid(e)
  }
  let dateoption = daterang == 'week' ? [
    { value: 1, label: i18t("comm", "week") },
    { value: 2, label: i18t("comm", "month") },
    { value: 3, label: i18t("comm", "year") },
  ] : [
    { value: 1, label: i18t("comm", "day") },
    { value: 2, label: i18t("comm", "month") },
    { value: 3, label: i18t("comm", "year") },
  ]
  const changetype = (v) => {
    if (v == 1 && isdaterange) {
      form.setFieldValue("date", [moment().subtract(7, "day"), moment()])
    } else {
      form.setFieldValue("date", moment())
    }
    props.setexparams({ ...form.getFieldsValue(true) })
  }
  const dateselect = (
    <Space size={16} style={{ marginLeft: '16px' }}>
      <Item name="type" initialValue={1} key="electricity" preserve={false}>
        <Select style={{ width: '80px' }} onChange={changetype} options={dateoption}></Select>
      </Item>
      <Item noStyle shouldUpdate={(pre, cur) => pre.type != cur.type}  >
        {
          ({ getFieldValue, setFieldValue }) => {
            let type = (daterang == 'week' ? ['week', 'week', 'month', 'year'] : ['date', 'date', 'month', 'year'])[getFieldValue('type')]
            return (
              <Item name="date" >
                {(type == 'date' && isdaterange) ? <RangePicker></RangePicker> : <DatePicker picker={type} style={{ width: '160px' }} />}
              </Item>
            )
          }
        }
      </Item>
      {!props.config?.shiftNo && <Item name="shiftNo" initialValue={0}>
        <Select style={{ width: '100px' }} options={allshifts} fieldNames={{ label: 'name', value: 'id' }}

        ></Select>
      </Item>
      }
    </Space>

  )

  const carbonDateY = (
    <Item label={<CustTransO ns="comm" text="Assessmentyear" />} name="carbonY" initialValue={moment()} >
      <DatePicker picker="year" />
    </Item>
  )
  const carbonDateR = (
    <Item label="" name="">
      <RangePicker />
    </Item>
  )
  const viewtype = (<Item name="view" initialValue={1} >
    <Radiogroup
      options={[
        {
          label: '能耗',
          value: 1,
        },
        {
          label: '费用',
          value: 2,
        }]}
      optionType="button"
      buttonStyle="solid"
    />
  </Item>
  )
  // 能源类型

  //   const energyoptions = gas ? [{
  //     label: '用电',
  //     value: 1
  //   }, {
  //     label: '冷水',
  //     value: 2
  //   }, {
  //     label: '热水',
  //     value: 7
  //   }, /* {
  //   label: '燃气',
  //   value: 3
  // } */] : [{
  //     label: '用电',
  //     value: 1
  //   }, {
  //     label: '冷水',
  //     value: 2
  //   }, {
  //     label: '热水',
  //     value: 7
  //   }]
  const energyChange = (v) => {
    let e = v > 1 ? 2 : 1 //电表默认日，其他设备默认月
    form.setFieldValue("type", e)
    changetype(e)
  }
  const energytype = (
    <Item label="能源类型" name="energytype" initialValue={energyTypeDefault.current}>
      <Select style={{ width: 112 }} options={energyoptions} onChange={energyChange}></Select>
    </Item>
  )
  const getTank = async () => { // 初始化、 站点改变时 ; 储能柜
    if (!props.config.isTank) return;
    try {
      const { areaId, stationName } = form.getFieldsValue();

      if (!(Number.isInteger(areaId) && stationName?.value)) return
      let { success, data, errMsg } = await FindContainerList(projectId, areaId, stationName?.value)
      if (success && Array.isArray(data) && data.length > 0) {
        setTankoptions(data)

        form.setFieldValue('containerId', { value: data[0].id, label: data[0].name })
        props.setexparams({ ...form.getFieldsValue(true) })
        if (props.config?.isPcs) getPcs()

      } else {
        form.setFieldValue('containerId', { label: null, value: null })
        props.setexparams({ ...form.getFieldsValue(true) })
        setTankoptions([])
        if (!success) return message.warning(errMsg || '数据出错')
        if (data?.length == 0) return message.warning("当前站点暂无储能柜数据")
      }
    } catch (error) {

    }


  }


  const getPcs = async () => {
    try {
      let { areaId, stationName, containerId = { value: 0 } } = form.getFieldsValue(true)
      let { success, data, errMsg } = await PCSMonitorRuntime.queryPCSList(projectId, areaId, stationName?.value, containerId.value)
      if (success && Array.isArray(data) && data.length > 0) {
        setPcsoptions(data)

        form.setFieldsValue({
          pcsId: { value: data[0].id, label: data[0].sn }
        })
        props.setexparams({ ...form.getFieldsValue(true) })
      } else {
        setPcsoptions([])
        form.setFieldValue('pcsId', { label: null, value: null })
        props.setexparams({ ...form.getFieldsValue(true) })
        if (!success) return message.warning(errMsg || "数据出错")
        if (data?.length == 0) return message.warning('当前站点不存在PCS!')
      }
    } catch (error) {
      console.log(error)
    }

  }


  // 设备类型

  const deviceStyleChange = (v) => {

    window.localStorage.setItem(currdeviceStyle, v);
  }

  const deviceStyleNode = (<Item name="deviceStyle" label={i18t("comm", "type", { text: "设备" })}  >

    <Select options={DeviceStyle} fieldNames={{ label: "name", value: "deviceStyle" }} style={{ width: laptop ? "160px" : '200px' }} onChange={deviceStyleChange} {...filterProps}></Select>
  </Item>)
  // 站点选择
  const site = (<Item name="stationName" label="站点"   >
    <Select options={options} onChange={getTank} fieldNames={{ label: 'name', value: 'id' }} style={{ width: laptop ? "160px" : '264px' }} labelInValue></Select>
  </Item>)
  // 储能柜
  const tank = (<Item name="containerId" label="储能柜" >
    <Select options={tankoptions} onChange={getPcs} fieldNames={{ label: 'name', value: 'id' }} style={{ width: laptop ? "160px" : '264px' }} labelInValue></Select>
  </Item>)
  // pcs选择
  const pcs = (<Item name="pcsId" label="PCS" >
    <Select options={pcsoptions} fieldNames={{ label: 'sn', value: 'id' }} style={{ width: laptop ? "160px" : '264px' }} {...filterProps}></Select>
  </Item>)








  useEffect(() => {
    if (levelone.length < 1) message.error('当前项目尚未创建园区!')
  }, [levelone])

  const onValuesChange = (_, allValues) => {

    props.setexparams({ ...allValues })
  }

  useEffect(() => {
    if (!config.gas) {
      let v = form.getFieldValue('energytype');
      if (v == 3) form.setFieldValue('energytype', 1)
    }
    if (config.dateType) {
      form.setFieldValue('type', config.dateType)

    } else {
      form.setFieldValue('type', 1)
    }

    if (config.meterType) {
      form.setFieldValue('deviceStyle', config.meterType)
    }
    props.setexparams({ ...form.getFieldsValue(true) })

  }, [props.config, projectId])

  useEffect(() => {

    if (nested == "public" && primary == 'runtimeEnergy') {
      form.setFieldValue('date', [moment().startOf("day"), moment()])
    } else {
      form.setFieldValue('date', moment(new Date(), "YYYY-MM-DD"))
    }
  }, [nested, primary])
  return (

    <Cform layout="inline" form={form}   {...props.formprop}
      onValuesChange={onValuesChange}
      style={{ displey: 'flex', justifyContent: 'space-between' }} >
      <Space size={16} >
        {isAreaId && <Item label={varlabel} name='areaId' initialValue={AreaID}>
          <Select style={{ width: "200px" }} onChange={onChange} options={levelone} fieldNames={{ label: 'name', value: 'id', options: 'options' }}>

          </Select>

        </Item>
        }
        {props.config?.isSite && site}
        {props.config?.isTank && tank}
        {props.config?.isPcs && pcs}
        {props.config?.isdevsty && deviceStyleNode}
        {props.config?.isview && viewtype}
        {props.config?.energytype && energytype}

      </Space>

      {
        props.config?.isdate && dateselect
      }
      {
        props.config?.custview && custview
      }
      {
        props.config?.export ? <ExportExcel /> : null
      }
      {
        props.config?.dateY && carbonDateY // 碳排管理--碳排考核跟踪
      }
      {
        props.config?.dateR && carbonDateR // 碳排管理-- 碳排分析
      }

      <Item noStyle name="projectId" initialValue={projectId}>
        <Input hidden />
      </Item>

      {/* {
          props.config.textloop && <Textloop />
        } */}

    </Cform>


  );
}
