import React, { useState,  useEffect,memo, useRef } from "react";
import moment from "moment";
import Pagecount from '@com/pagecontent' 
import {useSearchParams, useOutletContext} from 'react-router-dom'
import {EnergyFlowRuntime} from "@api/api"
import {useSelector} from 'react-redux'
import {selectOneLevel, currProject} from '@redux/systemconfig.js'
import {getTime} from '@com/usehandler'
import Titlelayout from '@com/titlelayout'
import {CustButton} from '@com/useButton'
import Ichart  from '@com/useEcharts/Ichart';
 

const {queryElectric, queryWater} = EnergyFlowRuntime
 
 
const Headcom = memo(() => {
  const {projectName,  logoImage  } = useSelector(currProject) 
  return (
    <div style={{height: "64px", display: 'flex', alignItems: "center", backgroundColor: "#036"}}>
        <img src={logoImage} width={200} height={64} style={{marginRight: '16px'}}></img>
        <span style={{fontSize: "22px", color: "#fff"}}>{projectName}综合能源服务平台</span>
    </div>
  )

})
 
 
 
 
 
 
export default function Index() {   
  let {exparams={}} = useOutletContext() || {}
  
  const levelone = useSelector(selectOneLevel)
  const areaId = levelone.map(a => a.id);

  let [searchParams] = useSearchParams()
  const isfull = searchParams.get('full')  
  

 const [options, setOptions] = useState({
  tooltip: {
    trigger: 'item',
    triggerOn: 'mousemove'
  },
  series: [
    {
      type: 'sankey',
      layout: "none",
      emphasis: {
      },
      data: [],
      links: [],
      lineStyle: {
        color: 'gradient',
        curveness: 0.5
      },
      left: 16,
      top: 32,
      bottom: 32,  
      right: 200,
      nodeGap: 8,
     // layoutIterations: 0,
    
    }
  ],
  type: 5,
})
 
  const getData = async () => {
    let store={};
    if(isfull) {
     store = JSON.parse(window.localStorage.getItem('exparams'))
    }
   
    let {type, date, projectId, energytype} =isfull ? store : exparams
    let params  = {
      projectId,
      type,
      date: getTime(moment(date), type)
    }
     try {
      let hander = ['', queryElectric, queryWater][energytype]    
      let {success, data} = await hander(params, areaId)
      if(success && data.constructor==Object) {
       
         const {link=[] } = data
        let arr = []
         let sources = Array.from(new Set([...link.map(i => i.source)]))

      
       
        sources.forEach(s => {
            let depth =link.filter(l => l.source == s).map(d =>  d.target)
            
             arr = [...arr, s, ...depth]

         })    
       
        let datas = Array.from(new Set([...arr])).map(name => ({name}))
       
     /*    let source =  link.map(i => i.source)
        let target = link.map(i => i.target)
        let nodes =Array.from(new Set([...source, ...target])).map(name => ({name}))

        console.log(nodes) */




         let links = link.map(l =>({...l, value: parseFloat(l.value)}))
          setOptions({
            ...options,
            series: [
              {
                ...options.series[0],
                data: datas,
                links,
                label: {
                  fontSize: 10
                },
                nodeAlign: "left",
                nodeGap: 12,
                lineStyle: {
                  color: "source"
                }
              }
            ]
          })
 
      } 
     } catch (error) {
         
     }
     
     
  }
 
  useEffect(() => {
    if(Object.values(exparams).length <4 ) return
    window.localStorage.setItem('exparams', JSON.stringify(exparams))
    getData()
  }, [exparams])
  useEffect(()=> {
     if(isfull) {
      getData()
     }
  }, [isfull])
   const full = () => {
      window.open('/directionfull?full=full')
   }
   const mapref = useRef()

   useEffect(() => {
     if(!mapref.current || !isfull) return
     let map = document.getElementsByClassName('ichartmap')[0];
     window.onmousewheel = (event) => {
      
       let {x, y, deltaY } = event
       let {left, right, top, bottom} = mapref.current.getClientRects()[0]
      
       if(x>left && x<right&& y>top && y<bottom) {      
        if(deltaY > 0) {
          setOptions({
            ...options,
            series: [
              {
                ...options.series[0],
                nodeGap: options.series[0].nodeGap+=2,
              }
            ]
          })
          
          mapref.current.style.height = mapref.current.style.height + 20 + 'px'
        }else {
          setOptions({
            ...options,
            series: [
              {
                ...options.series[0],
                nodeGap: options.series[0].nodeGap<12 ? 10 : options.series[0].nodeGap - 2
              }
            ]
          })
          mapref.current.style.height = mapref.current.style.height - 20 + 'px'
        }
        

       }
     }
   }, [options, isfull])
    return (
      <Pagecount  pd="0px">   
      <Titlelayout title={ (!isfull) && <CustButton onClick={full} style={{marginLeft: "auto" }}>全屏显示</CustButton>} pv={isfull? "0px" : "16px"}   layout="flex" bl="none" dr="column">
          {isfull && <Headcom />}
          <div style={{display: 'flex', flex:1,  alignItems: 'center',justifyContent: 'center',}} ref={mapref}>
               <Ichart  custoption={options}   />
          </div>
       </Titlelayout>
      </Pagecount>
    )
}
