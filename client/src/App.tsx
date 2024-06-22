import { FaUpload } from "react-icons/fa6";
import React, { useState, useEffect } from "react";


import ChatMessage from "./ChatMessage";

export default function App() {
    const [messages, setMessages] = useState<{ text: string; sender: string; timestamp: string; }[]>([]);


    useEffect(() => {
        fetchMessages();
    }, []);


    // Some function to fetch messages
    const fetchMessages = async () => {
        setMessages([
            { text: "Hello!", sender: "Alice", timestamp: "12:00" },
            { text: "Hi!", sender: "Bob", timestamp: "12:01" },
            { text: "How are you?", sender: "Alice", timestamp: "12:02" },
        ]);
    }


    // Upload file function
    const uploadFile = () => {
        console.log("clicked!")
    }

    return (
        <>
            <div className='h-screen w-screen bg-white'>

                <div className="flex flex-row h-full">
                    {/* LEFT SIDEBAR */}
                    <div className="flex flex-col w-1/5 p-4">
                        <h1 className="text-5xl font-bold mb-8">Lessons</h1>
                        <div className="flex flex-col gap-24 overflow-y-auto h-full">
                            <h2 className="text-3xl font-bold">Lesson 1</h2>
                            <h2 className="text-3xl font-bold">Lesson 2</h2>
                            <h2 className="text-3xl font-bold">Lesson 3</h2>
                            <h2 className="text-3xl font-bold">Lesson 4</h2>
                            <h2 className="text-3xl font-bold">Lesson 5</h2>
                            <h2 className="text-3xl font-bold">Lesson 6</h2>
                        </div>

                        <div className="flex flex-row justify-center items-center py-2 rounded-lg border-2 border-black cursor-pointer hover:-translate-y-0.5 transition"
                            onClick={() => { uploadFile() }}>
                            <FaUpload size={24} />
                            <h1 className='text-lg text-center'>upload</h1>
                        </div>
                    </div>

                    {/* MAIN PAGE */}
                    <div className="flex flex-col w-4/5 ">
                        <ChatMessage message="Hello!" sender="Alice" timestamp="12:00" />

                        {messages.map((message, index) => (
                            <ChatMessage
                                key={index}
                                message={message.text}
                                sender={message.sender}
                                timestamp={message.timestamp}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}