import React, { useRef } from 'react';
import { ReactSketchCanvas } from 'react-sketch-canvas';

const Whiteboard: React.FC = () => {

    const canvas = useRef();

    const canvasStyle = {
        border: "0.0625rem solid #ffffff",
        borderColor: "#000000",
        borderRadius: "0.25rem",
        margin: "auto",
        height: "90%",
        marginBottom: "20px",
        aspectRatio: "1 / 1",
    };


    // submit canvas
    const submitCanvas = async () => {
        // @ts-ignore
        const data = await canvas.current.exportImage("png");

        console.log(data);
    };

    return (
        <div className='absolute right-5 w-9/12 h-full py-5 bg-white'>
            <div className='flex flex-col h-full border-black border-2 rounded-xl p-4'>
                <ReactSketchCanvas
                    // @ts-ignore
                    ref={canvas}
                    style={canvasStyle}
                    strokeWidth={3}
                    strokeColor="black"
                />
                <div className='flex flex-row justify-end gap-2'>
                    <button className='w-24 bg-black text-white p-2 rounded-lg' onClick={() => {
                        // @ts-ignore
                        canvas.current.undo();
                    }}>undo</button>
                    <button className='w-24 bg-black text-white p-2 rounded-lg' onClick={() => {
                        // @ts-ignore
                        canvas.current.clearCanvas();
                    }}>clear</button>
                    <button className='w-48 bg-black text-white p-2 rounded-lg' onClick={() => {
                        submitCanvas();
                    }}>add to next message</button>
                </div>
            </div >
        </div>
    );
};

export default Whiteboard;