import React, { useRef } from 'react';
import { useVoice } from '@humeai/voice-react';
import { useEffect } from 'react';
import ChatMessage from './ChatMessage';


export default function Chat() {
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    const { connect, disconnect, messages, status } = useVoice();

    useEffect(() => {
        console.log(messages)
    }, [messages])

    useEffect(() => {
        connect()
        return () => {
            disconnect()
        }
    }, [])


    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    return (
        <>
            {status.value == 'connected' ?
                <div className="overflow-y-auto h-full pr-6">
                    {messages.slice(1).map((message, index) => {
                        if (message.type == 'user_message' || message.type == 'assistant_message') {
                            return (
                                <ChatMessage
                                    key={index}
                                    message={message.message.content}
                                    sender={message.message.role}
                                />
                            )
                        }
                        return null
                    })}
                    <div ref={messagesEndRef} />
                </div>
                :
                null
            }
        </>
    )
}
