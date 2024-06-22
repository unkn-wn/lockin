import React, { useState, useEffect, useRef } from "react";

import { FaUpload } from "react-icons/fa6";
import ClipLoader from "react-spinners/ClipLoader";
import Webcam from "react-webcam";

export default function App() {
    const inputFile = useRef<HTMLInputElement | null>(null);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    const [messages, setMessages] = useState<{ text: string; sender: string; timestamp: string; }[]>([]);
    const [lessons, setLessons] = useState<{ name: string; description: string; topics: string[] }[]>([]);

    const [loading, setLoading] = useState(false);
    const [speaking, setSpeaking] = useState(false);

    useEffect(() => {
        fetchMessages("123");
        setSpeaking(true);
    }, [])

    // useEffect to scroll to bottom of chat
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);


    // Some function to fetch messages
    const fetchMessages = async (temp: string) => {
        setMessages([
            { text: temp, sender: "system", timestamp: "12:00" },
            { text: "Hello!", sender: "Alice", timestamp: "12:00" },
            { text: "Hi!", sender: "User", timestamp: "12:01" },
            { text: "How are you?", sender: "Alice", timestamp: "12:02" },
            { text: "I'm good, thanks!", sender: "User", timestamp: "12:03" },
            { text: "How about you?", sender: "User", timestamp: "12:04" },
            { text: "I'm good too.", sender: "Alice", timestamp: "12:05" },
            { text: "Great!", sender: "User", timestamp: "12:06" },
            { text: "I'm glad to hear that.", sender: "Alice", timestamp: "12:07" },
            { text: "Me too!", sender: "User", timestamp: "12:08" },
            { text: "I'm glad we're both happy.", sender: "Alice", timestamp: "12:09" },
            { text: "Me too!", sender: "User", timestamp: "12:10" },
            { text: "I'm glad we both agree.", sender: "Alice", timestamp: "12:11" },
            { text: "Me too!", sender: "User", timestamp: "12:12" },
            { text: "I'm glad we both agree.", sender: "Alice", timestamp: "12:13" },
            { text: "Me too!", sender: "User", timestamp: "12:14" },
            { text: "I'm glad we both agree.", sender: "Alice", timestamp: "12:15" },
            { text: "Hello there", sender: "User", timestamp: "12:16" }
        ]);
    }

    // Fetch lessons function
    const fetchLessons = async (file: File | null) => {
        setLoading(true);
        try {
            const formData = new FormData();
            if (file) {
                formData.append('file', file);
            }

            const response = await fetch("http://localhost:8000/curriculum/generate", {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            console.log(data.lessons);
            setLessons(data.lessons);
        } catch (error) {
            console.error('Error fetching lessons:', error);
        } finally {
            setLoading(false);
        }
    }


    // Switching lessons on click
    const switchLesson = (index: number) => {
        console.log("Switching to lesson", index + 1);
        fetchMessages("Lesson " + (index + 1) + " messages.");
    }


    // -------------------- Upload file functions ------------------------------
    const uploadFile = () => {
        inputFile.current?.click();
    }

    useEffect(() => {
        const handleFileChange = (event: Event) => {
            const target = event.target as HTMLInputElement;
            const file = target.files?.[0];
            if (file) {
                console.log("File name:", file.name);
                console.log(file);
                fetchLessons(file);
            }

            // Reset the value of the input to allow the same file to be selected multiple times
            if (inputFile.current) {
                inputFile.current.value = "";
            }
        };

        const inputElement = inputFile.current;
        inputElement?.addEventListener('change', handleFileChange);

        return () => {
            inputElement?.removeEventListener('change', handleFileChange);
        };
    }, []);
    // -------------------------------------------------------------------------



    return (
        <>
            <div className='h-screen w-screen bg-white'>
                {/* LOADING ICON */}
                {loading ? <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm z-50">
                    <ClipLoader
                        color={"#fff"}
                        loading={true}
                        size={30}
                        aria-label="Loading Spinner"
                        data-testid="loader"
                    />
                </div> : null}

                {/* MAIN CONTAINER */}
                <div className="flex flex-row h-full">
                    {/* LEFT SIDEBAR */}
                    <div className="flex flex-col w-1/5 p-4">
                        <h1 className="text-5xl font-bold">lock in.</h1>

                        {/* LESSONS */}
                        <div className="flex flex-col gap-8 py-6 overflow-y-auto h-full">
                            {lessons.map((lesson, index) => (
                                <h1 className='text-2xl font-bold cursor-pointer hover:text-gray-500 transition'
                                    key={index}
                                    onClick={() => switchLesson(index)}>
                                    {index + 1}: {lesson.name}
                                </h1>
                            ))}
                        </div>

                        {/* UPLOAD BUTTON */}
                        <input type='file' ref={inputFile} style={{ display: 'none' }} accept=".pdf" />
                        <div className="flex flex-row gap-2 justify-center items-center py-2 rounded-lg border-2 border-black cursor-pointer hover:-translate-y-0.5 transition"
                            onClick={() => { uploadFile() }}>
                            <FaUpload size={24} />
                            <h1 className='text-lg text-center'>upload.</h1>
                        </div>

                        {/* WEBCAM */}
                        <div className="mt-2 h-48" >
                            <Webcam height={300} width={300} className={`rounded-xl ${speaking ? 'border-green-500 border-4' : ''}`} />
                        </div>
                    </div>

                    {/* MAIN PAGE */}
                    <div className="flex flex-col w-4/5 border-l p-4 border-black">

                        {/* Chat */}
                        <div className="overflow-y-auto h-full pr-6">
                            {messages.map((message, index) => (
                                <ChatMessage
                                    key={index}
                                    message={message.text}
                                    sender={message.sender}
                                    timestamp={message.timestamp}
                                />
                            ))}

                            <div ref={messagesEndRef} />
                        </div>
                    </div>
                </div>
            </div >
        </>
    )
}