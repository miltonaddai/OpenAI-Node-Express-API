import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import aiRoutes from './routes/openai-routes.js';
import dotenv from 'dotenv';

const app = express();
dotenv.config();

app.use(
    express.json({
        limit: '50mb',
        verify: (req, res, buf) => {
            req.rawBody = buf.toString();
        },
    })
);
app.use(express.urlencoded({extended: true}));
app.use(cors());

app.set('serverTimeout', 24000000);
app.use("/openai-routes", aiRoutes);

app.get('/', (req, res) => {
    res.send('Fliika GPT API Works!');
});

const PORT = process.env.PORT || 443;

app.listen(PORT,()=> console.log(`Server running on port:${PORT}`))