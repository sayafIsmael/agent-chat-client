import {
    CANCEL_REQ,
    ADD_REQ
  } from './types';
 
  export const cancelRequest = (reqs) => dispatch => {
    dispatch({
      type: CANCEL_REQ,
      payload: reqs
    })
  };
  
  export const addRequest = (req) => dispatch => {
    dispatch({
      type: ADD_REQ,
      payload: req
    })
  };