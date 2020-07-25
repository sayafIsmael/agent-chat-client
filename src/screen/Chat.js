import React, { useRef, useEffect, useState } from 'react';
import queryString from 'query-string'
import PropTypes from "prop-types";
import {
	cancelRequest,
	addRequest
} from "../actions/chatActions";
import { connect } from "react-redux";
import axios from 'axios'
import './registration.scss'
import { baseurl } from './../env'
import { Redirect } from "react-router-dom";
import Message from './../components/Message'
import { socket, socketClient } from './../socket'
import { getAvilableAgent, getAvilableCustomer } from "./ChatServices";
import ActiveUser from './../components/ActiveUser'

function Chat({ location, requests, cancelRequest, addRequest }) {
	var chatContainer = useRef();
	const parsed = queryString.parse(location.search);
	const [user, setUser] = useState(socketClient.getUser());
	const [userType, setUserType] = useState('');
	const [text, setText] = useState('');
	const [typing, setTyping] = useState(false);
	const [messages, setMessages] = useState([]);
	const [chatting, setChatting] = useState();
	const [chattingWith, setChattingWith] = useState("");
	const [recepientId, setRecepientId] = useState(null);
	const [recepientAvatar, setRecepientAvatar] = useState(null);
	const [availableUsers, setAvailableUsers] = useState([]);

	useEffect(() => {
		let localUser = localStorage.getItem('user')
		setUserType(JSON.parse(localUser))
		cancelRequest([])
	}, []);

	async function refreshData() {
		try {
			if (user.type == "agent") {
				setAvailableUsers(await getAvilableCustomer());
				setInterval(async function () {
					setAvailableUsers(await getAvilableCustomer());
				}, 1000);
			} else if (user.type == "customer") {
				setAvailableUsers(await getAvilableAgent())
				setInterval(async function () {
					setAvailableUsers(await getAvilableAgent())
				}, 1000);
			}
		} catch (error) {
			console.log(error)
		}
	}

	useEffect(() => {
		refreshData()
	}, []);

	useEffect(() => {
		socket.on("greetings", (data) => {
			setChattingWith(data.name)
			setRecepientId(data.socketId)
			setRecepientAvatar(data.image)
			setChatting(true)
		});
	}, []);

	useEffect(() => {
		socket.on("chatReq", (data) => {
			addRequest(data)
			console.log("Notification", data);
		});
	}, [])

	useEffect(() => {
		socket.on("typing", (data) => {
			setTyping(data)
			console.log("typing: ", data);
		});
	}, [])


	useEffect(() => {
		socket.on("message", (data) => {
			messages.push(data)
			console.log("Message", data);
		});
	}, [])

	useEffect(() => {
		socket.on("cancelReq", (socketId) => {
			let newList = requests.filter(chatreq => chatreq.socketId != socketId)
			console.log("New list", newList);
			cancelRequest(newList)
			console.log("Last ID from server: ", socketId);
		});
	}, [])

	function sendRequest() {
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


	async function chat(customer) {
		let { name, socketId, image } = customer
		setChatting(true)
		setChattingWith(name)
		setRecepientId(socketId)
		setRecepientAvatar(image)

		// setMessages([])
		let agent = user
		agent.status = "busy"
		let postData = { customerId: socketId, agent };
		await axios.post(`${baseurl}/cancel-request-prev`, { customerId: socketId, agentId: socketClient.getSocketId() });
		let response = await axios.post(
			`${baseurl}/accept-request`,
			postData
		);
		let data = response.data;
		console.log(data);
	}

	async function typingReq(typing) {
		await axios.post(`${baseurl}/typing`, { typing, toId: recepientId });
	}

	function handleMessageeInput(e) {
		setText(e.target.value)
		if (e.which != 13) {
			typingReq(true)
		}
		if (e.target.value == "") {
			typingReq(false)
		}
	}

	function handleKeyDown(e) {
		if (e.keyCode == 13) {
			sendMessage()
		}
	}

	async function sendMessage() {
		let response = await axios.post(`${baseurl}/sendmessage`, {
			from: user.socketId,
			to: recepientId,
			text,
			time: new Date(),
		});
		if (response.data.success) {
			setText('')
		}
	}

	return (
		<div id="frame">
			<div id="sidepanel">
				<div id="profile">
					<div className="wrap">
						<img id="profile-img" src={user.image} className="online" alt="" style={{ width: 50, height: 50 }} />
						<p>{user.name} {user.type}</p>
					</div>
				</div>


				<div id="search">
					<label htmlFor=""><i className="fa fa-search" aria-hidden="true"></i></label>
					<input type="text" placeholder="Search contacts..." />
				</div>
				<div id="contacts">
					{availableUsers.map((user, i) => {
						return (<ActiveUser avatar={user.image} key={i} name={user.name} chat={() => chat(user)} />)
					})}
					{requests.map((user, i) => {
						return (<ActiveUser avatar={user.image} key={i} name={user.name} chat={() => chat(user)} type="chatreq" />)
					})}
				</div>

				<div id="bottom-bar">
					{user.type == "customer" && !chatting && <button id="addcontact" onClick={() => sendRequest()}><i className="fa fa-user-plus fa-fw" aria-hidden="true"></i> <span>Send Chat request</span></button>
					}					<button id="settings"><i className="fa fa-commenting-o" aria-hidden="true"></i> <span></span></button>
				</div>
			</div>
			<div className={`content ${chatting ? '' : 'd-none'}`}>
				<div className="contact-profile">
					<img src={recepientAvatar} alt="" style={{ width: 40, height: 40 }} />
					<p>{chattingWith}</p>
				</div>
				<div ref={chatContainer} className="messages">
					<ul>
						{messages.map((message, i) => {
							return <Message key={i}
								avatar={recepientAvatar}
								date={message.date}
								text={message.text}
								type={`${socketClient.getSocketId() === message.from ? "sent" : "replies"}`} />
						})}
						{/* <Message text={"I am sayaf"} type={"sent"} /> */}
						{/* <Message text={"I am Mojnu"} type={"replies"} /> */}
					</ul>
					{typing && <p className="type-indicator">Typing ...</p>}
				</div>
				<div className="message-input">
					<div className="wrap">
						<input onBlur={() => typingReq(false)}
							onKeyDown={(e) => handleKeyDown(e)}
							type="text" value={text} placeholder="Write your message..."
							onChange={(e) => handleMessageeInput(e)} />
						<i className="fa fa-paperclip attachment" aria-hidden="true"></i>
						<button className="submit"
							onClick={() => sendMessage()}
						><i className="fa fa-paper-plane" aria-hidden="true"></i></button>
					</div>
				</div>
			</div>
		</div>
	);

}


Chat.propTypes = {
	cancelRequest: PropTypes.func.isRequired,
	addRequest: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
	requests: state.chat.requests,
});

export default connect(
	mapStateToProps,
	{ cancelRequest, addRequest }
)(Chat);
