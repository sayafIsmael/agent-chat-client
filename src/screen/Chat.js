import React, { useRef, useEffect, useState } from 'react';
import queryString from 'query-string'
import './registration.scss'
import { Redirect } from "react-router-dom";
import Message from './../components/Message'
import { socket, socketClient } from './../socket'
import { getAvilableAgent, getAvilableCustomer } from "./ChatServices";
import ActiveUser from './../components/ActiveUser'

function Chat({ location }) {
	var chatContainer = useRef();
	const parsed = queryString.parse(location.search);
	const [user, setUser] = useState(socketClient.getUser());
	const [userType, setUserType] = useState('');
	const [chatting, setChatting] = useState(socketClient.getChatting());
	const [chattingWith, setChattingWith] = useState("");
	const [availableUsers, setAvailableUsers] = useState([]);
	const [chatrequests, setChatrequests] = useState([]);

	useEffect(() => {
		let localUser = localStorage.getItem('user')
		setUserType(JSON.parse(localUser))
	}, []);

	async function refreshData() {
		try {
			if (user.type == "agent") {
				setAvailableUsers(await getAvilableCustomer());
				setInterval(async function () {
					setAvailableUsers(await getAvilableCustomer());
				}, 3000);
			} else if (user.type == "customer") {
				setAvailableUsers(await getAvilableAgent())
				setInterval(async function () {
					setAvailableUsers(await getAvilableAgent())
				}, 3000);
			}
		} catch (error) {
			console.log(error)
		}
	}

	useEffect(() => {
		refreshData()
	}, []);

	useEffect(() => {
		socket.on("chatReq", (data) => {
			chatrequests.push(data)
			console.log("Notification", data);
		});
	}, [])
	
	// useEffect(() => {
	// 	socket.on("cancelReq", (socketId) => {
	// 		// let newList = chatrequests.filter(chatreq => chatreq.socketId != socketId)
	// 		// console.log("New list", newList);
	// 		setChatrequests(chatrequests.filter(chatreq => chatreq.socketId !== socketId))
	// 		// chatrequests.pop()
	// 		console.log("Last ID from server: ", socketId);


	// 	});
	// }, [chatrequests])

	function sendRequest (){
		socketClient.createRequest((data) => console.log(data))
	}

	function scrollToMyRef() {
		try {
			const scroll =
				chatContainer.current.scrollHeight -
				chatContainer.current.clientHeight;
			chatContainer.current.scrollTo(0, scroll);
		} catch (error) {

		}
	};

	if (!user) {
		return <Redirect to="/" />
	}


	function chat(name) {
		setChatting(true)
		setChattingWith(name)
	}

function checkReqstExist(socketId) {
		let exist = chatrequests.filter(chatreq => chatreq.socketId === socketId)
		console.log("kkkkkkkkk", exist.length)
		if (exist.length) {
			return true
		} else {
			return false
		}
	}

	return (
		<div id="frame">
			<div id="sidepanel">
				<div id="profile">
					<div className="wrap">
						<img id="profile-img" src="http://emilcarlsson.se/assets/mikeross.png" className="online" alt="" />
						<p>{user.name}</p>
					</div>
				</div>


				<div id="search">
					<label htmlFor=""><i className="fa fa-search" aria-hidden="true"></i></label>
					<input type="text" placeholder="Search contacts..." />
				</div>
				<div id="contacts">
					{availableUsers.map((user, i) => {
						return (<ActiveUser key={i} name={user.name} chat={() => chat(user.name)} />)
					})}
					{[...chatrequests].map((user, i) => {
						return (<ActiveUser key={i} name={user.name} chat={() => chat(user.name)} type="chatreq" />)
					})}
				</div>
				<p>No user is active now..</p>

				<div id="bottom-bar">
					<button id="addcontact" onClick={()=> sendRequest()}><i className="fa fa-user-plus fa-fw" aria-hidden="true"></i> <span>Start chat</span></button>
					<button id="settings"><i className="fa fa-commenting-o" aria-hidden="true"></i> <span>Start chatting</span></button>
				</div>
			</div>
			<div className={`content ${chatting ? '' : 'd-none'}`}>
				<div className="contact-profile">
					<img src="http://emilcarlsson.se/assets/harveyspecter.png" alt="" />
					<p>{chattingWith}</p>
				</div>
				<div ref={chatContainer} className="messages">
					<ul>
						<Message text={"I am sayaf"} type={"sent"} />
						<Message text={"I am Mojnu"} type={"replies"} />
					</ul>
					<p className="type-indicator">Typing ...</p>
				</div>
				<div className="message-input">
					<div className="wrap">
						<input type="text" placeholder="Write your message..." />
						<i className="fa fa-paperclip attachment" aria-hidden="true"></i>
						<button className="submit"><i className="fa fa-paper-plane" aria-hidden="true"></i></button>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Chat;
