const express = require('express');
const { spawn } = require('child_process');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(express.json()); // For parsing JSON request bodies

let ffmpegProcess = null;

// Route to start live streaming
app.post('/start-stream', (req, res) => {
  const { streamKey, route } = req.body;

  if (!streamKey || !route) {
    return res.status(400).send({ message: "Stream key and RTMP URL are required." });
  }

  const outputDirectory = path.join(__dirname, './streams/index.m3u8');

  const ffmpegCommand = [
    '-i', `rtmp://fms-03-01.5centscdn.com/${route}/${streamKey}`,
    '-c:v', 'libx264',
    '-preset', 'veryfast',
    '-maxrate', '3000k',
    '-bufsize', '6000k',
    '-g', '50',
    '-c:a', 'aac',
    '-b:a', '160k',
    '-ac', '2',
    '-f', 'hls',
    '-hls_time', '2',
    '-hls_list_size', '3',
    '-hls_flags', 'delete_segments',
    outputDirectory
  ];

  if (ffmpegProcess) {
    return res.status(400).send({ message: "Stream is already running." });
  }

  ffmpegProcess = spawn('ffmpeg', ffmpegCommand);
  console.log(ffmpegCommand, 'command code')

  ffmpegProcess.stdout.on('data', (data) => {
    console.log(`FFmpeg stdout: ${data}`);
  });

  ffmpegProcess.stderr.on('data', (data) => {
    console.error(`FFmpeg stderr: ${data}`);
  });

  ffmpegProcess.on('close', (code) => {
    console.log(`FFmpeg process exited with code ${code}`);
    ffmpegProcess = null;
  });

  res.send({ message: "Stream started." });
});

// Route to stop live streaming
app.post('/stop-stream', (req, res) => {
  if (!ffmpegProcess) {
    return res.status(400).send({ message: "No stream is running." });
  }

  ffmpegProcess.kill('SIGINT'); // Gracefully stop FFmpeg
  ffmpegProcess = null;
  res.send({ message: "Stream stopped." });
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, (res) => {
  console.log(`Server is running on port ${PORT}`);
});
