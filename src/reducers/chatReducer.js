import {
    CANCEL_REQ,
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
          default:
            return state;
    }
  }