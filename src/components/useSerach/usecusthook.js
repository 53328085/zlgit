

import { message } from "antd";
import {useAllLevel, useQueryAll,useQuerySpaceTrees} from "./api"
import React, { useState, useEffect } from 'react';

export function useGetAllLevel(projectId) { 
   const [alllevel, setAllevel]=useState(null);
   const getLevel =async () => {
     try {
      const {success, data} = await useAllLevel({projectId});
      if(success && Array.isArray(data) && data.length) {
        setAllevel(data);
      }else {
        if(!data || !data.length) {
            message.warning('获取层级失败,请设置区域层级')
        }
      }
      
     } catch (error) {
       
     }
    
      
   };
   useEffect(() => {
     if (Number.isInteger(parseInt(projectId))) {
      getLevel()
     }
   }, [projectId])


   return alllevel
}

export function useGetQueryAll(projectId,level) { 
    const [alllevel, setAllevel]=useState(null);
    const getLevel =async () => {
      try {
       const {success, data} = await useQueryAll({projectId,level});
       if(success && Array.isArray(data) && data.length) {
         setAllevel(data);
       }else {
        setAllevel(null);
         if(!data || !data.length) {
             message.warning('获取层级失败,请设置区域层级')
         }
       }
       
      } catch (error) {
        
      }
     
       
    };
    useEffect(() => {
      if (Number.isInteger(parseInt(projectId)) && Number.isInteger(parseInt(level))) {
       getLevel()
      }
    }, [projectId, level])
 
 
    return alllevel
 }
 export function useGetSpaceTrees(projectId,areaId,isall) {  // isall=false 能耗分类设置态页面  配置
 
  const [alllevel, setAllevel]=useState(null);
  const [allAreaId, setAllAreaId] = useState([]);
 
  const getAreaId = (nodes,  arr, child = 'nodes') => {
    if (Array.isArray(nodes)) {
      for (let node of nodes) {
        let {areaId} = node
           arr.push(areaId )
        if (node[child] && Array.isArray(node[child]) && node[child]?.length > 0) {
          getAreaId(node[child], arr, child)
        }
      }
    }
  }
  const getLevel =async () => {
    try {
     let {success, data} = await useQuerySpaceTrees({projectId,areaId, name:""});
     if(success && Array.isArray(data) && data.length) {
        if(areaId===0 && isall) {
           data = [{
             areaId:0,
             name:"全部区域",
             level:0,
             nodes:data
           }]
        }
        let arr=[];
         getAreaId(data, arr)
         if(isall) {
          setAllAreaId(arr)
         }else {
          setAllAreaId([data[0].areaId])
         }
        
         setAllevel(data);       
     }else {
       if(!data || !data.length) {
           message.warning('获取层级失败,请设置区域层级')
       }
     }
     
    } catch (error) {
      console.log(error);
    }
   
     
  };
  useEffect(() => {
    if (Number.isInteger(parseInt(projectId)) && Number.isInteger(parseInt(areaId))) {
     getLevel()
    }
  }, [projectId, areaId])


  return [alllevel, allAreaId]
}