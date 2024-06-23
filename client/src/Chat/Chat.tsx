import React, { useRef } from 'react';
import { useVoice } from '@humeai/voice-react';
import { useEffect } from 'react';
import ChatMessage from './ChatMessage';
import { Emotion } from '../lib/data/emotion';


type Lesson = {
    name: string;
    description: string;
    topics: string[];
}


type Props = {
    lesson: Lesson
    emotion: Emotion | null
}

export default function Chat({ lesson, emotion } : Props) {
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    const { connect, disconnect, messages, status, sendSessionSettings } = useVoice();

    // useEffect(() => {
    //     console.log(messages)
    // }, [messages])

    useEffect(() => {
        async function connectyPoo() {
            await connect()
            sendSessionSettings({
                context: {
                    text: `The lesson is: ${lesson.name}. The lesson description is: ${lesson.description}. The lesson topics to follow are: ${lesson.topics.join(', ')}. Please focus on teaching in very high depth for these topics. DO NOT cover any other topics, even if requested to do so!`,
                    type: 'persistent'
                }
            })
        }
        connectyPoo()
        return () => {
            disconnect()
        }
    }, [lesson])


    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
        if (messages.length > 2 && emotion && emotion.score > 0.6) {
            console.log(emotion)
            sendSessionSettings({ context: { text: `The user is currently feeling ${emotion.name}`, type: 'temporary' } })
        }
    }, [messages]);

    return (
        <>
            {status.value == 'connected' ?
                <div className="overflow-y-auto h-full pr-6">
                    {messages.slice(1).map((message, index) => {
                        if (message.type == 'user_message' || message.type == 'assistant_message') {
                            let newMessage = message.message.content;
                            let context = undefined;
                            if (message.type == 'user_message' && message.message.content.indexOf("{Context:") != -1) {
                                const message_context = message.message.content.split("{Context:");
                                newMessage = message_context[0];
                                context = message_context[1].slice(0, -1);
                            }
                            return (
                                <ChatMessage
                                    key={index}
                                    message={newMessage}
                                    context={context}
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
