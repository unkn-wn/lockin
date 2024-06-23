import { useEffect, useRef } from "react";

type FaceTrackedVideoProps = {
  className?: string;
  onVideoReady: (video: HTMLVideoElement) => void;
  width: number;
  height: number;
};

export function FaceTrackedVideo({ className, onVideoReady, width, height }: FaceTrackedVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  className = className || "";

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) {
      console.error("Missing video element");
      return;
    }
    onVideoReady(videoElement);
  }, []);

  const canvasElement = canvasRef.current;
  const videoElement = videoRef.current;
  const graphics = canvasElement?.getContext("2d");

  if (!canvasElement) {
    console.info("Missing canvasElement");
  }
  if (!videoElement) {
    console.info("Missing videoElement");
  }
  if (!graphics) {
    console.info("Missing graphics");
  }

  if (canvasElement && videoElement && graphics) {
    canvasElement.width = videoElement.width = width;
    canvasElement.height = videoElement.height = height;
    graphics.clearRect(0, 0, canvasElement.width, canvasElement.height);
  }

  return (
      <div className={`relative overflow-hidden rounded-lg border border-neutral-300 bg-black align-top shadow h-40 w-full ${className}`}>
        <video className="absolute -scale-x-[1]" ref={videoRef} autoPlay playsInline></video>
        <canvas className="absolute" ref={canvasRef}></canvas>
    </div>
  );
}