import React, { useRef, useEffect, useState} from 'react';
import queryString from 'query-string'
import './registration.scss'
import { Redirect }  from "react-router-dom";
import Message from './../components/Message'
import { socketClient } from './../socket'

function Chat({location}) {
	var chatContainer = useRef();
	const parsed = queryString.parse(location.search);
    const [user, setUser] = useState(socketClient.getUser());

	useEffect(() => console.log("Loged in user",user), []);

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

	return (
		<div id="frame">
			<div id="sidepanel">
				<div id="profile">
					<div className="wrap">
						<img id="profile-img" src="http://emilcarlsson.se/assets/mikeross.png" className="online" alt="" />
						<p>Mike Ross</p>
						<i className="fa fa-chevron-down expand-button" aria-hidden="true"></i>
						<div id="status-options">
							<ul>
								<li id="status-online" className="active"><span className="status-circle"></span> <p>Online</p></li>
								<li id="status-away"><span className="status-circle"></span> <p>Away</p></li>
								<li id="status-busy"><span className="status-circle"></span> <p>Busy</p></li>
								<li id="status-offline"><span className="status-circle"></span> <p>Offline</p></li>
							</ul>
						</div>
					</div>
				</div>
				<div id="search">
					<label htmlFor=""><i className="fa fa-search" aria-hidden="true"></i></label>
					<input type="text" placeholder="Search contacts..." />
				</div>
				<div id="contacts">
					<ul>
						<li className="contact">
							<div className="wrap">
								<span className="contact-status online"></span>
								<img src="http://emilcarlsson.se/assets/louislitt.png" alt="" />
								<div className="meta">
									<p className="name">Louis Litt</p>
									<p className="preview">You just got LITT up, Mike.</p>
								</div>
							</div>
						</li>
						<li className="contact active">
							<div className="wrap">
								<span className="contact-status busy"></span>
								<img src="http://emilcarlsson.se/assets/harveyspecter.png" alt="" />
								<div className="meta">
									<p className="name">Harvey Specter</p>
									<p className="preview">Wrong. You take the gun, or you pull out a bigger one. Or, you call their bluff. Or, you do any one of a hundred and forty six other things.</p>
								</div>
							</div>
						</li>

					</ul>
				</div>
				<div id="bottom-bar">
					<button id="addcontact"><i className="fa fa-user-plus fa-fw" aria-hidden="true"></i> <span>Add contact</span></button>
					<button id="settings"><i className="fa fa-commenting-o" aria-hidden="true"></i> <span>Start chatting</span></button>
				</div>
			</div>
			<div className="content">
				<div className="contact-profile">
					<img src="http://emilcarlsson.se/assets/harveyspecter.png" alt="" />
					<p>Harvey Specter</p>
					<div className="social-media">
						<i className="fa fa-facebook" aria-hidden="true"></i>
						<i className="fa fa-twitter" aria-hidden="true"></i>
						<i className="fa fa-instagram" aria-hidden="true"></i>
					</div>
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
