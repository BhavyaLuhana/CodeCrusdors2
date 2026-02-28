import { useRef, useState } from "react";
import axios from "axios";

function Home() {
  const videoRef = useRef(null);
  const [isRunning, setIsRunning] = useState(false);
  const [subtitle, setSubtitle] = useState("");

  const captureFrame = () => {
    const canvas = document.createElement("canvas");
    const video = videoRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0);

    return canvas.toDataURL("image/jpeg");
  };

  // Start Camera
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      setIsRunning(true);

      // Start prediction loop only after camera works
      const intervalId = setInterval(async () => {
        if (!videoRef.current) return;

        const image = captureFrame();

        try {
          const res = await axios.post("http://localhost:5000/api/predict", {
            image,
          });

          setSubtitle(res.data.text);
        } catch (err) {
          console.error("Prediction error:", err);
        }
      }, 2000);

    } catch (error) {
      console.error("Camera error:", error);
      alert("Camera not accessible. Check permissions.");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      

      <div className="flex flex-col items-center mt-10">
        <div className="relative w-[640px] h-[480px] bg-neutral-900 rounded-2xl overflow-hidden shadow-xl">
          {/* Camera */}
          <video
            ref={videoRef}
            autoPlay
            className="w-full h-full object-cover"
          />

          {/* Subtitle Overlay */}
          <div className="absolute bottom-5 left-0 right-0 text-center">
            <span className="bg-black/70 px-4 py-2 rounded-lg text-lg">
              {subtitle || "Generated text will appear here..."}
            </span>
          </div>
        </div>

        {/* Start Button */}
        <button
          onClick={startCamera}
          className="mt-6 px-6 py-3 bg-blue-600 rounded-xl hover:bg-blue-700 transition"
        >
          Start
        </button>
      </div>
    </div>
  );
}

export default Home;