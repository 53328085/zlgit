import React, { useMemo } from 'react'
import styled from 'styled-components'
import BlueColumn from '@com/bluecolumn'
import { Select, Divider, Input, Button } from 'antd'
import { useSelector } from 'react-redux'

export default function Index() {
  const ContainerDiv = styled.div`
      border: 1px solid #d7d7d7;
      background-color: #fff;
      height: 100%;
      padding: 16px;
      .pdtop8{
        padding-top: 8px;
      }
      .pdbottom12{
        padding-bottom: 12px;
      }
      .searchbtn:hover,.searchbtn:focus{
        border-color: #d9d9d9 !important;
        color: #000;
      }
      .flexcss{
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .btncss{
         width: 96px;
         height: 32px;
         background-color: #237ae4;
         border-radius: 2px;
         color: #fff;
         text-align: center;
         line-height: 32px;
         cursor: pointer;
         &:hover{
          opacity: .7;
         }
      }
  `
  const onelevel = useSelector(state => state.system.onelevel);
  const options = onelevel.length > 0 ? useMemo(() => ([{ name: onelevel[0]?.levelName, id: 0 }, ...onelevel]), [onelevel]) : []
  const search = () => { }
  return (
    <ContainerDiv>
      <BlueColumn name="设备管理" />
      <Select
        options={options}
        fieldNames={{ label: 'name', value: 'id' }}
        style={{ width: 264 }}
        className="pdtop8 pdbottom12"
        defaultValue={onelevel.length > 0 ? 0 : null}
      ></Select>
      <Divider style={{ margin: 0, borderColor: '#d7d7d7' }} dashed></Divider>
      <div className='flexcss'>
        <div>
          <span style={{ paddingRight: 16, }} >设备查询</span>
          <Input
            style={{
              width: 290,
              margin: '16px 0'
            }}
            placeholder="输入设备编号/安装地址"
            onChange={(e) => { setInpValue(e.target.value) }}
          />
          <Button style={{ width: 80, borderLeft: 'none', background: '#f5f7fa' }} className='searchbtn' onClick={search}>查询</Button>
        </div>
        <div className='btncss'>
          新增
        </div>
      </div>

    </ContainerDiv>
  )
}
