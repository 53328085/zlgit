import {  useDispatch} from "react-redux";

import { userRest} from "@redux/user";
import { systemConfigRest} from "@redux/systemconfig";

export default  async function restStore() {
     const dispatch = useDispatch();
     try {
        await dispatch(userRest())
        await  dispatch(systemConfigRest())
     } catch (error) {
        
     }
    
}