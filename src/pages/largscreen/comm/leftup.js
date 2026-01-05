import React, { useEffect, useMemo, useState } from "react";
import {Badge} from 'antd'
import { useSelector } from "react-redux";
import { selectProjectId, selectOneLevelDefaultId } from "@redux/systemconfig";
import { isObject } from "@com/usehandler";
import Ichart from '@com/useEcharts/Ichart'
import { Leftup } from "../style";
import { colors } from "../data";
import { useQueryOverview } from "../api";
import dayjs from "dayjs";
import Layoutcom from './layout'
export default function Index() {
  const areaId = useSelector(selectOneLevelDefaultId);
  const projectId = useSelector(selectProjectId);
  const [datas, setDatas] = useState({
    pie: [],
    total: null,
  });
  const len =colors.length
  const getData = async () => {
    try {
      let body = {
        projectId: projectId,
        dayMonthYear: 1,
        startDate: dayjs().subtract(7,"day").format("YYYY-MM-DD"),
        endDate: dayjs().format("YYYY-MM-DD"),
        areaIds: [areaId],
        meterType: 1,
        name: "全部",
        group: 1,
      };
      let { data, success } = await useQueryOverview({}, body);
      if (success && isObject(data)) {
        let { proportion, total } = data;
        if (Array.isArray(proportion)) {
          setDatas({ pie: proportion, total: parseFloat(total?.periodValue) });
        } else {
          setDatas({ pie: [], total: parseFloat(total?.periodValue)
          });
        }
      }
    } catch (e) {
      console.log(e);
    }
  };
  const pieopt=useMemo(() => { 
    return {
        pieData: {
          data: datas.pie,   radius: ["40%", "70%"],color:colors
        },
        type: 3,    
        legend: { 
            show:false,
        },
        grid: {
            containLabel: true,
            left: 0,
            right: 0,
          },
        
      };
  }, [datas]);
  useEffect(() => {
    if ([areaId, projectId].some((id) => Number.isInteger(parseInt(id)))) {
      getData();
    }
  }, [areaId, projectId]);
  return (
    <Layoutcom title="分项用能占比" subtitle="近7天" flex="582px">
        <Leftup>
        <Ichart {...pieopt}></Ichart>
        <div className="total">
            <div className="totalcontent">
                总计：<span className="num mgr">{datas?.total?.toFixed?.(2)}</span>kWh
            </div>
        </div>
        <div className="items">
            {datas?.pie?.map?.((item, index) => (<div className="item">
                <div className="value">
                    <Badge color={colors[index%len]} text={item.name}></Badge>
                    <div><span >{parseFloat(item.value)?.toFixed?.(2)}</span> kWh</div>
                </div>
            </div>
))}
        </div>
        </Leftup>
    </Layoutcom>
  );
}
