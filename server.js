import express from 'express';
import dotenv from "dotenv";
import connectDB from './src/config/db.js';
import transactionRoute from "./src/routes/transactionRoute.js";
import cors from "cors";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use(cors());

app.use(express.static('public'));

// rest api
app.use("/transactions", transactionRoute);

app.listen(PORT, () => {
    connectDB();
    console.log(`Server running on port ${PORT}`);
});