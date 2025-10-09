import React, { useState, useEffect } from 'react';
import Building from '@com/building';
import { useOutletContext } from "react-router-dom";
import Pagecount from "@com/pagecontent";
import PhotovoltaicStation from './PhotovoltaicStation';

export default function Index({ pagename }) {
  // 1. 获取 projectId 和 areaId（根据你的实际参数来源调整，以下提供2种常见场景）
  // 场景1：从路由参数获取（推荐，URL 变化时自动更新）
  let { exparams } = useOutletContext();
  let { areaId, projectId } = exparams;
  console.log(areaId, projectId)
  return (
    <Pagecount pd={0}>
      {/* 4. 将 projectId 和 areaId 作为 props 传递给 PhotovoltaicStation */}
      <PhotovoltaicStation
        projectId={projectId}
        areaId={areaId}
      />
    </Pagecount>
  );
}

