import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { setSelectedUser } from '@/redux/authSlice';
import { Link } from 'react-router-dom';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { MessageCircleCode } from 'lucide-react';
import Messages from './Messages';
import axios from 'axios';
import { setMessages } from '@/redux/chatSlice';

const ChatPage = () => {
    const {user, selectedUser} = useSelector(store => store.auth);
    const dispatch = useDispatch();
    const {onlineUsers, messages} = useSelector(store => store.chat);
    const [textMessage, setTextMessage] = useState("");

    useEffect(() => {
        dispatch(setSelectedUser(null));
    }, []);

    const sendMessageHandler = async () => {
        try {
            const res = await axios.post(`https://social-media-project-v2n6.onrender.com/api/v1/message/send/${selectedUser._id}` , {textMessage}, {
                headers:{
                    "Content-Type":"application/json",
                },
                withCredentials:true
            })

            if(res.data.success){
                dispatch(setMessages([...messages, res.data.newMessage]));
                setTextMessage("");
            }

        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="flex flex-col md:flex-row h-screen w-full px-2 md:px-8 gap-4 md:gap-8">
            {/* Left: User List */}
            <div className="w-full md:w-1/3 lg:w-1/4 bg-white border-r border-gray-200 p-2 md:p-4 overflow-y-auto">
                <h2 className="font-bold text-lg mb-4">Chats</h2>
                <div className="space-y-4">
                    {user.followings.map((following, index) => {
                        const isOnline = onlineUsers.includes(following._id);
                        return (
                            <div
                                key={index}
                                onClick={() => dispatch(setSelectedUser(following))}
                                className={`flex items-center gap-4 p-2 rounded-lg cursor-pointer hover:bg-gray-100 transition ${selectedUser?._id === following._id ? 'bg-gray-100' : ''}`}
                            >
                                <Avatar className="h-10 w-10">
                                    <AvatarImage src={following.profilePicture} />
                                    <AvatarFallback>{following?.username ? following.username.charAt(0).toUpperCase() : "."}</AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col">
                                    <span className="font-medium text-sm">{following?.username}</span>
                                    <span className={`text-xs ${isOnline ? 'text-green-500' : 'text-red-500'}`}>{isOnline ? 'online' : 'offline'}</span>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
            {/* Right: Chat Area */}
            <div className="flex-1 flex flex-col bg-white rounded-lg shadow-md p-2 md:p-6 overflow-hidden">
                {selectedUser ? (
                    <section className="flex flex-col h-full">
                        <div className="flex items-center gap-4 mb-4">
                            <Avatar className="h-10 w-10">
                                <AvatarImage src={selectedUser.profilePicture} />
                                <AvatarFallback>{selectedUser?.username ? selectedUser.username.charAt(0).toUpperCase() : "."}</AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                                <span className="font-medium">{selectedUser?.username}</span>
                                <Link to={`/profile/${selectedUser._id}`}>
                                    <button className="px-4 py-1 rounded border font-semibold bg-gray-100 hover:bg-gray-200 text-xs shadow-sm cursor-pointer">
                                        View Profile
                                    </button>
                                </Link>
                            </div>
                        </div>
                        <div className="flex-1 overflow-y-auto mb-4">
                            <Messages selectedUser={selectedUser}/>
                        </div>
                        <div className="flex gap-2 items-center">
                            <Input
                                value={textMessage}
                                onChange={(e)=>setTextMessage(e.target.value)}
                                type="text"
                                placeholder="Type a message..."
                                className="flex-1"
                            />
                            <Button onClick={sendMessageHandler} disabled={!textMessage.trim()}>
                                Send
                            </Button>
                        </div>
                    </section>
                ) : (
                    <section className="flex flex-col items-center justify-center h-full text-gray-500">
                        <MessageCircleCode size={48} />
                        <span className="mt-2">Select a user to start messaging</span>
                    </section>
                )}
            </div>
        </div>
    )
}

export default ChatPage