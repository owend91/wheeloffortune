import express from 'express';
import cors from 'cors';
import wheel from './api/wheel.route.js';

const app = express();
app.use(cors());
//This is used instead of bodyparser
app.use(express.json());

app.use("/api/v1/wheel", wheel);
app.use("*", function(req, res){
    return res.status(404).json({error:"not found"});
});
// app.use("*", (req, res) => res.status(404).json({error:"not found"})); same thing as above!

export default app;