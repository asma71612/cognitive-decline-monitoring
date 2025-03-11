require('dotenv').config();
const express = require("express");
const multer = require("multer");
const cors = require("cors");
const fetch = require('node-fetch');
const AWS = require("aws-sdk");
const fs = require("fs");

const app = express();
const port = process.env.PORT || 5001;

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

// uploading audio to S3 and starting aws transcribe job
app.post("/transcribe", upload.single("audio"), async (req, res) => {
  try {
    const { game, userId, date, sessionNumber } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const filePath = req.file.path;
    const fileName = `${game}_${userId}_${date}_session${sessionNumber}.wav`;

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
    const jobName = `${game}_${userId}_${date}_session${sessionNumber}`;

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

    if (result.TranscriptionJob.TranscriptionJobStatus === "COMPLETED") {
      const transcriptUrl = result.TranscriptionJob.Transcript.TranscriptFileUri;

      const response = await fetch(transcriptUrl);
      const transcriptData = await response.json();

      res.json({ transcript: transcriptData.results.transcripts[0].transcript, audio_segments: transcriptData.results.audio_segments, full_transcription: transcriptData });
    } else {
      res.json({ status: result.TranscriptionJob.TranscriptionJobStatus });
    }
  } catch (error) {
    console.error("Error fetching transcription:", error);
    res.status(500).json({ error: "Failed to fetch transcription" });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
