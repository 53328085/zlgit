import TitleLayout from '@com/titlelayout'
import CardView from './CardView'
import ImageLogo1 from '../icon/img_1.png'
import ImageLogo2 from '../icon/img_2.png'
import ImageLogo3 from '../icon/img_3.png'
import ImageNotice1 from '../icon/img_notice_1.png'
import ImageNotice2 from '../icon/img_notice_2.png'
import ImageNotice3 from '../icon/img_notice_3.png'
import { Flex } from 'antd'

export default function EnergyDispatchOptimization() {
  return (
    <Flex>
      <TitleLayout title="能源综合调度优化">
      <Flex vertical justify='space-between' gap={12} style={{height:'100%'}}>
        <CardView
        imgLogo={ImageLogo1}
        imgNotice={ImageNotice1}
        title="峰谷电价利用"
        content="优化能源综合调度，充分利用峰谷电价差，合理安排生产负荷与储能充放时序，在低谷电价时段增加用电负荷、储存电能与热能，高峰电价时段削减非必要负荷、优先使用储能出力，实现用电成本与电网负荷压力双下降。"
        background="linear-gradient( 270deg, rgba(158,190,246,0) 0%, rgba(158,190,246,0.3) 100%)"
        iconColor="#1E50E6"
      />
      <CardView
        imgLogo={ImageLogo2}
        imgNotice={ImageNotice2}
        title="多能互补优化"
        content="深化多能互补优化运行，统筹电、气、冷、热及可再生能源协同调配，根据能源价格、负荷需求与设备特性动态切换供能方式，提升能源利用效率，增强供能可靠性与经济性。"
        background="linear-gradient( 270deg, rgba(158,217,246,0) 0%, rgba(158,217,246,0.6) 100%)"
        iconColor="#00CFFF"
      />
      <CardView
        imgLogo={ImageLogo3}
        imgNotice={ImageNotice3}
        title="高能耗设备集中管控"
        content="建立设备运行台账与分时启停机制，将空压机、制冷、热处理、水泵等大功率设备统一调度，避免高峰时段集中启动造成负荷尖峰。通过错峰运行、联动启停、减少空载待机，平抑用能波动，降低高峰电费支出与设备能耗。"
        background="linear-gradient( 270deg, rgba(158,190,246,0) 0%, rgba(158,190,246,0.3) 100%)"
        iconColor="#1E50E6"
      />
      </Flex>
    </TitleLayout>
    </Flex>
  )
}