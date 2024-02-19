import React, {useMemo} from 'react'
import {useGetPostsQuery, useGetPostQuery, useParamPostMutation} from './apiSlice'
import {Spin, List, Space, Button} from 'antd'
export default function Index() {
  const {
    data: posts,
    isLoading,
    isSuccess,
    isError,
    error
  } = useGetPostQuery(2)
  const [paramPost] = useParamPostMutation()
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
           <Button onClick={()=> paramPost(2)}>2</Button>
           <Button onClick={()=> paramPost(4)}>4</Button>
           <Button onClick={()=> paramPost(8)}>8</Button>
        </Space>
          {content}
     </div>
    
  )
}
