import React from 'react';

export default function Message({ text="Hello", type, avatar }) {
    return (
        <li className={type}>
            <img src={avatar} alt="" style={{width:20, height: 20}}/>
            <p>{text}</p>
        </li>
    )
}