import React from 'react';
import axios from 'axios'
import { baseurl } from './../env'

const getAvilableAgent = async () =>{
    let response = await axios.get(`${baseurl}/available/agent`);
    let data = response.data;
    // console.log("Avilable agents: ",data)
    return data
}

const getAvilableCustomer = async () =>{
    let response = await axios.get(`${baseurl}/available/customer`);
    let data = response.data;
    // console.log("Avilable customers: ",data)
    return data
}

export { getAvilableAgent, getAvilableCustomer }