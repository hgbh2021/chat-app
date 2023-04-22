const dotenv= require("dotenv").config();
const axios= require("axios");
const FormData = require("form-data");
const fs= require("fs");
const path= require("path");
const ytdl = require('ytdl-core');



const OPENAI_KEY=process.env.OPENAI_API_KEY;

const videoUrl = 'https://www.youtube.com/watch?v=gddNRAxnJhE';
const audioPath = path.join(__dirname, 'audio.mp3');

const audioStream = ytdl(videoUrl, { filter: 'audioonly' });
const audioFile = fs.createWriteStream(audioPath);

audioStream.pipe(audioFile);

audioFile.on('finish', () => {
const filepath= path.join(__dirname,"audio.mp3");

const model= "whisper-1";

const formData= new FormData();
formData.append("model", model );
formData.append("file", fs.createReadStream(filepath));

  console.log(`Audio saved to ${audioPath}`);
  axios
    .post("https://api.openai.com/v1/audio/transcriptions", formData, {
        headers: {
            Authorization: `Bearer ${OPENAI_KEY}`,
            "Content-Type": `multipart/form-data; boundary= ${formData._boundary }`,
        },

    })
    .then((response)=>{
        console.log(response.data);
    })
});

audioFile.on('error', (error) => {
  console.error(error);
});


















