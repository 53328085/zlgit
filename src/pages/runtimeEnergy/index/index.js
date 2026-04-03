import React, {useEffect} from 'react'
import {Layout} from 'antd'
import {Outlet} from 'react-router-dom'
import {useDispatch, useSelector} from 'react-redux'
import { selectOneLevel, setCurrentlevel, getOnelevel} from '@redux/systemconfig.js'
export default function Index() {
 const { Header, Footer, Sider, Content } = Layout;   
 const levelone = useSelector(selectOneLevel)
 const dispatch = useDispatch();
/*  useEffect(() => {
    if(levelone.length > 1){
      let all = { name: levelone[0].levelName+'(全部)', levelName: levelone[0].levelName+'(全部)', id: 0 };
      if(levelone.findIndex(o => o.id == 0) == -1) {
        dispatch(getOnelevel([all, ...levelone]))
        dispatch(setCurrentlevel(all))
      }
      
    }
    return() => {
      dispatch(getOnelevel([...levelone]))
    }
 }, []) */
 //let    [{ name: levelone[0].levelName+'(全部)', id: 0 }, ...levelone]
  return (
   /*   <Layout>
         <Sider><Menus></Menus></Sider>
         <Content className='page--main'><Outlet/></Content>
     </Layout> */
     <Content className='page--main'><Outlet/></Content>
  )
}
