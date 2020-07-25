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
            requests.push(action.payload)
            return {
                ...state,
                requests
            };
        default:
            return state;
    }
}