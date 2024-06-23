import { Emotion } from "../lib/data/emotion";
import { useEffect, useRef, useState } from "react";

import { FacePrediction } from "../lib/data/facePrediction";
import { FaceTrackedVideo } from "./FaceTrackedVideo";
import { VideoRecorder } from "../lib/media/videoRecorder";
import { blobToBase64 } from "../lib/utilities/blobUtilities";
import { throttle } from 'lodash';

import { useVoice } from "@humeai/voice-react";


export default function FaceWidgets() {
    const socketRef = useRef<WebSocket | null>(null);
    const recorderRef = useRef<VideoRecorder | null>(null);
    const photoRef = useRef<HTMLCanvasElement | null>(null);
    const mountRef = useRef(true);
    const recorderCreated = useRef(false);
    const numReconnects = useRef(0);
    const { sendSessionSettings } = useVoice()
    const [status, setStatus] = useState("");
    const maxReconnects = 3;

    useEffect(() => {
        console.log("Mounting component");
        mountRef.current = true;
        console.log("Connecting to server");
        connect();

        return () => {
            console.log("Tearing down component");
            stopEverything();
        };
    }, []);

    const throttledCapturePhoto = throttle(capturePhoto, 2000)

    function connect() {
        const socket = socketRef.current;
        if (socket && socket.readyState === WebSocket.OPEN) {
            console.log("Socket already exists, will not create");
        } else {
            const baseUrl = "wss://api.hume.ai";
            const endpointUrl = `${baseUrl}/v0/stream/models`;
            const socketUrl = `${endpointUrl}?apikey=${import.meta.env.VITE_HUME_API_KEY}`;
            console.log(`Connecting to websocket... (using ${endpointUrl})`);
            setStatus(`Connecting to server...`);

            const socket = new WebSocket(socketUrl);

            socket.onopen = socketOnOpen;
            socket.onmessage = socketOnMessage;
            socket.onclose = socketOnClose;
            socket.onerror = socketOnError;

            socketRef.current = socket;
        }
    }

    async function socketOnOpen() {
        console.log("Connected to websocket");
        setStatus("Connecting to webcam...");
        if (recorderRef.current) {
            console.log("Video recorder found, will use open socket");
            await throttledCapturePhoto();
        } else {
            console.warn("No video recorder exists yet to use with the open socket");
        }
    }

    async function socketOnMessage(event: MessageEvent) {
        setStatus("");
        const response = JSON.parse(event.data);
        // console.log("Got response", response);
        const predictions: FacePrediction[] = response.face?.predictions || [];
        const warning = response.face?.warning || "";
        const error = response.error;
        if (error) {
            setStatus(error);
            console.error(error);
            stopEverything();
            return;
        }

        if (predictions.length === 0) {
            setStatus(warning.replace(".", ""));
        }

        predictions.forEach(async (pred: FacePrediction, dataIndex: number) => {
            if (dataIndex === 0) {
                const newEmotions = pred.emotions;
                newEmotions.sort((a: { name: string, score: number }, b: { name: string, score: number }) => { return b.score - a.score })
                const topEmotion = newEmotions[0]
                if (topEmotion.score > 0.6) {
                    console.log('just told it u was', topEmotion.name)
                    sendSessionSettings({ context: { text: `The user is currently feeling ${topEmotion.name}`, type: 'temporary' } })
                }
            }
        });

        await throttledCapturePhoto();
    }

    async function socketOnClose(event: CloseEvent) {
        console.log("Socket closed");

        if (mountRef.current === true) {
            setStatus("Reconnecting");
            console.log("Component still mounted, will reconnect...");
            connect();
        } else {
            console.log("Component unmounted, will not reconnect...");
        }
    }

    async function socketOnError(event: Event) {
        console.error("Socket failed to connect: ", event);
        if (numReconnects.current >= maxReconnects) {
            setStatus(`Failed to connect to the Hume API (prod).
      Please log out and verify that your API key is correct.`);
            stopEverything();
        } else {
            numReconnects.current++;
            console.warn(`Connection attempt ${numReconnects.current}`);
        }
    }

    function stopEverything() {
        console.log("Stopping everything...");
        mountRef.current = false;
        const socket = socketRef.current;
        if (socket) {
            console.log("Closing socket");
            socket.close();
            socketRef.current = null;
        } else {
            console.warn("Could not close socket, not initialized yet");
        }
        const recorder = recorderRef.current;
        if (recorder) {
            console.log("Stopping recorder");
            recorder.stopRecording();
            recorderRef.current = null;
        } else {
            console.warn("Could not stop recorder, not initialized yet");
        }
    }

    async function onVideoReady(videoElement: HTMLVideoElement) {
        console.log("Video element is ready");

        if (!photoRef.current) {
            console.error("No photo element found");
            return;
        }

        if (!recorderRef.current && recorderCreated.current === false) {
            console.log("No recorder yet, creating one now");
            recorderCreated.current = true;
            const recorder = await VideoRecorder.create(videoElement, photoRef.current);

            recorderRef.current = recorder;
            const socket = socketRef.current;
            if (socket && socket.readyState === WebSocket.OPEN) {
                console.log("Socket open, will use the new recorder");
                await throttledCapturePhoto();
            } else {
                console.warn("No socket available for sending photos");
            }
        }
    }

    async function capturePhoto() {
        const recorder = recorderRef.current;
        console.log('took pic')

        if (!recorder) {
            console.error("No recorder found");
            return;
        }

        const photoBlob = await recorder.takePhoto();
        sendRequest(photoBlob);
    }

    async function sendRequest(photoBlob: Blob) {
        const socket = socketRef.current;

        if (!socket) {
            console.error("No socket found");
            return;
        }

        const encodedBlob = await blobToBase64(photoBlob);
        const requestData = JSON.stringify({
            data: encodedBlob,
            models: {
                face: {},
            },
        });

        if (socket.readyState === WebSocket.OPEN) {
            socket.send(requestData);
        } else {
            console.error("Socket connection not open. Will not capture a photo");
            socket.close();
        }
    }

    return (
        <div>
            <div className="h-full">
                <FaceTrackedVideo
                    onVideoReady={onVideoReady}
                    width={400}
                    height={300}
                />


            </div>

            <div className="py-2">{status}</div>
            <canvas className="hidden" ref={photoRef}></canvas>
        </div>
    );
}

FaceWidgets.defaultProps = {
    onCalibrate: undefined,
};