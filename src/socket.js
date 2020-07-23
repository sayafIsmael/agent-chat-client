import React from 'react';
import socketIOClient from "socket.io-client";
import axios from 'axios'

const baseurl = `http://localhost:5000`;
const SOCKETENDPOINT = "http://localhost:4000";

export const socket = socketIOClient(SOCKETENDPOINT)

export const notifications = []

class SocketService {

    constructor() {
        this.socketId = null
        this.sendRequest = null;
        this.user = null
        
        socket.on("connect", () => {
            this.setSocketId(socket.id)
            console.log("Socket service", socket.id)
        });

        socket.on("chatRequestError", (data) => {
            console.log("Chat error: ", data);
            this.stopSendingReqst();
        });

        socket.on("notification", (data) => {
            console.log("Notification", data);
            notifications.push(data)
        });

        socket.on("greetings", (data) => {
            console.log("Chat started", data);
            this.stopSendingReqst();
        });

        
    }

    setUser(user){
        this.user = user
    }

    getUser(){
        return this.user
    }

    setSocketId(id) {
        this.socketId = id
    }

    getSocketId() {
        return this.socketId
    }

    async createRequest(callback) {
        let interval = 3000
        let user = { name: "Customer sayaf", socketId: this.socketId };
        let res = await axios.post(`${baseurl}/send-request-next`, user);
        this.sendRequest = setInterval(async function () {
            // alert("Hello");
            let response = await axios.post(`${baseurl}/send-request-next`, user);
            console.log(response);
            callback(`Please wait ${interval/1000} seconds`)
        }, interval);
        console.log(res);
        callback(res)
    }

    stopSendingReqst() {
        clearTimeout(this.sendRequest);
    }
}

export const socketClient = new SocketService()
