import React from "react";
 
import { isObject } from "@com/usehandler";
 
 
import { Right3rd } from "../style";
import imgurl from '../icon'
import {useGetHuaDongStreetLightRunInfo} from '../api'
import {useGetData,usebarlineright2nd } from '../usehook'
import Ichart from '@com/useEcharts/Ichart'
import Layoutcom from "./layout";
export default function Index() {
  const data = useGetData(useGetHuaDongStreetLightRunInfo);
  const { lightRate, lightTypes,todayEUsed } =isObject(data) ? data : {}
  const option = []
  return (
    <Layoutcom title="路灯运行情况" flex="185px">
      <Right3rd>
        <div className="streetlingtMap" key="rate">
           <Ichart custoption={[]} />
         </div>
          <div className="streetlingtMap" key="light">
           <Ichart custoption={[]} />
         </div>
          <div className="streetlingtMap" key="electric">
           <Ichart custoption={[]} />
         </div>
      </Right3rd>
    </Layoutcom>
  );
}
