import {
    CANCEL_REQ,
  } from './types';
 
  export const seeMore = (reqs) => dispatch => {
    dispatch({
      type: CANCEL_REQ,
      payload: reqs
    })
  };
  
  