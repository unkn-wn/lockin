import React, { useState, useEffect } from "react";

import ChatMessage from "./ChatMessage";

import { FaUpload } from "react-icons/fa6";
import Webcam from "react-webcam";

export default function App() {
    const [messages, setMessages] = useState<{ text: string; sender: string; timestamp: string; }[]>([]);
    const [lessons, setLessons] = useState<string[]>([]);


    useEffect(() => {
        fetchMessages();
        fetchLessons();
    }, []);


    // Some function to fetch messages
    const fetchMessages = async () => {
        setMessages([
            { text: "Hello!", sender: "Alice", timestamp: "12:00" },
            { text: "Hi!", sender: "Bob", timestamp: "12:01" },
            { text: "How are you?", sender: "Alice", timestamp: "12:02" },
            { text: "I'm good, thanks!", sender: "Bob", timestamp: "12:03" },
            { text: "How about you?", sender: "Bob", timestamp: "12:04" },
            { text: "I'm good too.", sender: "Alice", timestamp: "12:05" },
            { text: "Great!", sender: "Bob", timestamp: "12:06" },
            { text: "I'm glad to hear that.", sender: "Alice", timestamp: "12:07" },
            { text: "Me too!", sender: "Bob", timestamp: "12:08" },
            { text: "I'm glad we're both happy.", sender: "Alice", timestamp: "12:09" },
            { text: "Me too!", sender: "Bob", timestamp: "12:10" },
            { text: "I'm glad we both agree.", sender: "Alice", timestamp: "12:11" },
            { text: "Me too!", sender: "Bob", timestamp: "12:12" }
        ]);
    }


    // Some function to fetch lessons
    const fetchLessons = async () => {
        setLessons([
            "Lesson 1: Introduction to React",
            "Lesson 2: State Management",
            "Lesson 3: Hooks",
            "Lesson 4: Context API",
            "Lesson 5: Redux",
            "Lesson 6: Redux Toolkit",
            "Lesson 7: React Router",
            "Lesson 8: Testing",
            "Lesson 9: Deployment",
            "Lesson 10: Conclusion",
            "Lesson 11: Bonus Lesson",
            "Lesson 12: Extra Bonus Lesson",
            "Lesson 13: Extra Extra Bonus Lesson"
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
                        <h1 className="text-5xl font-bold">Lessons</h1>
                        <div className="flex flex-col gap-8 py-6 overflow-y-auto h-full">
                            {lessons.map((lesson, index) => (
                                <h1 className='text-2xl font-bold'>{index + 1}: {lesson}</h1>
                            ))}
                        </div>

                        <div className="flex flex-row justify-center items-center py-2 rounded-lg border-2 border-black cursor-pointer hover:-translate-y-0.5 transition"
                            onClick={() => { uploadFile() }}>
                            <FaUpload size={24} />
                            <h1 className='text-lg text-center'>upload</h1>
                        </div>
                    </div>

                    {/* MAIN PAGE */}
                    <div className="flex flex-col w-4/5 border-l-2 p-4 border-black">
                        <div className="absolute right-0 top-0">
                            <Webcam height={300} width={300} className="rounded-xl" />
                        </div>
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