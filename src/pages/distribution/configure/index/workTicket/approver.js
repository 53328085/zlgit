import React, {useEffect} from 'react'
import {DistributionRoomRuntime,distributionRoom} from '@api/api.js'
export default function Index({projectId, areaId}) {

  const getCommanders= async () => {
    await distributionRoom({projectId, areaId, alike:''})
  }
  useEffect(() => {
    if([projectId, areaId].every(n => Number.isInteger(parseInt(n)))){
        getCommanders()
    } 
  }, [projectId, areaId])
  return (
    <div>group</div>
  )
}
