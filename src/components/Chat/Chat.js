import React, { useState, useEffect } from 'react';
import queryString from 'query-string';
import io from 'socket.io-client'; 

import InfoBar from '../InfoBar/InfoBar';
import Input from '../Input/Input';
import Messages from '../Messages/Messages';

import './Chat.css';

let socket;

const Chat = ( {location} ) => {
    const [name, setName] = useState('');
    const [room, setRoom] = useState('');
    const [users, setUsers] = useState('');
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const ENDPOINT = 'localhost:5000';

    useEffect(() => {
        // const data = queryString.parse(location.search);
        // console.log(location.search);
        // console.log(data);
        // or you can destructure it using:

        const { name, room } = queryString.parse(location.search);

        socket = io(ENDPOINT);

        setName(name);
        setRoom(room);

        // we are sending name and room to server
        // socket.emit('join', {name: name, room:room})
        // EM6 equivalent:
        socket.emit('join', {name, room}, (error) => {
            if(error) {
                alert(error);
            }
        });

    }, [ENDPOINT, location.search]);

    useEffect(() => {
        socket.on('message', (message) => {
            setMessages([...messages, message]);
        });

        socket.on('roomData', ({ users }) => {
            setUsers(users);
        });

        return () => {
            socket.emit('disconnect');
            socket.off();
        }
    }, [messages]);

    // function for sending messages

    const sendMessage = (event) => {
        // prevents reload of entire page on enter keypress
        event.preventDefault();

        if(message) {
            socket.emit('sendMessage', message, () => setMessage(''))
        }
    }

    return (
        <div className="outerContainer">
            <div className="container">
                <InfoBar room={room} />
                <Messages 
                    messages={messages}
                    name={name}
                />
                <Input 
                    message={message} 
                    setMessage={setMessage}
                    sendMessage={sendMessage}
                />
            </div>
        </div>
    );
}

export default Chat;