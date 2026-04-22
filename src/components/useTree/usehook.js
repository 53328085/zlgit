import {useMemo} from 'react';

  const getId = (nodes, key, children = 'nodes') => {
    
    if (Array.isArray(nodes)) { 
      for (let node of nodes) {
        let { keyStr,id, nodeType } = node
        if (nodeType == 3 ) {
           return [[keyStr], [id]]
        }
       
      
        if (node[children] && Array.isArray(node[children]) && node[children]?.length > 0) {
         return getId(node[children], key, children)
        }
      }
    }
  }
export function useGetId(props){
   const {nodes, key, children = 'nodes'} = props;
   return useMemo(() => {
      if(!Array.isArray(nodes)) return [[],[]]
      const values =  getId(nodes, key, children);
      return values
   },[nodes, key, children ])

}