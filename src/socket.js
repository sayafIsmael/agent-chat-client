import React from 'react';
import socketIOClient from "socket.io-client";
const SOCKETENDPOINT = "http://localhost:3000";

export const socket  = socketIOClient(SOCKETENDPOINT)

