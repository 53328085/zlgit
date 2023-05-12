import React, {useState, useContext,  useEffect} from "react";

import { Form, Select,  Space, Divider,} from "antd";
import styled from "styled-components";
 
import {useSelector, useDispatch, connect} from 'react-redux'
import {levelDefaultLabel,selectProjectId, selectOneLevelDefaultId, selectOneLevel, setCurrentlevel} from '@redux/systemconfig.js'


import {SiteManagerDesigner, PCSMonitorRuntime} from '@api/api'
import {setzl , zltest} from '@redux/reduxTest.js'
import CustContext from "@com/content";
function mapStateToProps(state, ownProps) {
  
   return {
    currentscreen: state.system.currentscreen
   }
}
  const mapDispatchToProps = (dispatch, ownProps) => {
  
   return {
      changename: (name) => {
         dispatch(setzl(name))
      }
   }
}

function Mytest({currentscreen, dispatch}) {
  
   return (
    <div>
       <button onClick={() => dispatch(setzl(Math.random().toString().slice(2)))}>updateName</button>
       {JSON.stringify(currentscreen, 2)}
    </div>
   )
}
  
export default connect(mapStateToProps)(Mytest)