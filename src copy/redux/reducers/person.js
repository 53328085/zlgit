import {ADD_PERSON} from '../constant'
const initState = []
export default function countreducer(state=initState, action) { // reducer 纯函数   
    console.log('person')
    switch (action.type) {
        case ADD_PERSON:
            return [action.playload, ...state];
       
        default:
            return state
    }
}
