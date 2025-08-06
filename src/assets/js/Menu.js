export const basic = [
    {
        name: 'rectangle',
        icon: 'icon-rect',
        data: {
            text: '正方形',
            rect: {
                width: 100,
                height: 100
            },
            paddingLeft: 10,
            paddingRight: 10,
            paddingTop: 10,
            paddingBottom: 10,
            name: 'rectangle'
        }
    },
    {
        name: 'rectangle',
        icon: 'icon-rectangle',
        data: {
            text: '圆角矩形',
            rect: {
                width: 200,
                height: 50
            },
            paddingLeft: 10,
            paddingRight: 10,
            paddingTop: 10,
            paddingBottom: 10,
            borderRadius: 0.1,
            name: 'rectangle'
        }
    },
    {
        name: 'circle',
        icon: 'icon-circle',
        data: {
            text: '圆',
            rect: {
                width: 100,
                height: 100
            },
            name: 'circle',
            textMaxLine: 1
        }
    },
    {
        name: 'triangle',
        icon: 'icon-triangle',
        data: {
            text: '三角形',
            rect: {
                width: 100,
                height: 100
            },
            name: 'triangle'
        }
    },
    {
        name: 'diamond',
        icon: 'icon-diamond',
        data: {
            text: '菱形',
            rect: {
                width: 100,
                height: 100
            },
            name: 'diamond'
        }
    },
    {
        name: 'pentagon',
        icon: 'icon-pentagon',
        data: {
            text: '五边形',
            rect: {
                width: 100,
                height: 100
            },
            name: 'pentagon'
        }
    },
    {
        name: 'hexagon',
        icon: 'icon-hexagon',
        data: {
            text: '六边形',
            rect: {
                width: 100,
                height: 100
            },
            paddingTop: 10,
            paddingBottom: 10,
            name: 'hexagon'
        }
    },
    {
        name: 'pentagram',
        icon: 'icon-pentagram',
        data: {
            text: '五角星',
            rect: {
                width: 100,
                height: 100
            },
            name: 'pentagram'
        }
    },
    {
        name: 'leftArrow',
        icon: 'icon-arrow-left',
        data: {
            text: '左箭头',
            rect: {
                width: 200,
                height: 100
            },
            name: 'leftArrow'
        }
    },
    {
        name: 'rightArrow',
        icon: 'icon-arrow-right',
        data: {
            text: '右箭头',
            rect: {
                width: 200,
                height: 100
            },
            name: 'rightArrow'
        }
    },
    {
        name: 'twowayArrow',
        icon: 'icon-twoway-arrow',
        data: {
            text: '双向箭头',
            rect: {
                width: 200,
                height: 100
            },
            name: 'twowayArrow'
        }
    },
    {
        name: 'line',
        icon: 'icon-line',
        data: {
            text: '直线',
            rect: {
                width: 100,
                height: 100
            },
            name: 'line'
        }
    },
    {
        name: 'text',
        icon: 'icon-text',
        data: {
            text: '文本 / Text',
            rect: {
                width: 160,
                height: 30
            },
            name: 'text'
        }
    }
]

export const flows = [
    {
        name: '开始/结束',
        icon: 'icon-flow-start',
        data: {
            text: '开始',
            rect: {
                width: 120,
                height: 40
            },
            borderRadius: 0.5,
            name: 'rectangle'
        }
    },
    {
        name: '流程',
        icon: 'icon-rectangle',
        data: {
            text: '流程',
            rect: {
                width: 120,
                height: 40
            },
            name: 'rectangle'
        }
    },
    {
        name: '判定',
        icon: 'icon-diamond',
        data: {
            text: '判定',
            rect: {
                width: 120,
                height: 60
            },
            name: 'diamond'
        }
    },
    {
        name: '数据',
        icon: 'icon-flow-data',
        data: {
            text: '数据',
            rect: {
                width: 120,
                height: 50
            },
            name: 'flowData'
        }
    },
    {
        name: '准备',
        icon: 'icon-flow-ready',
        data: {
            text: '准备',
            rect: {
                width: 120,
                height: 50
            },
            name: 'hexagon'
        }
    },
    {
        name: '子流程',
        icon: 'icon-flow-subprocess',
        data: {
            text: '子流程',
            rect: {
                width: 120,
                height: 50
            },
            name: 'flowSubprocess'
        }
    },
    {
        name: '数据库',
        icon: 'icon-db',
        data: {
            text: '数据库',
            rect: {
                width: 80,
                height: 120
            },
            name: 'flowDb'
        }
    },
    {
        name: '文档',
        icon: 'icon-flow-document',
        data: {
            text: '文档',
            rect: {
                width: 120,
                height: 100
            },
            name: 'flowDocument'
        }
    },
    {
        name: '内部存储',
        icon: 'icon-internal-storage',
        data: {
            text: '内部存储',
            rect: {
                width: 120,
                height: 80
            },
            name: 'flowInternalStorage'
        }
    },
    {
        name: '外部存储',
        icon: 'icon-extern-storage',
        data: {
            text: '外部存储',
            rect: {
                width: 120,
                height: 80
            },
            name: 'flowExternStorage'
        }
    },
    {
        name: '队列',
        icon: 'icon-flow-queue',
        data: {
            text: '队列',
            rect: {
                width: 100,
                height: 100
            },
            name: 'flowQueue'
        }
    },
    {
        name: '手动输入',
        icon: 'icon-flow-manually',
        data: {
            text: '手动输入',
            rect: {
                width: 120,
                height: 80
            },
            name: 'flowManually'
        }
    },
    {
        name: '展示',
        icon: 'icon-flow-display',
        data: {
            text: '展示',
            rect: {
                width: 120,
                height: 80
            },
            name: 'flowDisplay'
        }
    },
    {
        name: '并行模式',
        icon: 'icon-flow-parallel',
        data: {
            text: '并行模式',
            rect: {
                width: 120,
                height: 50
            },
            name: 'flowParallel'
        }
    },
    {
        name: '注释',
        icon: 'icon-flow-comment',
        data: {
            text: '注释',
            rect: {
                width: 100,
                height: 100
            },
            name: 'flowComment'
        }
    }
]

export const sgcc = [
    {
        name: '太阳能',
        icon: 'sgcc sgcc-taiyangneng',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '发电机',
        icon: 'sgcc sgcc-fadianji',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '馈线',
        icon: 'sgcc sgcc-kuixian',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '下字型排列cab右',
        icon: 'sgcc sgcc-xiazixingpailiecabyou1',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '三相三个次级绕组电流互感器',
        icon: 'sgcc sgcc-sanxiangsangecijiraozudianliuhuganqi',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '两相三个次级绕组电流互感器',
        icon: 'sgcc sgcc-liangxiangsangecijiraozudianliuhuganqi',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '单相三个次级绕组电流互感器',
        icon: 'sgcc sgcc-danxiangsangecijiraozudianliuhuganqi',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '三相六个次级绕组电流互感器',
        icon: 'sgcc sgcc-sanxiangliugecijiraozudianliuhuganqi',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '两相五个次级绕组电流互感器',
        icon: 'sgcc sgcc-liangxiangwugecijiraozudianliuhuganqi',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '三相五个次级绕组电流互感器',
        icon: 'sgcc sgcc-sanxiangwugecijiraozudianliuhuganqi',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '检修符',
        icon: 'sgcc sgcc-jianxiufu1',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '交叉跨越',
        icon: 'sgcc sgcc-jiaochakuayue1',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '建议孔位',
        icon: 'sgcc sgcc-jianyikongwei1',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '禁止遥控',
        icon: 'sgcc sgcc-jinzhiyaokong1',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '接地符',
        icon: 'sgcc sgcc-jiedifu1',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '缺陷符',
        icon: 'sgcc sgcc-quexianfu1',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '双绕组有载可调变压器Dyn（中性点引出三角形-星形连接）',
        icon: 'sgcc sgcc-shuangraozuyouzaiketiaobianyaqiDynzhongxingdianyinchusanjiaoxing-xingxinglianjie',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '两相六个次级绕组电流互感器',
        icon: 'sgcc sgcc-liangxiangliugecijiraozudianliuhuganqi1',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '临时符',
        icon: 'sgcc sgcc-linshifu1',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '临时保电符',
        icon: 'sgcc sgcc-linshibaodianfu1',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '空余孔位',
        icon: 'sgcc sgcc-kongyukongwei',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '管道',
        icon: 'sgcc sgcc-guandao1',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '跌落式熔断器（分）',
        icon: 'sgcc sgcc-dielashirongduanqifen2',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '工作许可',
        icon: 'sgcc sgcc-gongzuoxuke1',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '复合孔位',
        icon: 'sgcc sgcc-fuhekongwei1',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '电缆终端站',
        icon: 'sgcc sgcc-dianlanzhongduanzhan1',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '电缆排管',
        icon: 'sgcc sgcc-dianlanpaiguan1',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '电缆桥',
        icon: 'sgcc sgcc-dianlanqiao1',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '重要用户符',
        icon: 'sgcc sgcc-zhongyaoyonghufu1',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '电抗器',
        icon: 'sgcc sgcc-diankangqi1',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '有载可调压自耦变压器',
        icon: 'sgcc sgcc-youzaiketiaoyazioubianyaqi2',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '用户供电点',
        icon: 'sgcc sgcc-yonghugongdiandian',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '保护接地',
        icon: 'sgcc sgcc-baohujiedi',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '已批复未实施孔位',
        icon: 'sgcc sgcc-yipifuweishishikongwei',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '已申请未批复孔位',
        icon: 'sgcc sgcc-yishenqingweipifukongwei',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '不可并符',
        icon: 'sgcc sgcc-bukebingfu',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '保留孔位',
        icon: 'sgcc sgcc-baoliukongwei',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '已实施孔位',
        icon: 'sgcc sgcc-yishishikongwei',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '一个绕组上有中间抽头的变压器',
        icon: 'sgcc sgcc-yigeraozushangyouzhongjianchoutoudebianyaqi1',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '保安锁符',
        icon: 'sgcc sgcc-baoansuofu',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '无功补偿器',
        icon: 'sgcc sgcc-wugongbuchangqi',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '五绕组电压互感器',
        icon: 'sgcc sgcc-wuraozudianyahuganqi',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '尾线符',
        icon: 'sgcc sgcc-weixianfu',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '未知孔位',
        icon: 'sgcc sgcc-weizhikongwei',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '损坏孔位',
        icon: 'sgcc sgcc-sunhuaikongwei',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '四绕组电压互感器',
        icon: 'sgcc sgcc-siraozudianyahuganqi',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '电容式电压互感器',
        icon: 'sgcc sgcc-dianrongshidianyahuganqi',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '三绕组有载可调变压器1（星形-三星形-星形连接）',
        icon: 'sgcc sgcc-sanraozuyouzaiketiaobianyaqi1xingxing-sanxingxing-xingxinglianjie',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '三绕组变压器1（星形-三星形-星形连接）',
        icon: 'sgcc sgcc-sanraozubianyaqi1xingxing-sanxingxing-xingxinglianjie',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '三绕组有载可调变压器（星形-三星形-星形连接）',
        icon: 'sgcc sgcc-sanraozuyouzaiketiaobianyaqixingxing-sanxingxing-xingxinglianjie',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '双绕组有载可调变压器YNd（中性点引出星形-三角形连接）',
        icon: 'sgcc sgcc-shuangraozuyouzaiketiaobianyaqiYNdzhongxingdianyinchuxingxing-sanjiaoxinglianjie',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '双绕组变压器Yyn（中性点引出星形-星形连接）',
        icon: 'sgcc sgcc-shuangraozubianyaqiYynzhongxingdianyinchuxingxing-xingxinglianjie',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '分裂电抗器',
        icon: 'sgcc sgcc-fenliediankangqi',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '钢管塔（直线型）',
        icon: 'sgcc sgcc-gangguantazhixianxing',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '开闭器',
        icon: 'sgcc sgcc-kaibiqi',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '配变监测仪',
        icon: 'sgcc sgcc-peibianjianceyi',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '三角形排列cab',
        icon: 'sgcc sgcc-sanjiaoxingpailiecab',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '下字型排列abc右',
        icon: 'sgcc sgcc-xiazixingpailieabcyou',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '下字型排列cba左',
        icon: 'sgcc sgcc-xiazixingpailiecbazuo',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '下字型排列bac',
        icon: 'sgcc sgcc-xiazixingpailiebac',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '水平排列abc',
        icon: 'sgcc sgcc-shuipingpailieabc',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '可遥控符',
        icon: 'sgcc sgcc-keyaokongfu',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '保电符',
        icon: 'sgcc sgcc-baodianfu',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '信号符',
        icon: 'sgcc sgcc-xinhaofu',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '停用符',
        icon: 'sgcc sgcc-tingyongfu',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '手动符',
        icon: 'sgcc sgcc-shoudongfu',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '自切符',
        icon: 'sgcc sgcc-ziqiefu',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '单切',
        icon: 'sgcc sgcc-danqie',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '洪水冲刷区',
        icon: 'sgcc sgcc-hongshuichongshuaqu',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '强腐蚀区',
        icon: 'sgcc sgcc-qiangfushiqu',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '开口三角形连接的三相绕组',
        icon: 'sgcc sgcc-kaikousanjiaoxinglianjiedesanxiangraozu',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '三角形接的三相绕组',
        icon: 'sgcc sgcc-sanjiaoxingjiedesanxiangraozu',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: 'T形连接的三相绕组',
        icon: 'sgcc sgcc-Txinglianjiedesanxiangraozu',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: 'v行连接的三相绕组',
        icon: 'sgcc sgcc-vhanglianjiedesanxiangraozu',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '中性点引出的四相绕组',
        icon: 'sgcc sgcc-zhongxingdianyinchudesixiangraozu',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '互不连接的m相绕组',
        icon: 'sgcc sgcc-hubulianjiedemxiangraozu',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '两相四个次级绕组电流互感器',
        icon: 'sgcc sgcc-liangxiangsigecijiraozudianliuhuganqi',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '三相四个次级绕组电流互感器',
        icon: 'sgcc sgcc-sanxiangsigecijiraozudianliuhuganqi',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '手车刀闸（试验）',
        icon: 'sgcc sgcc-shouchedaozhashiyan',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '检修）',
        icon: 'sgcc sgcc-jianxiu1',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: 'T型开关AB-C',
        icon: 'sgcc sgcc-TxingkaiguanAB-C',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '跌落式熔断器（分）',
        icon: 'sgcc sgcc-dielashirongduanqifen1',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '运行光能发电站',
        icon: 'sgcc sgcc-yunhangguangnengfadianzhan',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '规划光能发电站',
        icon: 'sgcc sgcc-guihuaguangnengfadianzhan',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '双向隔离开关（分）',
        icon: 'sgcc sgcc-shuangxianggelikaiguanfen',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '双三角形连接的六相绕组',
        icon: 'sgcc sgcc-shuangsanjiaoxinglianjiedeliuxiangraozu',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '双绕组有载可调变压器YNd（中性点引出星形-三角形连接）2',
        icon: 'sgcc sgcc-shuangraozuyouzaiketiaobianyaqiYNdzhongxingdianyinchuxingxing-sanjiaoxinglianjie2',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '双绕组有载可调变压器Yyn（中性点引出星形-星形连接）',
        icon: 'sgcc sgcc-shuangraozuyouzaiketiaobianyaqiYynzhongxingdianyinchuxingxing-xingxinglianjie',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '三相一个次级绕组电流互感器',
        icon: 'sgcc sgcc-sanxiangyigecijiraozudianliuhuganqi',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '水泥杆',
        icon: 'sgcc sgcc-shuinigan',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '双向隔离开关（左）',
        icon: 'sgcc sgcc-shuangxianggelikaiguanzuo',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '上字型排列右bca',
        icon: 'sgcc sgcc-shangzixingpailieyoubca',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '水平排列cba',
        icon: 'sgcc sgcc-shuipingpailiecba',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '铁塔（直线型）',
        icon: 'sgcc sgcc-tietazhixianxing',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '铁塔（耐张型）',
        icon: 'sgcc sgcc-tietanaizhangxing',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '自调谐消弧线圈',
        icon: 'sgcc sgcc-zitiaoxiexiaohuxianquan',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '通信电缆段',
        icon: 'sgcc sgcc-tongxindianlanduan',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '无功补偿箱',
        icon: 'sgcc sgcc-wugongbuchangxiang',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '微气候、微地形区',
        icon: 'sgcc sgcc-weiqihouweidixingqu',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '下字型排列acb左',
        icon: 'sgcc sgcc-xiazixingpailieacbzuo',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '下字型排列acb右',
        icon: 'sgcc sgcc-xiazixingpailieacbyou',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '下字型排列bca右',
        icon: 'sgcc sgcc-xiazixingpailiebcayou',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '下字型排列bca左',
        icon: 'sgcc sgcc-xiazixingpailiebcazuo',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '下字型排列cab左',
        icon: 'sgcc sgcc-xiazixingpailiecabzuo',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '双绕组变压器Yzn（中性点引出三角形-曲形连接）',
        icon: 'sgcc sgcc-shuangraozubianyaqiYznzhongxingdianyinchusanjiaoxing-quxinglianjie',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '双绕组变压器Yd（中性点引出星形-三角形连接）',
        icon: 'sgcc sgcc-shuangraozubianyaqiYdzhongxingdianyinchuxingxing-sanjiaoxinglianjie',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '消弧线圈',
        icon: 'sgcc sgcc-xiaohuxianquan',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '箱式变',
        icon: 'sgcc sgcc-xiangshibian',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '下字型排列cba右',
        icon: 'sgcc sgcc-xiazixingpailiecbayou',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '壁龛交接箱',
        icon: 'sgcc sgcc-bikanjiaojiexiang',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '一个绕组',
        icon: 'sgcc sgcc-yigeraozu',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '避雷器',
        icon: 'sgcc sgcc-bileiqi',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '星形连接的六相绕组',
        icon: 'sgcc sgcc-xingxinglianjiedeliuxiangraozu',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '星形连接的三相绕组',
        icon: 'sgcc sgcc-xingxinglianjiedesanxiangraozu',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '变电站',
        icon: 'sgcc sgcc-biandianzhan',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '垂直排列acb',
        icon: 'sgcc sgcc-chuizhipailieacb',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '移相变压器',
        icon: 'sgcc sgcc-yixiangbianyaqi',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '采集终端',
        icon: 'sgcc sgcc-caijizhongduan',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '大跨越区',
        icon: 'sgcc sgcc-dakuayuequ',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '垂直排列abc',
        icon: 'sgcc sgcc-chuizhipailieabc',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '永久接头',
        icon: 'sgcc sgcc-yongjiujietou',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '垂直排列bac',
        icon: 'sgcc sgcc-chuizhipailiebac',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '垂直排列bca',
        icon: 'sgcc sgcc-chuizhipailiebca',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '易受外力破坏区',
        icon: 'sgcc sgcc-yishouwailipohuaiqu',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '易受风害区',
        icon: 'sgcc sgcc-yishoufenghaiqu',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '导线段',
        icon: 'sgcc sgcc-daoxianduan',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '运行等离子体电厂',
        icon: 'sgcc sgcc-yunhangdenglizitidianchang',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '单相两个次级绕组电流互感器',
        icon: 'sgcc sgcc-danxianglianggecijiraozudianliuhuganqi',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '运行抽水蓄能电厂',
        icon: 'sgcc sgcc-yunhangchoushuixunengdianchang',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '单相六个次级绕组电流互感器',
        icon: 'sgcc sgcc-danxiangliugecijiraozudianliuhuganqi',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '有载可调压自耦变压器',
        icon: 'sgcc sgcc-youzaiketiaoyazioubianyaqi1',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '单相一个次级绕组电流互感器',
        icon: 'sgcc sgcc-danxiangyigecijiraozudianliuhuganqi',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '运行杆塔',
        icon: 'sgcc sgcc-yunhangganta',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '带电显示器',
        icon: 'sgcc sgcc-daidianxianshiqi',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '运行换流站',
        icon: 'sgcc sgcc-yunhanghuanliuzhan',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '单相五个次级绕组电流互感器',
        icon: 'sgcc sgcc-danxiangwugecijiraozudianliuhuganqi',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '运行潮汐电厂',
        icon: 'sgcc sgcc-yunhangchaoxidianchang',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '低压熔丝箱（合）',
        icon: 'sgcc sgcc-diyarongsixianghe',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '运行风力发电站',
        icon: 'sgcc sgcc-yunhangfenglifadianzhan',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '低压熔丝箱（分）',
        icon: 'sgcc sgcc-diyarongsixiangfen',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '运行水电厂',
        icon: 'sgcc sgcc-yunhangshuidianchang',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '垂直排列cab',
        icon: 'sgcc sgcc-chuizhipailiecab',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '运行串补站',
        icon: 'sgcc sgcc-yunhangchuanbuzhan',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '单相四个次级绕组电流互感器',
        icon: 'sgcc sgcc-danxiangsigecijiraozudianliuhuganqi',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '运行变电站',
        icon: 'sgcc sgcc-yunhangbiandianzhan',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '电缆段',
        icon: 'sgcc sgcc-dianlanduan',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '运行核电站',
        icon: 'sgcc sgcc-yunhanghedianzhan',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '中继站',
        icon: 'sgcc sgcc-zhongjizhan',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '电缆分界箱',
        icon: 'sgcc sgcc-dianlanfenjiexiang',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '直流发电机',
        icon: 'sgcc sgcc-zhiliufadianji',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '导、地线覆冰区',
        icon: 'sgcc sgcc-daodixianfubingqu',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '运行秸秆电厂',
        icon: 'sgcc sgcc-yunhangjiegandianchang',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '电缆接地箱',
        icon: 'sgcc sgcc-dianlanjiedixiang',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '运行开关站',
        icon: 'sgcc sgcc-yunhangkaiguanzhan',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '电缆通风口',
        icon: 'sgcc sgcc-dianlantongfengkou',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '运行垃圾电厂',
        icon: 'sgcc sgcc-yunhanglajidianchang',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '电缆隧道',
        icon: 'sgcc sgcc-dianlansuidao',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '终端室（站）',
        icon: 'sgcc sgcc-zhongduanshizhan',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '电缆沟',
        icon: 'sgcc sgcc-dianlangou',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '柱上变压器',
        icon: 'sgcc sgcc-zhushangbianyaqi',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '低压配电箱',
        icon: 'sgcc sgcc-diyapeidianxiang',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '中性点引出的曲形折或互联星形的三相绕组',
        icon: 'sgcc sgcc-zhongxingdianyinchudequxingzhehuohulianxingxingdesanxiangraozu',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '电力电感器',
        icon: 'sgcc sgcc-dianlidianganqi',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '柱上变压器（公用变）',
        icon: 'sgcc sgcc-zhushangbianyaqigongyongbian',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '盗窃多发区',
        icon: 'sgcc sgcc-daoqieduofaqu',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '中性点引出星形连接的三相绕组',
        icon: 'sgcc sgcc-zhongxingdianyinchuxingxinglianjiedesanxiangraozu',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '电缆交叉互联箱',
        icon: 'sgcc sgcc-dianlanjiaochahulianxiang',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '中性点引出的叉形连接六相绕组',
        icon: 'sgcc sgcc-zhongxingdianyinchudechaxinglianjieliuxiangraozu',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '电缆中间接头',
        icon: 'sgcc sgcc-dianlanzhongjianjietou',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: 'a级污秽区',
        icon: 'sgcc sgcc-ajiwuhuiqu',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '断路器（合）',
        icon: 'sgcc sgcc-duanluqihe',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '柱上重合器（分）',
        icon: 'sgcc sgcc-zhushangzhongheqifen',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '柱上重合器（合）',
        icon: 'sgcc sgcc-zhushangzhongheqihe',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '电缆终端头',
        icon: 'sgcc sgcc-dianlanzhongduantou',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '运行火电厂',
        icon: 'sgcc sgcc-yunhanghuodianchang',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '跌落式熔断器（合）',
        icon: 'sgcc sgcc-dielashirongduanqihe',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '自耦变压器（星形连接）',
        icon: 'sgcc sgcc-zioubianyaqixingxinglianjie',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '运行地热电厂',
        icon: 'sgcc sgcc-yunhangdiredianchang',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '通信终端箱',
        icon: 'sgcc sgcc-tongxinzhongduanxiang',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '电力电容器',
        icon: 'sgcc sgcc-dianlidianrongqi',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '柱上断路器（分）',
        icon: 'sgcc sgcc-zhushangduanluqifen',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '电力电阻器',
        icon: 'sgcc sgcc-dianlidianzuqi',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '柱上隔离开关（合）',
        icon: 'sgcc sgcc-zhushanggelikaiguanhe',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '分段器',
        icon: 'sgcc sgcc-fenduanqi',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '柱上断路器（合）',
        icon: 'sgcc sgcc-zhushangduanluqihe',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '负荷开关（合）',
        icon: 'sgcc sgcc-fuhekaiguanhe',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '柱上负荷开关（合）',
        icon: 'sgcc sgcc-zhushangfuhekaiguanhe',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '电流方向',
        icon: 'sgcc sgcc-dianliufangxiang',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '柱上隔离开关（分）',
        icon: 'sgcc sgcc-zhushanggelikaiguanfen',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '防雷符',
        icon: 'sgcc sgcc-fangleifu',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '柱上电容器',
        icon: 'sgcc sgcc-zhushangdianrongqi',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '方向标志',
        icon: 'sgcc sgcc-fangxiangbiaozhi',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '柱上负荷开关（分）',
        icon: 'sgcc sgcc-zhushangfuhekaiguanfen',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '高压用户',
        icon: 'sgcc sgcc-gaoyayonghu',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: 'V型开关B-C',
        icon: 'sgcc sgcc-VxingkaiguanB-C',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '自耦变压器',
        icon: 'sgcc sgcc-zioubianyaqi',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '钢管杆',
        icon: 'sgcc sgcc-gangguangan',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: 'V型开关OPEN',
        icon: 'sgcc sgcc-VxingkaiguanOPEN',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '通信电缆接头',
        icon: 'sgcc sgcc-tongxindianlanjietou',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '钢管塔（耐张型）',
        icon: 'sgcc sgcc-gangguantanaizhangxing',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: 'e级污秽区',
        icon: 'sgcc sgcc-ejiwuhuiqu',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: 'c级污秽区',
        icon: 'sgcc sgcc-cjiwuhuiqu',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '放电线圈',
        icon: 'sgcc sgcc-fangdianxianquan',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: 'b级污秽区',
        icon: 'sgcc sgcc-bjiwuhuiqu',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '规划变电站',
        icon: 'sgcc sgcc-guihuabiandianzhan',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: 'd级污秽区',
        icon: 'sgcc sgcc-djiwuhuiqu',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '隔离开关（分）',
        icon: 'sgcc sgcc-gelikaiguanfen',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '阻波器',
        icon: 'sgcc sgcc-zuboqi',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '多雷区',
        icon: 'sgcc sgcc-duoleiqu',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: 'V型开关A-C',
        icon: 'sgcc sgcc-VxingkaiguanA-C',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: 'T型开关A-C',
        icon: 'sgcc sgcc-TxingkaiguanA-C',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '规划地热电厂',
        icon: 'sgcc sgcc-guihuadiredianchang',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: 'T型开关A-B',
        icon: 'sgcc sgcc-TxingkaiguanA-B',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '规划抽水蓄能电厂',
        icon: 'sgcc sgcc-guihuachoushuixunengdianchang',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: 'T型开关B-C',
        icon: 'sgcc sgcc-TxingkaiguanB-C',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '规划换流站',
        icon: 'sgcc sgcc-guihuahuanliuzhan',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: 'V型开关AB-C',
        icon: 'sgcc sgcc-VxingkaiguanAB-C',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '光缆段',
        icon: 'sgcc sgcc-guanglanduan',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '工井',
        icon: 'sgcc sgcc-gongjing',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '规划潮汐电厂',
        icon: 'sgcc sgcc-guihuachaoxidianchang',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '隔离开关（合）',
        icon: 'sgcc sgcc-gelikaiguanhe',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '电缆分支箱',
        icon: 'sgcc sgcc-dianlanfenzhixiang',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '电缆防火墙',
        icon: 'sgcc sgcc-dianlanfanghuoqiang',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '规划垃圾电厂',
        icon: 'sgcc sgcc-guihualajidianchang',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '规划风力发电站',
        icon: 'sgcc sgcc-guihuafenglifadianzhan',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '规划火电厂',
        icon: 'sgcc sgcc-guihuahuodianchang',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '导、地线易舞动区',
        icon: 'sgcc sgcc-daodixianyiwudongqu',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '故障指示器',
        icon: 'sgcc sgcc-guzhangzhishiqi',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '规划串补站',
        icon: 'sgcc sgcc-guihuachuanbuzhan',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '规划等离子体电厂',
        icon: 'sgcc sgcc-guihuadenglizitidianchang',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '规划开关站',
        icon: 'sgcc sgcc-guihuakaiguanzhan',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '规划水电厂',
        icon: 'sgcc sgcc-guihuashuidianchang',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '规划核电站',
        icon: 'sgcc sgcc-guihuahedianzhan',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '不良地质区',
        icon: 'sgcc sgcc-buliangdizhiqu',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '断路器（分）',
        icon: 'sgcc sgcc-duanluqifen',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '规划秸秆电厂',
        icon: 'sgcc sgcc-guihuajiegandianchang',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '垂直排列cba',
        icon: 'sgcc sgcc-chuizhipailiecba',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '互不连接的M相绕组',
        icon: 'sgcc sgcc-hubulianjiedeMxiangraozu',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '环网柜',
        icon: 'sgcc sgcc-huanwanggui',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '换流站',
        icon: 'sgcc sgcc-huanliuzhan',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '计量器',
        icon: 'sgcc sgcc-jiliangqi',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '互不连接的三相绕组',
        icon: 'sgcc sgcc-hubulianjiedesanxiangraozu',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '环网箱式变',
        icon: 'sgcc sgcc-huanwangxiangshibian',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '架空交接箱',
        icon: 'sgcc sgcc-jiakongjiaojiexiang',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '计量表计',
        icon: 'sgcc sgcc-jiliangbiaoji',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '检修）',
        icon: 'sgcc sgcc-jianxiu',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '接触器（分）',
        icon: 'sgcc sgcc-jiechuqifen',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '交流发电机',
        icon: 'sgcc sgcc-jiaoliufadianji',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '间隙',
        icon: 'sgcc sgcc-jianxi',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '接触器（合）',
        icon: 'sgcc sgcc-jiechuqihe',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '接地刀闸（分）',
        icon: 'sgcc sgcc-jiedidaozhafen',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '接地',
        icon: 'sgcc sgcc-jiedi',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '进户点',
        icon: 'sgcc sgcc-jinhudian',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '接地电阻',
        icon: 'sgcc sgcc-jiedidianzu',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '局用站点',
        icon: 'sgcc sgcc-juyongzhandian',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '接地刀闸（合）',
        icon: 'sgcc sgcc-jiedidaozhahe',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '接地变压器（曲折形连接）',
        icon: 'sgcc sgcc-jiedibianyaqiquzhexinglianjie',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '静止无功补偿器',
        icon: 'sgcc sgcc-jingzhiwugongbuchangqi',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '可拆卸固定接头',
        icon: 'sgcc sgcc-kechaixiegudingjietou',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '可调电容器',
        icon: 'sgcc sgcc-ketiaodianrongqi',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '开断符',
        icon: 'sgcc sgcc-kaiduanfu',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '开关站',
        icon: 'sgcc sgcc-kaiguanzhan',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '两相四端绕组02',
        icon: 'sgcc sgcc-liangxiangsiduanraozu02',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '两相四端绕组',
        icon: 'sgcc sgcc-liangxiangsiduanraozu',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '连接线',
        icon: 'sgcc sgcc-lianjiexian',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '两相两个次级绕组电流互感器',
        icon: 'sgcc sgcc-liangxianglianggecijiraozudianliuhuganqi',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '六个独立个绕组',
        icon: 'sgcc sgcc-liugeduligeraozu',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '母线',
        icon: 'sgcc sgcc-muxian',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '耦合电容器',
        icon: 'sgcc sgcc-ouhedianrongqi',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '木杆',
        icon: 'sgcc sgcc-mugan',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '两相一个次级绕组电流互感器',
        icon: 'sgcc sgcc-liangxiangyigecijiraozudianliuhuganqi',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '林竹区',
        icon: 'sgcc sgcc-linzhuqu',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '落地交接箱',
        icon: 'sgcc sgcc-ladijiaojiexiang',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '其他特殊区',
        icon: 'sgcc sgcc-qitateshuqu',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '配电站（室）',
        icon: 'sgcc sgcc-peidianzhanshi',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '曲折形或互联星形的三相绕组',
        icon: 'sgcc sgcc-quzhexinghuohulianxingxingdesanxiangraozu',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '盘留',
        icon: 'sgcc sgcc-panliu',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '鸟害多发区',
        icon: 'sgcc sgcc-niaohaiduofaqu',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '熔断器',
        icon: 'sgcc sgcc-rongduanqi',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '熔断式断路器（合）',
        icon: 'sgcc sgcc-rongduanshiduanluqihe',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '熔断式断路器（分）',
        icon: 'sgcc sgcc-rongduanshiduanluqifen',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '熔断式开关（合）',
        icon: 'sgcc sgcc-rongduanshikaiguanhe',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '熔断式隔离开关（合）',
        icon: 'sgcc sgcc-rongduanshigelikaiguanhe',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '熔断式负荷开关（合）',
        icon: 'sgcc sgcc-rongduanshifuhekaiguanhe',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '熔断式负荷开关（分）',
        icon: 'sgcc sgcc-rongduanshifuhekaiguanfen',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '三个独立个绕组',
        icon: 'sgcc sgcc-sangeduligeraozu',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '熔断式开关（分）',
        icon: 'sgcc sgcc-rongduanshikaiguanfen',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '三工位开关（分）',
        icon: 'sgcc sgcc-sangongweikaiguanfen',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '熔断式隔离开关（分）',
        icon: 'sgcc sgcc-rongduanshigelikaiguanfen',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '三联杆（钢管杆）',
        icon: 'sgcc sgcc-sanliangangangguangan',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '三角形排列cba',
        icon: 'sgcc sgcc-sanjiaoxingpailiecba',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '三工位开关（接地）',
        icon: 'sgcc sgcc-sangongweikaiguanjiedi',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '三角形排列abc',
        icon: 'sgcc sgcc-sanjiaoxingpailieabc',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '三角形排列bac',
        icon: 'sgcc sgcc-sanjiaoxingpailiebac',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '三工位开关（合）',
        icon: 'sgcc sgcc-sangongweikaiguanhe',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '三联杆（木杆）',
        icon: 'sgcc sgcc-sanlianganmugan',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '三绕组变压器YNdy（中性点引出星形-三角形-星形连接）',
        icon: 'sgcc sgcc-sanraozubianyaqiYNdyzhongxingdianyinchuxingxing-sanjiaoxing-xingxinglianjie',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '人口密集区',
        icon: 'sgcc sgcc-renkoumijiqu',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '三角形排列acb',
        icon: 'sgcc sgcc-sanjiaoxingpailieacb',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '三绕组变压器',
        icon: 'sgcc sgcc-sanraozubianyaqi',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '三绕组电压互感器',
        icon: 'sgcc sgcc-sanraozudianyahuganqi',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '三绕组变压器（三角形-星形-星形连接）',
        icon: 'sgcc sgcc-sanraozubianyaqisanjiaoxing-xingxing-xingxinglianjie',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '上字型排列右acb',
        icon: 'sgcc sgcc-shangzixingpailieyouacb',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '三绕组变压器（中性点引出星形-三角形连接）',
        icon: 'sgcc sgcc-sanraozubianyaqizhongxingdianyinchuxingxing-sanjiaoxinglianjie',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '三绕组变压器YNdy（中性点引出星形-三角形-星形连接）2',
        icon: 'sgcc sgcc-sanraozubianyaqiYNdyzhongxingdianyinchuxingxing-sanjiaoxing-xingxinglianjie2',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '三绕组变压器YNynd（中性点引出星形-星形-三角形连接）2',
        icon: 'sgcc sgcc-sanraozubianyaqiYNyndzhongxingdianyinchuxingxing-xingxing-sanjiaoxinglianjie2',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '三绕组变压器（星形-三角形-星形连接）',
        icon: 'sgcc sgcc-sanraozubianyaqixingxing-sanjiaoxing-xingxinglianjie',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '三绕组变压器（星形-星形-三角形连接）',
        icon: 'sgcc sgcc-sanraozubianyaqixingxing-xingxing-sanjiaoxinglianjie',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '三绕组变压器YNynd（中性点引出星形-星形-三角形连接）',
        icon: 'sgcc sgcc-sanraozubianyaqiYNyndzhongxingdianyinchuxingxing-xingxing-sanjiaoxinglianjie',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '上字型排列右bac',
        icon: 'sgcc sgcc-shangzixingpailieyoubac',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '三角形排列bca',
        icon: 'sgcc sgcc-sanjiaoxingpailiebca',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '上字型排列右abc',
        icon: 'sgcc sgcc-shangzixingpailieyouabc',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '沙丘区',
        icon: 'sgcc sgcc-shaqiuqu',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '三联杆（水泥杆）',
        icon: 'sgcc sgcc-sanlianganshuinigan',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '双绕组变压器（有载调压）',
        icon: 'sgcc sgcc-shuangraozubianyaqiyouzaitiaoya',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '上字型排列左cba',
        icon: 'sgcc sgcc-shangzixingpailiezuocba',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '上字型排列右cba',
        icon: 'sgcc sgcc-shangzixingpailieyoucba',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '上字型排列左cab',
        icon: 'sgcc sgcc-shangzixingpailiezuocab',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '手车刀闸（分）',
        icon: 'sgcc sgcc-shouchedaozhafen',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '双向隔离开关（右）',
        icon: 'sgcc sgcc-shuangxianggelikaiguanyou',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '手车刀闸（合）',
        icon: 'sgcc sgcc-shouchedaozhahe',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '双联杆（水泥杆）',
        icon: 'sgcc sgcc-shuanglianganshuinigan',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '手车开关（分）',
        icon: 'sgcc sgcc-shouchekaiguanfen',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '双绕组电压互感器',
        icon: 'sgcc sgcc-shuangraozudianyahuganqi',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '双联杆（钢管杆）',
        icon: 'sgcc sgcc-shuangliangangangguangan',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '双绕组变压器',
        icon: 'sgcc sgcc-shuangraozubianyaqi',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '双绕组变压器（具有分接开关）',
        icon: 'sgcc sgcc-shuangraozubianyaqijuyoufenjiekaiguan',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '上字型排列左bac',
        icon: 'sgcc sgcc-shangzixingpailiezuobac',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '双绕组变压器（具有4个抽头星形-星形连接）',
        icon: 'sgcc sgcc-shuangraozubianyaqijuyou4gechoutouxingxing-xingxinglianjie',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '上字型排列右cab',
        icon: 'sgcc sgcc-shangzixingpailieyoucab',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '上字型排列左abc',
        icon: 'sgcc sgcc-shangzixingpailiezuoabc',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '双绕组变压器（曲折形-星形）',
        icon: 'sgcc sgcc-shuangraozubianyaqiquzhexing-xingxing',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '双绕组变压器（三星形-星形连接）',
        icon: 'sgcc sgcc-shuangraozubianyaqisanxingxing-xingxinglianjie',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '上字型排列左bca',
        icon: 'sgcc sgcc-shangzixingpailiezuobca',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '双绕组变压器YNd（中性点引出星形-三角形连接）2',
        icon: 'sgcc sgcc-shuangraozubianyaqiYNdzhongxingdianyinchuxingxing-sanjiaoxinglianjie2',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '双绕组变压器（星形-星形连接）',
        icon: 'sgcc sgcc-shuangraozubianyaqixingxing-xingxinglianjie',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '上字型排列左acb',
        icon: 'sgcc sgcc-shangzixingpailiezuoacb',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '双绕组变压器Dyn（中性点引出三角形-星形连接）',
        icon: 'sgcc sgcc-shuangraozubianyaqiDynzhongxingdianyinchusanjiaoxing-xingxinglianjie',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '手车开关（合）',
        icon: 'sgcc sgcc-shouchekaiguanhe',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '双绕组变压器（绕组间有屏蔽）',
        icon: 'sgcc sgcc-shuangraozubianyaqiraozujianyoupingbi',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '手车压变（带熔断器）',
        icon: 'sgcc sgcc-shoucheyabiandairongduanqi',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '三相两个次级绕组电流互感器',
        icon: 'sgcc sgcc-sanxianglianggecijiraozudianliuhuganqi',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '双联杆（木杆）',
        icon: 'sgcc sgcc-shuanglianganmugan',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    },
    {
        name: '双绕组变压器Yd（中性点引出星形-三角形连接）2',
        icon: 'sgcc sgcc-shuangraozubianyaqiYdzhongxingdianyinchuxingxing-sanjiaoxinglianjie2',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'sgcc',
            icon: ''
        }
    }
]

export const ltdx = [
    {
        name: '5-7-7',
        icon: 'ltdx tdx-5-7-7',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '5-7-5',
        icon: 'ltdx tdx-5-7-5',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '5-7-4',
        icon: 'ltdx tdx-5-7-4',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '5-7-3',
        icon: 'ltdx tdx-5-7-3',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '5-7-1',
        icon: 'ltdx tdx-5-7-1',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '5-7-2',
        icon: 'ltdx tdx-5-7-2',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '5-6-5',
        icon: 'ltdx tdx-5-6-5',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '5-6-4',
        icon: 'ltdx tdx-5-6-4',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '5-6-2',
        icon: 'ltdx tdx-5-6-2',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '5-6-1',
        icon: 'ltdx tdx-5-6-1',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '5-6-3',
        icon: 'ltdx tdx-5-6-3',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '4.25',
        icon: 'ltdx tdx-425',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '5JPT',
        icon: 'ltdx tdx-5JPT',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '变压器4',
        icon: 'ltdx tdx-bianyaqi4',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: 'LA-1',
        icon: 'ltdx tdx-LA-1',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '发电机',
        icon: 'ltdx tdx-fadianji',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: 'hzz',
        icon: 'ltdx tdx-hzz',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: 'LA-2',
        icon: 'ltdx tdx-LA-2',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: 'hyjd',
        icon: 'ltdx tdx-hyjd',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '3',
        icon: 'ltdx tdx-3',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '12',
        icon: 'ltdx tdx-12',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '13',
        icon: 'ltdx tdx-13',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '14',
        icon: 'ltdx tdx-14',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '10',
        icon: 'ltdx tdx-10',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '17',
        icon: 'ltdx tdx-17',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '电容器',
        icon: 'ltdx tdx-dianrongqi',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '滤波器',
        icon: 'ltdx tdx-lvboqi',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '3-02',
        icon: 'ltdx tdx-3-02',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-256',
        icon: 'ltdx tdx-2-256',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-228',
        icon: 'ltdx tdx-2-228',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-227',
        icon: 'ltdx tdx-2-227',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-229',
        icon: 'ltdx tdx-2-229',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-224',
        icon: 'ltdx tdx-2-224',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-225',
        icon: 'ltdx tdx-2-225',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-226',
        icon: 'ltdx tdx-2-226',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-127',
        icon: 'ltdx tdx-2-127',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-095',
        icon: 'ltdx tdx-2-095',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-093',
        icon: 'ltdx tdx-2-093',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-091',
        icon: 'ltdx tdx-2-091',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-083',
        icon: 'ltdx tdx-2-083',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-081',
        icon: 'ltdx tdx-2-081',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-089',
        icon: 'ltdx tdx-2-089',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-087',
        icon: 'ltdx tdx-2-087',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-080',
        icon: 'ltdx tdx-2-080',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-082',
        icon: 'ltdx tdx-2-082',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-070',
        icon: 'ltdx tdx-2-0701',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-075',
        icon: 'ltdx tdx-2-075',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-072',
        icon: 'ltdx tdx-2-072',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-078',
        icon: 'ltdx tdx-2-078',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-074',
        icon: 'ltdx tdx-2-074',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-076',
        icon: 'ltdx tdx-2-076',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-079',
        icon: 'ltdx tdx-2-079',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-073',
        icon: 'ltdx tdx-2-073',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-071',
        icon: 'ltdx tdx-2-071',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-077',
        icon: 'ltdx tdx-2-077',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-070',
        icon: 'ltdx tdx-2-070',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-061',
        icon: 'ltdx tdx-2-061',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-062',
        icon: 'ltdx tdx-2-062',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-063',
        icon: 'ltdx tdx-2-063',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-066',
        icon: 'ltdx tdx-2-066',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-064',
        icon: 'ltdx tdx-2-064',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-060',
        icon: 'ltdx tdx-2-060',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-068',
        icon: 'ltdx tdx-2-068',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-065',
        icon: 'ltdx tdx-2-065',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-067',
        icon: 'ltdx tdx-2-067',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-069',
        icon: 'ltdx tdx-2-069',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-009',
        icon: 'ltdx tdx-2-009',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-033',
        icon: 'ltdx tdx-1-033',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-236svg',
        icon: 'ltdx tdx-2-236svg',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-238svg',
        icon: 'ltdx tdx-2-238svg',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-244svg',
        icon: 'ltdx tdx-2-244svg',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-242svg',
        icon: 'ltdx tdx-2-242svg',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-243svg',
        icon: 'ltdx tdx-2-243svg',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-245svg',
        icon: 'ltdx tdx-2-245svg',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-237svg',
        icon: 'ltdx tdx-2-237svg',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-241svg',
        icon: 'ltdx tdx-2-241svg',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-248',
        icon: 'ltdx tdx-2-248',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-253',
        icon: 'ltdx tdx-2-253',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-246svg',
        icon: 'ltdx tdx-2-246svg',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-257',
        icon: 'ltdx tdx-2-257',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-252',
        icon: 'ltdx tdx-2-252',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-259',
        icon: 'ltdx tdx-2-259',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-254',
        icon: 'ltdx tdx-2-254',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-040',
        icon: 'ltdx tdx-2-040',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-263',
        icon: 'ltdx tdx-2-263',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-044',
        icon: 'ltdx tdx-2-044',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-265',
        icon: 'ltdx tdx-2-265',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-267',
        icon: 'ltdx tdx-2-267',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-247',
        icon: 'ltdx tdx-2-247',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-264',
        icon: 'ltdx tdx-2-264',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-269',
        icon: 'ltdx tdx-2-269',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-266',
        icon: 'ltdx tdx-2-266',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-262',
        icon: 'ltdx tdx-2-262',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-273',
        icon: 'ltdx tdx-2-273',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-271',
        icon: 'ltdx tdx-2-271',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-261',
        icon: 'ltdx tdx-2-261',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-278',
        icon: 'ltdx tdx-2-278',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-272',
        icon: 'ltdx tdx-2-272',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-276',
        icon: 'ltdx tdx-2-276',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-270',
        icon: 'ltdx tdx-2-270',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-274',
        icon: 'ltdx tdx-2-274',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-279',
        icon: 'ltdx tdx-2-279',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-054',
        icon: 'ltdx tdx-2-054',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-283',
        icon: 'ltdx tdx-2-283',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-282',
        icon: 'ltdx tdx-2-282',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-260',
        icon: 'ltdx tdx-2-260',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-285',
        icon: 'ltdx tdx-2-285',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-284',
        icon: 'ltdx tdx-2-284',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-280',
        icon: 'ltdx tdx-2-280',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '3-186',
        icon: 'ltdx tdx-3-186',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-289',
        icon: 'ltdx tdx-2-289',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '3-187',
        icon: 'ltdx tdx-3-187',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '3-185',
        icon: 'ltdx tdx-3-185',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '3-188',
        icon: 'ltdx tdx-3-188',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '3-189',
        icon: 'ltdx tdx-3-189',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '3-195',
        icon: 'ltdx tdx-3-195',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '3-198',
        icon: 'ltdx tdx-3-198',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '3-196',
        icon: 'ltdx tdx-3-196',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '3-190',
        icon: 'ltdx tdx-3-190',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '3-199',
        icon: 'ltdx tdx-3-199',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '3-204',
        icon: 'ltdx tdx-3-204',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-325',
        icon: 'ltdx tdx-1-325',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '3-206',
        icon: 'ltdx tdx-3-206',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '3-201',
        icon: 'ltdx tdx-3-201',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '3-207',
        icon: 'ltdx tdx-3-207',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-277',
        icon: 'ltdx tdx-2-277',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '3-211',
        icon: 'ltdx tdx-3-211',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '3-209',
        icon: 'ltdx tdx-3-209',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-092',
        icon: 'ltdx tdx-2-092',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '3-210',
        icon: 'ltdx tdx-3-210',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '4-001',
        icon: 'ltdx tdx-4-001',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '3-208',
        icon: 'ltdx tdx-3-208',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '3-213',
        icon: 'ltdx tdx-3-213',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '3-197',
        icon: 'ltdx tdx-3-197',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '4-003',
        icon: 'ltdx tdx-4-003',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-094',
        icon: 'ltdx tdx-2-094',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '4-005',
        icon: 'ltdx tdx-4-005',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '4-002',
        icon: 'ltdx tdx-4-002',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '4-006',
        icon: 'ltdx tdx-4-006',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '4-004',
        icon: 'ltdx tdx-4-004',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-101',
        icon: 'ltdx tdx-2-101',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '4-008',
        icon: 'ltdx tdx-4-008',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '4-010',
        icon: 'ltdx tdx-4-010',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-116',
        icon: 'ltdx tdx-2-116',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '4-009',
        icon: 'ltdx tdx-4-009',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-110',
        icon: 'ltdx tdx-2-110',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-134',
        icon: 'ltdx tdx-2-134',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-132',
        icon: 'ltdx tdx-2-132',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-177',
        icon: 'ltdx tdx-2-177',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-131',
        icon: 'ltdx tdx-2-131',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-144',
        icon: 'ltdx tdx-2-144',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-119',
        icon: 'ltdx tdx-2-119',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-123',
        icon: 'ltdx tdx-2-123',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-235svg',
        icon: 'ltdx tdx-2-235svg',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-215',
        icon: 'ltdx tdx-2-215',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-249',
        icon: 'ltdx tdx-2-249',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-201',
        icon: 'ltdx tdx-2-201',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-210',
        icon: 'ltdx tdx-2-210',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-251',
        icon: 'ltdx tdx-2-251',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-286',
        icon: 'ltdx tdx-2-286',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-258',
        icon: 'ltdx tdx-2-258',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-268',
        icon: 'ltdx tdx-2-268',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-288',
        icon: 'ltdx tdx-2-288',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-230',
        icon: 'ltdx tdx-2-230',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '3-202',
        icon: 'ltdx tdx-3-202',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-195',
        icon: 'ltdx tdx-2-195',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-287',
        icon: 'ltdx tdx-2-287',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-135',
        icon: 'ltdx tdx-2-135',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '3-205',
        icon: 'ltdx tdx-3-205',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '3-200',
        icon: 'ltdx tdx-3-200',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-275',
        icon: 'ltdx tdx-2-275',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-250',
        icon: 'ltdx tdx-2-250',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-284',
        icon: 'ltdx tdx-1-284',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '4-007',
        icon: 'ltdx tdx-4-007',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-336',
        icon: 'ltdx tdx-1-336',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-281',
        icon: 'ltdx tdx-2-281',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-290',
        icon: 'ltdx tdx-2-290',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-186',
        icon: 'ltdx tdx-2-186',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '3-214',
        icon: 'ltdx tdx-3-214',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-026',
        icon: 'ltdx tdx-2-026',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-014',
        icon: 'ltdx tdx-2-014',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-326',
        icon: 'ltdx tdx-1-326',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-051',
        icon: 'ltdx tdx-2-051',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-319',
        icon: 'ltdx tdx-1-319',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-333',
        icon: 'ltdx tdx-1-333',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-335',
        icon: 'ltdx tdx-1-335',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-099',
        icon: 'ltdx tdx-2-099',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-053',
        icon: 'ltdx tdx-2-053',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-305',
        icon: 'ltdx tdx-1-305',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-102',
        icon: 'ltdx tdx-2-102',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-100',
        icon: 'ltdx tdx-2-100',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-036',
        icon: 'ltdx tdx-2-036',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-103',
        icon: 'ltdx tdx-2-103',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-104',
        icon: 'ltdx tdx-2-104',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-112',
        icon: 'ltdx tdx-2-112',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-106',
        icon: 'ltdx tdx-2-106',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-097',
        icon: 'ltdx tdx-2-097',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-114',
        icon: 'ltdx tdx-2-114',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-115',
        icon: 'ltdx tdx-2-115',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-108',
        icon: 'ltdx tdx-2-108',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-118',
        icon: 'ltdx tdx-2-118',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-096',
        icon: 'ltdx tdx-2-096',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-338',
        icon: 'ltdx tdx-1-338',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-329',
        icon: 'ltdx tdx-1-329',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-109',
        icon: 'ltdx tdx-2-109',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-143',
        icon: 'ltdx tdx-2-143',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-098',
        icon: 'ltdx tdx-2-098',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-142',
        icon: 'ltdx tdx-2-142',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-141',
        icon: 'ltdx tdx-2-141',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-111',
        icon: 'ltdx tdx-2-111',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-117',
        icon: 'ltdx tdx-2-117',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-055',
        icon: 'ltdx tdx-2-055',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-013',
        icon: 'ltdx tdx-2-013',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-025',
        icon: 'ltdx tdx-2-025',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-304',
        icon: 'ltdx tdx-1-304',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-200',
        icon: 'ltdx tdx-2-200',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-202',
        icon: 'ltdx tdx-2-202',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-208',
        icon: 'ltdx tdx-2-208',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-206',
        icon: 'ltdx tdx-2-206',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-203',
        icon: 'ltdx tdx-2-203',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-207',
        icon: 'ltdx tdx-2-207',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-209',
        icon: 'ltdx tdx-2-209',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-211',
        icon: 'ltdx tdx-2-211',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-205',
        icon: 'ltdx tdx-2-205',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-204',
        icon: 'ltdx tdx-2-204',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-214',
        icon: 'ltdx tdx-2-214',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-213',
        icon: 'ltdx tdx-2-213',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-220',
        icon: 'ltdx tdx-2-220',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-219',
        icon: 'ltdx tdx-2-219',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-216',
        icon: 'ltdx tdx-2-216',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-218',
        icon: 'ltdx tdx-2-218',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-221',
        icon: 'ltdx tdx-2-221',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-212',
        icon: 'ltdx tdx-2-212',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-217',
        icon: 'ltdx tdx-2-217',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-222',
        icon: 'ltdx tdx-2-222',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-223',
        icon: 'ltdx tdx-2-223',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-231svg',
        icon: 'ltdx tdx-2-231svg',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-232svg',
        icon: 'ltdx tdx-2-232svg',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-233svg',
        icon: 'ltdx tdx-2-233svg',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-027',
        icon: 'ltdx tdx-2-027',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-353',
        icon: 'ltdx tdx-1-353',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-002',
        icon: 'ltdx tdx-2-002',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-270',
        icon: 'ltdx tdx-1-270',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-034',
        icon: 'ltdx tdx-2-034',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-252',
        icon: 'ltdx tdx-1-252',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-028',
        icon: 'ltdx tdx-2-028',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-306',
        icon: 'ltdx tdx-1-306',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-341',
        icon: 'ltdx tdx-1-341',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-041',
        icon: 'ltdx tdx-2-041',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-307',
        icon: 'ltdx tdx-1-307',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-010',
        icon: 'ltdx tdx-2-010',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-050',
        icon: 'ltdx tdx-2-050',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-048',
        icon: 'ltdx tdx-2-048',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-292',
        icon: 'ltdx tdx-1-292',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-038',
        icon: 'ltdx tdx-2-038',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-039',
        icon: 'ltdx tdx-2-039',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-296',
        icon: 'ltdx tdx-1-296',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-005',
        icon: 'ltdx tdx-2-005',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-001',
        icon: 'ltdx tdx-1-001',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-056',
        icon: 'ltdx tdx-2-056',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-002',
        icon: 'ltdx tdx-1-002',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-049',
        icon: 'ltdx tdx-2-049',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-005',
        icon: 'ltdx tdx-1-005',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-310',
        icon: 'ltdx tdx-1-310',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-006',
        icon: 'ltdx tdx-1-006',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-058',
        icon: 'ltdx tdx-2-058',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-007',
        icon: 'ltdx tdx-1-007',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-046',
        icon: 'ltdx tdx-2-046',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-016',
        icon: 'ltdx tdx-1-016',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-029',
        icon: 'ltdx tdx-2-029',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-015',
        icon: 'ltdx tdx-1-015',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-017',
        icon: 'ltdx tdx-2-017',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-012',
        icon: 'ltdx tdx-1-012',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-317',
        icon: 'ltdx tdx-1-317',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-018',
        icon: 'ltdx tdx-1-018',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-057',
        icon: 'ltdx tdx-2-057',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-014',
        icon: 'ltdx tdx-1-014',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-042',
        icon: 'ltdx tdx-2-042',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-017',
        icon: 'ltdx tdx-1-017',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-008',
        icon: 'ltdx tdx-1-008',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-010',
        icon: 'ltdx tdx-1-010',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-021',
        icon: 'ltdx tdx-2-021',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-026',
        icon: 'ltdx tdx-1-026',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-315',
        icon: 'ltdx tdx-1-315',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-025',
        icon: 'ltdx tdx-1-025',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-030',
        icon: 'ltdx tdx-2-030',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-027',
        icon: 'ltdx tdx-1-027',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-016',
        icon: 'ltdx tdx-2-016',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-019',
        icon: 'ltdx tdx-1-019',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-052',
        icon: 'ltdx tdx-2-052',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-030',
        icon: 'ltdx tdx-1-030',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-032',
        icon: 'ltdx tdx-2-032',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-032',
        icon: 'ltdx tdx-1-032',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '3-203',
        icon: 'ltdx tdx-3-203',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-024',
        icon: 'ltdx tdx-1-024',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-028',
        icon: 'ltdx tdx-1-028',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-316',
        icon: 'ltdx tdx-1-316',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-035',
        icon: 'ltdx tdx-1-035',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-043',
        icon: 'ltdx tdx-2-043',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-031',
        icon: 'ltdx tdx-1-031',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-321',
        icon: 'ltdx tdx-1-321',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-020',
        icon: 'ltdx tdx-1-020',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-040',
        icon: 'ltdx tdx-1-040',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-324',
        icon: 'ltdx tdx-1-324',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-041',
        icon: 'ltdx tdx-1-041',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-037',
        icon: 'ltdx tdx-1-037',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-029',
        icon: 'ltdx tdx-1-029',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-059',
        icon: 'ltdx tdx-2-059',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-046',
        icon: 'ltdx tdx-1-046',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-042',
        icon: 'ltdx tdx-1-042',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-045',
        icon: 'ltdx tdx-2-045',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-044',
        icon: 'ltdx tdx-1-044',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-048',
        icon: 'ltdx tdx-1-048',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-045',
        icon: 'ltdx tdx-1-045',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-021',
        icon: 'ltdx tdx-1-021',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-128',
        icon: 'ltdx tdx-2-128',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-050',
        icon: 'ltdx tdx-1-050',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-120',
        icon: 'ltdx tdx-2-120',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-047',
        icon: 'ltdx tdx-1-047',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-121',
        icon: 'ltdx tdx-2-121',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-053',
        icon: 'ltdx tdx-1-053',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-126',
        icon: 'ltdx tdx-2-126',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-039',
        icon: 'ltdx tdx-1-039',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-124',
        icon: 'ltdx tdx-2-124',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-051',
        icon: 'ltdx tdx-1-051',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-138',
        icon: 'ltdx tdx-2-138',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-052',
        icon: 'ltdx tdx-1-052',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-129',
        icon: 'ltdx tdx-2-129',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-055',
        icon: 'ltdx tdx-1-055',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-140',
        icon: 'ltdx tdx-2-140',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-056',
        icon: 'ltdx tdx-1-056',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-139',
        icon: 'ltdx tdx-2-139',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-054',
        icon: 'ltdx tdx-1-054',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-147',
        icon: 'ltdx tdx-2-147',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-109',
        icon: 'ltdx tdx-1-109',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-136',
        icon: 'ltdx tdx-2-136',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-057',
        icon: 'ltdx tdx-1-057',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-137',
        icon: 'ltdx tdx-2-137',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-108',
        icon: 'ltdx tdx-1-108',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-145',
        icon: 'ltdx tdx-2-145',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-110',
        icon: 'ltdx tdx-1-110',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-148',
        icon: 'ltdx tdx-2-148',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-130',
        icon: 'ltdx tdx-2-130',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-113',
        icon: 'ltdx tdx-1-113',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-149',
        icon: 'ltdx tdx-2-149',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-058',
        icon: 'ltdx tdx-1-058',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-150',
        icon: 'ltdx tdx-2-150',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-114',
        icon: 'ltdx tdx-1-114',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-153',
        icon: 'ltdx tdx-2-153',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-049',
        icon: 'ltdx tdx-1-049',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-152',
        icon: 'ltdx tdx-2-152',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-112',
        icon: 'ltdx tdx-1-112',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-122',
        icon: 'ltdx tdx-2-122',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-117',
        icon: 'ltdx tdx-1-117',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-155',
        icon: 'ltdx tdx-2-155',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-116',
        icon: 'ltdx tdx-1-116',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-156',
        icon: 'ltdx tdx-2-156',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-111',
        icon: 'ltdx tdx-1-111',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-161',
        icon: 'ltdx tdx-2-161',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-133',
        icon: 'ltdx tdx-1-133',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-154',
        icon: 'ltdx tdx-2-154',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-145',
        icon: 'ltdx tdx-1-145',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-159',
        icon: 'ltdx tdx-2-159',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-146',
        icon: 'ltdx tdx-1-146',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-158',
        icon: 'ltdx tdx-2-158',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-135',
        icon: 'ltdx tdx-1-135',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-160',
        icon: 'ltdx tdx-2-160',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-151',
        icon: 'ltdx tdx-1-151',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-163',
        icon: 'ltdx tdx-2-163',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-149',
        icon: 'ltdx tdx-1-149',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-166',
        icon: 'ltdx tdx-2-166',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-150',
        icon: 'ltdx tdx-1-150',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-162',
        icon: 'ltdx tdx-2-162',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-059',
        icon: 'ltdx tdx-1-059',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-165',
        icon: 'ltdx tdx-2-165',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-125',
        icon: 'ltdx tdx-1-125',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-151',
        icon: 'ltdx tdx-2-151',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-158',
        icon: 'ltdx tdx-1-158',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-164',
        icon: 'ltdx tdx-2-164',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-144',
        icon: 'ltdx tdx-1-144',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-169',
        icon: 'ltdx tdx-2-169',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-159',
        icon: 'ltdx tdx-1-159',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-167',
        icon: 'ltdx tdx-2-167',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-152',
        icon: 'ltdx tdx-1-152',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-174',
        icon: 'ltdx tdx-2-174',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-165',
        icon: 'ltdx tdx-1-165',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-171',
        icon: 'ltdx tdx-2-171',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-162',
        icon: 'ltdx tdx-1-162',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-168',
        icon: 'ltdx tdx-2-168',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-115',
        icon: 'ltdx tdx-1-115',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-172',
        icon: 'ltdx tdx-2-172',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-148',
        icon: 'ltdx tdx-1-148',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-176',
        icon: 'ltdx tdx-2-176',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-161',
        icon: 'ltdx tdx-1-161',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-173',
        icon: 'ltdx tdx-2-173',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-163',
        icon: 'ltdx tdx-1-163',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-170',
        icon: 'ltdx tdx-2-170',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-147',
        icon: 'ltdx tdx-1-147',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-179',
        icon: 'ltdx tdx-2-179',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-166',
        icon: 'ltdx tdx-1-166',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-178',
        icon: 'ltdx tdx-2-178',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-167',
        icon: 'ltdx tdx-1-167',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-181',
        icon: 'ltdx tdx-2-181',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-168',
        icon: 'ltdx tdx-1-168',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-180',
        icon: 'ltdx tdx-2-180',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-171',
        icon: 'ltdx tdx-1-171',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-182',
        icon: 'ltdx tdx-2-182',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-172',
        icon: 'ltdx tdx-1-172',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-175',
        icon: 'ltdx tdx-2-175',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-170',
        icon: 'ltdx tdx-1-170',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-185',
        icon: 'ltdx tdx-2-185',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-173',
        icon: 'ltdx tdx-1-173',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-189',
        icon: 'ltdx tdx-2-189',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-164',
        icon: 'ltdx tdx-1-164',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-184',
        icon: 'ltdx tdx-2-184',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-177',
        icon: 'ltdx tdx-1-177',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-191',
        icon: 'ltdx tdx-2-191',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-169',
        icon: 'ltdx tdx-1-169',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-188',
        icon: 'ltdx tdx-2-188',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-176',
        icon: 'ltdx tdx-1-176',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-190',
        icon: 'ltdx tdx-2-190',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-180',
        icon: 'ltdx tdx-1-180',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-194',
        icon: 'ltdx tdx-2-194',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-175',
        icon: 'ltdx tdx-1-175',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-192',
        icon: 'ltdx tdx-2-192',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-181',
        icon: 'ltdx tdx-1-181',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-183',
        icon: 'ltdx tdx-2-183',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-184',
        icon: 'ltdx tdx-1-184',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-198',
        icon: 'ltdx tdx-2-198',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-182',
        icon: 'ltdx tdx-1-182',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-187',
        icon: 'ltdx tdx-2-187',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-183',
        icon: 'ltdx tdx-1-183',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-193',
        icon: 'ltdx tdx-2-193',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-186',
        icon: 'ltdx tdx-1-186',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-125',
        icon: 'ltdx tdx-2-125',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-118',
        icon: 'ltdx tdx-1-118',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-196',
        icon: 'ltdx tdx-2-196',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-178',
        icon: 'ltdx tdx-1-178',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-157',
        icon: 'ltdx tdx-2-157',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-188',
        icon: 'ltdx tdx-1-188',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-189',
        icon: 'ltdx tdx-1-189',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-192',
        icon: 'ltdx tdx-1-192',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-190',
        icon: 'ltdx tdx-1-190',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-191',
        icon: 'ltdx tdx-1-191',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-193',
        icon: 'ltdx tdx-1-193',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-195',
        icon: 'ltdx tdx-1-195',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-196',
        icon: 'ltdx tdx-1-196',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-187',
        icon: 'ltdx tdx-1-187',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-198',
        icon: 'ltdx tdx-1-198',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-160',
        icon: 'ltdx tdx-1-160',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-197',
        icon: 'ltdx tdx-1-197',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-202',
        icon: 'ltdx tdx-1-202',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-201',
        icon: 'ltdx tdx-1-201',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-203',
        icon: 'ltdx tdx-1-203',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-194',
        icon: 'ltdx tdx-1-194',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-205',
        icon: 'ltdx tdx-1-205',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-200',
        icon: 'ltdx tdx-1-200',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-207',
        icon: 'ltdx tdx-1-207',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-209',
        icon: 'ltdx tdx-1-209',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-206',
        icon: 'ltdx tdx-1-206',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-217',
        icon: 'ltdx tdx-1-217',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-215',
        icon: 'ltdx tdx-1-215',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-216',
        icon: 'ltdx tdx-1-216',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-219',
        icon: 'ltdx tdx-1-219',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-179',
        icon: 'ltdx tdx-1-179',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-226',
        icon: 'ltdx tdx-1-226',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-204',
        icon: 'ltdx tdx-1-204',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-224',
        icon: 'ltdx tdx-1-224',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-212',
        icon: 'ltdx tdx-1-212',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-228',
        icon: 'ltdx tdx-1-228',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-210',
        icon: 'ltdx tdx-1-210',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-229',
        icon: 'ltdx tdx-1-229',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-240',
        icon: 'ltdx tdx-1-240',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-225',
        icon: 'ltdx tdx-1-225',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-237',
        icon: 'ltdx tdx-1-237',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-213',
        icon: 'ltdx tdx-1-213',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-244',
        icon: 'ltdx tdx-1-244',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-245',
        icon: 'ltdx tdx-1-245',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-247',
        icon: 'ltdx tdx-1-247',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-248',
        icon: 'ltdx tdx-1-248',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-221',
        icon: 'ltdx tdx-1-221',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-254',
        icon: 'ltdx tdx-1-254',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-243',
        icon: 'ltdx tdx-1-243',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-214',
        icon: 'ltdx tdx-1-214',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-208',
        icon: 'ltdx tdx-1-208',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-220',
        icon: 'ltdx tdx-1-220',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-242',
        icon: 'ltdx tdx-1-242',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-222',
        icon: 'ltdx tdx-1-222',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-234',
        icon: 'ltdx tdx-1-234',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-250',
        icon: 'ltdx tdx-1-250',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-227',
        icon: 'ltdx tdx-1-227',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-264',
        icon: 'ltdx tdx-1-264',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-265',
        icon: 'ltdx tdx-1-265',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-266',
        icon: 'ltdx tdx-1-266',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-272',
        icon: 'ltdx tdx-1-272',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-238',
        icon: 'ltdx tdx-1-238',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-277',
        icon: 'ltdx tdx-1-277',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-239',
        icon: 'ltdx tdx-1-239',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-279',
        icon: 'ltdx tdx-1-279',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-249',
        icon: 'ltdx tdx-1-249',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-233',
        icon: 'ltdx tdx-1-233',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-267',
        icon: 'ltdx tdx-1-267',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-235',
        icon: 'ltdx tdx-1-235',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-263',
        icon: 'ltdx tdx-1-263',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-276',
        icon: 'ltdx tdx-1-276',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-253',
        icon: 'ltdx tdx-1-253',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-241',
        icon: 'ltdx tdx-1-241',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-256',
        icon: 'ltdx tdx-1-256',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-273',
        icon: 'ltdx tdx-1-273',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-283',
        icon: 'ltdx tdx-1-283',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-291',
        icon: 'ltdx tdx-1-291',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-290',
        icon: 'ltdx tdx-1-290',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-295',
        icon: 'ltdx tdx-1-295',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-218',
        icon: 'ltdx tdx-1-218',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-280',
        icon: 'ltdx tdx-1-280',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-294',
        icon: 'ltdx tdx-1-294',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-236',
        icon: 'ltdx tdx-1-236',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-278',
        icon: 'ltdx tdx-1-278',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-282',
        icon: 'ltdx tdx-1-282',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-303',
        icon: 'ltdx tdx-1-303',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-287',
        icon: 'ltdx tdx-1-287',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-271',
        icon: 'ltdx tdx-1-271',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-298',
        icon: 'ltdx tdx-1-298',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-047',
        icon: 'ltdx tdx-2-047',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-300',
        icon: 'ltdx tdx-1-300',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-288',
        icon: 'ltdx tdx-1-288',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-320',
        icon: 'ltdx tdx-1-320',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-246',
        icon: 'ltdx tdx-1-246',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-297',
        icon: 'ltdx tdx-1-297',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-314',
        icon: 'ltdx tdx-1-314',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-199',
        icon: 'ltdx tdx-1-199',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-301',
        icon: 'ltdx tdx-1-301',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-318',
        icon: 'ltdx tdx-1-318',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-302',
        icon: 'ltdx tdx-1-302',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-289',
        icon: 'ltdx tdx-1-289',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-328',
        icon: 'ltdx tdx-1-328',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-308',
        icon: 'ltdx tdx-1-308',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-251',
        icon: 'ltdx tdx-1-251',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-286',
        icon: 'ltdx tdx-1-286',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-311',
        icon: 'ltdx tdx-1-311',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-334',
        icon: 'ltdx tdx-1-334',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-309',
        icon: 'ltdx tdx-1-309',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-327',
        icon: 'ltdx tdx-1-327',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-299',
        icon: 'ltdx tdx-1-299',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-332',
        icon: 'ltdx tdx-1-332',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-312',
        icon: 'ltdx tdx-1-312',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-340',
        icon: 'ltdx tdx-1-340',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-313',
        icon: 'ltdx tdx-1-313',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-331',
        icon: 'ltdx tdx-1-331',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-345',
        icon: 'ltdx tdx-1-345',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-339',
        icon: 'ltdx tdx-1-339',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-011',
        icon: 'ltdx tdx-2-011',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-274',
        icon: 'ltdx tdx-1-274',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-348',
        icon: 'ltdx tdx-1-348',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-344',
        icon: 'ltdx tdx-1-344',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-015',
        icon: 'ltdx tdx-2-015',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-268',
        icon: 'ltdx tdx-1-268',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-330',
        icon: 'ltdx tdx-1-330',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-351',
        icon: 'ltdx tdx-1-351',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-255',
        icon: 'ltdx tdx-1-255',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-322',
        icon: 'ltdx tdx-1-322',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-001',
        icon: 'ltdx tdx-2-001',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-342',
        icon: 'ltdx tdx-1-342',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-275',
        icon: 'ltdx tdx-1-275',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-350',
        icon: 'ltdx tdx-1-350',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-323',
        icon: 'ltdx tdx-1-323',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-343',
        icon: 'ltdx tdx-1-343',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-347',
        icon: 'ltdx tdx-1-347',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-003',
        icon: 'ltdx tdx-2-003',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-211',
        icon: 'ltdx tdx-1-211',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-012',
        icon: 'ltdx tdx-2-012',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-346',
        icon: 'ltdx tdx-1-346',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-023',
        icon: 'ltdx tdx-2-023',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-293',
        icon: 'ltdx tdx-1-293',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-020',
        icon: 'ltdx tdx-2-020',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-019',
        icon: 'ltdx tdx-2-019',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '2-004',
        icon: 'ltdx tdx-2-004',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '1-223',
        icon: 'ltdx tdx-1-223',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    }
]

export const normal = [
    {
        "name": "变压器-两圈压变",
        "icon": "iconfont icon-bianyaqi-liangquanyabian-",
        "data": {
            "rect": {
                "width": 100,
                "height": 100
            },
            "name": "image",
            "iconFamily": "iconfont",
            "icon": ""
        }
    },
    {
        "name": "变压器",
        "icon": "iconfont icon-bianyaqi",
        "data": {
            "rect": {
                "width": 100,
                "height": 100
            },
            "name": "image",
            "iconFamily": "iconfont",
            "icon": ""
        }
    },
    {
        "name": "电流互感器",
        "icon": "iconfont icon-CT",
        "data": {
            "rect": {
                "width": 140,
                "height": 100
            },
            "name": "image",
            "iconFamily": "iconfont",
            "icon": ""
        }
    },
    // {
    //     "name": "断路器-开",
    //     "icon": "iconfont icon-_duanluqi",
    //     "data": {
    //         "rect": {
    //             "width": 100,
    //             "height": 100
    //         },
    //         "name": "image",
    //         "iconFamily": "iconfont",
    //         "icon":"\ue632"
    //     }
    // },
    // {
    //     "name": "断路器-合",
    //     "icon": "iconfont icon-duanluqi-he",
    //     "data": {
    //         "rect": {
    //             "width": 100,
    //             "height": 100
    //         },
    //         "name": "image",
    //         "iconFamily": "iconfont",
    //         // "icon":"\ue64e"
    //         "icon": ""

    //     }
    // },
    {
        name: '断路器-开',
        icon: 'ltdx tdx-1-117',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        name: '断路器-合',
        icon: 'ltdx tdx-1-118',
        data: {
            rect: {
                width: 100,
                height: 100
            },
            name: 'image',
            iconFamily: 'ltdx',
            icon: ''
        }
    },
    {
        "name": "低压断路器",
        "icon": "iconfont icon-diyaduanluqi",
        "data": {
            "rect": {
                "width": 100,
                "height": 100
            },
            "name": "image",
            "iconFamily": "iconfont",
            "icon": ""
        }
    },
    {
        "name": "变压器",
        "icon": "iconfont icon-bianyaqi2",
        "data": {
            "rect": {
                "width": 100,
                "height": 100
            },
            "name": "image",
            "iconFamily": "iconfont",
            "icon": ""
        }
    },
    // {
    //     "name": "抽屉式断路器",
    //     "icon": "iconfont icon-a-choutishiduanluqi-21",
    //     "data": {
    //         "rect": {
    //             "width": 100,
    //             "height": 100
    //         },
    //         "name": "image",
    //         "iconFamily": "iconfont",
    //         "icon": ""
    //     }
    // },
    {
        "name": "抽屉式断路器--分",
        "icon": "iconfont icon-a-zu60",
        "data": {
            "rect": {
                "width": 100,
                "height": 100
            },
            "name": "image",
            "iconFamily": "iconfont",
            // "icon": "\ue602"
            "icon": ""
        }
    },
    {
        "name": "抽屉式断路器--合",
        "icon": "iconfont icon-a-zu6",
        "data": {
            "rect": {
                "width": 100,
                "height": 100
            },
            "name": "image",
            "iconFamily": "iconfont",
            // "icon": "\ue601"
            "icon": "",
        }
    },
    {
        "name": "双绕组变压器Yd",
        "icon": "iconfont icon-shuangraozubianyaqiYd",
        "data": {
            "rect": {
                "width": 100,
                "height": 100
            },
            "name": "image",
            "iconFamily": "iconfont",
            "icon": ""
        }
    },
    {
        "name": "双绕组变压器（有载调压）",
        "icon": "iconfont icon-a-shuangraozubianyaqiyouzaitiaoya",
        "data": {
            "rect": {
                "width": 100,
                "height": 100
            },
            "name": "image",
            "iconFamily": "iconfont",
            "icon": ""
        }
    },
    {
        "name": "互感器-电流互感器1",
        "icon": "iconfont icon-huganqi-dianliuhuganqi-",
        "data": {
            "rect": {
                "width": 100,
                "height": 100
            },
            "name": "image",
            "iconFamily": "iconfont",
            "icon": ""
        }
    },
    {
        "name": "互感器-电流互感器2",
        "icon": "iconfont icon-huganqi-dianliuhuganqi-1",
        "data": {
            "rect": {
                "width": 100,
                "height": 100
            },
            "name": "image",
            "iconFamily": "iconfont",
            "icon": ""
        }
    },
    {
        "name": "电流互感器",
        "icon": "iconfont icon-dianliuhuganqi",
        "data": {
            "rect": {
                "width": 180,
                "height": 100
            },
            "name": "image",
            "iconFamily": "iconfont",
            "icon": ""
        }
    },
    {
        "name": "电流互感器2_竖直",
        "icon": "iconfont icon-dianliuhuganqi2_shuzhi",
        "data": {
            "rect": {
                "width": 100,
                "height": 100
            },
            "name": "image",
            "iconFamily": "iconfont",
            "icon": ""
        }
    },
    {
        "name": "双向二极管",
        "icon": "iconfont icon-shuangxiangerjiguan",
        "data": {
            "rect": {
                "width": 100,
                "height": 100
            },
            "name": "image",
            "iconFamily": "iconfont",
            "icon": ""
        }
    },
    {
        "name": "热继电器（分）",
        "icon": "iconfont icon-rejidianqi1",
        "data": {
            "rect": {
                "width": 100,
                "height": 100
            },
            "name": "image",
            "iconFamily": "iconfont",
            "icon": ""
        }
    },
    {
        "name": "热继电器(合)",
        "icon": "iconfont icon-rejidianqi11",
        "data": {
            "rect": {
                "width": 100,
                "height": 100
            },
            "name": "image",
            "iconFamily": "iconfont",
            "icon": ""
        }
    },
    {
        "name": "热继电器、动断触点",
        "icon": "iconfont icon-rejidianqidongduanchudian",
        "data": {
            "rect": {
                "width": 100,
                "height": 100
            },
            "name": "image",
            "iconFamily": "iconfont",
            "icon": ""
        }
    },
    {
        "name": "热继电器的驱动器件",
        "icon": "iconfont icon-rejidianqidequdongqijian",
        "data": {
            "rect": {
                "width": 100,
                "height": 100
            },
            "name": "image",
            "iconFamily": "iconfont",
            "icon": ""
        }
    },
    {
        "name": "热继电器的驱动器件",
        "icon": "iconfont icon-rejidianqidequdongqijian1",
        "data": {
            "rect": {
                "width": 100,
                "height": 100
            },
            "name": "image",
            "iconFamily": "iconfont",
            "icon": ""
        }
    },
    {
        "name": "熔断器-V",
        "icon": "iconfont icon-rongduanqi-1",
        "data": {
            "rect": {
                "width": 100,
                "height": 100
            },
            "name": "image",
            "iconFamily": "iconfont",
            "icon": ""
        }
    },
    {
        "name": "熔断器-H",
        "icon": "iconfont icon-rongduanqi-11",
        "data": {
            "rect": {
                "width": 100,
                "height": 100
            },
            "name": "image",
            "iconFamily": "iconfont",
            "icon": ""
        }
    }
]