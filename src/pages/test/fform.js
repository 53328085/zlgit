import React, {useEffect, useMemo} from 'react'
import {useGetPostsQuery, useGetPostQuery, useParamPostMutation} from './apiBasic'
import {Spin, List, Space, Button} from 'antd'
export default function Index() {
  const {
    data: posts,
    isLoading,
    isSuccess,
    isError,
    error,
    refetch
  } = useGetPostQuery(2)
  useEffect(() => {
    refetch()
  }, [])
  const [paramPost] = useParamPostMutation()
 const getdata = async (id)=> {
   try {
    let data = await paramPost(id).unwrap()
    console.log(data);
   } catch (error) {
    
   }
 }
 const [link, name] = useMemo(() => {
   if(!posts) return [[], []] ;
   let {link=[], name=[]} = posts.data || {}
   return [
    link,
    name
   ]
 }, [posts])
 
 let content

  if (isLoading) {
    content = <Spin text="Loading..." />
  } else if (isSuccess) {
    content =  <List bordered dataSource={name} renderItem={(item) => <List.Item>{item}</List.Item>}></List>
  } else if (isError) {
    content = <div>{error.toString()}</div>
  }
 
  return (
      <div style={{flex: 1}}>
        <Space>
           <Button onClick={()=> getdata(2)}>2</Button>
           <Button onClick={()=> getdata(4)}>4</Button>
           <Button onClick={()=> getdata(8)}>8</Button>
           <Button onClick={refetch}>refetch</Button>
        </Space>
          {content}
     </div>
    
  )
}
