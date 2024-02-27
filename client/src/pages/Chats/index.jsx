import { Button, Input, List, ListItem } from '@mantine/core';
import Cookies from 'js-cookie';
import React, { useEffect, useState } from 'react';
import { io } from "socket.io-client";

export default function Chats() {
    const [socket, setSocket] = useState(io('http://localhost:3000', { withCredentials: true }));
    const [message, setMessage] = useState('');
    const [receivedMessages, setReceivedMessages] = useState([]);
    const [sentMessages, setSentMessages] = useState([]);

    function messageChange(e){
        setMessage(e.target.value);
    }

    function sendMessage(e){
        setSentMessages([...sentMessages, message])
        socket.emit('chat', { message: message, to: Cookies.get('to') });
        setMessage('');
    }

    useEffect(() => {
        socket.emit('join', { user: Cookies.get('from')});
        return () => socket.off('join');
    },[])

    useEffect(() => {
        socket.on('chat', (data) => {
            console.log('event..')
            setReceivedMessages([...receivedMessages, data]);
        });
        return () => socket.off('join');
    },[receivedMessages])
 
    return (
        <>
            <div>Chats</div>
            <Input w={'200px'} value={message} onChange={messageChange} placeholder='type message'/>
            <Button onClick={sendMessage}>Send message</Button>
            <div>Sent messages</div>
            <List>
                {sentMessages.map((item, index) => <ListItem key={index}>{item}</ListItem>)}
            </List>
            <div>Received messages</div>
            <List>
                {receivedMessages.map((item, index) => <ListItem key={index}>{item}</ListItem>)}
            </List>
        </>
    )
}
