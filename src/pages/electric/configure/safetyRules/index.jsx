import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import Pagecount from '@com/pagecontent'
import { selectProjectId } from '@redux/systemconfig.js'
import CustContext from '@com/content.js'
import breakerShort from './breakerShort'

export default function Index() {
    const [value, setvalue] = useState('electric')
    const projectId = useSelector(selectProjectId);
    const tabs = [
        { label: '断路器短路', key: 1 }
    ]
    const propsData = {
        tabs,
        value,
        setvalue
    }
    const ProjectCom = {
        electric: breakerShort
    }
    const [tag, setTag] = useState('')
    const getFromChild = val => {
        setTag(val)
    }
    let Com = ProjectCom[value]
    return (
        <CustContext.Provider value={propsData}>
            <Pagecount showserach={false} pd="16px">
                {<Com projectId={projectId} getValues={getFromChild} />}
            </Pagecount>
        </CustContext.Provider>
    )
}
