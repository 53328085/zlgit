 

 import {Form, InputNumber, Input} from "antd"
 import {useMemo} from 'react'
export   function useColumns(step){

    let columuns = useMemo(()=> {
      return  Array(7).fill(1).map((_, index) => {
            if(index=== 0){
                return {
                    title: ' ',
                    dataIndex: 'name',
                    width: 240,
                    key:"name",
                }
            }else {
                return {
                    title:  `${index+step}月`,
                    dataIndex: `${index+step}`,
                    width: 100, 
                    key:`${index+step}`,
                    onCell:(record, idx)=>{
                        return {
                            record,
                            idx,
                            editing:true,
                            dataIndex: `${index+step}`,
                            title: `${index+step}月`, 
                           }
                       
                    }
                }
            }
        }) 
    },[step])
    return columuns

}



 
export const EditableCell = ({
    editing,
    dataIndex,
    title, 
    record,
    idx,
    children,
    ...restProps
  }) => {
   
    let ipt = idx==1  
    return (    
      <td {...restProps}>
        {editing && ipt? (
            <>
            <Form.Item name={[dataIndex,"month"]} initialValue={dataIndex} noStyle>
             <Input hidden></Input>
            </Form.Item>
          <Form.Item
            name={[dataIndex,"quotaValue"]}
            initialValue={record[dataIndex]}
            style={{
              margin: 0,
            }}
            rules={[
              {
                required: true,
                message: `请输入 ${title}数据!`,
              },
            ]}
          ><InputNumber></InputNumber></Form.Item>
          </>
        ) : (
          children
        )}
      </td>
    );
  };