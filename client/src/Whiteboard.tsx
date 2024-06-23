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

    const link = document.createElement('a');
    link.href = data;
    link.download = 'sketch.png';
    link.click();
  };

  return (
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
        }}>Undo</button>
        <button className='w-24 bg-black text-white p-2 rounded-lg' onClick={() => {
          // @ts-ignore
          canvas.current.clearCanvas();
        }}>Clear</button>
        <button className='w-24 bg-black text-white p-2 rounded-lg' onClick={() => {
          submitCanvas();
        }}>Submit</button>
      </div>
    </div >
  );
};

export default Whiteboard;