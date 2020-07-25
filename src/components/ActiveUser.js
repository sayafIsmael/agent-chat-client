import React from 'react';

export default function ActiveUser({ name, chat, type, avatar}) {
    return (
        <ul>
            <li className="contact">
                <div className="wrap">
                    <span className="contact-status online"></span>
                    <img src={avatar} alt="" style={{width:40, height: 40}}/>
                    <div className="meta">
                        <p className="name">{name}</p>
                        {type == "chatreq" && <p className="preview">Chat request</p>}
                    </div>

                </div>
                {type == "chatreq" && <button type="button" className={`${type == "chatreq" ? 'chat-btn-accept':'chat-btn'} `} onClick={chat}>{type == "chatreq" ? "Accept" : "Chat"}</button>}
            </li>
        </ul>
    )
}