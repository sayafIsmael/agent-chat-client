import {
    CANCEL_REQ,
    ADD_REQ
} from '../actions/types';

const initialState = {
    requests: []
};

export default function (state = initialState, action) {
    switch (action.type) {
        case CANCEL_REQ:
            return {
                ...state,
                requests: action.payload
            };

        case ADD_REQ:
            let requests = state.requests
            let reqExist = requests.filter(req => req.socketId === action.payload.socketId)
            if (!reqExist.length) {
                requests.push(action.payload)
                return {
                    ...state,
                    requests
                };
            }
            return state

        default:
            return state;
    }
}