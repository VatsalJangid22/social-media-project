import useGetAllMessages from '@/hooks/useGetAllMessages';
import useGetAllRTMessages from '@/hooks/useGetRTM';
import React from 'react';
import { useSelector } from 'react-redux';

const Messages = ({ selectedUser }) => {
    useGetAllRTMessages();
    useGetAllMessages(selectedUser?._id);
    const { messages } = useSelector(store => store.chat);
    const { user } = useSelector(store => store.auth);

    return (
        <div className="flex flex-col gap-3 px-2 py-4">
            {messages && messages.map((msg, idx) => {
                const isSent = user._id === msg.sender;
                return (
                    <div
                        key={idx}
                        className={`flex ${isSent ? 'justify-end' : 'justify-start'}`}
                    >
                        <div className={`max-w-[80%] sm:max-w-[70%] px-4 py-2 rounded-2xl shadow break-words
                            ${isSent
                                ? 'bg-blue-500 text-white rounded-br-none'
                                : 'bg-gray-200 text-gray-900 rounded-bl-none'
                            }`}
                        >
                            {msg.message}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default Messages;