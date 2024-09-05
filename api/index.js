import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from "./routes/userRoute.js";
import postRoutes from './routes/postRoute.js';
import {errorHandlingMiddleware} from './middleware/errorHandling.js';
import cookieParser from 'cookie-parser';

dotenv.config();

mongoose.connect(process.env.MONGO)
.then(() => {
    console.log('MongoDB is connected');
}).catch(err => {
    console.log(err);
});

const app = express();
app.use(express.json());
app.use(cookieParser());

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});


app.get("/", (req, res) => {
    res.json({ message: "API is working" });
})

//api routing
app.use("/api/user", userRoutes);
app.use("/api/post", postRoutes);

// Use the error-handling middleware
app.use(errorHandlingMiddleware);