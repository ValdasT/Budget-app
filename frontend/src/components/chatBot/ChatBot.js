import React, { useEffect, useState, useContext, Fragment } from "react";
import ExpensesContext from '../../context/expenses-context';
import AuthContext from '../../context/auth-context';
import { Widget, addResponseMessage, toggleMsgLoader, dropMessages } from 'react-chat-widget';
import './ChatBot.css';
import logo from '../../pig-face.png';


const CustomChatbot = () => {
    const { settingsForBot, allExpensesForBot} = useContext(ExpensesContext);
    let currentUser = AuthContext._currentValue;

    useEffect(() => {
        if (currentUser.token) {
            dropMessages();
            handleNewUserMessage("Hello");
        }
    }, [currentUser.token]);

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

    return (
        <Fragment>
            {currentUser.token ? < Widget
                handleNewUserMessage={handleNewUserMessage}
                title="Budget Buddy"
                subtitle=""
                profileAvatar={logo}
            /> : null
            }
        </Fragment>
    );
};

export { CustomChatbot as default };