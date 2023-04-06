import React, {useState, useEffect} from 'react'
import {message} from 'antd'
import {getOnelevel} from '@redux/systemconfig.js'
import { useDispatch} from 'react-redux'
import { Area } from "@api/api.js";

export function useOneLevel(projectId, update) {    
    const dispatch = useDispatch()
    const uplevel = async () => {
      try {
        let {success, data}  = await Area.QueryAll({projectId,level: 1,parentId: 0})
        if (success && Array.isArray(data)){ 
           dispatch(getOnelevel(data))
        }else {
            dispatch(getOnelevel([]))
        }
      } catch (error) {
        console.log(error)
      }
    
    }
    useEffect(() => {
        uplevel()
    }, [update])
    return null 
 }
 