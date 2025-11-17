

import { message } from "antd";
import {useAllLevel, useQueryAll} from "./api"
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