import React from 'react';

export default function ActiveUser({ name, chat, type }) {
    return (
        <ul>
            <li className="contact">
                <div className="wrap">
                    <span className="contact-status online"></span>
                    <img src="http://emilcarlsson.se/assets/louislitt.png" alt="" />
                    <div className="meta">
                        <p className="name">{name}</p>
                        {type == "chatreq" && <p className="preview">Chat request</p>}
                    </div>

                </div>
                <button type="button" className={`${type == "chatreq" ? 'chat-btn-accept':'chat-btn'} `} onClick={chat}>{type == "chatreq" ? "Accept" : "Chat"}</button>
            </li>
        </ul>
    )
}