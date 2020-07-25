import React, { useState, useEffect } from 'react';
import { socket, socketClient } from './../socket'
import axios from 'axios'
import './registration.scss'
import { baseurl } from './../env'

function Registration({ history }) {
    const [name, setName] = useState("sifat");
    const [type, setType] = useState('agent');
    // const [socketId, setSocketId] = useState(socketClient.getSocketId());
    const [topic, setTopic] = useState('');

    async function joinToChat() {
        let socketId = socketClient.getSocketId()
        let user
        if (name && type && socketId) {
            if (type == 'agent') {
                user = { name, type, status: "free", socketId };
            } else {
                user = { name, type, status: "free", socketId, topic };
            }
            let response = await axios.post(`${baseurl}/join`, user);
            let data = response.data;
            socketClient.setUser(user)
            if (data.success) {
                localStorage.setItem('user', JSON.stringify(user))
                history.push('/chat?login=true')
            }
            console.log("Join reqst response", data)
        }else{
            alert('Please input all field')
        }

    }

    return (
        <React.Fragment>
            <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css" integrity="sha384-9aIt2nRpC12Uk9gS9baDl411NQApFmC26EwAOH8WgZl5MYYxFfc+NcPb1dKGj7Sk" crossOrigin="anonymous" />
            <div className="card p-5">

                <form>
                    <div className="form-group">
                        <label htmlFor="exampleFormControlInput1">Name</label>
                        <input
                            onChange={(e) => setName(e.target.value)}
                            type="email"
                            className="form-control"
                            id="exampleFormControlInput1"
                            placeholder="name" />
                    </div>
                    <div className={`form-group`}>
                        <label htmlFor="exampleFormControlSelect1">Select login type</label>
                        <select className="form-control" id="exampleFormControlSelect1"
                            onChange={(e) => setType(e.target.value)}
                        >
                            <option value="agent">Agent</option>
                            <option value="customer">Customer</option>
                        </select>
                    </div>
                    <div className={`form-group ${type == 'agent' ? 'd-none' : ''}`}>
                        <label htmlFor="exampleFormControlInput1">Topic</label>
                        <input
                            onChange={(e) => setTopic(e.target.value)}
                            type="email" className="form-control" id="exampleFormControlInput1" placeholder="topic" />
                    </div>
                    <button type="button" className="btn btn-outline-secondary" style={{ width: '100%' }}
                        onClick={() => joinToChat()}
                    >Join</button>
                </form>
            </div>
        </React.Fragment>

    );
}

export default Registration;
