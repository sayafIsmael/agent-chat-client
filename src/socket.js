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
        this.chatting = false

        socket.on("connect", () => {
            this.setSocketId(socket.id)
            console.log("Socket service", socket.id)
        });

        socket.on("chatRequestError", (data) => {
            console.log("Chat error: ", data);
            this.this.stopSendingReqst();
        });

        socket.on("notification", (data) => {
            console.log("Notification", data);
            notifications.push(data)
        });

        socket.on("greetings", (data) => {
            console.log("Chat started", data);
            this.this.stopSendingReqst();
        });


    }

    setChatting(data) {
        this.chatting = data
    }

    getChatting() {
        return this.chatting
    }

    setUser(user) {
        this.user = user
    }

    getUser() {
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
        setTimeout(async function () {
            let response = await axios.post(`${baseurl}/cancel-request-prev`, { customerId: this.socketId, agentId: res.data.socketId });
            console.log(`Cancel req data: ${JSON.stringify({ customerId: this.socketId, agentId: res.data.socketId })}`)
            console.log(response.data);
        }, 5000);
        this.sendRequest = setInterval(async () => {
            let response = await axios.post(`${baseurl}/send-request-next`, user);
            console.log(response);
            let { socketId, message } = response.data
            console.log(message, socketId);
            setTimeout(async function () {
                let cancelres = await axios.post(`${baseurl}/cancel-request-prev`, { customerId: this.socketId, agentId: socketId });
                console.log(`Cancel req data: ${JSON.stringify({ customerId: this.socketId, agentId: socketId })}`)
                console.log(cancelres.data);
            }, 5000);
            if (!socketId) {
                this.stopSendingReqst();
                return
            }
            callback(response.data)
        }, interval);
        console.log(res);
        console.log(res.data.message, res.data.socketId);
        if (!res.data.socketId) {
            this.stopSendingReqst();
        }
        callback(res.data)
    }

    stopSendingReqst = () => {
        clearTimeout(this.sendRequest);
    }
}

export const socketClient = new SocketService()
