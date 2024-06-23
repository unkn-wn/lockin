import { useVoice } from '@humeai/voice-react';
import { useEffect } from 'react';
import ChatMessage from './ChatMessage';


export default function Chat() {

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

    return (
        <>
            {status.value == 'connected' ?
                <div className="overflow-y-auto h-full pr-6">
                    {messages.map((message, index) => {
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
                </div>
                :
                null
            }
        </>
    )
}