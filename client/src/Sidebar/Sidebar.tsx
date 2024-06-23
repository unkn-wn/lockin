import React, { useState, useEffect, useRef } from "react";
import { FaUpload, FaDrawPolygon, FaAngleDown, FaPen } from "react-icons/fa6";
import {
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    Button
} from '@chakra-ui/react'
import { useVoice } from '@humeai/voice-react';

import Whiteboard from "../Whiteboard";
import FaceWidgets from '../Facecam/FaceWidgets';


type Props = {
    loading: boolean,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>
}

export default function Sidebar({ loading, setLoading }: Props) {

    const { sendSessionSettings, clearMessages } = useVoice()

    const inputFile = useRef<HTMLInputElement | null>(null);

    const [lessons, setLessons] = useState<{ name: string; description: string; topics: string[] }[]>([]);

    const [whiteboardOn, setWhiteboardOn] = useState(false);
    const [textboxOn, setTextboxOn] = useState(false);
    const [topicTextbox, setTopicTextbox] = useState('');

    // Fetch lessons function
    const fetchLessons = async (lessondata: any | null) => {
        setLoading(true);
        try {
            const formData = new FormData();
            let response: Response;
            if (lessondata instanceof File) {
                formData.append('file', lessondata);
                response = await fetch("http://localhost:8000/curriculum/generate/file", {
                    method: 'POST',
                    body: formData,
                });
            } else {
                response = await fetch(`http://localhost:8000/curriculum/generate/topic?topic=${lessondata.toString()}`, {
                    method: 'POST'
                });
            }

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

    // -------------------- Upload file function ------------------------------
    const uploadFile = (event: React.ChangeEvent<HTMLInputElement>) => {
        const target = event.target as HTMLInputElement;
        const file = target.files?.[0];
        if (file) {
            console.log("File name:", file.name);
            console.log(file);
            fetchLessons(file);
        }
    }

    // SUBMIT TOPIC TEXTBOX
    const submitTopicTextbox = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        console.log("topic: " + topicTextbox);
        setTextboxOn(false);
        fetchLessons(topicTextbox);
    }

    return (
        <>
            <div className="flex flex-col w-1/5 p-4">
                <h1 className="text-5xl font-bold">lock in.</h1>

                {/* LESSONS */}
                <div className="flex flex-col gap-8 py-6 overflow-y-auto h-full">
                    {lessons.map((lesson, index) => (
                        <h1 className='text-2xl font-bold cursor-pointer hover:text-gray-500 transition'
                            key={index}
                            onClick={() => {
                                clearMessages()
                                sendSessionSettings({
                                    context: {
                                        text: `The lesson is: ${lesson.name}. The lesson description is: ${lesson.description}. The lesson topics to follow are: ${lesson.topics.join(', ')})}`,
                                        type: 'persistent'
                                    }
                                })
                            }}
                        >
                            {index + 1}: {lesson.name}
                        </h1>
                    ))}
                </div>


                {/* Topic Textbox */}
                {textboxOn ? <div className="flex flex-col gap-2 mb-4">
                    <input type="text" className="w-full p-2 border-2 border-black rounded-lg" placeholder="Enter topic here..." onChange={(e) => { setTopicTextbox(e.target.value); }} />

                    <div className="flex flex-row gap-2">
                        <button className="w-1/4 border-2 border-black text-black p-2 rounded-lg" onClick={() => { setTextboxOn(!textboxOn); }}>Cancel</button>
                        <button className="w-3/4 bg-black text-white p-2 rounded-lg" onClick={(e) => { submitTopicTextbox(e); }}>Submit</button>
                    </div>
                </div> : null}



                <div className="flex flex-row gap-2">
                    {/* DRAW BUTTON */}
                    <div className="w-1/2 flex flex-row gap-2 justify-center items-center py-2 rounded-lg border-2 border-black cursor-pointer hover:bg-gray-200 transition"
                        onClick={() => { setWhiteboardOn(!whiteboardOn) }}>
                        <FaDrawPolygon size={24} />
                        <h2 className='text-lg text-center'>draw.</h2>
                    </div>


                    {/* GENERATE BUTTON */}
                    <div className="w-1/2 flex flex-row gap-2 justify-center items-center py-2 rounded-lg border-2 border-black cursor-pointer hover:bg-gray-200 transition z-50">
                        <Menu>
                            {({ isOpen }) => (
                                <>
                                    <MenuButton isActive={isOpen} as={Button} rightIcon={<FaAngleDown />}>
                                        <h2 className="text-lg text-center">generate.</h2>
                                    </MenuButton>
                                    <MenuList className="bg-white rounded-lg my-2 z-40">
                                        <MenuItem onClick={() => { inputFile.current?.click() }}>
                                            <input type='file' ref={inputFile} onChange={(event) => uploadFile(event)} style={{ display: 'none' }} accept=".pdf" />
                                            <div className="flex flex-row gap-2 p-2 justify-center items-center hover:bg-gray-200 transition rounded-lg">
                                                <FaUpload size={24} />
                                                <h2 className='text-md text-center'>upload.</h2>
                                            </div>
                                        </MenuItem>
                                        <MenuItem onClick={() => { setTextboxOn(!textboxOn) }}>
                                            <div className="flex flex-row gap-2 w-full p-2 justify-center items-center hover:bg-gray-200 transition rounded-lg">
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
                <div className="mt-2 z-10" >
                    <FaceWidgets />
                </div>
            </div >

            {/* WHITEBOARD */}
            {whiteboardOn ? <Whiteboard /> : null}
        </>
    )
}
