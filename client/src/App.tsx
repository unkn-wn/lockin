import React, { useState, useEffect, useRef } from "react";
import Chat from "./Chat/Chat";
import ClipLoader from "react-spinners/ClipLoader";
import { getToken } from './lib/hume'
import { VoiceProvider } from '@humeai/voice-react';
import Sidebar from './Sidebar/Sidebar';
import { Emotion } from "./lib/data/emotion";

type Lesson = {
    name: string;
    description: string;
    topics: string[];
}


export default function App() {
    // const messagesEndRef = useRef<HTMLDivElement | null>(null);

    const [token, setToken] = useState<string | null>(null)
    const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null)
    const [topEmotion, setTopEmotion] = useState<Emotion | null>(null)
    const [loading, setLoading] = useState(false);
    // const [speaking, setSpeaking] = useState(false);



    useEffect(() => {
        getToken(setToken)
        // setSpeaking(true);
    }, [])

    // useEffect to scroll to bottom of chat
    // useEffect(() => {
    //     if (messagesEndRef.current) {
    //         messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    //     }
    // }, [messages]);

    return (
        <>


            {token ?
                <VoiceProvider auth={{ type: 'accessToken', value: token ?? '' }} configId='b38e9463-48e8-4fd0-968a-f8970f40f134'>
                    <div className='h-screen w-screen bg-white'>
                        {loading ? <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm z-50">
                            <ClipLoader
                                color={"#fff"}
                                loading={true}
                                size={30}
                                aria-label="Loading Spinner"
                                data-testid="loader"
                            />
                        </div> : null}
                        <div className="flex flex-row h-full">
                            <Sidebar loading={loading} setLoading={setLoading} setSelectedLesson={setSelectedLesson} setTopEmotion={setTopEmotion}/>
                            <div className="flex flex-col w-4/5 border-l-2 p-4 border-black">
                                {selectedLesson ? <Chat lesson={selectedLesson} emotion={topEmotion} /> : <h1>Upload a file or topic to generate your curriculum!</h1>}
                            </div>
                        </div>
                    </div >
                </VoiceProvider >
                : null
            }
        </>
    )
}