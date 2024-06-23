import React, { useState, useEffect, useRef } from "react";
import Chat from "./Chat/Chat";
import Whiteboard from "./Whiteboard";
import { FaUpload, FaDrawPolygon, FaAngleDown, FaPen } from "react-icons/fa6";
import ClipLoader from "react-spinners/ClipLoader";
import FaceWidgets from "./Facecam/FaceWidgets";
import { getToken } from './lib/hume'
import { VoiceProvider } from '@humeai/voice-react';

import {
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    Button
} from '@chakra-ui/react'


export default function App() {
    const inputFile = useRef<HTMLInputElement | null>(null);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    const [lessons, setLessons] = useState<{ name: string; description: string; topics: string[] }[]>([]);
    const [token, setToken] = useState<string | null>(null)

    const [loading, setLoading] = useState(false);
    const [speaking, setSpeaking] = useState(false);

    const [whiteboardOn, setWhiteboardOn] = useState(false);
    const [textboxOn, setTextboxOn] = useState(false);
    const [topicTextbox, setTopicTextbox] = useState('');

    useEffect(() => {
        getToken(setToken)
        setSpeaking(true);
    }, [])

    // useEffect to scroll to bottom of chat
    // useEffect(() => {
    //     if (messagesEndRef.current) {
    //         messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    //     }
    // }, [messages]);

    // Fetch lessons function ADD TOPIC CAPABILITIES
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


    // SUBMIT TOPIC TEXTBOX
    const submitTopicTextbox = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        console.log("topic: " + topicTextbox);
        setTextboxOn(false);
    }


    return (
        <>


            {token ?
                <VoiceProvider auth={{ type: 'accessToken', value: token ?? '' }} configId='b38e9463-48e8-4fd0-968a-f8970f40f134'>
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
                                        // onClick={() => switchLesson(index)}
                                        >
                                            {index + 1}: {lesson.name}
                                        </h1>
                                    ))}
                                </div>


                                {/* Textbox */}
                                {textboxOn ? <div className="flex flex-col gap-2 mb-4">
                                    <input type="text" className="w-full p-2 border-2 border-black rounded-lg" placeholder="Enter topic here..." onChange={(e) => { setTopicTextbox(e.target.value); }} />
                                    <button className="w-full bg-black text-white p-2 rounded-lg" onClick={(e) => { submitTopicTextbox(e); }}>Submit</button>
                                </div> : null}



                                <div className="flex flex-row gap-2">
                                    {/* DRAW BUTTON */}
                                    <div className="w-1/2 flex flex-row gap-2 justify-center items-center py-2 rounded-lg border-2 border-black cursor-pointer hover:bg-gray-200 transition"
                                        onClick={() => { setWhiteboardOn(!whiteboardOn) }}>
                                        <FaDrawPolygon size={24} />
                                        <h2 className='text-lg text-center'>draw.</h2>
                                    </div>


                                    {/* GENERATE BUTTON */}
                                    <div className="w-1/2 flex flex-row gap-2 justify-center items-center py-2 rounded-lg border-2 border-black cursor-pointer hover:bg-gray-200 transition">
                                        <Menu>
                                            {({ isOpen }) => (
                                                <>
                                                    <MenuButton isActive={isOpen} as={Button} rightIcon={<FaAngleDown />}>
                                                        <h2 className="text-lg text-center">generate.</h2>
                                                    </MenuButton>
                                                    <MenuList>
                                                        <MenuItem onClick={() => { uploadFile() }}>
                                                            <div className="flex flex-row gap-2 p-2 justify-center items-center hover:bg-gray-200 transition rounded-lg">
                                                                <input type='file' ref={inputFile} style={{ display: 'none' }} accept=".pdf" />
                                                                <FaUpload size={24} />
                                                                <h2 className='text-md text-center'>upload.</h2>
                                                            </div>
                                                        </MenuItem>
                                                        <MenuItem onClick={() => { setTextboxOn(!textboxOn) }}>
                                                            <div className="flex flex-row gap-2 mb-4 p-2 justify-center items-center hover:bg-gray-200 transition rounded-lg">
                                                                <FaPen size={24} />
                                                                <h2 className='text-md text-center'>topic.</h2>
                                                            </div>
                                                        </MenuItem>
                                                    </MenuList>
                                                </>
                                            )}
                                        </Menu>
                                    </div>
                                </div>



                                {/* WEBCAM */}
                                <div className="mt-2" >
                                    {/* <FaceWidgets /> */}
                                </div>
                            </div>

                            {/* MAIN PAGE */}
                            <div className="flex flex-col w-4/5 border-l-2 p-4 border-black">
                                {/* WHITEBOARD */}

                                {whiteboardOn ? <Whiteboard /> : null}

                                {/* CHAT */}
                                <Chat />
                            </div>
                        </div>
                    </div >
                </VoiceProvider >
                : null
            }
        </>
    )
}