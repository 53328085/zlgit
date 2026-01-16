import React, {   useMemo  } from "react";
import {Badge} from 'antd'
 
import Ichart from '@com/useEcharts/Ichart'
import { Leftup } from "../style";
import { colors } from "../data";
 
import Layoutcom from './layout'
export default function Index({datas}) {
 
 
  const len =colors.length
  const total = datas?.reduce?.((a, b) => a + parseFloat(b.value), 0)
  const pieopt=useMemo(() => { 
    return {
        pieData: {
          data: datas,   radius: ["40%", "70%"],color:colors
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
 
  return (
    <Layoutcom title="分项用能占比" subtitle="近7天" flex="582px">
        <Leftup>
        <Ichart {...pieopt}></Ichart>
        <div className="total">
            <div className="totalcontent">
                总计：<span className="num mgr">{total?.toFixed?.(2)}</span>kWh
            </div>
        </div>
        <div className="items">
            {datas?.map?.((item, index) => (<div className="item">
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
