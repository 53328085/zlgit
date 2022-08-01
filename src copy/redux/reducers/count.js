import {INCREMENT, DECREMENT} from '../constant'
const initState = {counter: 10, sum: 0}
export default function countreducer(state=initState, action) { // reducer 纯函数
    console.log('counter')
    let {counter} = state
    switch (action.type) {
        case INCREMENT:
            return {...state, counter: counter+=action.playload};
        case DECREMENT:
            return {...state, counter: counter-=action.playload}
        default:
            return state
    }
}
