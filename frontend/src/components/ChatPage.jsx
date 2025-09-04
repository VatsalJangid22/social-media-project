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
import { toast } from 'sonner';

const ChatPage = () => {
    const {user, selectedUser} = useSelector(store => store.auth);
    const dispatch = useDispatch();
    const {onlineUsers, messages} = useSelector(store => store.chat);
    const [textMessage, setTextMessage] = useState("");

    useEffect(() => {
        dispatch(setSelectedUser(null));
    }, []);

    const sendMessageHandler = async () => {
        if (!selectedUser?._id || !textMessage.trim()) return;
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
            toast.error(error?.response?.data?.message || "Failed to send message");
        }
    }

    return (
        <div className="w-full px-2 sm:px-3 md:px-4">
            <div className="w-full max-w-[1200px] mx-auto grid md:grid-cols-[220px_1fr] lg:grid-cols-[240px_1fr] gap-4 lg:gap-6 min-h-[70vh]">
                {/* Left: User List */}
                <aside className="bg-white border border-gray-200 rounded-lg overflow-hidden flex flex-col">
                    <div className="px-3 py-3 border-b border-gray-200">
                        <h2 className="font-bold text-base">Chats</h2>
                    </div>
                    <div className="flex-1 overflow-y-auto p-2 md:p-3 space-y-2">
                        {user.followings.map((following, index) => {
                            const isOnline = onlineUsers.includes(following._id);
                            return (
                                <div
                                    key={index}
                                    onClick={() => dispatch(setSelectedUser(following))}
                                    className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer hover:bg-gray-100 transition ${selectedUser?._id === following._id ? 'bg-gray-100' : ''}`}
                                >
                                    <Avatar className="h-10 w-10">
                                        <AvatarImage src={following.profilePicture} />
                                        <AvatarFallback>{following?.username ? following.username.charAt(0).toUpperCase() : "."}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex flex-col">
                                        <span className="font-medium text-sm">{following?.username}</span>
                                        <span className={`${isOnline ? 'text-green-500' : 'text-red-500'} text-xs`}>{isOnline ? 'online' : 'offline'}</span>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </aside>
                {/* Right: Chat Area */}
                <section className="bg-white border border-gray-200 rounded-lg p-2 md:p-4 overflow-hidden flex flex-col">
                    {selectedUser ? (
                        <div className="flex flex-col h-full">
                            <div className="flex items-center gap-3 mb-3 border-b border-gray-100 pb-3">
                                <Avatar className="h-10 w-10">
                                    <AvatarImage src={selectedUser.profilePicture} />
                                    <AvatarFallback>{selectedUser?.username ? selectedUser.username.charAt(0).toUpperCase() : "."}</AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col">
                                    <span className="font-medium">{selectedUser?.username}</span>
                                    <Link to={`/profile/${selectedUser._id}`}>
                                        <button className="px-3 py-1 rounded border font-semibold bg-gray-100 hover:bg-gray-200 text-xs shadow-sm cursor-pointer">
                                            View Profile
                                        </button>
                                    </Link>
                                </div>
                            </div>
                            <div className="flex-1 overflow-y-auto mb-3">
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
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-gray-500">
                            <MessageCircleCode size={48} />
                            <span className="mt-2">Select a user to start messaging</span>
                        </div>
                    )}
                </section>
            </div>
        </div>
    )
}

export default ChatPage