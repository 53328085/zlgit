import React, { useMemo, useRef, useState, useEffect, useContext} from "react";
import { Space, Form, message } from "antd";
 
import Pagecount from "@com/pagecontent";
import { useNavigate, useLocation } from "react-router-dom";
import {   useRequest } from "ahooks";
import {useSelector,useDispatch} from "react-redux"
import { selectProjectId ,levelDefaultLabel,selectOneLevelDefaultId,setCurrentlevel } from '@redux/systemconfig.js'
 
import { useOutletContext } from "react-router-dom";
 
import {useOverview, useMonitor, usePage } from "./api.js";
import { getTime, isObject } from "@com/usehandler";
 
import {   Mainbox } from "./style";
import {Cspin} from "@com/comstyled"
import {Streetligth,MapCard,Details} from "./components"
import {OverdataContext} from './context'
import {Cform, AreaSelect } from "@com/useSerach/comhead"
export default function Index() {
  const [form] = Form.useForm();
  const dispatch = useDispatch()
  const varlabel = useSelector(levelDefaultLabel)
  const projectId = useSelector(selectProjectId);
  const areaId =useSelector(selectOneLevelDefaultId);
  //const [areaId, setAreaId] =useState(0);
  console.log("areaId",areaId)
  const [overview, setOverView] = useState(null)
 
  const getOverview = async()=>{
    try {
      if([projectId, areaId].some((a) =>Number.isInteger(parseInt(a))) ) {
      let {success, data,errMsg}= await useOverview({projectId, areaId})
      if(success && isObject(data)) {
        setOverView(data)
      }else {
        if(!success) return message.warning(errMsg)
        setOverView({})
      }
    }
    } catch (error) {
      console.log(error)
    }
  }
  useRequest(getOverview, {
    refreshDeps:[projectId, areaId]
  })
 const onChange=(value)=>{
  dispatch(setCurrentlevel(value))
}
/*   useEffect(()=>{
    if(Number.isInteger(parseInt(areaId))) {
      form.setFieldValue("areaId",areaId)
    }
  },[areaId]) */
  return (
  
    <Pagecount pd="0" bgcolor="none">
      <OverdataContext.Provider value={{lightdata: overview, projectId}}>
      <Mainbox>
        <Cform form={form} layout="inline">
          <Form.Item label={varlabel} name="areaId" initialValue={areaId} >
             <AreaSelect  onChange={onChange} />
          </Form.Item>
        </Cform>
      <div className="maincontent">
      <div className="leftlayout">
        <Streetligth lightdata={overview}  />
        <MapCard   />
      </div>
      <Details/>
      </div>
      </Mainbox>
      </OverdataContext.Provider>
    </Pagecount> 
    );
}
