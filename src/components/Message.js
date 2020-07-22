import React from 'react';

export default function Message({ image, text="Hello", type }) {
    return (
        <li class={type}>
            <img src="http://emilcarlsson.se/assets/mikeross.png" alt="" />
            <p>{text}</p>
        </li>
    )
}