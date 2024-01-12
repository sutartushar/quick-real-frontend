// App.js
import { useState, useRef, useEffect } from "react";
import axios from "axios";
import WaveSurfer from "wavesurfer.js";

const App = () => {
  const [audioFile, setAudioFile] = useState(null);
  const [processedAudio, setProcessedAudio] = useState(null);
  const [fillerWordSensitivity, setFillerWordSensitivity] = useState(0.5);
  const [silenceThreshold, setSilenceThreshold] = useState(2000); // in milliseconds

  const wavesurferRef = useRef(null);

  useEffect(() => {
    // Initialize Wavesurfer when the component mounts
    wavesurferRef.current = WaveSurfer.create({
      container: "#waveform", // Specify the container element
      waveColor: "violet",
      progressColor: "purple",
    });

    return () => {
      // Clean up Wavesurfer when the component unmounts
      wavesurferRef.current.destroy();
    };
  }, []);

  const handleFileUpload = (event) => {
    setAudioFile(event.target.files[0]);
  };

  const handleRecord = async () => {
    // Implement audio recording logic using Web Audio API or a third-party library
  };

  const handleProcessAudio = async () => {
    const formData = new FormData();
    formData.append("audioFile", audioFile);
    formData.append("fillerWordSensitivity", fillerWordSensitivity);
    formData.append("silenceThreshold", silenceThreshold);

    try {
      const response = await axios.post(
        "http://localhost:3001/process-audio",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Assuming the backend sends back the processed audio file
      setProcessedAudio(response.data.processedAudio);

      // Load the processed audio into Wavesurfer for visualization
      wavesurferRef.current.load(response.data.processedAudio);
    } catch (error) {
      console.error("Error processing audio:", error);
    }
  };

  return (
    <div>
      <input type="file" accept="audio/*" onChange={handleFileUpload} />
      <button onClick={handleRecord}>Record</button>
      <button onClick={handleProcessAudio}>Process Audio</button>

      <div id="waveform" style={{ width: "100%", height: "200px" }} />

      {processedAudio && (
        <audio controls>
          <source src={processedAudio} type="audio/mp3" />
          Your browser does not support the audio element.
        </audio>
      )}

      {/* Add additional UI elements for filler word sensitivity and silence threshold */}
      <div>
        <label>Filler Word Sensitivity:</label>
        <input
          type="number"
          value={fillerWordSensitivity}
          onChange={(e) => setFillerWordSensitivity(parseFloat(e.target.value))}
        />
      </div>
      <div>
        <label>Silence Threshold (ms):</label>
        <input
          type="number"
          value={silenceThreshold}
          onChange={(e) => setSilenceThreshold(parseInt(e.target.value))}
        />
      </div>
    </div>
  );
};

export default App;
