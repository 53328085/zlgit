import React, { useState, useEffect, useRef, useMemo, Fragment } from "react";
import {useLocation} from 'react-router-dom'
import { Form, Select, Space, DatePicker, message, Input, Button, Typography } from "antd";
import { useRequest } from 'ahooks'
import styled from "styled-components";
import { ExportExcel, i18t, CustTransO } from '@com/useButton'
import { useSelector, useDispatch } from 'react-redux'
import { levelDefaultLabel, selectProjectId, selectshifts, filterDeviceStyle, selectOneLevelDefaultId, selectOneLevel, setCurrentlevel, deviceStyle, getThemeColor, themeColor, setIntl, adaptation,lightlevel } from '@redux/systemconfig.js'
import moment from "moment";
import 'moment/locale/zh-cn';
const { RangePicker } = DatePicker;
import { SiteManagerDesigner, PCSMonitorRuntime, StorageContainerDesigner, Editapi, PhotovoltaicPowerGeneration } from '@api/api' 
import { filterProps } from '@com/usehandler'
import {
  SyncOutlined,
} from '@ant-design/icons';
const { Link } = Typography
import { publicdateType, Daterange, w200, w88,viewopt } from "./data"
import Enery from "./enery";
import AreaLevel from './areas'

const { FindContainerList } = StorageContainerDesigner  //储能柜

const Cform = styled(Form)`
    background: ${props=>props.theme.isdark ? "dark" : "#fff"} ;
    padding: 7px 16px;
    border-top: 1px solid ${props=>props.theme.isdark ? "dark" : "#dedede"};
    border-bottom: 1px solid ${props=>props.theme.isdark ? "dark" : "#dedede"};
    height: max-content;
    display: flex;
    column-gap: 16px;
    border-radius: 8px;
   &&{
    .ant-form-item {
        margin: 0px;
    }
   } 
`

export {Cform};

const { Item } = Form;
export const AreaSelect = ({ value, onChange, isall, ...otherProps }) => {
  const levelone = useSelector(selectOneLevel)
   const lightone = useSelector(lightlevel)
  const location = useLocation();
   const { state } = location
  const options = useMemo(() => {
     let levels = state?.primary==="lightManagement" ? lightone : levelone
     const filter = levels?.filter?.(f => f.id != 0);
 
    
     return isall ? [isall, ...filter] : filter
   
    
  }, [levelone,lightone, state?.primary, isall])
  return (
    <Select   style={w200} {...otherProps} defaultValue={value} onChange={onChange} options={options}  fieldNames={{ label: 'name', value: 'id', options: 'options' }}>

    </Select>
  )

}


// 1.   状态中获取
export default function UseSerach(props) {


  const { config = {}, custview = null, record = null } = props

  const { isAreaId = true, gas = true, isLevles=false, daterang = 'day', formsty = {} } = config
  const dispatch = useDispatch()



  const [form] = Form.useForm()



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
    form.setFieldValue("date", moment())
    props.setexparams({ ...form.getFieldsValue(true) })
  }
  const dateselect = (
    <Space size={16}>
      <Item name="type" initialValue={1} key="electricity" preserve={false}>
        <Select style={w88} onChange={changetype} options={dateoption}></Select>
      </Item>
      <Item noStyle shouldUpdate={(pre, cur) => pre.type != cur.type}  >
        {
          ({ getFieldValue, setFieldValue }) => {
            let type = (daterang == 'week' ? ['week', 'week', 'month', 'year'] : ['date', 'date', 'month', 'year'])[getFieldValue('type')]
            return (
              <Item name="date" initialValue={moment()} >
                <DatePicker picker={type} style={w200} />
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
    <Item label="" name="rangePicker" initialValue={[moment().subtract(1, 'months'), moment()]}>
      <RangePicker />
    </Item>
  )

  const viewtype = (<Item label="能源类型" name="view" initialValue={1} >
    <Select
      options={viewopt}
       style={w200}
       onChange={() => props.setexparams({ ...form.getFieldsValue(true) })}
    />
  </Item>
  )

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

  const { primaryColor } = useSelector(themeColor)

  // 能源管理 --公共能耗
  const changepublic = (e) => {
    if (e == 4) {
      form.setFieldValue("publicrangedate", [moment().subtract("day", 7), moment().endOf("day")])
    } else {
      form.setFieldValue("publicdate", moment())
    }
    props.setexparams({ ...form.getFieldsValue(true) })
  }
  const publicDate = <Space size={16}>
    <Form.Item name="publictype" initialValue={1}>
      <Select options={publicdateType} style={{ width: "140px" }} onChange={changepublic}></Select>
    </Form.Item>
    <Form.Item noStyle shouldUpdate={(cur, pre) => cur.publictype != pre.publictype}>
      {
        ({ getFieldValue, setFieldValue }) => {
          let type = getFieldValue("publictype")
          console.log("type", type)
          const picker = { "1": "date", "2": "month", "3": "year" }[type?.toString()]

          if (type == 4) {
            return <Form.Item name="publicrangedate" initialValue={[moment().startOf("day"), moment().endOf("day")]}  >
              <Daterange rangeDate={31} />
            </Form.Item>
          } else {
            return <Form.Item name="publicdate" initialValue={moment()}>
              <DatePicker picker={picker} />
            </Form.Item>
          }
        }
      }
    </Form.Item>


  </Space>


  useEffect(() => {
    if (!props.config?.photovoltaicPowerStation) return;
    if (Number.isInteger(AreaID) && Number.isInteger(projectId)) {
      getStation();
    }
  }, [props.config, AreaID, projectId])
  const [powerstationData, setPowerstationData] = useState([]) //光伏站点
  const [cabinetData, setCabinetData] = useState([])//并网柜
  const [InverterData, setInverterData] = useState([])//逆变器
  const getStation = async () => {
    try {
      let { success, data, errMsg } = await PhotovoltaicPowerGeneration.QueryStationList(projectId, AreaID)
      if (success && Array.isArray(data) && data.length > 0) {
        setPowerstationData([...data])
        let { name, id } = data[0]
        form.setFieldValue('photovoltaicPowerStation', { label: name, value: id, })
        console.log(props.config.cabinet)
        props.setexparams({ ...form.getFieldsValue(true) })
        if (props.config.cabinet) getCabinet();
      } else {
        setPowerstationData([])
        form.setFieldsValue({
          photovoltaicPowerStation: { label: null, value: null, id: null }
        })
        props.setexparams({ ...form.getFieldsValue(true) })
        if (!success) return message.warning(errMsg)
        if (data?.length < 1) return message.warning("光伏站点暂无数据")
      }
    } catch (error) {
      console.log(error)
    }
  }
  const getCabinet = async () => {
    try {
      if (!props.config.cabinet) return
      let { areaId, photovoltaicPowerStation } = form.getFieldsValue(true)
    //  console.log(areaId, photovoltaicPowerStation)
      let { success, data, errMsg } = await PhotovoltaicPowerGeneration.QueryGirdCabientList(projectId, areaId, photovoltaicPowerStation?.value)
      if (success && Array.isArray(data) && data.length > 0) {
        setCabinetData(data)

        form.setFieldsValue({
          cabinet: { value: data[0].id, label: data[0].name }
        })
        props.setexparams({ ...form.getFieldsValue(true) })
        if (props.config.cabinet && props.config.inverter) getInverter();
      } else {
        setCabinetData([])
        form.setFieldValue('cabinet', { label: null, value: null })
        props.setexparams({ ...form.getFieldsValue(true) })
        if (!success) return message.warning(errMsg || "数据出错")
        if (data?.length == 0 && props.config.cabinet) return message.warning('当前光伏站点不存在并网柜!')
      }
    } catch (error) {
      console.log(error)
    }

  }
  const getInverter = async () => {
    try {
      let { cabinet } = form.getFieldsValue(true)
      if (cabinet == undefined) return
      let { success, data, errMsg } = await PhotovoltaicPowerGeneration.QueryInverterList(projectId, cabinet?.value)
      if (success && Array.isArray(data) && data.length > 0) {
        setInverterData(data)

        form.setFieldsValue({
          inverter: data[0].sn
        })
        props.setexparams({ ...form.getFieldsValue(true) })
      } else {
        setInverterData([])
        form.setFieldValue('inverter', null)
        props.setexparams({ ...form.getFieldsValue(true) })
        if (!success) return message.warning(errMsg || "数据出错")
        if (data?.length == 0) return message.warning('当前并网柜不存在逆变器!')
      }
    } catch (error) {
      console.log(error)
    }
  }
  const changetInverter = (e) => {
    props.setexparams({ ...form.getFieldsValue(true) })
  }
  const photovoltaicPowerStation = (
    <Item name="photovoltaicPowerStation" style={{ color: `${primaryColor}` }} label="光伏站点">
      {/* powerStationData */}
      <Select options={powerstationData} fieldNames={{ label: 'name', value: 'id' }} labelInValue style={{ width: "140px" }} onChange={getCabinet}></Select>
    </Item>

  )

  const cabinet = (
    <Item name="cabinet" style={{ color: `${primaryColor}` }} label="并网柜">
      {/* inverterData */}
      <Select options={cabinetData} fieldNames={{ label: 'name', value: 'id' }} labelInValue style={{ width: "140px" }} onChange={getInverter}></Select>
    </Item>
  )
  const inverter = (
    <Item name="inverter" style={{ color: `${primaryColor}` }} label="逆变器">
      {/* inverterData */}
      <Select options={InverterData} fieldNames={{ label: 'name', value: 'sn' }} style={{ width: "140px" }} onChange={changetInverter}></Select>
    </Item>
  )
  const onRefresh = () => {
    props.setexparams({ ...form.getFieldsValue(), refresh: {} });
  }
  const refresh = (
    <Item name="refresh" style={{ color: `${primaryColor}` }} initialValue={{ name: "refresh" }}>
      <Link onClick={onRefresh}><SyncOutlined style={{ color: `${primaryColor}` }} /> 刷新</Link>
    </Item>

  )


  useEffect(() => {
    if (levelone.length < 1) message.error('当前项目尚未创建园区!')
  }, [levelone])

  const onValuesChange = (_, allValues) => { 
    console.log(allValues)
    props.setexparams({ ...allValues })
  }

  useEffect(() => {
    form.resetFields()
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
    if(oneLevelDefaultId==0) {
      form.setFieldValue('areaId', 0)
    }
    props.setexparams({ ...form.getFieldsValue(true) })

  }, [props.config, projectId, oneLevelDefaultId])

  /*   useEffect(() => {
  
      if (nested == "public" && primary == 'runtimeEnergy') {
        form.setFieldValue('date', [moment().startOf("day"), moment()])
      } else {
        form.setFieldValue('date', moment(new Date(), "YYYY-MM-DD"))
      }
    }, [nested, primary]) */
  return (

    <Cform layout="inline" form={form} colon={false}  {...props.formprop}
      onValuesChange={onValuesChange}
      style={{ displey: 'flex',  ...formsty }} >
      <Space size={16} >
        {isAreaId && <Item label={varlabel} name='areaId' initialValue={AreaID}>
          <Select style={w200} onChange={onChange} options={levelone} fieldNames={{ label: 'name', value: 'id', options: 'options' }}>

          </Select>

        </Item>
        }
         {props.config?.isLevles && <AreaLevel setexparams={props.setexparams} />} 
        {props.config?.isSite && site}
        {props.config?.isTank && tank}
        {props.config?.isPcs && pcs}
        {props.config?.isdevsty && deviceStyleNode}
        {props.config?.isview && viewtype}
        {props.config?.energytype && energytype}
        {
          props.config?.photovoltaicPowerStation && photovoltaicPowerStation //光伏发电-光伏站点
        }
        {
          props.config?.cabinet && cabinet //光伏发电-并网柜
        }
        {
          props.config?.inverter && inverter //光伏发电-逆变器
        }
      </Space>
      <Space size={16}>
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
          props.config?.dateR && carbonDateR // 碳排管理-- 碳排分析  光伏发电--告警消息
        }
        {
          props.config.publicDate && publicDate // 能源管理--公共能耗
        }
        {
          props.config?.refresh && refresh //光伏发电
        }
      </Space>



      <Item noStyle name="projectId" initialValue={projectId}>
        <Input hidden />
      </Item>

      {/* {
          props.config.textloop && <Textloop />
        } */}

    </Cform>


  );
}
