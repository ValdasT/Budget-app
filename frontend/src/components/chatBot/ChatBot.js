import React, { useEffect, useState } from "react";
// import ChatBot from "react-simple-chatbot";
import { Widget, addResponseMessage, toggleMsgLoader } from 'react-chat-widget';
import './ChatBot.css';
import logo from '../../pig-face.png';


const CustomChatbot = () => {

    useEffect(() => {
        addResponseMessage("Init message!");
    }, []);

    const handleNewUserMessage = (newMessage) => {
        toggleMsgLoader();
        let message = { userMessage: newMessage };

        fetch('/watson', {
            method: 'POST',
            body: JSON.stringify(message),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => res.json())
            .then(data => {
                toggleMsgLoader();
                addResponseMessage(data.response);
            })
            .catch(err => {
                toggleMsgLoader();
                console.log(err);
            });
    };

    return <Widget
        handleNewUserMessage={handleNewUserMessage}
        title="Budget Buddy"
        subtitle=""
        profileAvatar={logo}
    />;
};

export { CustomChatbot as default };