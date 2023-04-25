import { createRequire } from 'module';
import dotenv from "dotenv";
import axios from 'axios';
import Replicate from 'replicate';
//import request from 'request';

const require = createRequire(import.meta.url);
const fs = require('fs');
const https = require('https');
dotenv.config();

const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY
});

const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN,
})

const openai = new OpenAIApi(configuration);

export const createImage = async (req, res) => {
    const prompt = req.body.prompt;
    const quantity = req.body.quantity;
    const size = req.body.quantity;


    try{
        const response = await openai.createImage({
            prompt: prompt,
            n: quantity,
            size: size
        });
    
        res.send(response.data);
        console.log(response.data)
    }catch(err){
        console.log(err);
        res.send(err);
    }

}

//create subtitles from audio files
export const createTranslation = async (req, res) => {
    const audioFile = req.body.audioFile;
    const prompt = req.body.prompt;
    const language = req.body.language;
    const model = req.body.model;

    const instance = axios.create({
        maxContentLength: 50 * 1024 * 1024, // 50MB
        maxBodyLength: 50 * 1024 * 1024, // 50MB
      });



    try{

        //const stream = request.get(audioFile);
        const getAudio = await instance.get(audioFile, {
            responseType: 'arraybuffer'
        }); 

        const encoder = new OpusEncoder(48000, 2);
        const stream = encoder.decode(getAudio);
        //const pcmStream = getAudio.pipe(decoder);
        
        
        const response = await openai.createTranscription(
            stream,
            "whisper-1",
            prompt,
            "vtt"
        );
    
        //const flatResponse = stringify(response.data.text)
        res.send(response.data);
        console.log(response.data);
    }catch(err){
        console.log(err);
        res.send(err);
    }

}

//Replicate API Subtitles. Has some issues 
export const replicateSubtitles = async (req, res) => {
    const audioFile = req.body.audioFile;
    
    try{
        const output = await replicate.run(
            "m1guelpf/whisper-subtitles:7f686e243a96c7f6f0f481bcef24d688a1369ed3983cea348d1f43b879615766",
            {
                input: {
                    audio_path: audioFile,
                    model: "base",
                    format: "vtt"
                }
            }
        )
        console.log("output response", output)
        res.send(output);
    }catch(err){
        console.log(err);
    }
}

//chat
export const createCompletion = async (req, res) => {
    const prompt = req.body.prompt;


    try{
        const response = await openai.createCompletion({
            model: 'gpt-3.5-turbo',
            prompt: prompt,
            temperature: 0.7,
            max_tokens: 256,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0
        });
    
        res.send(response.data);
        console.log(response.data)
    }catch(err){
        console.log(err);
        res.send(err);
    }

}
