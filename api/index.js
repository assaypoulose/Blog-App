import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from "./routes/userRoute.js";
import postRoutes from './routes/postRoute.js';
import {errorHandlingMiddleware} from './middleware/errorHandling.js';
import cookieParser from 'cookie-parser';
import commentRoute from './routes/commentRoute.js';
import path from 'path';

dotenv.config();

mongoose.connect(process.env.MONGO)
.then(() => {
    console.log('MongoDB is connected');
}).catch(err => {
    console.log(err);
});

const __dirname = path.resolve();

const app = express();
app.use(express.json());
app.use(cookieParser());

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});


//api routing
app.use("/api/user", userRoutes);
app.use("/api/post", postRoutes);
app.use("/api/comment", commentRoute);

app.use(express.static(path.join(__dirname, '/client/dist')));

app.get('*',(req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
})

// Use the error-handling middleware
app.use(errorHandlingMiddleware);