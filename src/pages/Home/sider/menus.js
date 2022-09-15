 import {ScanOutlined} from '@ant-design/icons'
 const Micon = () => {
    return <span className="custicon">&#9673;</span>
 }
 export  const monitoring = [
    {
      label: '运行概述' ,
      key: "outline",
      icon: <Micon />
    },
    {
      label: '测点监测',
      key: "point",
      icon: <Micon />
    },
    {
      label: "网关监测",
      key: "gateway",
      icon: <Micon />
    },
    {
        label: "远程控制",
        key: "remote",
        icon: <Micon />
    },
    {
        label: "视频监控",
        key: "video",
        icon: <Micon />
    },
    {
        label: "告警监控",
        key: "warning",
        icon: <Micon />
    },
    {
        label: "配电系统图",
        key: "electrica",
        icon: <Micon />
    },
    {
        label: "损耗分析",
        key: "loss",
        icon: <Micon />
    },
    {
        label: "用户报告",
        key: "report",
        icon: <Micon />
    },
    {
      label: "操作日志",
      key: "oplog",
      icon: <Micon />
  },
   ]



   export  const energy = [
    {
      label: '能源概述' ,
      key: "summary",
      icon: <Micon />
    },
    {
      label: '综合能耗',
      key: "synthetical",
      icon: <Micon />
    },
    {
      label: "能耗排名",
      key: "ranking",
      icon: <Micon />
    },
    {
        label: "分时能耗",
        key: "timesharing",
        icon: <Micon />
       
    },
    {
        label: "能耗用量",
        key: "usage",
        icon: <Micon />
      
    },
    {
        label: "能耗流向",
        key: "direction",
        icon: <Micon />
       
    },
    {
        label: "损耗分析",
        key: "analysis",
        icon: <Micon />
    },
    {
        label: "能耗指标",
        key: "quota",
        icon: <Micon />
    },
    {
        label: "公共能耗",
        key: "comm",
        icon: <Micon />
    },
   ]