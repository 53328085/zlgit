import React, { useMemo, useRef, useState, useCallback, useContext} from "react";
import { Space, Form, message } from "antd";
 
import Pagecount from "@com/pagecontent";
import { useNavigate, useLocation } from "react-router-dom";
import {   useRequest } from "ahooks";
import {useSelector} from "react-redux"
import { selectProjectId ,levelDefaultLabel} from '@redux/systemconfig.js'
 
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
  const varlabel = useSelector(levelDefaultLabel)
  const projectId = useSelector(selectProjectId);
  const [areaId, setAreaId] =useState(0);
  
  const [overview, setOverView] = useState(null)
 
  const getOverview = async()=>{
    try {
      if(!Number.isInteger(parseInt(projectId))) return
      let {success, data,errMsg}= await useOverview({projectId, areaId})
      if(success && isObject(data)) {
        setOverView(data)
      }else {
        if(!success) return message.warning(errMsg)
        setOverView({})
      }
    } catch (error) {
      console.log(error)
    }
  }
  useRequest(getOverview, {
    refreshDeps:[projectId, areaId]
  })
 
  const isall= { name: `${varlabel}(全部)`, id: 0, levelName: varlabel }
  return (
  
    <Pagecount pd="0" bgcolor="none">
      <OverdataContext.Provider value={{lightdata: overview, projectId}}>
      <Mainbox>
        <Cform form={form} layout="inline">
          <Form.Item label={varlabel} name="areaId" initialValue={areaId}>
             <AreaSelect  isall={isall}  onChange={setAreaId} />
          </Form.Item>
        </Cform>
      <div className="maincontent">
      <div className="leftlayout">
        <Streetligth lightdata={overview}  />
        <MapCard lightdata={overview} projectId={projectId} />
      </div>
      <Details/>
      </div>
      </Mainbox>
      </OverdataContext.Provider>
    </Pagecount> 
    );
}
