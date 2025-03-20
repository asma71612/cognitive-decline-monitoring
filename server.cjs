require('dotenv').config();
const express = require("express");
const multer = require("multer");
const cors = require("cors");
const fetch = require('node-fetch');
const AWS = require("aws-sdk");
const fs = require("fs");
const path = require("path");

// Define consistent ports
const EXPRESS_PORT = 5005;
const FLASK_PORT = 5000;
const REACT_PORT = 5001;

// Create the main Express app
const app = express();
app.use(cors());
app.use(express.json());

// configuring aws sdk (these are pulled from .env file)
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const s3 = new AWS.S3();
const transcribeService = new AWS.TranscribeService();

// store the file temporarily
const upload = multer({ dest: "uploads/" });

// Endpoint to serve the gaze tracking metrics directly from the JSON file
app.get("/get-eye-tracking-metrics", (req, res) => {
  try {
    // Using absolute path to the exact file specified by the user
    const filePath = path.resolve(__dirname, 'demo/gazeCalibration/saccade_output/processed_trial_data_with_gaze.json');
    console.log("Looking for eye tracking data at:", filePath);
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      console.error("Eye tracking data file not found at primary path:", filePath);
      
      // Try alternative paths
      const alternativePaths = [
        path.resolve(__dirname, './demo/flask_api/saccade_output/processed_trial_data_with_gaze.json'),
        path.resolve(__dirname, './demo/saccade_output/processed_trial_data_with_gaze.json'),
        path.resolve(__dirname, '../demo/gazeCalibration/saccade_output/processed_trial_data_with_gaze.json')
      ];
      
      let fileFound = false;
      let fileData;
      
      for (const altPath of alternativePaths) {
        console.log("Trying alternative path:", altPath);
        if (fs.existsSync(altPath)) {
          console.log("Found eye tracking data at:", altPath);
          fileData = fs.readFileSync(altPath, 'utf8');
          fileFound = true;
          break;
        }
      }
      
      if (!fileFound) {
        console.error("Eye tracking data file not found in any of the alternative paths");
        return res.status(404).json({ 
          error: "Eye tracking data file not found",
          searchedPaths: [filePath, ...alternativePaths]
        });
      }
      
      // Return the data from the alternative path
      const eyeTrackingData = JSON.parse(fileData);
      return res.json(eyeTrackingData);
    }
    
    // Read and parse the JSON file from the primary path
    const fileData = fs.readFileSync(filePath, 'utf8');
    const eyeTrackingData = JSON.parse(fileData);
    console.log("Successfully read eye tracking data from:", filePath);
    
    res.json(eyeTrackingData);
  } catch (error) {
    console.error("Error fetching eye tracking metrics:", error);
    res.status(500).json({ error: "Failed to fetch eye tracking metrics", details: error.message });
  }
});

// Proxy endpoint to fetch eye tracking metrics from Flask server
app.get("/proxy-eye-tracking-data", async (req, res) => {
  try {
    console.log("Attempting to proxy request to Flask server for eye tracking data");
    const response = await fetch(`http://localhost:${FLASK_PORT}/get-saccade-data`);
    
    if (!response.ok) {
      console.error("Failed to fetch from Flask server:", response.statusText);
      return res.status(response.status).json({ error: "Failed to fetch from Flask server" });
    }
    
    const data = await response.json();
    console.log("Successfully fetched data from Flask server");
    res.json(data);
  } catch (error) {
    console.error("Error proxying request to Flask server:", error);
    res.status(500).json({ error: "Failed to proxy request to Flask server" });
  }
});

// uploading audio to S3 and starting aws transcribe job
app.post("/transcribe", upload.single("audio"), async (req, res) => {
  try {
    const { game, userId, date, sessionNumber } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const filePath = req.file.path;
    const fileName = `${game}_${userId}_${date}_session${sessionNumber}_${Date.now()}.wav`;

    // uploading file to S3
    const fileContent = fs.readFileSync(filePath);
    const uploadParams = {
      Bucket: 'cognify-capstone',
      Key: fileName,
      Body: fileContent,
      ContentType: "audio/wav",
    };

    await s3.upload(uploadParams).promise();
    fs.unlinkSync(filePath);

    const s3Uri = `s3://${process.env.S3_BUCKET_NAME}/${fileName}`;
    const jobName = `${game}_${userId}_${date}_session${sessionNumber}_${Date.now()}`;

    // starting aws transcribe job and storing transcript in s3 bucket
    const transcribeParams = {
      TranscriptionJobName: jobName,
      LanguageCode: "en-US",
      MediaFormat: "wav",
      Media: { MediaFileUri: s3Uri },
      OutputBucketName: process.env.S3_BUCKET_NAME,
    };

    await transcribeService.startTranscriptionJob(transcribeParams).promise();

    res.json({ message: "Transcription started", jobName });
  } catch (error) {
    console.error("Error processing audio:", error);
    res.status(500).json({ error: "Failed to process audio" });
  }
});

// fetching transcription result
app.get("/transcription/:jobName", async (req, res) => {
  try {
    const jobName = req.params.jobName;
    const result = await transcribeService
      .getTranscriptionJob({ TranscriptionJobName: jobName })
      .promise();

    const jobStatus = result.TranscriptionJob.TranscriptionJobStatus;

    if (jobStatus === "COMPLETED") {
      const outputKey = `${jobName}.json`;
      const bucketName = process.env.S3_BUCKET_NAME;

      const s3Response = await s3
        .getObject({
          Bucket: bucketName,
          Key: outputKey,
        })
        .promise();

      const transcriptData = JSON.parse(s3Response.Body.toString('utf-8'));

      res.json({
        transcript: transcriptData.results.transcripts[0]?.transcript || '',
        audio_segments: transcriptData.results.audio_segments,
        full_transcription: transcriptData,
      });
    } else {
      res.json({ status: jobStatus });
    }
  } catch (error) {
    console.error("Error fetching transcription:", error);
    res.status(500).json({ error: "Failed to fetch transcription" });
  }
});

// Start the main server
app.listen(EXPRESS_PORT, () => {
  console.log(`Express server running on port ${EXPRESS_PORT}`);
  console.log(`React is expected to be running on port ${REACT_PORT}`);
  console.log(`Flask server is expected to be running on port ${FLASK_PORT}`);
  console.log("-------------------------------------------");
  console.log("Port Configuration Summary:");
  console.log(`- Express API: http://localhost:${EXPRESS_PORT}`);
  console.log(`- React App: http://localhost:${REACT_PORT}`);
  console.log(`- Flask API: http://localhost:${FLASK_PORT}`);
  console.log("-------------------------------------------");
});
